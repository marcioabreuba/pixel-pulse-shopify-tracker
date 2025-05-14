
import React from 'react';
import { ExternalLink } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container py-6 md:py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">PixelTracker</h3>
            <p className="text-sm text-muted-foreground">
              Advanced Facebook Pixel tracking for Shopify stores with geolocation capabilities.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a href="https://developers.facebook.com/docs/meta-pixel/" 
                   className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1" 
                   target="_blank" 
                   rel="noopener noreferrer">
                  Facebook Pixel Documentation
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a href="https://shopify.dev/docs/api" 
                   className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1" 
                   target="_blank" 
                   rel="noopener noreferrer">
                  Shopify API
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a href="https://dev.maxmind.com/geoip/docs/databases/city-and-country" 
                   className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1" 
                   target="_blank" 
                   rel="noopener noreferrer">
                  GeoLite2 Documentation
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Terms of Service</a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Cookie Policy</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 border-t border-border pt-6">
          <p className="text-sm text-muted-foreground text-center">
            © {new Date().getFullYear()} PixelTracker. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
