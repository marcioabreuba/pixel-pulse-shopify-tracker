
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ApiConnectionTester from '@/components/TestTools/ApiConnectionTester';
import { useCredentials } from '@/hooks';
import { toast } from "sonner";

const Developer = () => {
  const [activeTab, setActiveTab] = useState('api');
  
  const { 
    getCredential,
    saveCredential,
    listCredentialKeys
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
  
  const storedCredentials = getStoredCredentials();
  
  // Função para recarregar as credenciais da página Settings
  const syncCredentialsFromSettings = () => {
    // Em uma implementação real, você buscaria do banco de dados ou API
    // Por enquanto simulamos apenas uma atualização
    toast.info("Sincronizando credenciais das configurações...");
    
    setTimeout(() => {
      toast.success("Credenciais sincronizadas com sucesso");
    }, 1000);
  };

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
              >
                Sincronizar Credenciais
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-center"
                onClick={() => {
                  toast.success("Logs limpos com sucesso");
                }}
              >
                Limpar Logs de Eventos
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Developer;
