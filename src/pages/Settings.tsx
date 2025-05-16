
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
import { InfoIcon } from "lucide-react";
import { usePixel } from "@/hooks/usePixel";
import { useCredentials } from "@/hooks";

const Settings = () => {
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
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
