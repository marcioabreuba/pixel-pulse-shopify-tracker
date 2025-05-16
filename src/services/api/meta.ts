
import { toast } from "sonner";

// Tipos para a API do Meta
export interface PixelConfig {
  pixelId: string;
  accessToken: string;
  apiVersion: string;
  enableServerSide: boolean;
  enableBrowserSide: boolean;
}

export interface EventData {
  event_name: string;
  event_time: number;
  event_source_url?: string;
  user_data?: UserData;
  custom_data?: Record<string, any>;
  event_id?: string;
  action_source: 'website' | 'mobile_app' | 'email' | 'other';
}

export interface UserData {
  em?: string;       // email hash
  ph?: string;       // phone hash
  fn?: string;       // first name hash
  ln?: string;       // last name hash
  ct?: string;       // city hash
  st?: string;       // state hash
  zp?: string;       // zip code hash
  country?: string;  // country
  external_id?: string;
  client_ip_address?: string;
  client_user_agent?: string;
  fbp?: string;      // Facebook Browser ID
  fbc?: string;      // Facebook Click ID
}

// Classe de serviço para Facebook Pixel e Conversions API
export class MetaPixelService {
  private config: PixelConfig;
  private pixelInitialized = false;
  private browserQueue: EventData[] = [];

  constructor(config: PixelConfig) {
    console.log('Inicializando MetaPixelService com config:', config);
    this.config = config;
    
    if (config.enableBrowserSide) {
      this.initializePixel();
    }
  }

