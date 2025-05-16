
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ApiConnectionTester from '@/components/TestTools/ApiConnectionTester';
import { useCredentials } from '@/hooks';
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePixel } from "@/hooks/usePixel";
import { CheckCircle2, AlertCircle } from "lucide-react";

const Developer = () => {
  const [activeTab, setActiveTab] = useState('api');
  const [isSyncing, setIsSyncing] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [eventType, setEventType] = useState('ViewContent');
  const [customData, setCustomData] = useState('{\n  "content_name": "Página de Produto",\n  "content_type": "product",\n  "value": 99.99,\n  "currency": "BRL"\n}');
  const [isSendingEvent, setIsSendingEvent] = useState(false);
  const [eventResult, setEventResult] = useState<{ success: boolean; message: string; time?: string } | null>(null);
  
  const { 
    getCredential,
    saveCredential,
    listCredentialKeys,
    removeCredential
  } = useCredentials({ encryptionKey: 'dev-mode-testing' });
  
  // Carrega credenciais armazenadas localmente (para desenvolvimento/teste)
  const getStoredCredentials = () => {
    const pixelId = getCredential('FB_PIXEL_ID');
    const pixelToken = getCredential('FB_ACCESS_TOKEN');
    const geoAccountId = getCredential('MAXMIND_ACCOUNT_ID');
    const geoLicenseKey = getCredential('MAXMIND_LICENSE_KEY');
    const shopifyApiKey = getCredential('SHOPIFY_API_KEY');
    const shopifyApiSecretKey = getCredential('SHOPIFY_API_SECRET_KEY');
    
    return {
      pixelId,
      pixelToken,
      geoAccountId,
      geoLicenseKey,
      shopifyApiKey,
      shopifyApiSecretKey
    };
  };
  
  const [storedCredentials, setStoredCredentials] = useState(getStoredCredentials());
  
  // Initialize the pixel hook for testing
  const { trackEvent, testConnection, prepareUserData, updateConfig } = usePixel({
    pixelId: storedCredentials.pixelId || '',
    accessToken: storedCredentials.pixelToken || '',
    apiVersion: 'v19.0',
    enableServerSide: true,
    enableBrowserSide: true
  });
  
  // Recarrega credenciais quando o componente monta
  useEffect(() => {
    setStoredCredentials(getStoredCredentials());
  }, []);
  
  // Função para recarregar as credenciais da página Settings
  const syncCredentialsFromSettings = () => {
    setIsSyncing(true);
    
    try {
      // Em uma implementação real, você buscaria do banco de dados ou API
      toast.info("Sincronizando credenciais das configurações...");
      
      // Simula uma sincronização recarregando as credenciais do localStorage
      setTimeout(() => {
        setStoredCredentials(getStoredCredentials());
        toast.success("Credenciais sincronizadas com sucesso");
        setIsSyncing(false);
      }, 1000);
    } catch (error) {
      toast.error("Erro ao sincronizar credenciais");
      setIsSyncing(false);
    }
  };
  
  // Função para limpar logs de eventos
  const clearEventLogs = () => {
    setIsClearing(true);
    
    try {
      // Em uma implementação real, você limparia os logs do banco de dados
      toast.info("Limpando logs de eventos...");
      
      // Simula limpeza de logs
      setTimeout(() => {
        toast.success("Logs limpos com sucesso");
        setIsClearing(false);
      }, 1000);
    } catch (error) {
      toast.error("Erro ao limpar logs de eventos");
      setIsClearing(false);
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
    if (!storedCredentials.pixelId || !storedCredentials.pixelToken) {
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
          message: `Evento ${eventType} enviado com sucesso para o pixel ${storedCredentials.pixelId}`,
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

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold tracking-tight mb-2">Ferramentas do Desenvolvedor</h1>
      <p className="text-muted-foreground mb-8">Ferramentas para testar e depurar integrações de API</p>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="api">Teste de API</TabsTrigger>
              <TabsTrigger value="webhooks">Simulador de Webhooks</TabsTrigger>
            </TabsList>
            
            <TabsContent value="api">
              <ApiConnectionTester 
                pixelId={storedCredentials.pixelId}
                pixelToken={storedCredentials.pixelToken}
                geoAccountId={storedCredentials.geoAccountId}
                geoLicenseKey={storedCredentials.geoLicenseKey}
                shopifyApiKey={storedCredentials.shopifyApiKey}
                shopifyApiSecretKey={storedCredentials.shopifyApiSecretKey}
              />
            </TabsContent>
            
            <TabsContent value="webhooks">
              <Card>
                <CardHeader>
                  <CardTitle>Simulador de Webhooks</CardTitle>
                  <CardDescription>Simule eventos de webhook de diferentes plataformas</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col gap-4">
                    <div className="p-6 text-center bg-muted rounded-lg">
                      <p className="text-muted-foreground">
                        O simulador de webhooks está disponível apenas com a integração de banco de dados.
                        Registre os eventos primeiro na configuração de Eventos.
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Button disabled>Simular Adição ao Carrinho</Button>
                      <Button disabled>Simular Checkout</Button>
                      <Button disabled>Simular Visualização de Produto</Button>
                      <Button disabled>Simular Compra</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Informações do Sistema</CardTitle>
            <CardDescription>Status e configurações atuais</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">APIs Configuradas</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Meta Pixel:</span>
                  <span className={storedCredentials.pixelId ? "text-green-600" : "text-red-600"}>
                    {storedCredentials.pixelId ? "Configurado" : "Não configurado"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Conversions API:</span>
                  <span className={storedCredentials.pixelToken ? "text-green-600" : "text-red-600"}>
                    {storedCredentials.pixelToken ? "Configurado" : "Não configurado"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Geolocalização:</span>
                  <span className={storedCredentials.geoAccountId ? "text-green-600" : "text-red-600"}>
                    {storedCredentials.geoAccountId ? "Configurado" : "Não configurado"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Shopify:</span>
                  <span className={storedCredentials.shopifyApiKey ? "text-green-600" : "text-red-600"}>
                    {storedCredentials.shopifyApiKey ? "Configurado" : "Não configurado"}
                  </span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Status do Ambiente</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Modo:</span>
                  <span className="text-amber-600">Desenvolvimento</span>
                </div>
                <div className="flex justify-between">
                  <span>Depuração:</span>
                  <span className="text-green-600">Ativada</span>
                </div>
                <div className="flex justify-between">
                  <span>Eventos de teste:</span>
                  <span className="text-green-600">Permitidos</span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <div className="w-full space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-center"
                onClick={syncCredentialsFromSettings}
                disabled={isSyncing}
              >
                {isSyncing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sincronizando...
                  </>
                ) : (
                  "Sincronizar Credenciais"
                )}
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-center"
                onClick={clearEventLogs}
                disabled={isClearing}
              >
                {isClearing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Limpando...
                  </>
                ) : (
                  "Limpar Logs de Eventos"
                )}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Quadro de teste de envio de eventos - Movido da página Settings */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Teste de Envio de Eventos</CardTitle>
          <CardDescription>
            Envie eventos de teste para o Meta Pixel e Conversions API
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {(!storedCredentials.pixelId || !storedCredentials.pixelToken) && (
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-md flex gap-2 items-center">
                <AlertCircle className="h-5 w-5 text-amber-600" />
                <div>
                  <p className="text-sm text-amber-800">
                    Configure o ID do pixel e o token de acesso na página de Configurações para usar esta funcionalidade.
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
            disabled={isSendingEvent || !storedCredentials.pixelId || !storedCredentials.pixelToken}
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

      {/* Quadro de informações do sistema - Movido da página Settings */}
      <div className="bg-muted p-6 rounded-lg border mb-8">
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
  );
};

export default Developer;
