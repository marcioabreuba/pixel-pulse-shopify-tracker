
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GeolocationSetup from '@/components/Geolocation/GeolocationSetup';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock data for charts
const mockPerformanceData = [
  { date: '2023-01', impressions: 4000, clicks: 240, conversions: 24 },
  { date: '2023-02', impressions: 3000, clicks: 198, conversions: 19 },
  { date: '2023-03', impressions: 5000, clicks: 300, conversions: 35 },
  { date: '2023-04', impressions: 4500, clicks: 276, conversions: 30 },
  { date: '2023-05', impressions: 6000, clicks: 390, conversions: 45 },
  { date: '2023-06', impressions: 7000, clicks: 490, conversions: 60 },
];

const Analytics = () => {
  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Analytics & Settings</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Time Range:</span>
          <Select defaultValue="30days">
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
              <SelectItem value="year">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Tracking Performance</CardTitle>
            <CardDescription>Event tracking success rate and performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockPerformanceData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="impressions" stroke="#8884d8" name="Impressions" />
                  <Line type="monotone" dataKey="clicks" stroke="#82ca9d" name="Clicks" />
                  <Line type="monotone" dataKey="conversions" stroke="#ff7300" name="Conversions" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <GeolocationSetup />
        
        <Card>
          <CardHeader>
            <CardTitle>Configuration Details</CardTitle>
            <CardDescription>View and manage advanced tracking settings</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="server">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="server">Server Settings</TabsTrigger>
                <TabsTrigger value="deploy">Deployment</TabsTrigger>
              </TabsList>
              
              <TabsContent value="server" className="space-y-4">
                <div className="space-y-4">
                  <div className="bg-muted p-4 rounded">
                    <h3 className="text-sm font-medium mb-2">Node.js Server Configuration</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs">Environment</span>
                        <span className="text-xs font-medium">Production</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs">Node Version</span>
                        <span className="text-xs font-medium">18.x</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs">Memory Allocation</span>
                        <span className="text-xs font-medium">512 MB</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs">GeoLite2 Database</span>
                        <span className="text-xs font-medium text-green-600">Loaded</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted p-4 rounded">
                    <h3 className="text-sm font-medium mb-2">API Rate Limits</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs">Event Tracking</span>
                        <span className="text-xs font-medium">100 req/s</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs">Shopify Webhooks</span>
                        <span className="text-xs font-medium">50 req/s</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs">Geolocation Lookups</span>
                        <span className="text-xs font-medium">200 req/s</span>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="deploy" className="space-y-4">
                <div className="bg-muted p-4 rounded">
                  <h3 className="text-sm font-medium mb-2">Render.com Deployment</h3>
                  <p className="text-xs text-muted-foreground mb-4">
                    This application is configured for optimal deployment on Render.com hosting platform.
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs">Build Command</span>
                      <span className="text-xs font-mono bg-background p-1 rounded">npm run build</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs">Start Command</span>
                      <span className="text-xs font-mono bg-background p-1 rounded">npm start</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs">Node Type</span>
                      <span className="text-xs font-medium">Web Service</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-muted p-4 rounded">
                  <h3 className="text-sm font-medium mb-2">Environment Configuration</h3>
                  <p className="text-xs text-muted-foreground mb-2">
                    Required environment variables for deployment:
                  </p>
                  <ul className="space-y-1 text-xs font-mono">
                    <li>FACEBOOK_PIXEL_ID</li>
                    <li>SHOPIFY_API_KEY</li>
                    <li>SHOPIFY_API_SECRET</li>
                    <li>GEOLITE_DB_PATH</li>
                    <li>NODE_ENV</li>
                  </ul>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
