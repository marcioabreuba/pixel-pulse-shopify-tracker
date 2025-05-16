
import { toast } from "sonner";

// Interfaces para o serviço de geolocalização
export interface GeolocationConfig {
  provider: 'maxmind';
  accountId?: string;
  licenseKey?: string;
  dbPath?: string;
}

export interface GeoLocation {
  ip: string;
  city?: string;
  region?: string;
  country?: string;
  continent?: string;
  latitude?: number;
  longitude?: number;
  postalCode?: string;
  timezone?: string;
  accuracyRadius?: number;
}

// Classe de serviço para geolocalização
export class GeolocationService {
  private config: GeolocationConfig;
  private apiUrl = 'https://geolite.info/geoip/v2.1/city';
  private isConfigured = false;

  constructor(config: GeolocationConfig) {
    this.config = config;
    this.isConfigured = !!(config.accountId && config.licenseKey);
  }

  // Atualiza a configuração
  updateConfig(config: Partial<GeolocationConfig>): void {
    this.config = { ...this.config, ...config };
    this.isConfigured = !!(this.config.accountId && this.config.licenseKey);
  }

  // Obtém informações de geolocalização para um IP
  async getLocationByIp(ip: string): Promise<GeoLocation | null> {
    if (!this.isConfigured) {
      console.error('Serviço de geolocalização não configurado');
      return null;
    }

    try {
      const credentials = btoa(`${this.config.accountId}:${this.config.licenseKey}`);
      
      const response = await fetch(`${this.apiUrl}/${ip}`, {
        headers: {
          'Authorization': `Basic ${credentials}`
        }
      });

      if (!response.ok) {
        throw new Error(`Erro na API de geolocalização: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        ip,
        city: data.city?.names?.pt || data.city?.names?.en,
        region: data.subdivisions?.[0]?.names?.pt || data.subdivisions?.[0]?.names?.en,
        country: data.country?.names?.pt || data.country?.names?.en,
        continent: data.continent?.names?.pt || data.continent?.names?.en,
        latitude: data.location?.latitude,
        longitude: data.location?.longitude,
        postalCode: data.postal?.code,
        timezone: data.location?.time_zone,
        accuracyRadius: data.location?.accuracy_radius
      };
    } catch (error) {
      console.error('Erro ao obter dados de geolocalização:', error);
      return null;
    }
  }

  // Detecta o IP do usuário atual
  async detectUserIp(): Promise<string> {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      console.error('Erro ao detectar IP:', error);
      return '';
    }
  }

  // Testa a conexão com o serviço de geolocalização
  async testConnection(): Promise<{ success: boolean, message: string }> {
    if (!this.isConfigured) {
      return { 
        success: false, 
        message: "Serviço de geolocalização não configurado. Adicione as credenciais." 
      };
    }

    try {
      const ip = await this.detectUserIp();
      if (!ip) {
        return { 
          success: false, 
          message: "Não foi possível detectar o IP para teste." 
        };
      }
      
      const location = await this.getLocationByIp(ip);
      if (!location) {
        return { 
          success: false, 
          message: "Falha ao consultar dados de geolocalização." 
        };
      }
      
      return { 
        success: true, 
        message: `Conexão bem-sucedida. IP detectado: ${ip} (${location.city || ''}, ${location.country || ''})` 
      };
    } catch (error) {
      return { 
        success: false, 
        message: `Erro ao testar serviço de geolocalização: ${(error as Error).message}` 
      };
    }
  }

  // Converte IPv4 para formato compatível com IPv6
  convertIpv4ToIpv6Format(ipv4: string): string {
    // Validação simples de IPv4
    const ipv4Regex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
    const match = ipv4.match(ipv4Regex);
    
    if (!match) {
      return ipv4; // Não é IPv4 ou formato inválido
    }
    
    // Converte cada octeto para hexadecimal
    const octets = [match[1], match[2], match[3], match[4]];
    const hexOctets = octets.map(octet => {
      const hex = parseInt(octet).toString(16).padStart(2, '0');
      return hex;
    });
    
    // Formato IPv6: ::ffff:xxxx:xxxx onde xxxx são os octetos em hex
    return `::ffff:${hexOctets[0]}${hexOctets[1]}:${hexOctets[2]}${hexOctets[3]}`;
  }
}

// Função de fábrica para obter instância do serviço
export function createGeolocationService(config: GeolocationConfig): GeolocationService {
  return new GeolocationService(config);
}
