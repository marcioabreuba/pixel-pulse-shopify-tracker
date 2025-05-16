
import { useState, useCallback } from 'react';
import { services, WebhookData } from '../services';
import { toast } from 'sonner';

export interface UseWebhooksOptions {
  onError?: (error: Error) => void;
}

export function useWebhooks(options?: UseWebhooksOptions) {
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Inicializa o serviço de webhooks
  const webhookService = services.getWebhookService();

  // Processa um webhook recebido
  const processWebhook = useCallback(async (
    topic: string,
    payload: any,
    shopDomain?: string
  ): Promise<boolean> => {
    setIsProcessing(true);
    
    try {
      return await webhookService.processWebhook(topic, payload, shopDomain);
    } catch (error) {
      console.error('Erro ao processar webhook:', error);
      
      if (options?.onError) {
        options.onError(error as Error);
      } else {
        toast.error(`Erro ao processar webhook: ${(error as Error).message}`);
      }
      
      return false;
    } finally {
      setIsProcessing(false);
    }
  }, [webhookService, options]);

  // Mapeia dados de webhook para evento do Meta
  const mapToMetaEvent = useCallback(async (
    topic: string,
    payload: any,
    shopDomain?: string
  ) => {
    try {
      return await webhookService.mapToMetaEvent(topic, payload, shopDomain);
    } catch (error) {
      console.error('Erro ao mapear webhook para evento:', error);
      
      if (options?.onError) {
        options.onError(error as Error);
      }
      
      return null;
    }
  }, [webhookService, options]);

  return {
    isProcessing,
    processWebhook,
    mapToMetaEvent,
  };
}
