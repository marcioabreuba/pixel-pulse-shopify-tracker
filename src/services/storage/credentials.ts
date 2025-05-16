
// Serviço para armazenamento seguro de credenciais
export class CredentialsService {
  private storageKey = 'secure_credentials';
  private encryptionKey: string | null = null;

  constructor(encryptionKey?: string) {
    if (encryptionKey) {
      this.encryptionKey = encryptionKey;
    }
  }

  // Define a chave de criptografia
  setEncryptionKey(key: string): void {
    this.encryptionKey = key;
  }

  // Salva uma credencial
  saveCredential(key: string, value: string): boolean {
    try {
      const credentials = this.getAllCredentials();
      credentials[key] = this.encrypt(value);
      
      localStorage.setItem(this.storageKey, JSON.stringify(credentials));
      return true;
    } catch (error) {
      console.error('Erro ao salvar credencial:', error);
      return false;
    }
  }

  // Obtém uma credencial pelo nome
  getCredential(key: string): string {
    try {
      const credentials = this.getAllCredentials();
      const encryptedValue = credentials[key];
      
      if (!encryptedValue) return '';
      
      return this.decrypt(encryptedValue);
    } catch (error) {
      console.error('Erro ao obter credencial:', error);
      return '';
    }
  }

  // Remove uma credencial
  removeCredential(key: string): boolean {
    try {
      const credentials = this.getAllCredentials();
      
      if (!(key in credentials)) return false;
      
      delete credentials[key];
      localStorage.setItem(this.storageKey, JSON.stringify(credentials));
      return true;
    } catch (error) {
      console.error('Erro ao remover credencial:', error);
      return false;
    }
  }

  // Lista todas as chaves de credenciais disponíveis
  listCredentialKeys(): string[] {
    try {
      return Object.keys(this.getAllCredentials());
    } catch {
      return [];
    }
  }

  // Obtém todas as credenciais (apenas para uso interno)
  private getAllCredentials(): Record<string, string> {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  }

  // Criptografa uma string (implementação básica)
  private encrypt(text: string): string {
    if (!this.encryptionKey) {
      return text; // Sem criptografia se não houver chave
    }
    
    // Em produção, usaria uma biblioteca de criptografia apropriada
    // Esta é apenas uma implementação básica para simular o processo
    const key = this.generateKey(this.encryptionKey);
    let result = '';
    
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i) ^ key[i % key.length];
      result += String.fromCharCode(charCode);
    }
    
    // Converte para base64 para armazenamento
    return btoa(result);
  }

  // Descriptografa uma string (implementação básica)
  private decrypt(encrypted: string): string {
    if (!this.encryptionKey) {
      return encrypted;
    }
    
    try {
      // Converte de base64
      const text = atob(encrypted);
      const key = this.generateKey(this.encryptionKey);
      let result = '';
      
      for (let i = 0; i < text.length; i++) {
        const charCode = text.charCodeAt(i) ^ key[i % key.length];
        result += String.fromCharCode(charCode);
      }
      
      return result;
    } catch (error) {
      console.error('Erro na descriptografia:', error);
      return '';
    }
  }

  // Gera uma chave a partir da senha
  private generateKey(password: string): number[] {
    const key = [];
    
    for (let i = 0; i < password.length; i++) {
      key.push(password.charCodeAt(i));
    }
    
    return key;
  }
}

// Função de fábrica para obter instância do serviço
export function createCredentialsService(encryptionKey?: string): CredentialsService {
  return new CredentialsService(encryptionKey);
}
