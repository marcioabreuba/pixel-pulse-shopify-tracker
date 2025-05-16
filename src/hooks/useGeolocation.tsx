
import { useState, useEffect, useCallback } from 'react';
import { services, GeolocationConfig, GeoLocation } from '../services';
import { toast } from 'sonner';

export interface UseGeolocationOptions {
  accountId?: string;
  licenseKey?: string;
  dbPath?: string;
}

export function useGeolocation(options: UseGeolocationOptions) {
  const [isConfigured, setIsConfigured] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<GeoLocation | null>(null);

  // Configura as opções padrão
  const geoConfig: GeolocationConfig = {
    provider: 'maxmind',
    accountId: options.accountId,
    licenseKey: options.licenseKey,
    dbPath: options.dbPath,
  };

  // Inicializa o serviço de geolocalização
  const geoService = services.getGeolocationService(geoConfig);

  // Verifica a configuração inicial
  useEffect(() => {
    if (options.accountId && options.licenseKey) {
      setIsConfigured(true);
    }
  }, [options.accountId, options.licenseKey]);

  // Atualiza a configuração do serviço de geolocalização
  const updateConfig = useCallback((newConfig: Partial<GeolocationConfig>) => {
    geoService.updateConfig(newConfig);
    
    if (newConfig.accountId && newConfig.licenseKey) {
      setIsConfigured(true);
    }
    
    toast.success('Configurações de geolocalização atualizadas');
  }, [geoService]);

  // Detecta localização do usuário atual
  const detectUserLocation = useCallback(async (): Promise<GeoLocation | null> => {
    if (!isConfigured) {
      toast.error('Serviço de geolocalização não configurado');
      return null;
    }

    setIsLoading(true);
    
    try {
      const ip = await geoService.detectUserIp();
      if (!ip) {
        toast.error('Não foi possível detectar seu IP');
        return null;
      }
      
      const location = await geoService.getLocationByIp(ip);
      setUserLocation(location);
      
      return location;
    } catch (error) {
      console.error('Erro ao detectar localização:', error);
      toast.error('Falha ao obter dados de localização');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [geoService, isConfigured]);

  // Converte IPv4 para o formato IPv6
  const convertIpv4ToIpv6 = useCallback((ipv4: string): string => {
    return geoService.convertIpv4ToIpv6Format(ipv4);
  }, [geoService]);

  // Testa a conexão com o serviço de geolocalização
  const testConnection = useCallback(async (): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true);
    
    try {
      const result = await geoService.testConnection();
      
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
      
      return result;
    } catch (error) {
      const message = `Erro ao testar serviço: ${(error as Error).message}`;
      toast.error(message);
      return { success: false, message };
    } finally {
      setIsLoading(false);
    }
  }, [geoService]);

  return {
    isConfigured,
    isLoading,
    userLocation,
    updateConfig,
    detectUserLocation,
    convertIpv4ToIpv6,
    testConnection,
  };
}
