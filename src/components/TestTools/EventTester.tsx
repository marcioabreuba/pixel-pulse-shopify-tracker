
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { usePixel } from '@/hooks/usePixel';
import { CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface EventTesterProps {
  pixelId?: string;
  pixelToken?: string;
}

const EVENT_TYPES = [
  { id: 'ViewContent', name: 'Visualização de Conteúdo', description: 'Quando um visitante visualiza uma página ou item' },
  { id: 'AddToCart', name: 'Adicionar ao Carrinho', description: 'Quando um item é adicionado ao carrinho de compras' },
  { id: 'InitiateCheckout', name: 'Iniciar Checkout', description: 'Quando um usuário inicia o processo de checkout' },
  { id: 'Purchase', name: 'Compra', description: 'Quando uma compra é concluída' },
  { id: 'Lead', name: 'Lead', description: 'Quando um formulário de lead é enviado' },
  { id: 'CompleteRegistration', name: 'Registro Completo', description: 'Quando um registro é concluído' }
];

const EventTester: React.FC<EventTesterProps> = ({ pixelId, pixelToken }) => {
  const [eventType, setEventType] = useState('ViewContent');
  const [customData, setCustomData] = useState('{\n  "content_name": "Página de Produto",\n  "content_type": "product",\n  "value": 99.99,\n  "currency": "BRL"\n}');
  const [isSending, setIsSending] = useState(false);
  const [eventResult, setEventResult] = useState<{ success: boolean; message: string; time?: string } | null>(null);
  
  // Initialize pixel hook
  const { trackEvent, prepareUserData } = usePixel({
    pixelId: pixelId || '',
    accessToken: pixelToken || '',
  });
  
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
    if (!pixelId || !pixelToken) {
      toast.error('ID do pixel e token de acesso são necessários');
      return;
    }
    
    setIsSending(true);
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
          message: `Evento ${eventType} enviado com sucesso para o pixel ${pixelId}`,
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
      setIsSending(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Teste de Envio de Eventos</CardTitle>
        <CardDescription>
          Envie eventos de teste para o Meta Pixel e Conversions API
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {(!pixelId || !pixelToken) && (
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-md flex gap-2 items-center">
              <AlertCircle className="h-5 w-5 text-amber-600" />
              <div>
                <p className="text-sm text-amber-800">
                  Configure o ID do pixel e o token de acesso nas configurações para usar esta funcionalidade.
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
          disabled={isSending || !pixelId || !pixelToken}
          className="w-full"
        >
          {isSending ? (
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
  );
};

export default EventTester;
