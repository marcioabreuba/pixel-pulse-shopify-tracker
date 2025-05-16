
import { useState, useCallback, useEffect } from 'react';
import { services } from '../services';
import { toast } from 'sonner';

export interface UseCredentialsOptions {
  encryptionKey?: string;
}

export function useCredentials(options?: UseCredentialsOptions) {
  const [isReady, setIsReady] = useState(false);
  
  // Inicializa o serviço de credenciais
  const credentialsService = services.getCredentialsService(options?.encryptionKey);

  useEffect(() => {
    // Define a chave de encriptação se fornecida
    if (options?.encryptionKey) {
      credentialsService.setEncryptionKey(options.encryptionKey);
    }
    
    setIsReady(true);
  }, [options?.encryptionKey]);

  // Salva uma credencial
  const saveCredential = useCallback((key: string, value: string): boolean => {
    try {
      const success = credentialsService.saveCredential(key, value);
      
      if (success) {
        toast.success(`Credencial "${key}" salva com sucesso`);
      } else {
        toast.error(`Falha ao salvar credencial "${key}"`);
      }
      
      return success;
    } catch (error) {
      console.error('Erro ao salvar credencial:', error);
      toast.error(`Erro ao salvar credencial: ${(error as Error).message}`);
      return false;
    }
  }, [credentialsService]);

  // Obtém uma credencial
  const getCredential = useCallback((key: string): string => {
    try {
      return credentialsService.getCredential(key);
    } catch (error) {
      console.error('Erro ao obter credencial:', error);
      return '';
    }
  }, [credentialsService]);

  // Remove uma credencial
  const removeCredential = useCallback((key: string): boolean => {
    try {
      const success = credentialsService.removeCredential(key);
      
      if (success) {
        toast.success(`Credencial "${key}" removida com sucesso`);
      } else {
        toast.error(`Credencial "${key}" não encontrada`);
      }
      
      return success;
    } catch (error) {
      console.error('Erro ao remover credencial:', error);
      toast.error(`Erro ao remover credencial: ${(error as Error).message}`);
      return false;
    }
  }, [credentialsService]);

  // Lista todas as chaves de credenciais disponíveis
  const listCredentialKeys = useCallback((): string[] => {
    try {
      return credentialsService.listCredentialKeys();
    } catch (error) {
      console.error('Erro ao listar credenciais:', error);
      return [];
    }
  }, [credentialsService]);

  return {
    isReady,
    saveCredential,
    getCredential,
    removeCredential,
    listCredentialKeys,
  };
}
