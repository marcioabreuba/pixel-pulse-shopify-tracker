
import { useState, useEffect, useCallback } from 'react';
import { services, PixelConfig, EventData, UserData } from '../services';
import { toast } from 'sonner';

export interface UsePixelOptions {
  pixelId: string | number;  // Alterado para aceitar string ou número
  accessToken: string;
  apiVersion?: string;
  enableServerSide?: boolean;
  enableBrowserSide?: boolean;
}

export function usePixel(options: UsePixelOptions) {
  const [isConfigured, setIsConfigured] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  // Configura as opções padrão
  const pixelConfig: PixelConfig = {
    pixelId: String(options.pixelId),  // Convertemos para string aqui
    accessToken: options.accessToken || '',
    apiVersion: options.apiVersion || 'v19.0',
    enableServerSide: options.enableServerSide !== false,
    enableBrowserSide: options.enableBrowserSide !== false,
  };

  // Inicializa o serviço do Meta Pixel
  const pixelService = services.getMetaPixelService(pixelConfig);

  // Verifica a configuração inicial
  useEffect(() => {
    if (options.pixelId) {
      setIsConfigured(true);
    }
  }, [options.pixelId]);

  // Atualiza a configuração do pixel
  const updateConfig = useCallback((newConfig: Partial<PixelConfig>) => {
    pixelService.updateConfig(newConfig);
    
    if (newConfig.pixelId) {
      setIsConfigured(true);
    }
    
    toast.success('Configurações do Pixel atualizadas');
  }, [pixelService]);

  // Rastreia um evento
  const trackEvent = useCallback(async (
    eventName: string, 
    userData?: Partial<UserData>, 
    customData?: Record<string, any>
  ): Promise<boolean> => {
    if (!isConfigured) {
      toast.error('Pixel não configurado');
      return false;
    }

    try {
      const success = await pixelService.trackEvent(eventName, userData, customData);
      
      if (success) {
        console.log(`Evento ${eventName} rastreado com sucesso`);
      } else {
        console.warn(`Evento ${eventName} pode não ter sido rastreado completamente`);
      }
      
      return success;
    } catch (error) {
      console.error(`Erro ao rastrear evento ${eventName}:`, error);
      return false;
    }
  }, [pixelService, isConfigured]);

  // Prepara dados do usuário com hash para o Pixel
  const prepareUserData = useCallback((data: Record<string, string>): UserData => {
    return pixelService.prepareUserData(data);
  }, [pixelService]);

  // Testa a conexão com a API do Meta
  const testConnection = useCallback(async (): Promise<{ success: boolean; message: string }> => {
    setIsTesting(true);
    
    try {
      const result = await pixelService.testConnection();
      
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
      
      return result;
    } catch (error) {
      const message = `Erro ao testar conexão: ${(error as Error).message}`;
      toast.error(message);
      return { success: false, message };
    } finally {
      setIsTesting(false);
    }
  }, [pixelService]);

  return {
    isConfigured,
    isTesting,
    trackEvent,
    updateConfig,
    prepareUserData,
    testConnection,
  };
}
