
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GeolocationSetup from "@/components/Geolocation/GeolocationSetup";
import { AlertCircle, EyeIcon, EyeOffIcon, CopyIcon, Loader2, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { InfoIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePixel } from "@/hooks/usePixel";
import { useCredentials } from "@/hooks";

const Settings = () => {
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
  const [isTesting, setIsTesting] = useState(false);
  const [eventType, setEventType] = useState('ViewContent');
  const [customData, setCustomData] = useState('{\n  "content_name": "Página de Produto",\n  "content_type": "product",\n  "value": 99.99,\n  "currency": "BRL"\n}');
  const [isSendingEvent, setIsSendingEvent] = useState(false);
  const [eventResult, setEventResult] = useState<{ success: boolean; message: string; time?: string } | null>(null);
  const { getCredential, saveCredential } = useCredentials({ encryptionKey: 'prod-pixel-config' });

  // Get stored credentials
  const storedPixelId = getCredential('FB_PIXEL_ID');
  const storedAccessToken = getCredential('FB_ACCESS_TOKEN');
  const storedApiVersion = getCredential('FB_API_VERSION') || 'v19.0';
  
  // Initialize the pixel hook for testing
  const { trackEvent, testConnection, prepareUserData, updateConfig } = usePixel({
    pixelId: storedPixelId || '',
    accessToken: storedAccessToken || '',
    apiVersion: storedApiVersion,
    enableServerSide: true,
    enableBrowserSide: true
  });

  // Mostrar/esconder credenciais
  const toggleSecretVisibility = (key: string) => {
    setShowSecrets(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Copiar para área de transferência
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success("Copiado para a área de transferência");
    });
  };

  // Salvar credenciais do Meta
  const saveMetaCredentials = (pixelId: string, accessToken: string, apiVersion: string) => {
    const pixelSaved = saveCredential('FB_PIXEL_ID', pixelId);
    const tokenSaved = saveCredential('FB_ACCESS_TOKEN', accessToken);
    const versionSaved = saveCredential('FB_API_VERSION', apiVersion);
    
    // Update pixel configuration
    updateConfig({
      pixelId,
      accessToken,
      apiVersion,
    });
    
    if (pixelSaved && tokenSaved && versionSaved) {
      toast.success("Configurações do Meta Pixel salvas com sucesso");
    } else {
      toast.error("Ocorreu um erro ao salvar algumas configurações");
    }
  };

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
  
  // Parse custom data (safely)
  const parseCustomData = () => {
    try {
      return JSON.parse(customData || '{}');
    } catch (e) {
      toast.error('Erro ao analisar dados JSON personalizados');
      return {};
    }
  };
  
  // Send test event
  const handleSendEvent = async () => {
    if (!storedPixelId || !storedAccessToken) {
      toast.error('ID do pixel e token de acesso são necessários');
      return;
    }
    
    setIsSendingEvent(true);
    setEventResult(null);
    
    try {
      const eventData = parseCustomData();
      const userData = prepareUserData({
        email: 'teste@exemplo.com',
        phone: '5511999999999',
        firstName: 'Usuário',
        lastName: 'Teste',
        city: 'São Paulo',
        state: 'SP',
        country: 'BR',
        zipCode: '01000000'
      });
      
      const startTime = Date.now();
      const success = await trackEvent(eventType, userData, eventData);
      const endTime = Date.now();
      
      if (success) {
        setEventResult({
          success: true,
          message: `Evento ${eventType} enviado com sucesso para o pixel ${storedPixelId}`,
          time: `${endTime - startTime}ms`
        });
        toast.success(`Evento ${eventType} enviado com sucesso`);
      } else {
        setEventResult({
          success: false,
          message: `Falha ao enviar evento ${eventType}`,
          time: `${endTime - startTime}ms`
        });
        toast.error(`Falha ao enviar evento ${eventType}`);
      }
    } catch (error) {
      console.error('Erro ao enviar evento:', error);
      setEventResult({
        success: false,
        message: `Erro: ${(error as Error).message}`,
      });
      toast.error(`Erro ao enviar evento: ${(error as Error).message}`);
    } finally {
      setIsSendingEvent(false);
    }
  };

  // Tipos de eventos
  const EVENT_TYPES = [
    { id: 'ViewContent', name: 'Visualização de Conteúdo', description: 'Quando um visitante visualiza uma página ou item' },
    { id: 'AddToCart', name: 'Adicionar ao Carrinho', description: 'Quando um item é adicionado ao carrinho de compras' },
    { id: 'InitiateCheckout', name: 'Iniciar Checkout', description: 'Quando um usuário inicia o processo de checkout' },
    { id: 'Purchase', name: 'Compra', description: 'Quando uma compra é concluída' },
    { id: 'Lead', name: 'Lead', description: 'Quando um formulário de lead é enviado' },
    { id: 'CompleteRegistration', name: 'Registro Completo', description: 'Quando um registro é concluído' }
  ];

  // Credenciais de serviço com valores removidos
  const credentials = {
    meta: [
      { name: "FB_PIXEL_ID", value: storedPixelId || "", description: "ID do Pixel do Meta", isSecret: false },
      { name: "FB_ACCESS_TOKEN", value: storedAccessToken || "", description: "Token de acesso à API do Meta", isSecret: true },
      { name: "FB_API_VERSION", value: storedApiVersion, description: "Versão da API do Meta", isSecret: false }
    ],
    maxmind: [
      { name: "MAXMIND_ACCOUNT_ID", value: "", description: "ID da conta MaxMind GeoIP", isSecret: false },
      { name: "MAXMIND_LICENSE_KEY", value: "", description: "Chave de licença MaxMind GeoIP", isSecret: true }
    ],
    yampi: [
      { name: "YAMPI_WEBHOOK_SECRET", value: "", description: "Chave secreta para webhook Yampi", isSecret: true }
    ],
    database: [
      { name: "DB_CONNECTION", value: "pgsql", description: "Tipo de conexão do banco de dados", isSecret: false },
      { name: "DB_HOST", value: "", description: "Host do banco de dados", isSecret: false },
      { name: "DB_PORT", value: "5432", description: "Porta do banco de dados", isSecret: false },
      { name: "DB_DATABASE", value: "", description: "Nome do banco de dados", isSecret: false },
      { name: "DB_USERNAME", value: "", description: "Usuário do banco de dados", isSecret: false },
      { name: "DB_PASSWORD", value: "", description: "Senha do banco de dados", isSecret: true }
    ]
  };

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Configurações do Sistema</h1>
      
      <Alert className="mb-8">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Importante</AlertTitle>
        <AlertDescription>
          Esta página fornece acesso a chaves de API sensíveis e configurações do sistema.
          As alterações feitas aqui afetarão diretamente a funcionalidade do seu sistema de rastreamento.
        </AlertDescription>
      </Alert>
      
      <div className="space-y-8">
        <Tabs defaultValue="meta" className="w-full">
          <TabsList className="grid w-full sm:grid-cols-2 md:grid-cols-4">
            <TabsTrigger value="meta">Meta/Facebook</TabsTrigger>
            <TabsTrigger value="geolocation">Geolocalização</TabsTrigger>
            <TabsTrigger value="yampi">Yampi</TabsTrigger>
            <TabsTrigger value="database">Banco de Dados</TabsTrigger>
          </TabsList>
          
          <TabsContent value="meta" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Credenciais do Meta/Facebook</CardTitle>
                <CardDescription>Gerencie suas credenciais de API do Meta para rastreamento de pixel</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {credentials.meta.map((cred) => (
                    <div key={cred.name} className="grid gap-2">
                      <div className="flex justify-between items-center">
                        <Label htmlFor={cred.name} className="text-sm font-medium">
                          {cred.name}
                        </Label>
                        <div className="text-xs text-muted-foreground">{cred.description}</div>
                      </div>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Input
                            id={cred.name}
                            value={cred.isSecret && !showSecrets[cred.name] 
                              ? "•".repeat(Math.min(cred.value.length || 12, 12))
                              : cred.value}
                            type={cred.isSecret && !showSecrets[cred.name] ? "password" : "text"}
                            className="pr-10"
                            placeholder="Insira o valor da credencial"
                            onChange={(e) => {
                              // Atualiza o valor no estado local
                              const newCredentials = {...credentials};
                              const index = newCredentials.meta.findIndex(c => c.name === cred.name);
                              if (index !== -1) {
                                newCredentials.meta[index].value = e.target.value;
                              }
                            }}
                          />
                          {cred.isSecret && (
                            <button
                              type="button"
                              onClick={() => toggleSecretVisibility(cred.name)}
                              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                            >
                              {showSecrets[cred.name] ? (
                                <EyeOffIcon className="h-4 w-4" />
                              ) : (
                                <EyeIcon className="h-4 w-4" />
                              )}
                            </button>
                          )}
                        </div>
                        <Button
                          type="button"
                          size="icon"
                          variant="outline"
                          onClick={() => copyToClipboard(cred.value)}
                        >
                          <CopyIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}

                  <div className="flex gap-4 pt-4">
                    <Button 
                      onClick={() => {
                        const pixelId = credentials.meta.find(c => c.name === "FB_PIXEL_ID")?.value || "";
                        const accessToken = credentials.meta.find(c => c.name === "FB_ACCESS_TOKEN")?.value || "";
                        const apiVersion = credentials.meta.find(c => c.name === "FB_API_VERSION")?.value || "v19.0";
                        saveMetaCredentials(pixelId, accessToken, apiVersion);
                      }}
                    >
                      Salvar Configurações
                    </Button>
                    
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handleTestConnection}
                      disabled={isTesting || !storedPixelId || !storedAccessToken}
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
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Teste de Envio de Eventos</CardTitle>
                <CardDescription>
                  Envie eventos de teste para o Meta Pixel e Conversions API
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {(!storedPixelId || !storedAccessToken) && (
                    <div className="bg-amber-50 border border-amber-200 p-4 rounded-md flex gap-2 items-center">
                      <AlertCircle className="h-5 w-5 text-amber-600" />
                      <div>
                        <p className="text-sm text-amber-800">
                          Configure o ID do pixel e o token de acesso acima para usar esta funcionalidade.
                        </p>
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="event-type">Tipo de Evento</Label>
                      <Select
                        value={eventType}
                        onValueChange={setEventType}
                      >
                        <SelectTrigger id="event-type">
                          <SelectValue placeholder="Selecione o tipo de evento" />
                        </SelectTrigger>
                        <SelectContent>
                          {EVENT_TYPES.map((event) => (
                            <SelectItem key={event.id} value={event.id}>
                              {event.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground mt-1">
                        {EVENT_TYPES.find(e => e.id === eventType)?.description}
                      </p>
                    </div>
                    
                    <div>
                      <Label htmlFor="custom-data">Dados Personalizados (JSON)</Label>
                      <Textarea
                        id="custom-data"
                        value={customData}
                        onChange={(e) => setCustomData(e.target.value)}
                        rows={6}
                        placeholder='{\n  "content_name": "Nome do produto",\n  "value": 99.99,\n  "currency": "BRL"\n}'
                        className="font-mono text-sm"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Dados personalizados para enviar com o evento em formato JSON
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex flex-col items-stretch gap-4">
                <Button 
                  onClick={handleSendEvent} 
                  disabled={isSendingEvent || !storedPixelId || !storedAccessToken}
                  className="w-full"
                >
                  {isSendingEvent ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enviando Evento...
                    </>
                  ) : (
                    'Enviar Evento de Teste'
                  )}
                </Button>
                
                {eventResult && (
                  <div className={`p-3 rounded-md border ${eventResult.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                    <div className="flex items-center gap-2">
                      {eventResult.success ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-red-600" />
                      )}
                      <span className={`text-sm ${eventResult.success ? 'text-green-700' : 'text-red-700'}`}>
                        {eventResult.message}
                      </span>
                    </div>
                    {eventResult.time && (
                      <p className="text-xs text-muted-foreground mt-1 pl-7">
                        Tempo de resposta: {eventResult.time}
                      </p>
                    )}
                  </div>
                )}
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="geolocation" className="mt-6">
            <GeolocationSetup />
          </TabsContent>
          
          <TabsContent value="yampi" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Credenciais da Yampi</CardTitle>
                <CardDescription>Gerencie suas credenciais para integração com a Yampi</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {credentials.yampi.map((cred) => (
                    <div key={cred.name} className="grid gap-2">
                      <div className="flex justify-between items-center">
                        <Label htmlFor={cred.name} className="text-sm font-medium">
                          {cred.name}
                        </Label>
                        <div className="text-xs text-muted-foreground">{cred.description}</div>
                      </div>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Input
                            id={cred.name}
                            value={cred.isSecret && !showSecrets[cred.name] 
                              ? "•".repeat(Math.min(cred.value.length || 12, 12))
                              : cred.value}
                            type={cred.isSecret && !showSecrets[cred.name] ? "password" : "text"}
                            className="pr-10"
                            placeholder="Insira o valor da credencial"
                          />
                          {cred.isSecret && (
                            <button
                              type="button"
                              onClick={() => toggleSecretVisibility(cred.name)}
                              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                            >
                              {showSecrets[cred.name] ? (
                                <EyeOffIcon className="h-4 w-4" />
                              ) : (
                                <EyeIcon className="h-4 w-4" />
                              )}
                            </button>
                          )}
                        </div>
                        <Button
                          type="button"
                          size="icon"
                          variant="outline"
                          onClick={() => copyToClipboard(cred.value)}
                        >
                          <CopyIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="database" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Configuração do Banco de Dados</CardTitle>
                <CardDescription>Detalhes de conexão com o banco de dados PostgreSQL (Neon)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {credentials.database.map((cred) => (
                    <div key={cred.name} className="grid gap-2">
                      <div className="flex justify-between items-center">
                        <Label htmlFor={cred.name} className="text-sm font-medium">
                          {cred.name}
                        </Label>
                        <div className="text-xs text-muted-foreground">{cred.description}</div>
                      </div>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Input
                            id={cred.name}
                            value={cred.isSecret && !showSecrets[cred.name] 
                              ? "•".repeat(Math.min(cred.value.length || 12, 12))
                              : cred.value}
                            type={cred.isSecret && !showSecrets[cred.name] ? "password" : "text"}
                            className="pr-10"
                            placeholder="Insira o valor da credencial"
                          />
                          {cred.isSecret && (
                            <button
                              type="button"
                              onClick={() => toggleSecretVisibility(cred.name)}
                              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                            >
                              {showSecrets[cred.name] ? (
                                <EyeOffIcon className="h-4 w-4" />
                              ) : (
                                <EyeIcon className="h-4 w-4" />
                              )}
                            </button>
                          )}
                        </div>
                        <Button
                          type="button"
                          size="icon"
                          variant="outline"
                          onClick={() => copyToClipboard(cred.value)}
                        >
                          <CopyIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="bg-muted p-6 rounded-lg border mt-8">
          <h2 className="text-xl font-semibold mb-4">Informações do Sistema</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Ambiente</h3>
              <div className="bg-background p-4 rounded border">
                <p className="text-sm"><strong>APP_ENV:</strong> production</p>
                <p className="text-sm"><strong>APP_DEBUG:</strong> false</p>
                <p className="text-sm"><strong>APP_TIMEZONE:</strong> UTC</p>
                <p className="text-sm"><strong>Plataforma de Hospedagem:</strong> Render.com</p>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-2">Banco de Dados e Cache</h3>
              <div className="bg-background p-4 rounded border">
                <p className="text-sm"><strong>Banco de Dados:</strong> PostgreSQL (Neon)</p>
                <p className="text-sm"><strong>Cache/Sessão:</strong> Redis</p>
                <p className="text-sm"><strong>Sistema de Arquivos:</strong> Local</p>
                <p className="text-sm"><strong>Fila:</strong> Redis</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
