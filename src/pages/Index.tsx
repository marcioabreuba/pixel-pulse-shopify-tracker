
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Activity, Database, Globe, BarChart3 } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-tracking-gray-light">
      <div className="container pt-16 pb-20">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl mb-6">
            Advanced Facebook Pixel Tracking for <span className="text-tracking-blue">Shopify</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Improve your marketing analytics with precision geolocation tracking and seamless Shopify integration.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/dashboard">
              <Button size="lg" className="gap-2">
                Go to Dashboard
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/events">
              <Button size="lg" variant="outline">Configure Tracking</Button>
            </Link>
          </div>
        </div>
        
        {/* Features Section */}
        <div className="mt-24">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card>
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-tracking-blue/10 flex items-center justify-center mb-4">
                  <Activity className="h-6 w-6 text-tracking-blue" />
                </div>
                <CardTitle>Advanced Pixel Tracking</CardTitle>
                <CardDescription>
                  Comprehensive Facebook Pixel integration with custom event mapping
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Track standard and custom events with detailed attribution data for improved ad performance.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-tracking-blue/10 flex items-center justify-center mb-4">
                  <Database className="h-6 w-6 text-tracking-blue" />
                </div>
                <CardTitle>Shopify Integration</CardTitle>
                <CardDescription>
                  Seamless connection with your Shopify store via API
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Automatically track product views, cart actions, checkouts and purchases with detailed product data.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-tracking-blue/10 flex items-center justify-center mb-4">
                  <Globe className="h-6 w-6 text-tracking-blue" />
                </div>
                <CardTitle>Geolocation Tracking</CardTitle>
                <CardDescription>
                  Precise location data using GeoLite2 database
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Enhance your events with accurate location data for better targeting and regional analytics.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-tracking-blue/10 flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-tracking-blue" />
                </div>
                <CardTitle>Performance Analytics</CardTitle>
                <CardDescription>
                  Detailed tracking performance metrics and reports
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Monitor event success rates, user engagement, and conversion metrics through intuitive dashboards.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* How It Works Section */}
        <div className="mt-24">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="h-16 w-16 bg-tracking-blue rounded-full text-white flex items-center justify-center mx-auto mb-6">
                <span className="text-xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-medium mb-3">Connect</h3>
              <p className="text-muted-foreground">
                Link your Facebook Pixel and Shopify store to the platform
              </p>
            </div>
            
            <div className="text-center">
              <div className="h-16 w-16 bg-tracking-blue rounded-full text-white flex items-center justify-center mx-auto mb-6">
                <span className="text-xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-medium mb-3">Configure</h3>
              <p className="text-muted-foreground">
                Set up event tracking and geolocation parameters
              </p>
            </div>
            
            <div className="text-center">
              <div className="h-16 w-16 bg-tracking-blue rounded-full text-white flex items-center justify-center mx-auto mb-6">
                <span className="text-xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-medium mb-3">Monitor</h3>
              <p className="text-muted-foreground">
                Track performance and optimize your marketing campaigns
              </p>
            </div>
          </div>
        </div>
        
        {/* CTA Section */}
        <div className="mt-24 bg-card rounded-xl p-8 md:p-12 border shadow-md text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to improve your marketing analytics?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Get started with our advanced tracking system optimized for Brazilian e-commerce stores.
          </p>
          <Link to="/dashboard">
            <Button size="lg">Get Started Today</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;
