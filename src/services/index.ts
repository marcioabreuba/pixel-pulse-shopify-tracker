
// Exportando todos os serviços de um único ponto
import { ShopifyService, createShopifyService, ShopifyConfig } from './api/shopify';
import { MetaPixelService, createMetaPixelService, PixelConfig } from './api/meta';
import { GeolocationService, createGeolocationService, GeolocationConfig } from './api/geolocation';
import { WebhookService, createWebhookService } from './api/webhooks';
import { CredentialsService, createCredentialsService } from './storage/credentials';

// Singleton instances
let shopifyServiceInstance: ShopifyService | null = null;
let metaPixelServiceInstance: MetaPixelService | null = null;
let geoLocationServiceInstance: GeolocationService | null = null;
let webhookServiceInstance: WebhookService | null = null;
let credentialsServiceInstance: CredentialsService | null = null;

// Service factory & singleton getters
export const services = {
  // Shopify service
  getShopifyService(config?: ShopifyConfig): ShopifyService {
    if (!shopifyServiceInstance && config) {
      shopifyServiceInstance = createShopifyService(config);
    }
    if (!shopifyServiceInstance) {
      throw new Error('ShopifyService não inicializado. Forneça config na primeira chamada.');
    }
    return shopifyServiceInstance;
  },
  
  // Meta Pixel service
  getMetaPixelService(config?: PixelConfig): MetaPixelService {
    if (config) {
      // Para o Meta Pixel, sempre atualizamos ou criamos uma nova instância
      // quando uma configuração é fornecida, por ser mais flexível e suportar
      // diferentes tokens de acesso (tokens de pixel)
      if (metaPixelServiceInstance) {
        // Se já existe uma instância, apenas atualize a configuração
        console.log('Atualizando configuração do MetaPixelService existente:', config);
        metaPixelServiceInstance.updateConfig(config);
      } else {
        // Cria uma nova instância se não existir
        console.log('Criando nova instância de MetaPixelService com config:', config);
        metaPixelServiceInstance = createMetaPixelService(config);
      }
      return metaPixelServiceInstance;
    } 
    
    if (!metaPixelServiceInstance) {
      console.warn('Tentativa de obter MetaPixelService sem configuração inicial');
      throw new Error('MetaPixelService não inicializado. Forneça config na primeira chamada.');
    }
    
    return metaPixelServiceInstance;
  },
  
  // Geolocation service
  getGeolocationService(config?: GeolocationConfig): GeolocationService {
    if (!geoLocationServiceInstance && config) {
      geoLocationServiceInstance = createGeolocationService(config);
    }
    if (!geoLocationServiceInstance) {
      throw new Error('GeolocationService não inicializado. Forneça config na primeira chamada.');
    }
    return geoLocationServiceInstance;
  },
  
  // Webhook service
  getWebhookService(): WebhookService {
    if (!webhookServiceInstance) {
      webhookServiceInstance = createWebhookService();
    }
    return webhookServiceInstance;
  },
  
  // Credentials service
  getCredentialsService(encryptionKey?: string): CredentialsService {
    if (!credentialsServiceInstance) {
      credentialsServiceInstance = createCredentialsService(encryptionKey);
    }
    return credentialsServiceInstance;
  }
};

// Reexport types
export type { ShopifyService, ShopifyConfig, ShopifyStore, ShopifyWebhook } from './api/shopify';
export type { MetaPixelService, PixelConfig, EventData, UserData } from './api/meta';
export type { GeolocationService, GeolocationConfig, GeoLocation } from './api/geolocation';
export type { WebhookService, WebhookData } from './api/webhooks';
export type { CredentialsService } from './storage/credentials';
