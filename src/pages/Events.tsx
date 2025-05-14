
import React from 'react';
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ConfiguracaoPixel from "@/components/Pixel/ConfiguracaoPixel";

const Events = () => {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Rastreamento de Eventos</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-2/3">
          <Tabs defaultValue="pixel" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="pixel">Pixel do Meta</TabsTrigger>
              <TabsTrigger value="custom">Eventos Personalizados</TabsTrigger>
            </TabsList>
            <TabsContent value="pixel">
              <ConfiguracaoPixel />
            </TabsContent>
            <TabsContent value="custom">
              <div className="bg-card rounded-lg border shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Rastreamento de Eventos Personalizados</h2>
                <p className="text-muted-foreground mb-6">
                  Defina e gerencie eventos personalizados para rastrear interações específicas de usuários.
                  Eventos personalizados podem ser acionados via API JavaScript ou através da integração com Shopify.
                </p>
                
                <div className="bg-muted p-4 rounded-md mb-6">
                  <h3 className="text-sm font-medium mb-2">Exemplo de API JavaScript</h3>
                  <pre className="text-xs overflow-auto p-2 bg-background rounded border">
{`trackEvent('VisualizacaoProduto', {
  product_id: '12345',
  product_name: 'Produto Exemplo',
  price: 99.99,
  currency: 'BRL'
});`}
                  </pre>
                </div>
                
                <Button variant="outline">Adicionar Evento Personalizado</Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="md:w-1/3">
          <div className="bg-card rounded-lg border shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Log de Eventos</h2>
            <div className="relative mb-4">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar eventos..." className="pl-8" />
            </div>
            
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="border-b pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-sm">
                        {i % 3 === 0 ? "Compra" : i % 2 === 0 ? "AdicionarAoCarrinho" : "VisualizacaoPagina"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        via {i % 2 === 0 ? "API Shopify" : "Pixel Web"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs">há {i * 5} minutos</p>
                      <p className="text-xs text-muted-foreground">ID: {123456 + i}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <Button variant="link" className="mt-2 px-0">Ver Todos os Eventos</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Events;
