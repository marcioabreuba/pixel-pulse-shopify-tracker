import { useState, useEffect, useCallback } from 'react';
import { services, PixelConfig, EventData, UserData } from '../services';
import { toast } from 'sonner';

export interface UsePixelOptions {
  pixelId: string | number;  // Alterado para aceitar string ou número
  pixelToken: string;        // Renomeado de accessToken para pixelToken
  apiVersion?: string;
  enableServerSide?: boolean;
  enableBrowserSide?: boolean;
  testEventCode?: string;    // Novo campo para código de evento de teste
}

export function usePixel(options: UsePixelOptions) {
  const [isConfigured, setIsConfigured] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [currentConfig, setCurrentConfig] = useState<PixelConfig>({
    pixelId: String(options.pixelId),
    pixelToken: options.pixelToken || '',     // Renomeado para pixelToken
    apiVersion: options.apiVersion || 'v19.0',
    enableServerSide: options.enableServerSide !== false,
    enableBrowserSide: options.enableBrowserSide !== false,
    testEventCode: options.testEventCode || 'TEST123', // Adicionado testEventCode
  });

  // Inicializa o serviço do Meta Pixel com a configuração inicial
  const pixelService = services.getMetaPixelService(currentConfig);

  // Verifica a configuração inicial e atualiza quando as opções mudam
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
      pixelToken: options.pixelToken || '',   // Renomeado para pixelToken
      apiVersion: options.apiVersion || 'v19.0',
      enableServerSide: options.enableServerSide !== false,
      enableBrowserSide: options.enableBrowserSide !== false,
      testEventCode: options.testEventCode || 'TEST123', // Adicionado testEventCode
    };
    
    console.log('usePixel: Atualizando configuração com opções:', newConfig);
    setCurrentConfig(newConfig);
    
    // Certifique-se de atualizar o serviço com a nova configuração
    try {
      pixelService.updateConfig(newConfig);
    } catch (error) {
      console.error('Erro ao atualizar configuração do serviço Pixel:', error);
    }
    
  }, [options.pixelId, options.pixelToken, options.apiVersion, options.enableServerSide, options.enableBrowserSide, options.testEventCode]);

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
    
    if (!currentConfig.pixelToken || currentConfig.pixelToken === '') {
      setIsTesting(false);
      return { 
        success: false, 
        message: 'Token do Pixel não configurado' 
      };
    }
    
    try {
      console.log('Enviando requisição de teste para o Meta...');
      
      // Garantir que estamos usando a configuração mais recente
      const updatedService = services.getMetaPixelService(currentConfig);
      
      const result = await updatedService.testConnection();
      console.log('Resultado do teste:', result);
      
      if (result.success) {
        setIsConfigured(true);
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
      
      return result;
    } catch (error) {
      console.error('Erro ao testar conexão:', error);
      const errorMessage = `Erro ao testar conexão: ${(error as Error).message}`;
      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setIsTesting(false);
    }
  }, [currentConfig]);

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
