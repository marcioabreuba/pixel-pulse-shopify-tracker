
import React, { useState, useEffect } from 'react';
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
import { InfoIcon, Loader2 } from "lucide-react";
import { useCredentials } from '@/hooks';
import { usePixel } from '@/hooks/usePixel';

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
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const { getCredential, saveCredential } = useCredentials({ encryptionKey: 'prod-pixel-config' });
  
  // Get stored credentials
  const storedPixelId = getCredential('FB_PIXEL_ID');
  const storedAccessToken = getCredential('FB_ACCESS_TOKEN');
  const storedApiVersion = getCredential('FB_API_VERSION') || 'v19.0';
  
  // Initialize the pixel hook for testing
  const { testConnection, updateConfig } = usePixel({
    pixelId: storedPixelId || '',
    accessToken: storedAccessToken || '',
    apiVersion: storedApiVersion,
    enableServerSide: true,
    enableBrowserSide: true
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pixelId: storedPixelId || "",
      accessToken: storedAccessToken || "",
      apiVersion: storedApiVersion,
      enableServerSide: true,
      enableBrowserSide: true,
      trackProdutoView: true,
      trackAddToCart: true,
      trackCheckout: true,
      trackCompra: true,
      enviarGeolocalizacao: true
    },
  });

  // Update form if stored credentials change
  useEffect(() => {
    if (storedPixelId) {
      form.setValue('pixelId', storedPixelId);
    }
    
    if (storedAccessToken) {
      form.setValue('accessToken', storedAccessToken);
    }
    
    if (storedApiVersion) {
      form.setValue('apiVersion', storedApiVersion);
    }
  }, [storedPixelId, storedAccessToken, storedApiVersion, form]);

  // Handle form submission
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSaving(true);
    
    try {
      // Save all values to credentials storage
      const pixelSaved = saveCredential('FB_PIXEL_ID', values.pixelId);
      const tokenSaved = saveCredential('FB_ACCESS_TOKEN', values.accessToken);
      const versionSaved = saveCredential('FB_API_VERSION', values.apiVersion);
      
      // Update pixel configuration
      updateConfig({
        pixelId: values.pixelId,
        accessToken: values.accessToken,
        apiVersion: values.apiVersion,
        enableServerSide: values.enableServerSide,
        enableBrowserSide: values.enableBrowserSide
      });
      
      // Save event tracking preferences
      saveCredential('FB_TRACK_VIEW_CONTENT', values.trackProdutoView.toString());
      saveCredential('FB_TRACK_ADD_TO_CART', values.trackAddToCart.toString());
      saveCredential('FB_TRACK_CHECKOUT', values.trackCheckout.toString());
      saveCredential('FB_TRACK_PURCHASE', values.trackCompra.toString());
      saveCredential('FB_USE_GEOLOCATION', values.enviarGeolocalizacao.toString());
      
      if (pixelSaved && tokenSaved && versionSaved) {
        toast.success("Configurações do Pixel salvas com sucesso");
      } else {
        toast.error("Ocorreu um erro ao salvar algumas configurações");
      }
    } catch (error) {
      console.error("Erro ao salvar configurações:", error);
      toast.error("Erro ao salvar configurações do Pixel");
    } finally {
      setIsSaving(false);
    }
  }

  // Test pixel connection
  const handleTestConnection = async () => {
    setIsTesting(true);
    
    try {
      const result = await testConnection();
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error(`Erro ao testar conexão: ${(error as Error).message}`);
    } finally {
      setIsTesting(false);
    }
  };

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
                        <Input {...field} placeholder="Insira o ID do seu Meta Pixel" />
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
                        <Input {...field} type="password" placeholder="Insira o token de acesso à API" />
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
                
                <div className="flex gap-4">
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      "Salvar Configurações"
                    )}
                  </Button>
                  
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleTestConnection}
                    disabled={isTesting || !form.watch('pixelId') || !form.watch('accessToken')}
                  >
                    {isTesting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Testando...
                      </>
                    ) : (
                      "Testar Conexão"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </TabsContent>
          
          <TabsContent value="eventos" className="pt-4">
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
                      <strong>Modo de Teste:</strong> {storedPixelId && storedAccessToken ? "Desativado" : "Ativo - Credenciais não configuradas"}
                    </p>
                    <p className="text-xs text-amber-700">
                      <strong>Última Sincronização:</strong> {storedPixelId ? new Date().toLocaleString() : "Nunca sincronizado"}
                    </p>
                    <p className="text-xs text-amber-700">
                      <strong>Status da API:</strong> {storedAccessToken ? "Configurado" : "Não verificado"}
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
