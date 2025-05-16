
import { EventData, UserData } from './meta';
import { toast } from "sonner";

// Tipos para processamento de webhooks
export interface WebhookData {
  id: string;
  topic: string;
  payload: any;
  shopDomain?: string;
  timestamp: number;
}

// Serviço para processamento de webhooks
export class WebhookService {
  private webhookHandlers: Record<string, (data: WebhookData) => Promise<boolean>>;
  private eventMappers: Record<string, (data: WebhookData) => Promise<EventData | null>>;

  constructor() {
    this.webhookHandlers = {};
    this.eventMappers = {};
    
    // Registra handlers padrão para Shopify
    this.registerDefaultShopifyHandlers();
  }

  // Registra um handler para um tópico de webhook
  registerHandler(topic: string, handler: (data: WebhookData) => Promise<boolean>): void {
    this.webhookHandlers[topic] = handler;
  }

  // Registra um mapeador de eventos
  registerEventMapper(topic: string, mapper: (data: WebhookData) => Promise<EventData | null>): void {
    this.eventMappers[topic] = mapper;
  }

  // Processa dados de webhook recebidos
  async processWebhook(topic: string, payload: any, shopDomain?: string): Promise<boolean> {
    const webhookData: WebhookData = {
      id: this.generateWebhookId(),
      topic,
      payload,
      shopDomain,
      timestamp: Date.now()
    };

    try {
      // Usa o handler específico ou um genérico
      const handler = this.webhookHandlers[topic] || this.defaultHandler;
      return await handler(webhookData);
    } catch (error) {
      console.error(`Erro ao processar webhook ${topic}:`, error);
      return false;
    }
  }

  // Mapeia dados de webhook para evento do Meta
  async mapToMetaEvent(topic: string, payload: any, shopDomain?: string): Promise<EventData | null> {
    const webhookData: WebhookData = {
      id: this.generateWebhookId(),
      topic,
      payload,
      shopDomain,
      timestamp: Date.now()
    };

    try {
      // Usa o mapeador específico ou retorna null
      const mapper = this.eventMappers[topic];
      if (!mapper) return null;
      
      return await mapper(webhookData);
    } catch (error) {
      console.error(`Erro ao mapear webhook ${topic} para evento:`, error);
      return null;
    }
  }

  // Handler padrão para webhooks não registrados
  private async defaultHandler(data: WebhookData): Promise<boolean> {
    console.log(`Webhook recebido [${data.topic}]:`, data);
    return true;
  }

  // Registra handlers padrão para eventos Shopify
  private registerDefaultShopifyHandlers(): void {
    // Mapeadores de eventos Shopify para Meta Pixel
    this.registerEventMapper('products/view', this.mapProductViewEvent);
    this.registerEventMapper('products/create', this.mapProductCreateEvent);
    this.registerEventMapper('products/update', this.mapProductUpdateEvent);
    this.registerEventMapper('cart/add', this.mapAddToCartEvent);
    this.registerEventMapper('cart/update', this.mapUpdateCartEvent);
    this.registerEventMapper('checkouts/create', this.mapCheckoutCreateEvent);
    this.registerEventMapper('checkouts/update', this.mapCheckoutUpdateEvent);
    this.registerEventMapper('orders/create', this.mapOrderCreateEvent);
    this.registerEventMapper('orders/paid', this.mapOrderPaidEvent);
  }

  // Mapeadores de eventos Shopify para Meta Pixel
  private async mapProductViewEvent(data: WebhookData): Promise<EventData | null> {
    const product = data.payload;
    
    if (!product || !product.id) return null;
    
    return {
      event_name: 'ViewContent',
      event_time: Math.floor(data.timestamp / 1000),
      action_source: 'website',
      custom_data: {
        content_type: 'product',
        content_ids: [product.id.toString()],
        content_name: product.title,
        content_category: product.product_type || '',
        value: parseFloat(product.variants?.[0]?.price || '0'),
        currency: 'BRL'
      }
    };
  }
  
