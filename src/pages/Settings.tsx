
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

const pixelFormSchema = z.object({
  pixelId: z.string().min(1, {
    message: "ID do Pixel é obrigatório",
  }),
  accessToken: z.string().min(1, {
    message: "Token de acesso é obrigatório",
  }),
  apiVersion: z.string().default("v19.0"),
  enableServerSide: z.boolean().default(true),
  enableBrowserSide: z.boolean().default(true),
});

const testEventFormSchema = z.object({
  eventName: z.string().min(1, {
    message: "Nome do evento é obrigatório",
  }),
  eventData: z.string().optional(),
});

const Settings = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isSendingEvent, setIsSendingEvent] = useState(false);
  
  const { getCredential, saveCredential } = useCredentials({ encryptionKey: 'prod-pixel-config' });
  
  // Get stored credentials
  const storedPixelId = getCredential('FB_PIXEL_ID');
  const storedAccessToken = getCredential('FB_ACCESS_TOKEN');
  const storedApiVersion = getCredential('FB_API_VERSION') || 'v19.0';
  const storedEnableServerSide = getCredential('FB_ENABLE_SERVER_SIDE') !== 'false';
  const storedEnableBrowserSide = getCredential('FB_ENABLE_BROWSER_SIDE') !== 'false';
  
  // Initialize pixel hook
  const { trackEvent, testConnection, updateConfig } = usePixel({
    pixelId: storedPixelId || '',
    accessToken: storedAccessToken || '',
    apiVersion: storedApiVersion,
    enableServerSide: storedEnableServerSide,
    enableBrowserSide: storedEnableBrowserSide
  });

  // Setup forms
  const pixelForm = useForm<z.infer<typeof pixelFormSchema>>({
    resolver: zodResolver(pixelFormSchema),
    defaultValues: {
      pixelId: storedPixelId || "",
      accessToken: storedAccessToken || "",
      apiVersion: storedApiVersion || "v19.0",
      enableServerSide: storedEnableServerSide,
      enableBrowserSide: storedEnableBrowserSide
    },
  });

  const testEventForm = useForm<z.infer<typeof testEventFormSchema>>({
    resolver: zodResolver(testEventFormSchema),
    defaultValues: {
      eventName: "PageView",
      eventData: JSON.stringify({
        page_path: "/",
        page_title: "Página Inicial"
      }, null, 2)
    },
  });

  // Update form if stored credentials change
  useEffect(() => {
    if (storedPixelId) {
      pixelForm.setValue('pixelId', storedPixelId);
    }
    
    if (storedAccessToken) {
      pixelForm.setValue('accessToken', storedAccessToken);
    }
    
    if (storedApiVersion) {
      pixelForm.setValue('apiVersion', storedApiVersion);
    }
    
    pixelForm.setValue('enableServerSide', storedEnableServerSide);
    pixelForm.setValue('enableBrowserSide', storedEnableBrowserSide);
    
  }, [storedPixelId, storedAccessToken, storedApiVersion, storedEnableServerSide, storedEnableBrowserSide, pixelForm]);

  // Handle Pixel configuration form submission
  async function onSubmitPixelForm(values: z.infer<typeof pixelFormSchema>) {
    setIsSaving(true);
    
    try {
      // Save all values to credentials storage
      const pixelSaved = saveCredential('FB_PIXEL_ID', values.pixelId);
      const tokenSaved = saveCredential('FB_ACCESS_TOKEN', values.accessToken);
      const versionSaved = saveCredential('FB_API_VERSION', values.apiVersion);
      const serverSideSaved = saveCredential('FB_ENABLE_SERVER_SIDE', values.enableServerSide.toString());
      const browserSideSaved = saveCredential('FB_ENABLE_BROWSER_SIDE', values.enableBrowserSide.toString());
      
      // Update pixel configuration
      updateConfig({
        pixelId: values.pixelId,
        accessToken: values.accessToken,
        apiVersion: values.apiVersion,
        enableServerSide: values.enableServerSide,
        enableBrowserSide: values.enableBrowserSide
      });
      
      if (pixelSaved && tokenSaved && versionSaved && serverSideSaved && browserSideSaved) {
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

  // Handle test event form submission
  async function onSubmitTestEvent(values: z.infer<typeof testEventFormSchema>) {
    setIsSendingEvent(true);
    
    try {
      let eventData = {};
      
      // Parse event data if provided
      if (values.eventData) {
        try {
          eventData = JSON.parse(values.eventData);
        } catch (e) {
          toast.error("Erro ao analisar dados do evento. Use formato JSON válido.");
          setIsSendingEvent(false);
          return;
        }
      }
      
      // Send test event
      const success = await trackEvent(values.eventName, {}, eventData);
      
      if (success) {
        toast.success(`Evento ${values.eventName} enviado com sucesso`);
      } else {
        toast.error(`Falha ao enviar evento ${values.eventName}`);
      }
    } catch (error) {
      console.error("Erro ao enviar evento:", error);
      toast.error(`Erro ao enviar evento: ${(error as Error).message}`);
    } finally {
      setIsSendingEvent(false);
    }
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Configurações</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Configuração do Meta Pixel</CardTitle>
              <CardDescription>
                Configure sua integração com o Meta Pixel para rastreamento de eventos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="configuracoes" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="configuracoes">Configurações</TabsTrigger>
                  <TabsTrigger value="teste">Teste de Eventos</TabsTrigger>
                </TabsList>
                
                <TabsContent value="configuracoes" className="space-y-4 pt-4">
                  <Form {...pixelForm}>
                    <form onSubmit={pixelForm.handleSubmit(onSubmitPixelForm)} className="space-y-6">
                      <FormField
                        control={pixelForm.control}
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
                        control={pixelForm.control}
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
                        control={pixelForm.control}
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
                          control={pixelForm.control}
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
                          control={pixelForm.control}
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
                          disabled={isTesting || !pixelForm.watch('pixelId') || !pixelForm.watch('accessToken')}
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
                
                <TabsContent value="teste" className="space-y-4 pt-4">
                  <div className="bg-muted p-4 rounded-md flex items-start gap-2 mb-4">
                    <InfoIcon className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm">
                        Use esta ferramenta para enviar eventos de teste para o Meta Pixel e verificar se sua integração está funcionando corretamente.
                        Os eventos serão enviados usando as configurações (servidor/navegador) definidas acima.
                      </p>
                    </div>
                  </div>
                  
                  <Form {...testEventForm}>
                    <form onSubmit={testEventForm.handleSubmit(onSubmitTestEvent)} className="space-y-6">
                      <FormField
                        control={testEventForm.control}
                        name="eventName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome do Evento</FormLabel>
                            <FormControl>
                              <select
                                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                {...field}
                              >
                                <option value="PageView">PageView</option>
                                <option value="ViewContent">ViewContent</option>
                                <option value="AddToCart">AddToCart</option>
                                <option value="InitiateCheckout">InitiateCheckout</option>
                                <option value="Purchase">Purchase</option>
                                <option value="Lead">Lead</option>
                                <option value="CompleteRegistration">CompleteRegistration</option>
                                <option value="Search">Search</option>
                              </select>
                            </FormControl>
                            <FormDescription>
                              Selecione o evento que deseja enviar para teste
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={testEventForm.control}
                        name="eventData"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Dados do Evento (JSON)</FormLabel>
                            <FormControl>
                              <textarea
                                className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 font-mono"
                                placeholder='{"key": "value"}'
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Dados em formato JSON que serão enviados com o evento
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="submit" 
                        disabled={isSendingEvent || !storedPixelId || !storedAccessToken}
                      >
                        {isSendingEvent ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Enviando...
                          </>
                        ) : (
                          "Enviar Evento de Teste"
                        )}
                      </Button>
                    </form>
                  </Form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Status da Integração</CardTitle>
              <CardDescription>
                Informações sobre a conexão com o Meta Pixel
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">ID do Pixel:</span>
                  <span className="font-medium">{storedPixelId || "Não configurado"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">API Conversions:</span>
                  <span className={`font-medium ${storedAccessToken ? "text-green-600" : "text-red-600"}`}>
                    {storedAccessToken ? "Configurado" : "Não configurado"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Rastreamento via Servidor:</span>
                  <span className={`font-medium ${storedEnableServerSide ? "text-green-600" : "text-amber-600"}`}>
                    {storedEnableServerSide ? "Ativado" : "Desativado"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Rastreamento via Browser:</span>
                  <span className={`font-medium ${storedEnableBrowserSide ? "text-green-600" : "text-amber-600"}`}>
                    {storedEnableBrowserSide ? "Ativado" : "Desativado"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Versão da API:</span>
                  <span className="font-medium">{storedApiVersion}</span>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <h4 className="text-sm font-medium mb-2">Recomendações</h4>
                <ul className="space-y-1 text-sm">
                  {!storedPixelId && (
                    <li className="flex items-start gap-2 text-red-600">
                      <span className="text-xs">•</span>
                      <span>Configure o ID do Pixel do Meta</span>
                    </li>
                  )}
                  {!storedAccessToken && (
                    <li className="flex items-start gap-2 text-red-600">
                      <span className="text-xs">•</span>
                      <span>Adicione o token de acesso da API</span>
                    </li>
                  )}
                  {(!storedEnableServerSide && !storedEnableBrowserSide) && (
                    <li className="flex items-start gap-2 text-red-600">
                      <span className="text-xs">•</span>
                      <span>Ative pelo menos um método de rastreamento</span>
                    </li>
                  )}
                  {(storedPixelId && storedAccessToken) && (
                    <li className="flex items-start gap-2 text-green-600">
                      <span className="text-xs">•</span>
                      <span>Integração configurada corretamente</span>
                    </li>
                  )}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;
