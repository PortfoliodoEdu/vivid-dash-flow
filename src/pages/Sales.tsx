import { ExpandableChart } from "@/components/ExpandableChart";
import { FilterBadges } from "@/components/FilterBadges";
import { CustomTooltip } from "@/components/CustomTooltip";
import { AccountSelector } from "@/components/AccountSelector";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from "recharts";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Target, Users, Award, Phone, MessageCircle, TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const vendedoresPerformance = [
  { 
    vendedor: "Carlos Silva", 
    oportunidadesConvertidas: 28, 
    metaVendas: 25, 
    conversao: 18.5, 
    ticket: 3200, 
    comissao: 22400,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos",
    ligacoes: 145,
    whatsapp: 89,
    contatosNecessarios: 8.3,
    pipeline: 42
  },
  { 
    vendedor: "Ana Santos", 
    oportunidadesConvertidas: 32, 
    metaVendas: 30, 
    conversao: 21.2, 
    ticket: 3800, 
    comissao: 30400,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ana",
    ligacoes: 134,
    whatsapp: 112,
    contatosNecessarios: 7.7,
    pipeline: 38
  },
  { 
    vendedor: "Pedro Costa", 
    oportunidadesConvertidas: 24, 
    metaVendas: 25, 
    conversao: 16.8, 
    ticket: 2900, 
    comissao: 17400,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Pedro",
    ligacoes: 167,
    whatsapp: 78,
    contatosNecessarios: 10.2,
    pipeline: 51
  },
  { 
    vendedor: "Mariana Lima", 
    oportunidadesConvertidas: 35, 
    metaVendas: 30, 
    conversao: 23.4, 
    ticket: 4100, 
    comissao: 35875,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mariana",
    ligacoes: 112,
    whatsapp: 98,
    contatosNecessarios: 6.0,
    pipeline: 35
  },
  { 
    vendedor: "João Oliveira", 
    oportunidadesConvertidas: 29, 
    metaVendas: 25, 
    conversao: 19.3, 
    ticket: 3400, 
    comissao: 24650,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Joao",
    ligacoes: 156,
    whatsapp: 67,
    contatosNecessarios: 7.7,
    pipeline: 45
  },
];

const pipelineData = [
  { estagio: "Prospecção", quantidade: 245, valor: 784000 },
  { estagio: "Qualificação", quantidade: 142, valor: 512000 },
  { estagio: "Proposta", quantidade: 89, valor: 356000 },
  { estagio: "Negociação", quantidade: 54, valor: 248000 },
  { estagio: "Fechamento", quantidade: 28, valor: 134000 },
];

const vendasPorServico = [
  { servico: "Contabilidade", vendas: 45, valor: 162000, margem: 28 },
  { servico: "BPO Estratégico", vendas: 32, valor: 128000, margem: 35 },
  { servico: "BPO RH", vendas: 28, valor: 84000, margem: 32 },
  { servico: "ClickOn", vendas: 18, valor: 54000, margem: 42 },
  { servico: "Certificado Digital", vendas: 56, valor: 44800, margem: 18 },
];

const vendasPorProduto = [
  { produto: "Contab. Simples Nacional", vendas: 28, valor: 56000 },
  { produto: "Contab. Lucro Presumido", vendas: 12, valor: 72000 },
  { produto: "Contab. Lucro Real", vendas: 5, valor: 34000 },
  { produto: "BPO Financeiro Completo", vendas: 18, valor: 86400 },
  { produto: "Folha de Pagamento", vendas: 22, valor: 52800 },
  { produto: "ClickOn Pro", vendas: 14, valor: 42000 },
  { produto: "e-CNPJ A3", vendas: 34, valor: 27200 },
];

const metasTime = [
  { month: "Jan", meta: 120, realizado: 118 },
  { month: "Fev", meta: 125, realizado: 132 },
  { month: "Mar", meta: 130, realizado: 127 },
  { month: "Abr", meta: 135, realizado: 145 },
  { month: "Mai", meta: 140, realizado: 138 },
  { month: "Jun", meta: 145, realizado: 152 },
];

