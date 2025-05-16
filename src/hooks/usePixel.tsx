
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
  const [currentConfig, setCurrentConfig] = useState<PixelConfig>({
    pixelId: String(options.pixelId),
    accessToken: options.accessToken || '',
    apiVersion: options.apiVersion || 'v19.0',
    enableServerSide: options.enableServerSide !== false,
    enableBrowserSide: options.enableBrowserSide !== false,
  });

  // Inicializa o serviço do Meta Pixel com a configuração inicial
  const pixelService = services.getMetaPixelService(currentConfig);

  // Verifica a configuração inicial
  useEffect(() => {
    if (options.pixelId && String(options.pixelId).trim() !== '') {
      console.log('usePixel: ID do pixel definido:', options.pixelId);
      setIsConfigured(true);
    } else {
      console.log('usePixel: ID do pixel não definido');
      setIsConfigured(false);
    }
    
    // Atualiza a configuração quando as opções mudam
    const newConfig = {
      pixelId: String(options.pixelId),
      accessToken: options.accessToken || '',
      apiVersion: options.apiVersion || 'v19.0',
      enableServerSide: options.enableServerSide !== false,
      enableBrowserSide: options.enableBrowserSide !== false,
    };
    
    console.log('usePixel: Atualizando configuração com opções:', newConfig);
    setCurrentConfig(newConfig);
    pixelService.updateConfig(newConfig);
    
  }, [options.pixelId, options.accessToken, options.apiVersion, options.enableServerSide, options.enableBrowserSide, pixelService]);

  // Atualiza a configuração do pixel
  const updateConfig = useCallback((newConfig: Partial<PixelConfig>) => {
    try {
      console.log('usePixel: Atualizando configurações do Pixel:', newConfig);
      
      const updatedConfig = { ...currentConfig, ...newConfig };
      setCurrentConfig(updatedConfig);
      pixelService.updateConfig(updatedConfig);
      
      if (newConfig.pixelId && newConfig.pixelId !== '') {
        setIsConfigured(true);
      }
    } catch (error) {
      console.error('Erro ao atualizar configurações do Pixel:', error);
      toast.error(`Erro ao atualizar configurações: ${(error as Error).message}`);
    }
  }, [currentConfig, pixelService]);

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
      console.log(`Rastreando evento ${eventName}`, { userData, customData });
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
    console.log('Testando conexão com o Meta Pixel...');
    console.log('Configuração atual:', currentConfig);
    
    if (!currentConfig.pixelId || currentConfig.pixelId === '') {
      setIsTesting(false);
      return { 
        success: false, 
        message: 'ID do Pixel não configurado' 
      };
    }
    
    if (!currentConfig.accessToken || currentConfig.accessToken === '') {
      setIsTesting(false);
      return { 
        success: false, 
        message: 'Token de acesso não configurado' 
      };
    }
    
    try {
      console.log('Enviando requisição de teste para o Meta...');
      
      // Garantir que estamos usando a configuração mais recente
      pixelService.updateConfig(currentConfig);
      
      const result = await pixelService.testConnection();
      console.log('Resultado do teste:', result);
      
      if (result.success) {
        setIsConfigured(true);
      }
      
      return result;
    } catch (error) {
      console.error('Erro ao testar conexão:', error);
      const errorMessage = `Erro ao testar conexão: ${(error as Error).message}`;
      return { success: false, message: errorMessage };
    } finally {
      setIsTesting(false);
    }
  }, [currentConfig, pixelService]);

  return {
    isConfigured,
    isTesting,
    trackEvent,
    updateConfig,
    prepareUserData,
    testConnection,
    currentConfig,
  };
}
