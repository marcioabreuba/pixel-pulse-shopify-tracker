
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Activity, Database, Globe, BarChart3 } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-tracking-gray-light">
      <div className="container pt-16 pb-20">
        {/* Seção Principal */}
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl mb-6">
            Rastreamento Avançado de <span className="text-tracking-blue">Pixel do Meta</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Melhore sua análise de marketing com rastreamento preciso de geolocalização e integração perfeita com Shopify.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/dashboard">
              <Button size="lg" className="gap-2">
                Acessar Painel
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/events">
              <Button size="lg" variant="outline">Configurar Rastreamento</Button>
            </Link>
          </div>
        </div>
        
        {/* Seção de Funcionalidades */}
        <div className="mt-24">
          <h2 className="text-3xl font-bold text-center mb-12">Funcionalidades Principais</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card>
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-tracking-blue/10 flex items-center justify-center mb-4">
                  <Activity className="h-6 w-6 text-tracking-blue" />
                </div>
                <CardTitle>Rastreamento Avançado de Pixel</CardTitle>
                <CardDescription>
                  Integração completa do Pixel do Meta com mapeamento personalizado de eventos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Rastreie eventos padrão e personalizados com dados detalhados de atribuição para melhorar o desempenho dos anúncios.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-tracking-blue/10 flex items-center justify-center mb-4">
                  <Database className="h-6 w-6 text-tracking-blue" />
                </div>
                <CardTitle>Integração com Shopify</CardTitle>
                <CardDescription>
                  Conexão perfeita com sua loja Shopify via API
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Rastreie automaticamente visualizações de produtos, ações de carrinho, checkouts e compras com dados detalhados dos produtos.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-tracking-blue/10 flex items-center justify-center mb-4">
                  <Globe className="h-6 w-6 text-tracking-blue" />
                </div>
                <CardTitle>Rastreamento por Localização</CardTitle>
                <CardDescription>
                  Dados precisos de localização usando o banco de dados GeoLite2
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Aprimore seus eventos com dados precisos de localização para um melhor direcionamento e análise regional.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-tracking-blue/10 flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-tracking-blue" />
                </div>
                <CardTitle>Analytics de Desempenho</CardTitle>
                <CardDescription>
                  Métricas e relatórios detalhados de desempenho de rastreamento
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Monitore taxas de sucesso de eventos, engajamento de usuários e métricas de conversão através de painéis intuitivos.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Seção Como Funciona */}
        <div className="mt-24">
          <h2 className="text-3xl font-bold text-center mb-12">Como Funciona</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="h-16 w-16 bg-tracking-blue rounded-full text-white flex items-center justify-center mx-auto mb-6">
                <span className="text-xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-medium mb-3">Conectar</h3>
              <p className="text-muted-foreground">
                Vincule seu Pixel do Meta e sua loja Shopify à plataforma
              </p>
            </div>
            
            <div className="text-center">
              <div className="h-16 w-16 bg-tracking-blue rounded-full text-white flex items-center justify-center mx-auto mb-6">
                <span className="text-xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-medium mb-3">Configurar</h3>
              <p className="text-muted-foreground">
                Configure o rastreamento de eventos e parâmetros de geolocalização
              </p>
            </div>
            
            <div className="text-center">
              <div className="h-16 w-16 bg-tracking-blue rounded-full text-white flex items-center justify-center mx-auto mb-6">
                <span className="text-xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-medium mb-3">Monitorar</h3>
              <p className="text-muted-foreground">
                Acompanhe o desempenho e otimize suas campanhas de marketing
              </p>
            </div>
          </div>
        </div>
        
        {/* Seção CTA */}
        <div className="mt-24 bg-card rounded-xl p-8 md:p-12 border shadow-md text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Pronto para melhorar suas análises de marketing?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Comece com nosso sistema avançado de rastreamento otimizado para lojas de e-commerce brasileiras.
          </p>
          <Link to="/dashboard">
            <Button size="lg">Comece Hoje Mesmo</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;
