
import React, { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AlertCircle, CheckCircle2 } from "lucide-react";

const formSchema = z.object({
  shopDomain: z.string().min(1, "Shop domain is required"),
  apiKey: z.string().min(1, "API key is required"),
  apiSecretKey: z.string().min(1, "API secret key is required"),
  accessToken: z.string().optional(),
});

const ShopifyIntegration = () => {
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'connecting' | 'connected' | 'failed'>('idle');
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      shopDomain: "",
      apiKey: "",
      apiSecretKey: "",
      accessToken: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    setConnectionStatus('connecting');
    
    // Simulate API connection
    setTimeout(() => {
      setConnectionStatus('connected');
      toast.success("Successfully connected to Shopify store");
    }, 1500);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Shopify Integration</CardTitle>
        <CardDescription>Connect your Shopify store to enable advanced tracking</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="shopDomain"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Shop Domain</FormLabel>
                  <FormControl>
                    <Input placeholder="your-store.myshopify.com" {...field} />
                  </FormControl>
                  <FormDescription>
                    Your Shopify store domain without https://
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="apiKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>API Key</FormLabel>
                  <FormControl>
                    <Input placeholder="Shopify API Key" {...field} type="password" />
                  </FormControl>
                  <FormDescription>
                    From your Shopify Admin ➝ Apps ➝ Develop apps
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="apiSecretKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>API Secret Key</FormLabel>
                  <FormControl>
                    <Input placeholder="Shopify API Secret" {...field} type="password" />
                  </FormControl>
                  <FormDescription>
                    The secret key associated with your API key
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="accessToken"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Access Token (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Access Token" {...field} type="password" />
                  </FormControl>
                  <FormDescription>
                    Optional: For stores with existing access tokens
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <CardFooter className="flex justify-between p-0">
              <div className="flex items-center space-x-2">
                {connectionStatus === 'idle' && (
                  <span className="text-sm text-muted-foreground">Not connected</span>
                )}
                
                {connectionStatus === 'connecting' && (
                  <>
                    <span className="animate-pulse-tracking flex h-3 w-3 rounded-full bg-amber-500"></span>
                    <span className="text-sm text-amber-500">Connecting...</span>
                  </>
                )}
                
                {connectionStatus === 'connected' && (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-green-500">Connected</span>
                  </>
                )}
                
                {connectionStatus === 'failed' && (
                  <>
                    <AlertCircle className="h-4 w-4 text-destructive" />
                    <span className="text-sm text-destructive">Connection failed</span>
                  </>
                )}
              </div>
              
              <Button 
                type="submit" 
                disabled={connectionStatus === 'connecting' || connectionStatus === 'connected'}
              >
                {connectionStatus === 'connected' ? 'Connected' : 'Connect Store'}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ShopifyIntegration;
