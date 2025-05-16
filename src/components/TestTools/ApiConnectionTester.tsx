
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { usePixel, useGeolocation, useShopify } from '@/hooks';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

export interface ApiConnectionTesterProps {
  pixelId?: string;
  pixelToken?: string;
  geoAccountId?: string;
  geoLicenseKey?: string;
  shopifyApiKey?: string;
  shopifyApiSecretKey?: string;
}

const ApiConnectionTester: React.FC<ApiConnectionTesterProps> = ({
  pixelId,
  pixelToken,
  geoAccountId,
  geoLicenseKey,
  shopifyApiKey,
  shopifyApiSecretKey
}) => {
  const [results, setResults] = useState<{
    pixel?: { success: boolean; message: string };
    geo?: { success: boolean; message: string };
    shopify?: { success: boolean; message: string };
  }>({});
  
  const [testing, setTesting] = useState<{
    pixel: boolean;
    geo: boolean;
    shopify: boolean;
  }>({
    pixel: false,
    geo: false,
    shopify: false
  });

  // Inicializa hooks
  const { testConnection: testPixel } = usePixel({ 
    pixelId: pixelId || '',
    accessToken: pixelToken
  });
  
  const { testConnection: testGeo } = useGeolocation({
    accountId: geoAccountId,
    licenseKey: geoLicenseKey
  });
  
  const { isConnected: shopifyConnected } = useShopify({
    apiKey: shopifyApiKey || '',
    apiSecretKey: shopifyApiSecretKey || '',
    scopes: ['read_products', 'write_orders'],
    redirectUri: `${window.location.origin}/shopify/callback`
  });

  // Testa conexão com Meta Pixel
  const handleTestPixel = async () => {
    if (!pixelId || !pixelToken) {
      setResults(prev => ({
        ...prev, 
        pixel: { 
          success: false, 
          message: "ID do Pixel e Token de acesso são necessários" 
        }
      }));
      return;
    }
    
    setTesting(prev => ({ ...prev, pixel: true }));
    const result = await testPixel();
    setResults(prev => ({ ...prev, pixel: result }));
    setTesting(prev => ({ ...prev, pixel: false }));
  };

  // Testa conexão com Geolocalização
  const handleTestGeo = async () => {
    if (!geoAccountId || !geoLicenseKey) {
      setResults(prev => ({
        ...prev, 
        geo: { 
          success: false, 
          message: "ID da Conta e Chave de Licença MaxMind são necessários" 
        }
      }));
      return;
    }
    
    setTesting(prev => ({ ...prev, geo: true }));
    const result = await testGeo();
    setResults(prev => ({ ...prev, geo: result }));
    setTesting(prev => ({ ...prev, geo: false }));
  };

  // Verifica conexão com Shopify
  const handleCheckShopify = () => {
    setTesting(prev => ({ ...prev, shopify: true }));
    
    setTimeout(() => {
      setResults(prev => ({
        ...prev,
        shopify: {
          success: shopifyConnected,
          message: shopifyConnected 
            ? "Loja Shopify conectada com sucesso" 
            : "Loja Shopify não conectada. Use o formulário de integração."
        }
      }));
      setTesting(prev => ({ ...prev, shopify: false }));
    }, 500);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Teste de Conexão com APIs</CardTitle>
        <CardDescription>Verifique se as integrações estão funcionando corretamente</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <p className="font-medium">Meta Pixel / Conversions API</p>
              <p className="text-sm text-muted-foreground">
                Teste a conexão com a API do Meta
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              {results.pixel && (
                <span className={`text-sm ${results.pixel.success ? 'text-green-600' : 'text-red-600'} flex items-center`}>
                  {results.pixel.success ? (
                    <CheckCircle2 className="h-4 w-4 mr-1" />
                  ) : (
                    <AlertCircle className="h-4 w-4 mr-1" />
                  )}
                  {results.pixel.success ? 'Conectado' : 'Falha'}
                </span>
              )}
              
              <Button 
                onClick={handleTestPixel}
                disabled={testing.pixel || !pixelId}
                size="sm"
              >
                {testing.pixel ? (
                  <><Loader2 className="h-4 w-4 mr-1 animate-spin" /> Testando</>
                ) : (
                  'Testar'
                )}
              </Button>
            </div>
          </div>
          
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <p className="font-medium">Geolocalização MaxMind</p>
              <p className="text-sm text-muted-foreground">
                Teste o acesso à API de geolocalização
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              {results.geo && (
                <span className={`text-sm ${results.geo.success ? 'text-green-600' : 'text-red-600'} flex items-center`}>
                  {results.geo.success ? (
                    <CheckCircle2 className="h-4 w-4 mr-1" />
                  ) : (
                    <AlertCircle className="h-4 w-4 mr-1" />
                  )}
                  {results.geo.success ? 'Conectado' : 'Falha'}
                </span>
              )}
              
              <Button 
                onClick={handleTestGeo}
                disabled={testing.geo || !geoAccountId}
                size="sm"
              >
                {testing.geo ? (
                  <><Loader2 className="h-4 w-4 mr-1 animate-spin" /> Testando</>
                ) : (
                  'Testar'
                )}
              </Button>
            </div>
          </div>
          
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <p className="font-medium">Integração Shopify</p>
              <p className="text-sm text-muted-foreground">
                Verifique a conexão com a loja Shopify
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              {results.shopify && (
                <span className={`text-sm ${results.shopify.success ? 'text-green-600' : 'text-red-600'} flex items-center`}>
                  {results.shopify.success ? (
                    <CheckCircle2 className="h-4 w-4 mr-1" />
                  ) : (
                    <AlertCircle className="h-4 w-4 mr-1" />
                  )}
                  {results.shopify.success ? 'Conectado' : 'Não conectado'}
                </span>
              )}
              
              <Button 
                onClick={handleCheckShopify}
                disabled={testing.shopify}
                size="sm"
              >
                {testing.shopify ? (
                  <><Loader2 className="h-4 w-4 mr-1 animate-spin" /> Verificando</>
                ) : (
                  'Verificar'
                )}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex flex-col items-start">
        <h4 className="text-sm font-semibold mb-2">Detalhes da conexão</h4>
        
        {(results.pixel || results.geo || results.shopify) ? (
          <div className="text-xs text-muted-foreground space-y-1 w-full">
            {results.pixel && (
              <p className={`${results.pixel.success ? 'text-green-600' : 'text-red-600'}`}>
                <strong>Meta Pixel:</strong> {results.pixel.message}
              </p>
            )}
            {results.geo && (
              <p className={`${results.geo.success ? 'text-green-600' : 'text-red-600'}`}>
                <strong>Geolocalização:</strong> {results.geo.message}
              </p>
            )}
            {results.shopify && (
              <p className={`${results.shopify.success ? 'text-green-600' : 'text-red-600'}`}>
                <strong>Shopify:</strong> {results.shopify.message}
              </p>
            )}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">
            Execute os testes para ver os detalhes da conexão
          </p>
        )}
      </CardFooter>
    </Card>
  );
};

export default ApiConnectionTester;
