
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Activity, Settings, Layout, Database, BarChart3 } from "lucide-react";

const Header = () => {
  return (
    <header className="border-b border-border bg-card">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="h-6 w-6 text-tracking-blue" />
          <h1 className="text-xl font-bold">PixelTracker</h1>
        </div>
        
        <nav className="hidden md:flex items-center space-x-4">
          <Link to="/" className="text-sm font-medium hover:text-tracking-blue flex items-center gap-1">
            <Layout className="h-4 w-4" />
            <span>Dashboard</span>
          </Link>
          <Link to="/events" className="text-sm font-medium hover:text-tracking-blue flex items-center gap-1">
            <Activity className="h-4 w-4" />
            <span>Events</span>
          </Link>
          <Link to="/shopify" className="text-sm font-medium hover:text-tracking-blue flex items-center gap-1">
            <Database className="h-4 w-4" />
            <span>Shopify</span>
          </Link>
          <Link to="/analytics" className="text-sm font-medium hover:text-tracking-blue flex items-center gap-1">
            <BarChart3 className="h-4 w-4" />
            <span>Analytics</span>
          </Link>
        </nav>
        
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <Settings className="h-5 w-5" />
            <span className="sr-only">Settings</span>
          </Button>
          <Button>Get Started</Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
