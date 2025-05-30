
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
              Rastreamento avançado de Pixel do Meta para lojas Shopify com recursos de geolocalização.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold mb-4">Recursos</h3>
            <ul className="space-y-2">
              <li>
                <a href="https://developers.facebook.com/docs/meta-pixel/" 
                   className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1" 
                   target="_blank" 
                   rel="noopener noreferrer">
                  Documentação do Pixel do Meta
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a href="https://shopify.dev/docs/api" 
                   className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1" 
                   target="_blank" 
                   rel="noopener noreferrer">
                  API da Shopify
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a href="https://dev.maxmind.com/geoip/docs/databases/city-and-country" 
                   className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1" 
                   target="_blank" 
                   rel="noopener noreferrer">
                  Documentação GeoLite2
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Política de Privacidade</a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Termos de Serviço</a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Política de Cookies</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 border-t border-border pt-6">
          <p className="text-sm text-muted-foreground text-center">
            © {new Date().getFullYear()} PixelTracker. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
