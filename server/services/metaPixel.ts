
import { z } from 'zod';

// Esquema de validação para payload de evento
const EventDataSchema = z.object({
  event_name: z.string(),
  event_time: z.number(),
  event_id: z.string(),
  action_source: z.string().default('website'),
  user_data: z.record(z.unknown()).optional(),
  custom_data: z.record(z.unknown()).optional(),
});

// Interfaces para a API do Meta
interface EventResponse {
  events_received?: number;
  messages?: string[];
  error?: {
    message: string;
    code: number;
    type: string;
  };
}

export class MetaPixelService {
  private pixelId: string;
  private accessToken: string;
  private apiVersion: string;
  private testEventCode?: string;

  constructor() {
    this.pixelId = process.env.PIXEL_ID || '';
    this.accessToken = process.env.ACCESS_TOKEN || '';
    this.apiVersion = process.env.API_VERSION || 'v19.0';
    this.testEventCode = process.env.TEST_EVENT_CODE;
    
    if (!this.pixelId || !this.accessToken) {
      console.warn('AVISO: PIXEL_ID ou ACCESS_TOKEN não configurados em variáveis de ambiente');
    }
  }

  // Método para enviar dados para o Meta Conversions API
  async sendToMeta(eventData: unknown): Promise<{ success: boolean; message: string }> {
    try {
      // Validar os dados do evento
      const validation = EventDataSchema.safeParse(eventData);
      if (!validation.success) {
        return {
          success: false,
          message: `Dados de evento inválidos: ${JSON.stringify(validation.error.format())}`
        };
      }

      const validatedData = validation.data;
      
      // Sanitizar dados antes de enviar (remover campos vazios)
      const sanitizedData = this.sanitizeEventData(validatedData);
      
      // Construir a URL da API
      const url = `https://graph.facebook.com/${this.apiVersion}/${this.pixelId}/events?access_token=${encodeURIComponent(this.accessToken)}`;
      
      // Preparar corpo da requisição
      const body = {
        data: [sanitizedData],
        ...(this.testEventCode ? { test_event_code: this.testEventCode } : {})
      };
      
      console.log(`Enviando evento ${validatedData.event_name} para API do Meta`);
      
      // Enviar requisição
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      // Processar resposta
      const result = await response.json() as EventResponse;
      
      if (!response.ok) {
        console.error('Erro na resposta da API do Meta:', result);
        return {
          success: false,
          message: result.error?.message || `Erro HTTP ${response.status}`
        };
      }
      
      console.log('Resposta da API do Meta:', result);
      return {
        success: result.events_received === 1,
        message: result.events_received === 1 
          ? 'Evento processado com sucesso' 
          : 'Evento enviado mas não foi confirmado pelo Meta'
      };
    } catch (error) {
      console.error(`Erro ao enviar evento para Conversions API:`, error);
      return { 
        success: false, 
        message: `${(error as Error).message}` 
      };
    }
  }

  // Método para testar a conexão com o Meta
  async diagnosticsTest(): Promise<{ success: boolean; message: string }> {
    try {
      if (!this.pixelId || !this.accessToken) {
        return { 
          success: false, 
          message: "ID do Pixel ou Token de Acesso não configurados" 
        };
      }
      
      // Criar evento de teste
      const testEvent = {
        event_name: "DiagnosticsTest",
        event_time: Math.floor(Date.now() / 1000),
        action_source: "website" as const,
        event_id: `test_${Date.now()}`,
        user_data: {
          client_ip_address: "127.0.0.1",
          client_user_agent: "PixelTracker-Test-Backend"
        }
      };
      
      // Enviar evento de teste
      return await this.sendToMeta(testEvent);
    } catch (error) {
      console.error('Erro ao testar conexão com Meta:', error);
      return { 
        success: false, 
        message: `${(error as Error).message}` 
      };
    }
  }

  // Sanitiza dados de evento para evitar erros de parâmetro inválido
  private sanitizeEventData<T extends Record<string, any>>(eventData: T): T {
    const cleanData = { ...eventData };
    
    // Verificar e limpar user_data
    if (cleanData.user_data) {
      Object.keys(cleanData.user_data).forEach(key => {
        const value = cleanData.user_data[key];
        if (value === undefined || value === null || value === '') {
          delete cleanData.user_data[key];
        }
      });
      
      // Se não houver dados de usuário, remover o objeto inteiro
      if (Object.keys(cleanData.user_data).length === 0) {
        delete cleanData.user_data;
      }
    }
    
    // Verificar e limpar custom_data
    if (cleanData.custom_data) {
      Object.keys(cleanData.custom_data).forEach(key => {
        const value = cleanData.custom_data[key];
        if (value === undefined || value === null || value === '') {
          delete cleanData.custom_data[key];
        }
      });
      
      // Se não houver dados personalizados, remover o objeto inteiro
      if (Object.keys(cleanData.custom_data).length === 0) {
        delete cleanData.custom_data;
      }
    }
    
    return cleanData;
  }
}

// Exporta uma instância singleton do serviço
export const metaPixelService = new MetaPixelService();

// Métodos exportados para uso direto
export const sendToMeta = (payload: unknown) => metaPixelService.sendToMeta(payload);
export const diagnosticsTest = () => metaPixelService.diagnosticsTest();
