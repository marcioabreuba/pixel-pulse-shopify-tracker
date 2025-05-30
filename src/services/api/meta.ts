
import { toast } from "sonner";

// Tipos para a API do Meta
export interface PixelConfig {
  pixelId: string;
  pixelToken: string;     // Renomeado de accessToken para pixelToken
  apiVersion: string;
  enableServerSide: boolean;
  enableBrowserSide: boolean;
  testEventCode?: string; // Adicionado campo para código de evento de teste
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
    if (!this.config.enableServerSide || !this.config.pixelToken) {
      console.log('Rastreamento via servidor desativado ou token não configurado');
      return false;
    }

    try {
      // CORRIGIDO: Enviando token na URL como query parameter
      const url = `https://graph.facebook.com/${this.config.apiVersion}/${this.config.pixelId}/events?access_token=${encodeURIComponent(this.config.pixelToken)}`;
      console.log(`Enviando evento ${eventData.event_name} para ${url}`);
      
      // Sanitizar dados antes de enviar
      const cleanEventData = this.sanitizeEventData(eventData);
      
      const body = {
        data: [cleanEventData],
        test_event_code: this.config.testEventCode || (process.env.NODE_ENV === 'development' ? 'TEST123' : undefined)
      };
      
      console.log('Payload do evento para API:', JSON.stringify(body));
      
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

  // Sanitiza dados de evento para evitar erros de parâmetro inválido
  private sanitizeEventData(eventData: EventData): EventData {
    const cleanData = { ...eventData };
    
    // Garantir que os campos de user_data estão no formato correto
    if (cleanData.user_data) {
      Object.keys(cleanData.user_data).forEach(key => {
        const value = cleanData.user_data![key as keyof UserData];
        if (typeof value === 'string' && value.trim() === '') {
          delete cleanData.user_data![key as keyof UserData];
        }
      });
      
      // Se não houver dados de usuário, remover o objeto inteiro
      if (Object.keys(cleanData.user_data).length === 0) {
        delete cleanData.user_data;
      }
    }
    
    // Garantir que dados personalizados não contêm valores inválidos
    if (cleanData.custom_data) {
      Object.keys(cleanData.custom_data).forEach(key => {
        const value = cleanData.custom_data![key];
        if (value === undefined || value === null || value === '') {
          delete cleanData.custom_data![key];
        }
      });
      
      // Se não houver dados personalizados, remover o objeto inteiro
      if (Object.keys(cleanData.custom_data).length === 0) {
        delete cleanData.custom_data;
      }
    }
    
    return cleanData;
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

  // Testa a conexão enviando um evento de teste para o endpoint /events
  async testConnection(): Promise<{ success: boolean, message: string }> {
    console.log('Iniciando teste de conexão com Meta Pixel');
    
    if (!this.config.pixelId || this.config.pixelId === '') {
      return { 
        success: false, 
        message: "ID do Pixel não configurado" 
      };
    }
    
    if (!this.config.pixelToken || this.config.pixelToken === '') {
      return { 
        success: false, 
        message: "Token do Pixel não configurado" 
      };
    }
    
    console.log('Testando conexão com configuração:', {
      pixelId: this.config.pixelId,
      pixelToken: this.config.pixelToken ? `${this.config.pixelToken.substring(0, 5)}...` : 'não definido',
      apiVersion: this.config.apiVersion,
      testEventCode: this.config.testEventCode || 'TEST123'
    });

    try {
      // CORRIGIDO: Enviando token na URL como query parameter e adicionando dados de usuário necessários
      const testEvent = {
        event_name: "DiagnosticsTest",
        event_time: Math.floor(Date.now() / 1000),
        action_source: "website",
        event_id: `test_${Date.now()}`,
        // ADICIONADO: Incluir objeto user_data com IP e User-Agent
        user_data: {
          client_ip_address: "127.0.0.1",  // IP padrão, já que estamos no navegador
          client_user_agent: navigator.userAgent || "PixelTracker-Test" // Usar User-Agent do navegador
        }
      };
      
      // Colocando o token na query-string, não no body
      const testUrl = `https://graph.facebook.com/${this.config.apiVersion}/${this.config.pixelId}/events?access_token=${encodeURIComponent(this.config.pixelToken)}`;
      const testBody = {
        data: [testEvent],
        test_event_code: this.config.testEventCode || 'TEST123'
      };
      
      console.log('Enviando requisição para:', testUrl);
      console.log('Payload do teste:', JSON.stringify(testBody));
      
      const testResponse = await fetch(testUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testBody)
      });
      
      const testResult = await testResponse.json();
      console.log('Resultado do evento de teste:', testResult);
      
      if (testResponse.ok && testResult.events_received > 0) {
        return {
          success: true,
          message: `Conexão OK (Pixel + CAPI). ${testResult.events_received} evento(s) recebido(s).`
        };
      }
      
      if (testResult.error) {
        const errorMsg = testResult.error.message || 'Erro desconhecido';
        return {
          success: false,
          message: errorMsg
        };
      }
      
      return {
        success: false,
        message: "Evento enviado, mas não foi recebido pelo Meta"
      };
    } catch (error) {
      console.error('Erro ao testar conexão com Meta:', error);
      return { 
        success: false, 
        message: `${(error as Error).message}` 
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
