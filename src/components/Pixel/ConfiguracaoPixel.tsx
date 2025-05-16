
import React, { useState, useEffect } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { InfoIcon, Loader2 } from "lucide-react";
import { useCredentials } from '@/hooks';
import { usePixel } from '@/hooks/usePixel';

const formSchema = z.object({
  trackProdutoView: z.boolean().default(true),
  trackAddToCart: z.boolean().default(true),
  trackCheckout: z.boolean().default(true),
  trackCompra: z.boolean().default(true),
  enviarGeolocalizacao: z.boolean().default(true),
});

const ConfiguracaoPixel = () => {
  const [isSaving, setIsSaving] = useState(false);
  const { getCredential, saveCredential } = useCredentials({ encryptionKey: 'prod-pixel-config' });
  
  // Get stored credentials
  const storedPixelId = getCredential('FB_PIXEL_ID');
  const trackProdutoView = getCredential('FB_TRACK_VIEW_CONTENT') !== 'false';
  const trackAddToCart = getCredential('FB_TRACK_ADD_TO_CART') !== 'false';
  const trackCheckout = getCredential('FB_TRACK_CHECKOUT') !== 'false';
  const trackCompra = getCredential('FB_TRACK_PURCHASE') !== 'false';
  const enviarGeolocalizacao = getCredential('FB_USE_GEOLOCATION') !== 'false';

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      trackProdutoView,
      trackAddToCart,
      trackCheckout,
      trackCompra,
      enviarGeolocalizacao
    },
  });

  // Update form if stored credentials change
  useEffect(() => {
    form.setValue('trackProdutoView', trackProdutoView);
    form.setValue('trackAddToCart', trackAddToCart);
    form.setValue('trackCheckout', trackCheckout);
    form.setValue('trackCompra', trackCompra);
    form.setValue('enviarGeolocalizacao', enviarGeolocalizacao);
  }, [trackProdutoView, trackAddToCart, trackCheckout, trackCompra, enviarGeolocalizacao, form]);

  // Handle form submission
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSaving(true);
    
    try {
      // Save event tracking preferences
      saveCredential('FB_TRACK_VIEW_CONTENT', values.trackProdutoView.toString());
      saveCredential('FB_TRACK_ADD_TO_CART', values.trackAddToCart.toString());
      saveCredential('FB_TRACK_CHECKOUT', values.trackCheckout.toString());
      saveCredential('FB_TRACK_PURCHASE', values.trackCompra.toString());
      saveCredential('FB_USE_GEOLOCATION', values.enviarGeolocalizacao.toString());
      
      toast.success("Configurações de eventos salvas com sucesso");
    } catch (error) {
      console.error("Erro ao salvar configurações:", error);
      toast.error("Erro ao salvar configurações de eventos");
    } finally {
      setIsSaving(false);
    }
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
        <Tabs defaultValue="eventos" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="eventos">Eventos</TabsTrigger>
            <TabsTrigger value="avancado">Configurações Avançadas</TabsTrigger>
          </TabsList>
          
          <TabsContent value="eventos" className="space-y-4 pt-4">
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-md flex items-start gap-2">
                <InfoIcon className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
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
                  
                  <Button type="submit" onClick={form.handleSubmit(onSubmit)}>
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      "Salvar Configurações de Eventos"
                    )}
                  </Button>
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
                      <strong>Modo de Teste:</strong> {storedPixelId ? "Desativado" : "Ativo - Credenciais não configuradas"}
                    </p>
                    <p className="text-xs text-amber-700">
                      <strong>Última Sincronização:</strong> {storedPixelId ? new Date().toLocaleString() : "Nunca sincronizado"}
                    </p>
                    <p className="text-xs text-amber-700">
                      <strong>Status da API:</strong> {storedPixelId ? "Configurado" : "Não verificado"}
                    </p>
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  onClick={form.handleSubmit(onSubmit)}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    "Salvar Configurações Avançadas"
                  )}
                </Button>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ConfiguracaoPixel;
