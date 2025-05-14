
import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { InfoIcon } from "lucide-react";

const formSchema = z.object({
  pixelId: z.string().min(1, {
    message: "ID do Pixel é obrigatório",
  }),
  accessToken: z.string().min(1, {
    message: "Token de acesso é obrigatório",
  }),
  apiVersion: z.string().default("v19.0"),
  enableServerSide: z.boolean().default(true),
  enableBrowserSide: z.boolean().default(true),
  trackProdutoView: z.boolean().default(true),
  trackAddToCart: z.boolean().default(true),
  trackCheckout: z.boolean().default(true),
  trackCompra: z.boolean().default(true),
  enviarGeolocalizacao: z.boolean().default(true),
});

const ConfiguracaoPixel = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pixelId: "1163339595278098",
      accessToken: "EAAHZAkMjZBhOkBOyNMyPlwzhsX3ruT2cUAQCe8pqOFyuD15BzCspoQ8VZAMWahuI5yTmHUsIDIURs7uSOXH0DOZBKXsu9sFlhaYTC7sQ5o5dVYIYggiZBFDLZAEyZC63qPjvhe4Q8RbxX7yMCWDaULYJ2TA8fKFJDPMweuR44ayRdDVWziDm1LYrLOgZC3LIBWbKPgZDZD",
      apiVersion: "v19.0",
      enableServerSide: true,
      enableBrowserSide: true,
      trackProdutoView: true,
      trackAddToCart: true,
      trackCheckout: true,
      trackCompra: true,
      enviarGeolocalizacao: true
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast.success("Configurações do Pixel salvas com sucesso");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuração do Pixel do Meta</CardTitle>
        <CardDescription>
          Configure sua integração com o Meta Pixel para rastreamento de eventos
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="configuracoes" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="configuracoes">Configurações Básicas</TabsTrigger>
            <TabsTrigger value="eventos">Eventos</TabsTrigger>
            <TabsTrigger value="avancado">Configurações Avançadas</TabsTrigger>
          </TabsList>
          
          <TabsContent value="configuracoes" className="space-y-4 pt-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="pixelId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ID do Pixel</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>
                        O ID do seu Meta Pixel (encontrado no Gerenciador de Eventos do Meta)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="accessToken"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Token de Acesso à API</FormLabel>
                      <FormControl>
                        <Input {...field} type="password" />
                      </FormControl>
                      <FormDescription>
                        Token de acesso para a API do servidor do Meta Conversions
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="apiVersion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Versão da API</FormLabel>
                      <FormControl>
                        <select
                          className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                          {...field}
                        >
                          <option value="v19.0">v19.0 (Atual)</option>
                          <option value="v18.0">v18.0</option>
                          <option value="v17.0">v17.0</option>
                        </select>
                      </FormControl>
                      <FormDescription>
                        Versão da API do Meta Conversions a ser utilizada
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex gap-8">
                  <FormField
                    control={form.control}
                    name="enableServerSide"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-2">
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div>
                          <FormLabel>Rastreamento via Servidor</FormLabel>
                          <FormDescription>
                            Enviar eventos via API do servidor
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="enableBrowserSide"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-2">
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div>
                          <FormLabel>Rastreamento via Navegador</FormLabel>
                          <FormDescription>
                            Usar o script do Pixel no navegador
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
                
                <Button type="submit">Salvar Configurações</Button>
              </form>
            </Form>
          </TabsContent>
          
          <TabsContent value="eventos" className="pt-4">
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-md flex items-start gap-2">
                <InfoIcon className="h-5 w-5 text-tracking-blue mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm">
                    Configure quais eventos da sua loja Shopify serão enviados automaticamente para o Meta Pixel. 
                    Eventos habilitados serão enviados tanto por servidor quanto por navegador, conforme suas configurações básicas.
                  </p>
                </div>
              </div>
              
              <Form {...form}>
                <form className="space-y-4">
                  <FormField
                    control={form.control}
                    name="trackProdutoView"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1">
                          <FormLabel>Visualização de Produto</FormLabel>
                          <FormDescription>
                            Evento: ViewContent<br />
                            Rastreia quando um visitante visualiza a página de um produto.
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="trackAddToCart"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1">
                          <FormLabel>Adicionar ao Carrinho</FormLabel>
                          <FormDescription>
                            Evento: AddToCart<br />
                            Rastreia quando um produto é adicionado ao carrinho.
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="trackCheckout"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1">
                          <FormLabel>Início de Checkout</FormLabel>
                          <FormDescription>
                            Evento: InitiateCheckout<br />
                            Rastreia quando um cliente inicia o processo de checkout.
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="trackCompra"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1">
                          <FormLabel>Compra Finalizada</FormLabel>
                          <FormDescription>
                            Evento: Purchase<br />
                            Rastreia quando uma compra é finalizada com sucesso.
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" onClick={form.handleSubmit(onSubmit)}>Salvar Configurações de Eventos</Button>
                </form>
              </Form>
            </div>
          </TabsContent>
          
          <TabsContent value="avancado" className="pt-4">
            <Form {...form}>
              <form className="space-y-6">
                <FormField
                  control={form.control}
                  name="enviarGeolocalizacao"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1">
                        <FormLabel>Incluir Dados de Geolocalização</FormLabel>
                        <FormDescription>
                          Enriqueça seus eventos com dados precisos de localização usando o GeoLite2.<br />
                          Isso melhora a segmentação de público e a análise regional.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                
                <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
                  <h4 className="text-sm font-medium text-amber-800">Informações de Depuração</h4>
                  <div className="mt-2 space-y-2">
                    <p className="text-xs text-amber-700">
                      <strong>Modo de Teste:</strong> Desativado
                    </p>
                    <p className="text-xs text-amber-700">
                      <strong>Última Sincronização:</strong> Nunca sincronizado
                    </p>
                    <p className="text-xs text-amber-700">
                      <strong>Status da API:</strong> Não verificado
                    </p>
                  </div>
                </div>
                
                <Button type="submit" onClick={form.handleSubmit(onSubmit)}>Salvar Configurações Avançadas</Button>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ConfiguracaoPixel;