  private async mapProductCreateEvent(data: WebhookData): Promise<EventData | null> {
    // Produtos criados não geram eventos de pixel diretamente
    return null;
  }
  
  private async mapProductUpdateEvent(data: WebhookData): Promise<EventData | null> {
    // Produtos atualizados não geram eventos de pixel diretamente
    return null;
  }
  
  private async mapAddToCartEvent(data: WebhookData): Promise<EventData | null> {
    const item = data.payload;
    
    if (!item || !item.id) return null;
    
    return {
      event_name: 'AddToCart',
      event_time: Math.floor(data.timestamp / 1000),
      action_source: 'website',
      custom_data: {
        content_type: 'product',
        content_ids: [item.product_id.toString()],
        content_name: item.title || '',
        value: parseFloat(item.price || '0') * (parseInt(item.quantity) || 1),
        currency: 'BRL',
        contents: [{
          id: item.product_id.toString(),
          quantity: parseInt(item.quantity) || 1,
          item_price: parseFloat(item.price || '0')
        }]
      }
    };
  }
  
  private async mapUpdateCartEvent(data: WebhookData): Promise<EventData | null> {
    // Atualizações de carrinho são complexas e variam conforme a implementação
    return null;
  }
  
  private async mapCheckoutCreateEvent(data: WebhookData): Promise<EventData | null> {
    const checkout = data.payload;
    
    if (!checkout || !checkout.id) return null;
    
    // Calcula valor total
    const value = parseFloat(checkout.total_price || '0');
    
    // Prepara conteúdos do carrinho
    const contents = (checkout.line_items || []).map(item => ({
      id: item.product_id?.toString() || '',
      quantity: parseInt(item.quantity) || 0,
      item_price: parseFloat(item.price || '0')
    }));
    
    return {
      event_name: 'InitiateCheckout',
      event_time: Math.floor(data.timestamp / 1000),
      action_source: 'website',
      custom_data: {
        content_type: 'product',
        contents,
        value,
        currency: 'BRL',
        num_items: contents.reduce((total, item) => total + item.quantity, 0)
      }
    };
  }
  
  private async mapCheckoutUpdateEvent(data: WebhookData): Promise<EventData | null> {
    // A maioria das atualizações de checkout não geram eventos
    return null;
  }
  
  private async mapOrderCreateEvent(data: WebhookData): Promise<EventData | null> {
    const order = data.payload;
    
    if (!order || !order.id) return null;
    
    // Verifica se o pedido está pago
    const financial_status = order.financial_status;
    if (financial_status !== 'paid' && financial_status !== 'partially_paid') {
      // Se não estiver pago, não gera evento Purchase ainda
      return null;
    }
    
    // Prepara conteúdos do pedido
    const contents = (order.line_items || []).map(item => ({
      id: item.product_id?.toString() || '',
      quantity: parseInt(item.quantity) || 0,
      item_price: parseFloat(item.price || '0')
    }));
    
    return {
      event_name: 'Purchase',
      event_time: Math.floor(data.timestamp / 1000),
      action_source: 'website',
      custom_data: {
        content_type: 'product',
        contents,
        value: parseFloat(order.total_price || '0'),
        currency: order.currency || 'BRL',
        num_items: contents.reduce((total, item) => total + item.quantity, 0),
        order_id: order.id.toString()
      }
    };
  }
  
  private async mapOrderPaidEvent(data: WebhookData): Promise<EventData | null> {
    // Usa o mesmo mapeamento do event create, mas só para pagamentos
    return this.mapOrderCreateEvent(data);
  }

  // Gera um ID único para webhook
  private generateWebhookId(): string {
    return `wh_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
  }
}

// Função de fábrica para obter instância do serviço
export function createWebhookService(): WebhookService {
  return new WebhookService();
}
