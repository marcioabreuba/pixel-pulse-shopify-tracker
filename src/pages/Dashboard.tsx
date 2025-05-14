
import React from 'react';
import { Activity, Users, ArrowUpRight, Database, ShoppingCart } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import StatCard from "@/components/Dashboard/StatCard";
import EventsTable from "@/components/Dashboard/EventsTable";
import MapChart from "@/components/Dashboard/MapChart";

const mockEvents = [
  {
    id: "1",
    name: "PageView",
    source: "Web Pixel",
    time: "2 minutes ago",
    location: "São Paulo, Brazil",
    status: "success" as const,
  },
  {
    id: "2",
    name: "AddToCart",
    source: "Shopify API",
    time: "10 minutes ago",
    location: "Rio de Janeiro, Brazil",
    status: "success" as const,
  },
  {
    id: "3",
    name: "InitiateCheckout",
    source: "Web Pixel",
    time: "15 minutes ago",
    location: "Brasília, Brazil",
    status: "success" as const,
  },
  {
    id: "4",
    name: "Purchase",
    source: "Shopify API",
    time: "30 minutes ago",
    location: "Curitiba, Brazil",
    status: "pending" as const,
  },
  {
    id: "5",
    name: "ViewContent",
    source: "Web Pixel",
    time: "1 hour ago",
    location: "Belo Horizonte, Brazil",
    status: "failed" as const,
  },
];

const geoData = [
  { name: "São Paulo", value: 42, color: "#1a73e8" },
  { name: "Rio de Janeiro", value: 28, color: "#34a853" },
  { name: "Brasília", value: 15, color: "#fbbc04" },
  { name: "Other Regions", value: 15, color: "#ea4335" },
];

const Dashboard = () => {
  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="flex items-center space-x-2">
          <span className="animate-pulse-tracking flex h-3 w-3 rounded-full bg-tracking-blue"></span>
          <span className="text-sm">Tracking Active</span>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Active Tracking Events" 
          value="2,851" 
          icon={<Activity />}
          trend={{ value: 12, positive: true }}
        />
        <StatCard 
          title="Unique Users" 
          value="1,429" 
          icon={<Users />}
          trend={{ value: 8, positive: true }}
        />
        <StatCard 
          title="Conversion Rate" 
          value="3.2%" 
          icon={<ArrowUpRight />}
          trend={{ value: 1.5, positive: true }}
        />
        <StatCard 
          title="Total Sales" 
          value="R$ 28,490" 
          icon={<ShoppingCart />}
          trend={{ value: 5, positive: true }}
        />
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        <MapChart data={geoData} />
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Event Summary</CardTitle>
            <CardDescription>Top tracked events in last 24h</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-full">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">PageView</span>
                    <span className="text-sm text-muted-foreground">48%</span>
                  </div>
                  <div className="mt-1 h-2 w-full bg-secondary rounded-full overflow-hidden">
                    <div className="bg-tracking-blue h-full" style={{ width: '48%' }}></div>
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-full">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">AddToCart</span>
                    <span className="text-sm text-muted-foreground">25%</span>
                  </div>
                  <div className="mt-1 h-2 w-full bg-secondary rounded-full overflow-hidden">
                    <div className="bg-tracking-blue h-full" style={{ width: '25%' }}></div>
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-full">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">InitiateCheckout</span>
                    <span className="text-sm text-muted-foreground">15%</span>
                  </div>
                  <div className="mt-1 h-2 w-full bg-secondary rounded-full overflow-hidden">
                    <div className="bg-tracking-blue h-full" style={{ width: '15%' }}></div>
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-full">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Purchase</span>
                    <span className="text-sm text-muted-foreground">12%</span>
                  </div>
                  <div className="mt-1 h-2 w-full bg-secondary rounded-full overflow-hidden">
                    <div className="bg-tracking-blue h-full" style={{ width: '12%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Recent Events</h2>
        <EventsTable events={mockEvents} />
      </div>
    </div>
  );
};

export default Dashboard;
