
import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { AlertTriangle } from 'lucide-react';

const formSchema = z.object({
  geoDbPath: z.string().default("/path/to/GeoLite2-City.mmdb"),
  enableGeolocation: z.boolean().default(true),
  includeInTracking: z.boolean().default(true),
  updateFrequency: z.string().default("monthly"),
});

const GeolocationSetup = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      geoDbPath: "/path/to/GeoLite2-City.mmdb",
      enableGeolocation: true,
      includeInTracking: true,
      updateFrequency: "monthly",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast.success("Configurações de geolocalização salvas com sucesso");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuração de Geolocalização</CardTitle>
        <CardDescription>Configure o banco de dados GeoLite2 para rastreamento de geolocalização por IP</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-6 flex items-start gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-medium text-amber-800">Aviso Importante</h4>
            <p className="text-xs text-amber-700 mt-1">
              Você precisa baixar o banco de dados GeoLite2-City.mmdb da MaxMind e fornecer o caminho aqui.
              Para um desempenho ideal na hospedagem Render.com, coloque o banco de dados na raiz do projeto ou em um diretório acessível.
            </p>
          </div>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="geoDbPath"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Caminho do Banco de Dados GeoLite2</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    Caminho para seu arquivo GeoLite2-City.mmdb no servidor
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="enableGeolocation"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Ativar Geolocalização</FormLabel>
                    <FormDescription>
                      Usar geolocalização por IP nos eventos de rastreamento
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="includeInTracking"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Incluir nos Eventos do Pixel</FormLabel>
                    <FormDescription>
                      Adicionar dados de localização aos eventos do Meta Pixel
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="updateFrequency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Frequência de Atualização do Banco</FormLabel>
                  <FormControl>
                    <select
                      className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      {...field}
                    >
                      <option value="weekly">Semanal</option>
                      <option value="monthly">Mensal</option>
                      <option value="quarterly">Trimestral</option>
                    </select>
                  </FormControl>
                  <FormDescription>
                    Com que frequência atualizar o banco de dados GeoLite2
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <CardFooter className="px-0 pb-0">
              <Button type="submit">Salvar Configurações de Geolocalização</Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default GeolocationSetup;