export default function Sales() {
  const totalVendas = vendedoresPerformance.reduce((acc, curr) => acc + curr.oportunidadesConvertidas, 0);
  const totalMeta = vendedoresPerformance.reduce((acc, curr) => acc + curr.metaVendas, 0);
  const atingimentoMeta = ((totalVendas / totalMeta) * 100).toFixed(1);
  const conversaoMedia = (vendedoresPerformance.reduce((acc, curr) => acc + curr.conversao, 0) / vendedoresPerformance.length).toFixed(1);
  const ticketMedio = Math.round(vendedoresPerformance.reduce((acc, curr) => acc + curr.ticket, 0) / vendedoresPerformance.length);
  const totalLigacoes = vendedoresPerformance.reduce((acc, curr) => acc + curr.ligacoes, 0);
  const totalWhatsapp = vendedoresPerformance.reduce((acc, curr) => acc + curr.whatsapp, 0);
  const contatosMediosPorVenda = ((totalLigacoes + totalWhatsapp) / totalVendas).toFixed(1);

  const handleVendedorClick = (data: any) => {
    if (data && data.activeLabel) {
      toast.info(`Vendedor: ${data.activeLabel}`);
    }
  };

  // Calcular contatos necessários para bater meta
  const vendasRestantes = totalMeta - totalVendas;
  const contatosNecessariosParaMeta = vendasRestantes > 0 
    ? Math.ceil(vendasRestantes * parseFloat(contatosMediosPorVenda))
    : 0;

  return (
    <div className="p-8 space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Comercial & Vendas</h1>
          <p className="text-muted-foreground">Performance individual e oportunidades convertidas do time comercial</p>
        </div>
        <AccountSelector />
      </div>

      <FilterBadges />

      {/* KPIs do Time */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-5 gradient-card border-border shadow-soft hover:shadow-hover transition-all">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-muted-foreground break-words">Oportunidades Convertidas</h3>
            <Target className="h-5 w-5 text-primary flex-shrink-0" />
          </div>
          <p className="text-3xl font-bold text-foreground">{totalVendas}</p>
          <p className="text-xs text-success mt-2 break-words">Meta: {totalMeta} ({atingimentoMeta}%)</p>
        </Card>

        <Card className="p-5 gradient-card border-border shadow-soft hover:shadow-hover transition-all">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-muted-foreground break-words">Taxa de Conversão</h3>
            <TrendingUp className="h-5 w-5 text-success flex-shrink-0" />
          </div>
          <p className="text-3xl font-bold text-success">{conversaoMedia}%</p>
          <p className="text-xs text-muted-foreground mt-2">Média do time</p>
        </Card>

        <Card className="p-5 gradient-card border-border shadow-soft hover:shadow-hover transition-all">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-muted-foreground break-words">Contatos por Venda</h3>
            <MessageCircle className="h-5 w-5 text-primary flex-shrink-0" />
          </div>
          <p className="text-3xl font-bold text-foreground">{contatosMediosPorVenda}</p>
          <p className="text-xs text-muted-foreground mt-2">{totalLigacoes} ligações + {totalWhatsapp} WhatsApp</p>
        </Card>

        <Card className="p-5 gradient-card border-border shadow-soft hover:shadow-hover transition-all">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-muted-foreground break-words">Pipeline Total</h3>
            <Users className="h-5 w-5 text-primary flex-shrink-0" />
          </div>
          <p className="text-3xl font-bold text-primary">R$ 2.03M</p>
          <p className="text-xs text-muted-foreground mt-2">558 oportunidades</p>
        </Card>
      </div>

      {/* Indicador de Contatos Necessários */}
      {vendasRestantes > 0 && (
        <Card className="p-6 gradient-card border-border shadow-soft bg-primary/5">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <Phone className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Projeção para Atingir Meta</h3>
              <p className="text-muted-foreground">
                Para atingir a meta de <strong>{totalMeta}</strong> vendas, faltam <strong>{vendasRestantes}</strong> conversões.
                Com base na média de <strong>{contatosMediosPorVenda}</strong> contatos por venda, 
                serão necessários aproximadamente <strong>{contatosNecessariosParaMeta}</strong> contatos adicionais (ligações + WhatsApp).
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Detalhamento por Vendedor - Mais Intuitivo */}
      <Card className="p-6 gradient-card border-border shadow-soft">
        <h3 className="text-lg font-semibold text-foreground mb-6">Detalhamento por Vendedor - Performance Individual</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-2 text-muted-foreground font-medium">Vendedor</th>
                <th className="text-center py-3 px-2 text-muted-foreground font-medium">Meta vs Realizado</th>
                <th className="text-center py-3 px-2 text-muted-foreground font-medium">Contatos</th>
                <th className="text-center py-3 px-2 text-muted-foreground font-medium">Contatos/Venda</th>
                <th className="text-center py-3 px-2 text-muted-foreground font-medium">Conversão</th>
                <th className="text-right py-3 px-2 text-muted-foreground font-medium">Atingimento</th>
              </tr>
            </thead>
            <tbody>
              {vendedoresPerformance.map((vendedor) => {
                const atingimento = ((vendedor.oportunidadesConvertidas / vendedor.metaVendas) * 100);
                const totalContatos = vendedor.ligacoes + vendedor.whatsapp;
                return (
                  <tr key={vendedor.vendedor} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                    <td className="py-4 px-2">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border-2 border-primary/20">
                          <AvatarImage src={vendedor.avatar} alt={vendedor.vendedor} />
                          <AvatarFallback>{vendedor.vendedor.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-foreground">{vendedor.vendedor}</p>
                          <p className="text-xs text-muted-foreground">
                            Ticket: R$ {vendedor.ticket.toLocaleString("pt-BR")}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-2">
                      <div className="flex flex-col items-center">
                        <span className="text-sm font-medium text-foreground">
                          {vendedor.oportunidadesConvertidas} / {vendedor.metaVendas}
                        </span>
                        <Progress value={atingimento} className="h-2 w-24 mt-1" />
                      </div>
                    </td>
                    <td className="py-4 px-2">
                      <div className="flex items-center justify-center gap-2">
                        <div className="flex items-center gap-1 text-xs">
                          <Phone className="h-3 w-3 text-muted-foreground" />
                          <span>{vendedor.ligacoes}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs">
                          <MessageCircle className="h-3 w-3 text-success" />
                          <span>{vendedor.whatsapp}</span>
                        </div>
                      </div>
                    </td>
                    <td className="text-center py-4 px-2">
                      <span className={`text-sm font-medium ${vendedor.contatosNecessarios <= 7 ? 'text-success' : vendedor.contatosNecessarios <= 9 ? 'text-warning' : 'text-destructive'}`}>
                        {vendedor.contatosNecessarios.toFixed(1)}
                      </span>
                    </td>
                    <td className="text-center py-4 px-2">
                      <span className="text-sm font-medium text-primary">{vendedor.conversao}%</span>
                    </td>
                    <td className="text-right py-4 px-2">
                      <span className={`text-lg font-bold ${atingimento >= 100 ? 'text-success' : atingimento >= 80 ? 'text-warning' : 'text-destructive'}`}>
                        {atingimento.toFixed(0)}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ExpandableChart 
          title="Ranking de Vendedores - Oportunidades Convertidas"
          description="Compara o desempenho de conversão de cada vendedor contra suas metas individuais de quantidade de vendas. Verde indica vendas realizadas, azul mostra a meta estabelecida."
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={vendedoresPerformance} onClick={handleVendedorClick} layout="vertical">
              <defs>
                <linearGradient id="gradVendas" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="hsl(142 76% 36%)" stopOpacity={1} />
                  <stop offset="100%" stopColor="hsl(142 76% 50%)" stopOpacity={0.8} />
                </linearGradient>
                <linearGradient id="gradMeta" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="hsl(217 91% 60%)" stopOpacity={1} />
                  <stop offset="100%" stopColor="hsl(217 91% 70%)" stopOpacity={0.8} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
              <YAxis dataKey="vendedor" type="category" stroke="hsl(var(--muted-foreground))" width={120} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="oportunidadesConvertidas" fill="url(#gradVendas)" name="Convertidas" cursor="pointer" radius={[0, 8, 8, 0]} />
              <Bar dataKey="metaVendas" fill="url(#gradMeta)" name="Meta" cursor="pointer" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ExpandableChart>

        <ExpandableChart 
          title="Ações por Vendedor (Ligações + WhatsApp)"
          description="Total de ações de contato realizadas por cada vendedor, separando ligações telefônicas e mensagens de WhatsApp. Quanto mais eficiente o vendedor, menos contatos precisa para converter."
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={vendedoresPerformance} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
              <YAxis dataKey="vendedor" type="category" stroke="hsl(var(--muted-foreground))" width={120} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="ligacoes" fill="hsl(217 91% 60%)" name="Ligações" stackId="a" cursor="pointer" />
              <Bar dataKey="whatsapp" fill="hsl(142 76% 36%)" name="WhatsApp" stackId="a" cursor="pointer" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ExpandableChart>

        <ExpandableChart 
          title="Meta do Time vs Realizado (Quantidade)"
          description="Evolução mensal das metas do time comercial em quantidade de vendas (linha tracejada) comparada com o resultado real alcançado (linha sólida)."
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={metasTime}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="meta"
                stroke="hsl(217 91% 60%)"
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Meta (Qtd)"
                dot={{ fill: "hsl(217 91% 60%)", r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="realizado"
                stroke="hsl(142 76% 36%)"
                strokeWidth={3}
                name="Realizado (Qtd)"
                cursor="pointer"
                dot={{ fill: "hsl(142 76% 36%)", r: 6, strokeWidth: 2, stroke: "#fff" }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ExpandableChart>

        <ExpandableChart 
          title="Pipeline por Estágio do Funil"
          description="Funil de vendas mostrando quantidade de oportunidades em cada etapa do processo comercial, da prospecção ao fechamento."
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={pipelineData}>
              <defs>
                <linearGradient id="gradPipeline" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(217 91% 60%)" stopOpacity={1} />
                  <stop offset="100%" stopColor="hsl(217 91% 70%)" stopOpacity={0.7} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis dataKey="estagio" stroke="hsl(var(--muted-foreground))" angle={-15} textAnchor="end" height={80} />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="quantidade" fill="url(#gradPipeline)" name="Oportunidades" cursor="pointer" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ExpandableChart>

        <ExpandableChart 
          title="Vendas por Linha de Serviço"
          description="Distribuição de vendas entre as diferentes linhas de serviço do Grupo FN, permitindo identificar produtos mais vendidos."
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={vendasPorServico}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis dataKey="servico" stroke="hsl(var(--muted-foreground))" angle={-15} textAnchor="end" height={80} />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="vendas" fill="hsl(217 91% 60%)" name="Quantidade" cursor="pointer" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ExpandableChart>

        <ExpandableChart 
          title="Vendas por Linha de Produto"
          description="Detalhamento de vendas por produto específico dentro de cada linha de serviço, mostrando quantidade e valor de cada produto."
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={vendasPorProduto} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
              <YAxis dataKey="produto" type="category" stroke="hsl(var(--muted-foreground))" width={160} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="vendas" fill="hsl(142 76% 36%)" name="Quantidade" cursor="pointer" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ExpandableChart>
      </div>
    </div>
  );
}
