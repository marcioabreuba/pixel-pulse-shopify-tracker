
import React, { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const formSchema = z.object({
  pixelId: z.string().min(1, "Pixel ID is required"),
  domainVerification: z.string().optional(),
  enableAdvancedMatching: z.boolean().default(false),
  trackPageViews: z.boolean().default(true),
  trackAddToCart: z.boolean().default(true),
  trackInitiateCheckout: z.boolean().default(true),
  trackPurchase: z.boolean().default(true),
  useServerSideEvents: z.boolean().default(true)
});

const PixelConfiguration = () => {
  const [activeTab, setActiveTab] = useState("basic");
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pixelId: "",
      domainVerification: "",
      enableAdvancedMatching: false,
      trackPageViews: true,
      trackAddToCart: true,
      trackInitiateCheckout: true,
      trackPurchase: true,
      useServerSideEvents: true
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast.success("Facebook Pixel configuration saved");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Facebook Pixel Configuration</CardTitle>
        <CardDescription>Configure your Facebook Pixel tracking settings</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="basic">Basic Setup</TabsTrigger>
            <TabsTrigger value="advanced">Advanced Options</TabsTrigger>
          </TabsList>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-6">
              <TabsContent value="basic" className="space-y-4">
                <FormField
                  control={form.control}
                  name="pixelId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Facebook Pixel ID</FormLabel>
                      <FormControl>
                        <Input placeholder="123456789012345" {...field} />
                      </FormControl>
                      <FormDescription>
                        Enter your Facebook Pixel ID from Meta Business Suite
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="domainVerification"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Domain Verification Token (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="abc123def456" {...field} />
                      </FormControl>
                      <FormDescription>
                        Meta domain verification code if required
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="trackPageViews"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>Track Page Views</FormLabel>
                          <FormDescription>
                            Automatically track page view events
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
                    name="trackAddToCart"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>Track Add To Cart</FormLabel>
                          <FormDescription>
                            Track when products are added to cart
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
                    name="trackInitiateCheckout"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>Track Initiate Checkout</FormLabel>
                          <FormDescription>
                            Track when users start the checkout process
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
                    name="trackPurchase"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>Track Purchase</FormLabel>
                          <FormDescription>
                            Track completed purchase events
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
                </div>
              </TabsContent>
              
              <TabsContent value="advanced" className="space-y-4">
                <FormField
                  control={form.control}
                  name="enableAdvancedMatching"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Enable Advanced Matching</FormLabel>
                        <FormDescription>
                          Use customer data like email for better ad targeting
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
                  name="useServerSideEvents"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Use Server-Side Events</FormLabel>
                        <FormDescription>
                          Send events from server for improved tracking reliability
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
                
                <div className="rounded-lg border p-3 shadow-sm">
                  <h4 className="font-medium mb-2">GeoLocation Settings</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    The system is configured to use GeoLite2-City.mmdb for geolocation tracking.
                    This data will be used to enhance event tracking with location information.
                  </p>
                  <div className="text-sm text-muted-foreground p-2 bg-muted rounded">
                    <code>Database Path: /path/to/GeoLite2-City.mmdb</code>
                  </div>
                </div>
              </TabsContent>
              
              <CardFooter className="px-0 pb-0">
                <Button type="submit">Save Configuration</Button>
              </CardFooter>
            </form>
          </Form>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PixelConfiguration;
