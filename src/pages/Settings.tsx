
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GeolocationSetup from "@/components/Geolocation/GeolocationSetup";
import { AlertCircle, EyeIcon, EyeOffIcon, CopyIcon, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { usePixel } from "@/hooks/usePixel";
import { useCredentials } from "@/hooks";

const Settings = () => {
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
  const [isTesting, setIsTesting] = useState(false);
  const { getCredential, saveCredential } = useCredentials({ encryptionKey: 'prod-pixel-config' });

  // Estado local para os valores dos inputs
  const [pixelId, setPixelId] = useState(getCredential('FB_PIXEL_ID') || '');
  const [accessToken, setAccessToken] = useState(getCredential('FB_ACCESS_TOKEN') || '');
  const [apiVersion, setApiVersion] = useState(getCredential('FB_API_VERSION') || 'v19.0');
  const [enableServerSide, setEnableServerSide] = useState(getCredential('FB_ENABLE_SERVER_SIDE') !== 'false');
  const [enableBrowserSide, setEnableBrowserSide] = useState(getCredential('FB_ENABLE_BROWSER_SIDE') !== 'false');
  
  // Estado para armazenar o resultado do teste
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  
  // Initialize the pixel hook with current values
  const { testConnection, updateConfig } = usePixel({
    pixelId,
    accessToken,
    apiVersion,
    enableServerSide,
    enableBrowserSide
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
  const saveMetaCredentials = () => {
    console.log("Salvando credenciais:", { pixelId, accessToken, apiVersion, enableServerSide, enableBrowserSide });
    const pixelSaved = saveCredential('FB_PIXEL_ID', pixelId);
    const tokenSaved = saveCredential('FB_ACCESS_TOKEN', accessToken);
    const versionSaved = saveCredential('FB_API_VERSION', apiVersion);
    const serverSaved = saveCredential('FB_ENABLE_SERVER_SIDE', enableServerSide.toString());
    const browserSaved = saveCredential('FB_ENABLE_BROWSER_SIDE', enableBrowserSide.toString());
    
    // Update pixel configuration
    updateConfig({
      pixelId,
      accessToken,
      apiVersion,
      enableServerSide,
      enableBrowserSide
    });
    
    if (pixelSaved && tokenSaved && versionSaved && serverSaved && browserSaved) {
      toast.success("Configurações do Meta Pixel salvas com sucesso");
    } else {
      toast.error("Ocorreu um erro ao salvar algumas configurações");
    }
  };

  // Test pixel connection
  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null); // Limpa o resultado anterior
    
    try {
      console.log("Testando conexão com o pixel. Configuração:", { 
        pixelId, accessToken, apiVersion, enableServerSide, enableBrowserSide 
      });
      
      // Atualizando a configuração antes de testar
      updateConfig({
        pixelId,
        accessToken,
        apiVersion,
        enableServerSide,
        enableBrowserSide
      });
      
      const result = await testConnection();
      console.log("Resultado do teste de conexão:", result);
      
      setTestResult(result);  // Armazena o resultado do teste
      
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Erro ao testar conexão:", error);
      const errorMessage = `Erro ao testar conexão: ${(error as Error).message}`;
      setTestResult({ success: false, message: errorMessage });
      toast.error(errorMessage);
    } finally {
      setIsTesting(false);
    }
  };

  // Credenciais de serviço com valores atualizados
  const credentials = {
    maxmind: [
      { name: "MAXMIND_ACCOUNT_ID", value: getCredential('MAXMIND_ACCOUNT_ID') || "", description: "ID da conta MaxMind GeoIP", isSecret: false },
      { name: "MAXMIND_LICENSE_KEY", value: getCredential('MAXMIND_LICENSE_KEY') || "", description: "Chave de licença MaxMind GeoIP", isSecret: true }
    ],
    yampi: [
      { name: "YAMPI_WEBHOOK_SECRET", value: getCredential('YAMPI_WEBHOOK_SECRET') || "", description: "Chave secreta para webhook Yampi", isSecret: true }
    ],
    database: [
      { name: "DB_CONNECTION", value: getCredential('DB_CONNECTION') || "pgsql", description: "Tipo de conexão do banco de dados", isSecret: false },
      { name: "DB_HOST", value: getCredential('DB_HOST') || "", description: "Host do banco de dados", isSecret: false },
      { name: "DB_PORT", value: getCredential('DB_PORT') || "5432", description: "Porta do banco de dados", isSecret: false },
      { name: "DB_DATABASE", value: getCredential('DB_DATABASE') || "", description: "Nome do banco de dados", isSecret: false },
      { name: "DB_USERNAME", value: getCredential('DB_USERNAME') || "", description: "Usuário do banco de dados", isSecret: false },
      { name: "DB_PASSWORD", value: getCredential('DB_PASSWORD') || "", description: "Senha do banco de dados", isSecret: true }
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
                  {/* FB_PIXEL_ID */}
                  <div className="grid gap-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="FB_PIXEL_ID" className="text-sm font-medium">
                        FB_PIXEL_ID
                      </Label>
                      <div className="text-xs text-muted-foreground">ID do Pixel do Meta</div>
                    </div>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Input
                          id="FB_PIXEL_ID"
                          value={pixelId}
                          type="text"
                          className="pr-10"
                          placeholder="Insira o ID do Pixel"
                          onChange={(e) => setPixelId(e.target.value)}
                        />
                      </div>
                      <Button
                        type="button"
                        size="icon"
                        variant="outline"
                        onClick={() => copyToClipboard(pixelId)}
                      >
                        <CopyIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* FB_ACCESS_TOKEN */}
                  <div className="grid gap-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="FB_ACCESS_TOKEN" className="text-sm font-medium">
                        FB_ACCESS_TOKEN
                      </Label>
                      <div className="text-xs text-muted-foreground">Token de acesso à API do Meta</div>
                    </div>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Input
                          id="FB_ACCESS_TOKEN"
                          value={showSecrets['FB_ACCESS_TOKEN'] ? accessToken : "•".repeat(Math.min(accessToken.length || 12, 12))}
                          type={showSecrets['FB_ACCESS_TOKEN'] ? "text" : "password"}
                          className="pr-10"
                          placeholder="Insira o token de acesso"
                          onChange={(e) => setAccessToken(e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => toggleSecretVisibility('FB_ACCESS_TOKEN')}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                        >
                          {showSecrets['FB_ACCESS_TOKEN'] ? (
                            <EyeOffIcon className="h-4 w-4" />
                          ) : (
                            <EyeIcon className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      <Button
                        type="button"
                        size="icon"
                        variant="outline"
                        onClick={() => copyToClipboard(accessToken)}
                      >
                        <CopyIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* FB_API_VERSION */}
                  <div className="grid gap-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="FB_API_VERSION" className="text-sm font-medium">
                        FB_API_VERSION
                      </Label>
                      <div className="text-xs text-muted-foreground">Versão da API do Meta</div>
                    </div>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Input
                          id="FB_API_VERSION"
                          value={apiVersion}
                          type="text"
                          className="pr-10"
                          placeholder="Insira a versão da API"
                          onChange={(e) => setApiVersion(e.target.value)}
                        />
                      </div>
                      <Button
                        type="button"
                        size="icon"
                        variant="outline"
                        onClick={() => copyToClipboard(apiVersion)}
                      >
                        <CopyIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 pt-4 mt-6 border-t">
                    <div className="text-sm font-medium mb-2">Opções de Rastreamento</div>
                    
                    <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <Label>Rastreamento via Servidor</Label>
                        <div className="text-xs text-muted-foreground">
                          Enviar eventos via API do servidor
                        </div>
                      </div>
                      <Switch checked={enableServerSide} onCheckedChange={setEnableServerSide} />
                    </div>
                    
                    <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <Label>Rastreamento via Navegador</Label>
                        <div className="text-xs text-muted-foreground">
                          Usar o script do Pixel no navegador
                        </div>
                      </div>
                      <Switch checked={enableBrowserSide} onCheckedChange={setEnableBrowserSide} />
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button onClick={saveMetaCredentials}>
                      Salvar Configurações
                    </Button>
                    
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handleTestConnection}
                      disabled={isTesting || !pixelId || !accessToken}
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
                  
                  {/* Exibição do resultado do teste */}
                  {testResult && (
                    <div className={`mt-4 p-3 rounded-md border ${testResult.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                      <div className="flex items-center gap-2">
                        {testResult.success ? (
                          <AlertCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-red-600" />
                        )}
                        <span className={`text-sm ${testResult.success ? 'text-green-700' : 'text-red-700'}`}>
                          {testResult.message}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
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
      </div>
    </div>
  );
};

export default Settings;
