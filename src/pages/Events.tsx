
import React from 'react';
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PixelConfiguration from "@/components/Pixel/PixelConfiguration";

const Events = () => {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Event Tracking</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-2/3">
          <Tabs defaultValue="pixel" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="pixel">Facebook Pixel</TabsTrigger>
              <TabsTrigger value="custom">Custom Events</TabsTrigger>
            </TabsList>
            <TabsContent value="pixel">
              <PixelConfiguration />
            </TabsContent>
            <TabsContent value="custom">
              <div className="bg-card rounded-lg border shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Custom Event Tracking</h2>
                <p className="text-muted-foreground mb-6">
                  Define and manage custom events to track specific user interactions.
                  Custom events can be triggered via the JavaScript API or through the Shopify integration.
                </p>
                
                <div className="bg-muted p-4 rounded-md mb-6">
                  <h3 className="text-sm font-medium mb-2">JavaScript API Example</h3>
                  <pre className="text-xs overflow-auto p-2 bg-background rounded border">
{`trackEvent('ProductView', {
  product_id: '12345',
  product_name: 'Example Product',
  price: 99.99,
  currency: 'BRL'
});`}
                  </pre>
                </div>
                
                <Button variant="outline">Add Custom Event</Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="md:w-1/3">
          <div className="bg-card rounded-lg border shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Event Log</h2>
            <div className="relative mb-4">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search events..." className="pl-8" />
            </div>
            
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="border-b pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-sm">
                        {i % 3 === 0 ? "Purchase" : i % 2 === 0 ? "AddToCart" : "PageView"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        via {i % 2 === 0 ? "Shopify API" : "Web Pixel"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs">{i * 5} minutes ago</p>
                      <p className="text-xs text-muted-foreground">ID: {123456 + i}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <Button variant="link" className="mt-2 px-0">View All Events</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Events;
