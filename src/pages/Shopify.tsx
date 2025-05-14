
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ShopifyIntegration from "@/components/Shopify/ShopifyIntegration";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle, HelpCircle } from "lucide-react";

const Shopify = () => {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Integração com Shopify</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        <ShopifyIntegration />
        
        <Card>
          <CardHeader>
            <CardTitle>Mapeamento de Eventos</CardTitle>
            <CardDescription>Configure o mapeamento de eventos Shopify para eventos do Pixel do Meta</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="mapping">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="mapping">Mapeamento de Eventos</TabsTrigger>
                <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
              </TabsList>
              
              <TabsContent value="mapping">
                <div className="space-y-4">
                  {[
                    { shopify: "products/view", pixel: "ViewContent", status: "active" },
                    { shopify: "cart/add", pixel: "AddToCart", status: "active" },
                    { shopify: "checkout/start", pixel: "InitiateCheckout", status: "active" },
                    { shopify: "checkout/complete", pixel: "Purchase", status: "active" },
                    { shopify: "collections/view", pixel: "ViewCategory", status: "inactive" }
                  ].map((event, index) => (
                    <div key={index} className="flex justify-between items-center border-b pb-3">
                      <div>
                        <p className="font-medium text-sm">{event.shopify}</p>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <span>Mapeia para:</span>
                          <span className="font-mono bg-muted px-1.5 py-0.5 rounded">{event.pixel}</span>
                        </div>
                      </div>
                      <div>
                        {event.status === "active" ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" />
                            <span>Ativo</span>
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-gray-50 text-gray-500 border-gray-200 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            <span>Inativo</span>
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="webhooks">
                <div className="space-y-6">
                  <div className="bg-muted p-4 rounded">
                    <h3 className="text-sm font-medium flex items-center gap-1.5 mb-2">
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                      <span>Informações sobre Webhooks</span>
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Os webhooks permitem que sua aplicação seja notificada quando eventos específicos ocorrem em sua loja Shopify. 
                      O sistema registrará automaticamente esses webhooks durante o processo de integração.
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    {[
                      { topic: "products/create", address: "/api/webhooks/shopify/products", status: "active" },
                      { topic: "products/update", address: "/api/webhooks/shopify/products", status: "active" },
                      { topic: "orders/create", address: "/api/webhooks/shopify/orders", status: "active" },
                      { topic: "orders/paid", address: "/api/webhooks/shopify/orders", status: "active" },
                      { topic: "checkouts/create", address: "/api/webhooks/shopify/checkouts", status: "pending" }
                    ].map((webhook, index) => (
                      <div key={index} className="flex items-center justify-between border-b pb-3">
                        <div>
                          <p className="text-sm font-medium">{webhook.topic}</p>
                          <p className="text-xs font-mono text-muted-foreground">{webhook.address}</p>
                        </div>
                        <div>
                          {webhook.status === "active" ? (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              Ativo
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                              Pendente
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Shopify;
