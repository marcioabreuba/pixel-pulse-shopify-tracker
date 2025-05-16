import React, { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePixel } from '@/hooks';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  eventName: z.string().min(1, "Nome do evento é obrigatório"),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  contentIds: z.string().optional(),
  contentName: z.string().optional(),
  contentCategory: z.string().optional(),
  currency: z.string().default("BRL"),
  value: z.string().transform(val => parseFloat(val) || 0).optional(),
});

export interface EventTesterProps {
  pixelId?: string | number;  // Alterado para aceitar string ou número
  pixelToken?: string;
}

const EventTester: React.FC<EventTesterProps> = ({
  pixelId,
  pixelToken,
}) => {
  const [isSending, setIsSending] = useState(false);
  const [lastSent, setLastSent] = useState<{
    time: Date;
    event: string;
    success: boolean;
  } | null>(null);

  // Convertemos pixelId para string caso seja número
  const pixelIdStr = pixelId ? String(pixelId) : '';

  const { trackEvent, prepareUserData } = usePixel({
    pixelId: pixelId || '',  // Passamos diretamente o pixelId, o hook já aceita string ou número
    accessToken: pixelToken || '',
    enableServerSide: !!pixelToken,
    enableBrowserSide: !!pixelId
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      eventName: "PageView",
      email: "",
      phone: "",
      firstName: "",
      lastName: "",
      contentIds: "",
      contentName: "",
      contentCategory: "",
      currency: "BRL",
      value: ""
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!pixelId) {
      toast.error("ID do Pixel é necessário");
      return;
    }

    setIsSending(true);

    try {
      // Prepara dados do usuário
      const userData = prepareUserData({
        email: values.email || '',
        phone: values.phone || '',
        firstName: values.firstName || '',
        lastName: values.lastName || '',
      });

      // Prepara dados personalizados
      const customData: Record<string, any> = {};
      
      if (values.contentIds) {
        customData.content_ids = values.contentIds.split(',').map(id => id.trim());
      }
      
      if (values.contentName) {
        customData.content_name = values.contentName;
      }
      
      if (values.contentCategory) {
        customData.content_category = values.contentCategory;
      }
      
      if (values.currency) {
        customData.currency = values.currency;
      }
      
      if (values.value) {
        customData.value = values.value;
      }

      // Envia o evento
      const success = await trackEvent(values.eventName, userData, Object.keys(customData).length > 0 ? customData : undefined);

      if (success) {
        toast.success(`Evento ${values.eventName} enviado com sucesso`);
      } else {
        toast.error(`Falha ao enviar evento ${values.eventName}`);
      }

      setLastSent({
        time: new Date(),
        event: values.eventName,
        success,
      });
    } catch (error) {
      console.error('Erro ao enviar evento:', error);
      toast.error(`Erro ao enviar evento: ${(error as Error).message}`);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Teste de Eventos</CardTitle>
        <CardDescription>Envie eventos de teste para o Meta Pixel</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="eventName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Evento</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um evento" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="PageView">PageView</SelectItem>
                      <SelectItem value="ViewContent">ViewContent</SelectItem>
                      <SelectItem value="AddToCart">AddToCart</SelectItem>
                      <SelectItem value="InitiateCheckout">InitiateCheckout</SelectItem>
                      <SelectItem value="Purchase">Purchase</SelectItem>
                      <SelectItem value="Lead">Lead</SelectItem>
                      <SelectItem value="CompleteRegistration">CompleteRegistration</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Evento padrão do Meta Pixel para enviar
                  </FormDescription>
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="usuario@exemplo.com" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone</FormLabel>
                    <FormControl>
                      <Input placeholder="+55 11 98765-4321" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sobrenome</FormLabel>
                    <FormControl>
                      <Input placeholder="Sobrenome" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="contentIds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>IDs de Conteúdo</FormLabel>
                    <FormControl>
                      <Input placeholder="123, 456, 789" {...field} />
                    </FormControl>
                    <FormDescription>
                      Separados por vírgula
                    </FormDescription>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="contentName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Conteúdo</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome do produto/conteúdo" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="contentCategory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome da categoria" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Moeda</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma moeda" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="BRL">BRL (Real)</SelectItem>
                        <SelectItem value="USD">USD (Dólar)</SelectItem>
                        <SelectItem value="EUR">EUR (Euro)</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor</FormLabel>
                  <FormControl>
                    <Input placeholder="0.00" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-between items-center pt-4">
              <div className="text-sm">
                {lastSent && (
                  <p className="text-muted-foreground">
                    Último evento enviado: <span className={lastSent.success ? 'text-green-600' : 'text-red-600'}>
                      {lastSent.event}
                    </span> em {lastSent.time.toLocaleTimeString()}
                  </p>
                )}
              </div>
              
              <Button type="submit" disabled={isSending || !pixelId}>
                {isSending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  'Enviar Evento'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default EventTester;
