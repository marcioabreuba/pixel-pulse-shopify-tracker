import React from 'react';
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ConfiguracaoPixel from "@/components/Pixel/ConfiguracaoPixel";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { InfoIcon } from "lucide-react";

// Lista completa de eventos para rastreamento
const eventosDisponiveis = [
  { id: "PageView", nome: "Visualização de Página", categoria: "navegacao", padrao: true },
  { id: "ViewHome", nome: "Visualizar Página Inicial", categoria: "navegacao", padrao: true },
  { id: "ViewList", nome: "Visualizar Lista", categoria: "navegacao", padrao: true },
  { id: "ViewContent", nome: "Ver Conteúdo", categoria: "navegacao", padrao: true },
  { id: "ViewCategory", nome: "Visualizar Categoria", categoria: "navegacao", padrao: true },
  { id: "ViewCart", nome: "Visualizar Carrinho", categoria: "carrinho", padrao: true },
  { id: "AddToCart", nome: "Adicionar ao Carrinho", categoria: "carrinho", padrao: true },
  { id: "StartCheckout", nome: "Iniciar Finalização da Compra", categoria: "checkout", padrao: true },
  { id: "ShippingLoaded", nome: "Informações de Envio Carregadas", categoria: "checkout", padrao: false },
  { id: "AddPaymentInfo", nome: "Adicionar Informações de Pagamento", categoria: "checkout", padrao: true },
  { id: "Purchase", nome: "Compra", categoria: "compra", padrao: true },
  { id: "Purchase_credit_card", nome: "Compra - Cartão de Crédito", categoria: "compra", padrao: false },
  { id: "Purchase_pix", nome: "Compra - PIX", categoria: "compra", padrao: false },
  { id: "Purchase_billet", nome: "Compra - Boleto", categoria: "compra", padrao: false },
  { id: "Purchase_paid_pix", nome: "Compra - PIX Pago", categoria: "compra", padrao: false },
  { id: "Purchase_high_ticket", nome: "Compra - Alto Valor", categoria: "compra", padrao: false },
  { id: "Refused_credit_card", nome: "Recusado - Cartão de Crédito", categoria: "compra", padrao: false },
  { id: "RegisterDone", nome: "Registro Concluído", categoria: "usuario", padrao: false },
  { id: "AddCoupon", nome: "Adicionar Cupom", categoria: "carrinho", padrao: false },
  { id: "Search", nome: "Pesquisar", categoria: "navegacao", padrao: true },
  { id: "ViewSearchResults", nome: "Visualizar Resultados da Pesquisa", categoria: "navegacao", padrao: false },
  { id: "Timer_1min", nome: "Tempo na Página - 1 minuto", categoria: "engajamento", padrao: false },
  { id: "Scroll_25", nome: "Rolagem - 25%", categoria: "engajamento", padrao: false },
  { id: "Scroll_50", nome: "Rolagem - 50%", categoria: "engajamento", padrao: false }
];

