
import { toast } from "sonner";

// Tipos para a API do Shopify
export interface ShopifyStore {
  id: string;
  shopDomain: string;
  accessToken: string;
  scopes: string[];
  isActive: boolean;
}

export interface ShopifyWebhook {
  id: string;
  topic: string;
  address: string;
  format: string;
  isActive: boolean;
}

// Interface de configuração
export interface ShopifyConfig {
  apiKey: string;
  apiSecretKey: string;
  scopes: string[];
  redirectUri: string;
}

// Serviço de integração com Shopify
export class ShopifyService {
  private config: ShopifyConfig;
  private baseApiUrl = "https://api.shopify.com";

  constructor(config: ShopifyConfig) {
    this.config = config;
  }

  // Gera URL de autorização OAuth para Shopify
  generateAuthUrl(shop: string): string {
    const scopes = this.config.scopes.join(',');
    const redirectUri = encodeURIComponent(this.config.redirectUri);
    
    return `https://${shop}/admin/oauth/authorize?client_id=${this.config.apiKey}&scope=${scopes}&redirect_uri=${redirectUri}&state=${this.generateNonce()}`;
  }

  // Troca o código de autorização por um token de acesso
  async getAccessToken(shop: string, code: string): Promise<string> {
    try {
      const response = await fetch(`https://${shop}/admin/oauth/access_token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: this.config.apiKey,
          client_secret: this.config.apiSecretKey,
          code,
        }),
      });

      if (!response.ok) {
        throw new Error(`Erro ao obter token: ${response.status}`);
      }

      const data = await response.json();
      return data.access_token;
    } catch (error) {
      console.error('Erro ao trocar código por token:', error);
      toast.error("Falha ao obter token de acesso da Shopify");
      throw error;
    }
  }

  // Registra um webhook na loja Shopify
  async registerWebhook(shop: string, accessToken: string, topic: string, address: string): Promise<ShopifyWebhook | null> {
    try {
      const response = await fetch(`https://${shop}/admin/api/2024-04/webhooks.json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': accessToken,
        },
        body: JSON.stringify({
          webhook: {
            topic,
            address,
            format: 'json',
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Erro ao registrar webhook: ${response.status}`);
      }

      const data = await response.json();
      return {
        id: data.webhook.id,
        topic: data.webhook.topic,
        address: data.webhook.address,
        format: data.webhook.format,
        isActive: true,
      };
    } catch (error) {
      console.error('Erro ao registrar webhook:', error);
      toast.error("Falha ao registrar webhook na loja Shopify");
      return null;
    }
  }

  // Registra múltiplos webhooks necessários para rastreamento
  async setupAllWebhooks(shop: string, accessToken: string, baseWebhookUrl: string): Promise<boolean> {
    const topics = [
      'products/create',
      'products/update',
      'orders/create',
      'orders/paid',
      'checkouts/create',
      'checkouts/update',
    ];

    try {
      const promises = topics.map(topic => {
        const address = `${baseWebhookUrl}/${topic.replace('/', '-')}`;
        return this.registerWebhook(shop, accessToken, topic, address);
      });

      const results = await Promise.all(promises);
      const success = results.every(result => result !== null);
      
      if (success) {
        toast.success("Todos os webhooks foram configurados com sucesso");
      } else {
        toast.warning("Alguns webhooks não puderam ser configurados");
      }
      
      return success;
    } catch (error) {
      console.error('Erro ao configurar webhooks:', error);
      toast.error("Falha ao configurar webhooks na loja Shopify");
      return false;
    }
  }

  // Busca produtos da loja para teste de integração
  async getProducts(shop: string, accessToken: string, limit = 5): Promise<any[]> {
    try {
      const response = await fetch(`https://${shop}/admin/api/2024-04/products.json?limit=${limit}`, {
        headers: {
          'X-Shopify-Access-Token': accessToken,
        },
      });

      if (!response.ok) {
        throw new Error(`Erro ao buscar produtos: ${response.status}`);
      }

      const data = await response.json();
      return data.products || [];
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      toast.error("Falha ao buscar produtos da loja Shopify");
      return [];
    }
  }

  // Verifica se o token de acesso ainda é válido
  async verifyAccessToken(shop: string, accessToken: string): Promise<boolean> {
    try {
      const response = await fetch(`https://${shop}/admin/api/2024-04/shop.json`, {
        headers: {
          'X-Shopify-Access-Token': accessToken,
        },
      });
      
      return response.ok;
    } catch {
      return false;
    }
  }

  // Gera um nonce para segurança no fluxo OAuth
  private generateNonce(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }
}

// Função de fábrica para obter instância do serviço
export function createShopifyService(config: ShopifyConfig): ShopifyService {
  return new ShopifyService(config);
}
