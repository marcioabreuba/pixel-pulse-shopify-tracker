
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GeolocationSetup from "@/components/Geolocation/GeolocationSetup";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { EyeIcon, EyeOffIcon, CopyIcon } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

const Settings = () => {
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});

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

  // Credenciais de serviço
  const credentials = {
    meta: [
      { name: "FB_PIXEL_ID", value: "1163339595278098", description: "ID do Pixel do Meta", isSecret: false },
      { name: "FB_ACCESS_TOKEN", value: "EAAHZAkMjZBhOkBOyNMyPlwzhsX3ruT2cUAQCe8pqOFyuD15BzCspoQ8VZAMWahuI5yTmHUsIDIURs7uSOXH0DOZBKXsu9sFlhaYTC7sQ5o5dVYIYggiZBFDLZAEyZC63qPjvhe4Q8RbxX7yMCWDaULYJ2TA8fKFJDPMweuR44ayRdDVWziDm1LYrLOgZC3LIBWbKPgZDZD", description: "Token de acesso à API do Meta", isSecret: true },
      { name: "FB_API_VERSION", value: "v19.0", description: "Versão da API do Meta", isSecret: false }
    ],
    maxmind: [
      { name: "MAXMIND_ACCOUNT_ID", value: "1146789", description: "ID da conta MaxMind GeoIP", isSecret: false },
      { name: "MAXMIND_LICENSE_KEY", value: "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", description: "Chave de licença MaxMind GeoIP", isSecret: true }
    ],
    yampi: [
      { name: "YAMPI_WEBHOOK_SECRET", value: "sk_5xl8dpk93FIEvfMbLz3JOT7RQytQSiUFIkMaT", description: "Chave secreta para webhook Yampi", isSecret: true }
    ],
    database: [
      { name: "DB_CONNECTION", value: "pgsql", description: "Tipo de conexão do banco de dados", isSecret: false },
      { name: "DB_HOST", value: "ep-cold-bread-a5knxjtd-pooler.us-east-2.aws.neon.tech", description: "Host do banco de dados", isSecret: false },
      { name: "DB_PORT", value: "5432", description: "Porta do banco de dados", isSecret: false },
      { name: "DB_DATABASE", value: "neondb", description: "Nome do banco de dados", isSecret: false },
      { name: "DB_USERNAME", value: "neondb_owner", description: "Usuário do banco de dados", isSecret: false },
      { name: "DB_PASSWORD", value: "npg_RUFNhK7XWYG6", description: "Senha do banco de dados", isSecret: true }
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
          
          <TabsContent value="meta" className="mt-6">
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
                              ? "•".repeat(Math.min(cred.value.length, 12))
                              : cred.value}
                            type={cred.isSecret && !showSecrets[cred.name] ? "password" : "text"}
                            className="pr-10"
                            readOnly
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
                              ? "•".repeat(Math.min(cred.value.length, 12))
                              : cred.value}
                            type={cred.isSecret && !showSecrets[cred.name] ? "password" : "text"}
                            className="pr-10"
                            readOnly
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
                              ? "•".repeat(Math.min(cred.value.length, 12))
                              : cred.value}
                            type={cred.isSecret && !showSecrets[cred.name] ? "password" : "text"}
                            className="pr-10"
                            readOnly
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