// Parâmetros para Advanced Matching
const parametrosAvancados = [
  { id: "em", nome: "Email", descricao: "Email do cliente", hashing: "obrigatório", importante: true },
  { id: "ph", nome: "Telefone", descricao: "Número de telefone", hashing: "obrigatório", importante: true },
  { id: "fn", nome: "Nome", descricao: "Nome do cliente", hashing: "obrigatório", importante: true },
  { id: "ln", nome: "Sobrenome", descricao: "Sobrenome do cliente", hashing: "obrigatório", importante: true },
  { id: "ge", nome: "Gênero", descricao: "Gênero do cliente", hashing: "obrigatório", importante: false },
  { id: "db", nome: "Data de nascimento", descricao: "Data de nascimento do cliente", hashing: "obrigatório", importante: false },
  { id: "ct", nome: "Cidade", descricao: "Cidade do cliente", hashing: "obrigatório", importante: true },
  { id: "st", nome: "Estado", descricao: "Estado do cliente", hashing: "obrigatório", importante: true },
  { id: "zp", nome: "CEP", descricao: "Código postal", hashing: "obrigatório", importante: true },
  { id: "country", nome: "País", descricao: "País do cliente", hashing: "obrigatório", importante: true },
  { id: "external_id", nome: "ID Externo", descricao: "ID externo do cliente", hashing: "recomendado", importante: true },
  { id: "client_ip_address", nome: "Endereço IP", descricao: "Endereço IP do cliente", hashing: "não", importante: true },
  { id: "client_user_agent", nome: "User Agent", descricao: "Navegador do cliente", hashing: "não", importante: true },
  { id: "fbc", nome: "ID do clique", descricao: "Facebook click ID", hashing: "não", importante: true },
  { id: "fbp", nome: "ID do navegador", descricao: "Facebook browser ID", hashing: "não", importante: true },
  { id: "subscription_id", nome: "ID da assinatura", descricao: "ID da assinatura do cliente", hashing: "não", importante: false },
  { id: "fb_login_id", nome: "ID de Login do Facebook", descricao: "ID de login do Facebook", hashing: "não", importante: false },
  { id: "lead_id", nome: "ID de lead", descricao: "ID do lead", hashing: "não", importante: false },
  { id: "anon_id", nome: "ID anônimo", descricao: "ID de instalação", hashing: "não", importante: false },
  { id: "madid", nome: "ID do anunciante móvel", descricao: "ID do anunciante da plataforma móvel", hashing: "não", importante: false },
  { id: "page_id", nome: "ID da página", descricao: "ID da página do Facebook", hashing: "não", importante: false },
  { id: "page_scoped_user_id", nome: "ID do usuário na página", descricao: "ID do usuário no escopo da página", hashing: "não", importante: false },
  { id: "ctwa_clid", nome: "ID do clique WhatsApp", descricao: "ID do clique para o WhatsApp", hashing: "não", importante: false },
  { id: "ig_account_id", nome: "ID da conta do Instagram", descricao: "ID da conta do Instagram", hashing: "não", importante: false },
  { id: "ig_sid", nome: "ID do clique Instagram", descricao: "ID do clique para o Instagram", hashing: "não", importante: false }
];

