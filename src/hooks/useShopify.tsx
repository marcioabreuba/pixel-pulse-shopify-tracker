
import { useState, useEffect, useCallback } from 'react';
import { services, ShopifyConfig, ShopifyStore } from '../services';
import { toast } from 'sonner';

export interface UseShopifyOptions {
  apiKey: string;
  apiSecretKey: string;
  scopes: string[];
  redirectUri: string;
}

export function useShopify(options: UseShopifyOptions) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [shopData, setShopData] = useState<ShopifyStore | null>(null);

  // Inicializa o serviço do Shopify
  const shopifyService = services.getShopifyService({
    apiKey: options.apiKey,
    apiSecretKey: options.apiSecretKey,
    scopes: options.scopes,
    redirectUri: options.redirectUri,
  } as ShopifyConfig);

  // Verifica o status de conexão ao carregar
  useEffect(() => {
    const checkConnection = async () => {
      // Em uma implementação real, verificaria em algum armazenamento persistente
      const storedAccessToken = localStorage.getItem('shopify_access_token');
      const storedShopDomain = localStorage.getItem('shopify_shop_domain');
      
      if (storedAccessToken && storedShopDomain) {
        try {
          const isValid = await shopifyService.verifyAccessToken(
            storedShopDomain, 
            storedAccessToken
          );
          
          if (isValid) {
            setIsConnected(true);
            setShopData({
              id: 'stored',
              shopDomain: storedShopDomain,
              accessToken: storedAccessToken,
              scopes: options.scopes,
              isActive: true,
            });
          }
        } catch (error) {
          console.error('Erro ao verificar conexão com Shopify:', error);
        }
      }
    };

    checkConnection();
  }, []);

  // Inicia o fluxo de conexão OAuth
  const connect = useCallback((shopDomain: string) => {
    try {
      if (!shopDomain.includes('.myshopify.com')) {
        shopDomain = `${shopDomain}.myshopify.com`;
      }
      
      // Salva o domínio temporariamente para recuperar após o retorno OAuth
      localStorage.setItem('shopify_pending_domain', shopDomain);
      
      // Gera e redireciona para a URL de autorização
      const authUrl = shopifyService.generateAuthUrl(shopDomain);
      window.location.href = authUrl;
      
      setIsConnecting(true);
      
    } catch (error) {
      console.error('Erro ao iniciar conexão com Shopify:', error);
      toast.error('Erro ao conectar com a loja Shopify');
      setIsConnecting(false);
    }
  }, [shopifyService]);

  // Finaliza o fluxo OAuth após o retorno
  const handleOAuthCallback = useCallback(async (code: string) => {
    try {
      setIsConnecting(true);
      
      // Recupera o domínio pendente
      const shopDomain = localStorage.getItem('shopify_pending_domain');
      if (!shopDomain) {
        throw new Error('Domínio da loja não encontrado');
      }
      
      // Troca o código por um token
      const accessToken = await shopifyService.getAccessToken(shopDomain, code);
      
      // Salva as credenciais
      localStorage.setItem('shopify_access_token', accessToken);
      localStorage.setItem('shopify_shop_domain', shopDomain);
      localStorage.removeItem('shopify_pending_domain');
      
      // Configura webhooks necessários
      const webhookBaseUrl = `${window.location.origin}/api/webhooks/shopify`;
      await shopifyService.setupAllWebhooks(shopDomain, accessToken, webhookBaseUrl);
      
      // Atualiza o estado
      setIsConnected(true);
      setShopData({
        id: 'oauth-connected',
        shopDomain,
        accessToken,
        scopes: options.scopes,
        isActive: true,
      });
      
      toast.success('Loja Shopify conectada com sucesso!');
      
    } catch (error) {
      console.error('Erro ao processar retorno OAuth:', error);
      toast.error('Falha ao finalizar conexão com Shopify');
      localStorage.removeItem('shopify_pending_domain');
    } finally {
      setIsConnecting(false);
    }
  }, [shopifyService, options.scopes]);

  // Desconecta a loja
  const disconnect = useCallback(() => {
    localStorage.removeItem('shopify_access_token');
    localStorage.removeItem('shopify_shop_domain');
    setIsConnected(false);
    setShopData(null);
    toast.info('Loja Shopify desconectada');
  }, []);

  // Conecta com credenciais manuais (alternativa ao OAuth)
  const connectManually = useCallback(async (shopDomain: string, accessToken: string) => {
    try {
      setIsConnecting(true);
      
      if (!shopDomain.includes('.myshopify.com')) {
        shopDomain = `${shopDomain}.myshopify.com`;
      }
      
      // Verifica se o token é válido
      const isValid = await shopifyService.verifyAccessToken(shopDomain, accessToken);
      
      if (!isValid) {
        throw new Error('Token de acesso inválido');
      }
      
      // Salva as credenciais
      localStorage.setItem('shopify_access_token', accessToken);
      localStorage.setItem('shopify_shop_domain', shopDomain);
      
      // Configura webhooks necessários
      const webhookBaseUrl = `${window.location.origin}/api/webhooks/shopify`;
      await shopifyService.setupAllWebhooks(shopDomain, accessToken, webhookBaseUrl);
      
      // Atualiza o estado
      setIsConnected(true);
      setShopData({
        id: 'manual-connected',
        shopDomain,
        accessToken,
        scopes: options.scopes,
        isActive: true,
      });
      
      toast.success('Loja Shopify conectada manualmente com sucesso!');
      
    } catch (error) {
      console.error('Erro ao conectar manualmente:', error);
      toast.error('Falha ao conectar com a loja Shopify');
    } finally {
      setIsConnecting(false);
    }
  }, [shopifyService, options.scopes]);

  return {
    isConnecting,
    isConnected,
    shopData,
    connect,
    disconnect,
    handleOAuthCallback,
    connectManually,
  };
}