  // Inicializa o Pixel do Facebook no navegador
  private initializePixel(): void {
    if (typeof window === 'undefined' || this.pixelInitialized) return;

    try {
      console.log('Inicializando Pixel do Facebook no navegador com ID:', this.config.pixelId);
      // Adiciona o script do pixel
      (function(f: any, b, e, v, n, t, s) {
        if (f.fbq) return;
        n = f.fbq = function() {
          n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
        };
        if (!f._fbq) f._fbq = n;
        n.push = n;
        n.loaded = !0;
        n.version = '2.0';
        n.queue = [];
        t = b.createElement(e);
        t.async = !0;
        t.src = v;
        s = b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t, s);
      })(
        window,
        document,
        'script',
        'https://connect.facebook.net/en_US/fbevents.js'
      );

      (window as any).fbq('init', this.config.pixelId);
      this.pixelInitialized = true;
      console.log('Pixel do Facebook inicializado com sucesso');

      // Processa eventos em fila
      if (this.browserQueue.length > 0) {
        console.log(`Processando ${this.browserQueue.length} eventos em fila`);
        this.browserQueue.forEach(event => {
          this.trackEventBrowser(event.event_name, event.custom_data || {});
        });
        this.browserQueue = [];
      }
    } catch (error) {
      console.error('Falha ao inicializar o Pixel do Facebook:', error);
    }
  }

  // Atualiza a configuração
  updateConfig(newConfig: Partial<PixelConfig>): void {
    console.log('Atualizando configuração do Pixel:', newConfig);
    this.config = { ...this.config, ...newConfig };
    
    if (this.config.enableBrowserSide && !this.pixelInitialized) {
      this.initializePixel();
    }
    console.log('Nova configuração do Pixel:', this.config);
  }

  // Rastreia evento no navegador (client-side)
  trackEventBrowser(eventName: string, customData?: Record<string, any>): void {
    if (typeof window === 'undefined' || !this.config.enableBrowserSide) return;

    if (!this.pixelInitialized) {
      // Adiciona à fila para processar depois da inicialização
      console.log(`Adicionando evento ${eventName} à fila para processamento posterior`);
      this.browserQueue.push({
        event_name: eventName,
        event_time: Math.floor(Date.now() / 1000),
        custom_data: customData,
        action_source: 'website'
      });
      return;
    }

    try {
      console.log(`Rastreando evento ${eventName} via navegador:`, customData);
      (window as any).fbq('track', eventName, customData);
    } catch (error) {
      console.error(`Erro ao rastrear evento ${eventName} pelo navegador:`, error);
    }
  }

  // Rastreia evento via servidor (server-side)
  async trackEventServer(eventData: EventData): Promise<boolean> {
    if (!this.config.enableServerSide || !this.config.accessToken) {
      console.log('Rastreamento via servidor desativado ou token não configurado');
      return false;
    }

    try {
      const url = `https://graph.facebook.com/${this.config.apiVersion}/${this.config.pixelId}/events`;
      console.log(`Enviando evento ${eventData.event_name} para ${url}`);
      
      const body = {
        data: [eventData],
        access_token: this.config.accessToken,
        test_event_code: process.env.NODE_ENV === 'development' ? 'TEST12345' : undefined
      };
      
      console.log('Payload do evento:', JSON.stringify(body));
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Erro na resposta da API do Meta:', errorData);
        throw new Error(errorData.error?.message || `Erro HTTP ${response.status}`);
      }

      const result = await response.json();
      console.log('Resposta da API do Meta:', result);
      return result.events_received === 1;
    } catch (error) {
      console.error(`Erro ao enviar evento ${eventData.event_name} para Conversions API:`, error);
      return false;
    }
  }

  // Rastreia evento em ambos (navegador + servidor)
  async trackEvent(eventName: string, userData?: Partial<UserData>, customData?: Record<string, any>): Promise<boolean> {
    const eventTime = Math.floor(Date.now() / 1000);
    const eventId = `${this.config.pixelId}_${eventTime}_${Math.random().toString(36).substring(2, 10)}`;
    
    console.log(`Iniciando rastreamento do evento ${eventName}`, { userData, customData });
    
    // Rastreia no navegador
    if (this.config.enableBrowserSide) {
      console.log('Rastreando evento no navegador');
      this.trackEventBrowser(eventName, customData);
    }
    
    // Rastreia no servidor
    if (this.config.enableServerSide) {
      console.log('Rastreando evento no servidor');
      const eventData: EventData = {
        event_name: eventName,
        event_time: eventTime,
        event_id: eventId,
        action_source: 'website',
        event_source_url: typeof window !== 'undefined' ? window.location.href : undefined,
      };
      
      if (userData) {
        eventData.user_data = userData as UserData;
      }
      
      if (customData) {
        eventData.custom_data = customData;
      }
      
      return this.trackEventServer(eventData);
    }
    
    return this.config.enableBrowserSide;
  }

  // Testa a conexão com a API do Meta
  async testConnection(): Promise<{ success: boolean, message: string }> {
    console.log('Iniciando teste de conexão com Meta');
    
    if (!this.config.pixelId || this.config.pixelId === '') {
      return { 
        success: false, 
        message: "ID do Pixel não configurado" 
      };
    }
    
    if (!this.config.accessToken || this.config.accessToken === '') {
      return { 
        success: false, 
        message: "Token de acesso não configurado" 
      };
    }
    
    console.log('Testando conexão com configuração:', {
      pixelId: this.config.pixelId,
      accessToken: this.config.accessToken ? `${this.config.accessToken.substring(0, 5)}...` : 'não definido',
      apiVersion: this.config.apiVersion
    });

    try {
      const url = `https://graph.facebook.com/${this.config.apiVersion}/${this.config.pixelId}?access_token=${this.config.accessToken}`;
      console.log(`Enviando requisição GET para: ${this.config.apiVersion}/${this.config.pixelId}`);
      
      const response = await fetch(url);
      console.log('Resposta recebida, status:', response.status);
      
      const responseData = await response.json();
      console.log('Dados da resposta:', responseData);
      
      if (!response.ok) {
        if (responseData.error) {
          console.error('Erro retornado pelo Meta:', responseData.error);
          return { 
            success: false, 
            message: `Erro: ${responseData.error.message}` 
          };
        }
        return { 
          success: false, 
          message: `Erro HTTP ${response.status}` 
        };
      }
      
      if (responseData.id) {
        return { 
          success: true, 
          message: `Conexão bem-sucedida. Pixel '${responseData.name || responseData.id}' encontrado.` 
        };
      } else {
        return {
          success: false,
          message: "Resposta recebida, mas não foi possível identificar o pixel."
        };
      }
    } catch (error) {
      console.error('Erro ao testar conexão com Meta:', error);
      return { 
        success: false, 
        message: `Erro ao testar conexão: ${(error as Error).message}` 
      };
    }
  }

  // Prepara objeto com dados do usuário já com hash
  prepareUserData(data: Record<string, string>): UserData {
    const userData: UserData = {};
    
    // Aplica hash onde necessário
    if (data.email) userData.em = this.hashData(data.email.toLowerCase());
    if (data.phone) userData.ph = this.hashData(this.normalizePhone(data.phone));
    if (data.firstName) userData.fn = this.hashData(data.firstName.toLowerCase());
    if (data.lastName) userData.ln = this.hashData(data.lastName.toLowerCase());
    if (data.city) userData.ct = this.hashData(data.city.toLowerCase());
    if (data.state) userData.st = this.hashData(data.state.toLowerCase());
    if (data.zipCode) userData.zp = this.hashData(data.zipCode);
    if (data.country) userData.country = data.country;
    if (data.externalId) userData.external_id = this.hashData(data.externalId);
    
    // Dados que não precisam de hash
    if (data.ip) userData.client_ip_address = data.ip;
    if (data.userAgent) userData.client_user_agent = data.userAgent;
    if (data.fbp) userData.fbp = data.fbp;
    if (data.fbc) userData.fbc = data.fbc;
    
    return userData;
  }

  // Aplica hash SHA-256 para campos sensíveis
  private hashData(data: string): string {
    if (!data) return '';
    
    // Usando SubtleCrypto API (navegador moderno) se disponível
    if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
      const encoder = new TextEncoder();
      const data_buffer = encoder.encode(data);
      
      // Este código executa de forma assíncrona, então retorna uma promessa
      // Isso significa que em produção seria necessário adaptar a arquitetura para suportar
      return `Hashed_${data}`; // Placeholder, em produção usaria SHA-256 real
    }
    
    // Fallback simples para simulação
    return `Hashed_${data}`;
  }

  // Normaliza número de telefone para formato E.164
  private normalizePhone(phone: string): string {
    return phone.replace(/\D/g, '');
  }
}

// Função de fábrica para obter instância do serviço
export function createMetaPixelService(config: PixelConfig): MetaPixelService {
  return new MetaPixelService(config);
}