const Events = () => {
  const [activeFilter, setActiveFilter] = React.useState("todos");
  const [searchTerm, setSearchTerm] = React.useState("");

  const filteredEvents = React.useMemo(() => {
    let filtered = eventosDisponiveis;
    
    if (activeFilter !== "todos") {
      filtered = filtered.filter(event => event.categoria === activeFilter);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(event => 
        event.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
        event.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  }, [activeFilter, searchTerm]);

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Rastreamento de Eventos</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-2/3">
          <Tabs defaultValue="pixel" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="pixel">Pixel do Meta</TabsTrigger>
              <TabsTrigger value="eventos">Lista de Eventos</TabsTrigger>
              <TabsTrigger value="parametros">Parâmetros Avançados</TabsTrigger>
            </TabsList>
            <TabsContent value="pixel">
              <ConfiguracaoPixel />
            </TabsContent>
            
            <TabsContent value="eventos">
              <div className="bg-card rounded-lg border shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Eventos Disponíveis</h2>
                  <div className="flex items-center gap-2">
                    <div className="relative w-64">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input 
                        placeholder="Buscar eventos..." 
                        className="pl-8" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                  <Button 
                    variant={activeFilter === "todos" ? "default" : "outline"} 
                    size="sm" 
                    onClick={() => setActiveFilter("todos")}
                  >
                    Todos
                  </Button>
                  {["navegacao", "carrinho", "checkout", "compra", "usuario", "engajamento"].map((categoria) => (
                    <Button 
                      key={categoria} 
                      variant={activeFilter === categoria ? "default" : "outline"} 
                      size="sm" 
                      onClick={() => setActiveFilter(categoria)}
                    >
                      {categoria.charAt(0).toUpperCase() + categoria.slice(1)}
                    </Button>
                  ))}
                </div>
                
                <div className="bg-muted p-4 rounded-md mb-4 flex items-start gap-2">
                  <InfoIcon className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm">
                      Todos os eventos listados abaixo serão enviados automaticamente tanto via Pixel Web quanto via Conversions API (servidor). 
                      Isso garante maior precisão e confiabilidade dos dados enviados para o Meta.
                    </p>
                  </div>
                </div>
                
                <div className="mt-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">
                          <Checkbox id="select-all" />
                        </TableHead>
                        <TableHead>Evento</TableHead>
                        <TableHead>Código</TableHead>
                        <TableHead>Categoria</TableHead>
                        <TableHead className="w-24">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredEvents.map((evento) => (
                        <TableRow key={evento.id}>
                          <TableCell>
                            <Checkbox id={`select-${evento.id}`} defaultChecked={evento.padrao} />
                          </TableCell>
                          <TableCell>{evento.nome}</TableCell>
                          <TableCell className="font-mono text-xs">{evento.id}</TableCell>
                          <TableCell className="capitalize">{evento.categoria}</TableCell>
                          <TableCell>
                            {evento.padrao ? (
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                Ativo
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-gray-50 text-gray-500 border-gray-200">
                                Opcional
                              </Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                
                <div className="mt-6 flex justify-end">
                  <Button>Salvar Configurações de Eventos</Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="parametros">
              <div className="bg-card rounded-lg border shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Parâmetros de Advanced Matching</h2>
                <p className="text-muted-foreground mb-6">
                  Configure quais parâmetros avançados serão enviados junto com seus eventos. 
                  Quanto mais parâmetros enviados, maior a qualidade dos seus eventos e melhores resultados na otimização de campanhas.
                </p>
                
                <div className="bg-muted p-4 rounded-md mb-6 flex items-start gap-2">
                  <InfoIcon className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium mb-1">Sobre a conversão de endereços IP</p>
                    <p className="text-sm">
                      O sistema converterá automaticamente endereços IPv4 para IPv6 antes do envio para o Meta, 
                      melhorando a compatibilidade com o Pixel. Todos os dados que requerem hash serão tratados 
                      automaticamente antes do envio.
                    </p>
                  </div>
                </div>
                
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox id="select-all-params" defaultChecked />
                      </TableHead>
                      <TableHead>Parâmetro</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Hashing</TableHead>
                      <TableHead className="w-24">Importância</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {parametrosAvancados.map((param) => (
                      <TableRow key={param.id}>
                        <TableCell>
                          <Checkbox id={`select-param-${param.id}`} defaultChecked />
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{param.nome}</div>
                          <div className="text-xs font-mono text-muted-foreground">{param.id}</div>
                        </TableCell>
                        <TableCell>{param.descricao}</TableCell>
                        <TableCell>
                          {param.hashing === "obrigatório" ? (
                            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                              Obrigatório
                            </Badge>
                          ) : param.hashing === "recomendado" ? (
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                              Recomendado
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-gray-50 text-gray-500 border-gray-200">
                              Não Necessário
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {param.importante ? (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              Alta
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-gray-50 text-gray-500 border-gray-200">
                              Média
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                <div className="mt-6 flex justify-end">
                  <Button>Salvar Configurações de Parâmetros</Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="md:w-1/3">
          <div className="bg-card rounded-lg border shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Log de Eventos</h2>
            <div className="relative mb-4">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar eventos..." className="pl-8" />
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
                        via {i % 2 === 0 ? "API Servidor" : "Pixel Web"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs">há {i * 5} minutos</p>
                      <p className="text-xs text-muted-foreground">ID: {123456 + i}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <Button variant="link" className="mt-2 px-0">Ver Todos os Eventos</Button>
            
            <div className="mt-6 border-t pt-4">
              <h3 className="text-md font-semibold mb-3">Diagnóstico de Qualidade</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Qualidade dos eventos:</span>
                  <span className="font-medium text-green-600">Excelente</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Parâmetros avançados:</span>
                  <span className="font-medium text-green-600">25/25</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Eventos configurados:</span>
                  <span className="font-medium text-amber-600">24/24</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Conversão IPv4 para IPv6:</span>
                  <span className="font-medium text-green-600">Ativo</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Events;
