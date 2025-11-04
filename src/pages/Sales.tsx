import { ChartCard } from "@/components/ChartCard";
import { FilterBadges } from "@/components/FilterBadges";
import { FilterButtons } from "@/components/FilterButtons";
import { CustomTooltip } from "@/components/CustomTooltip";
import { useFilters } from "@/contexts/FilterContext";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from "recharts";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { TrendingUp, Target, Users, Award } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const vendedoresPerformance = [
  { vendedor: "Carlos Silva", vendas: 28, meta: 25, conversao: 18.5, ticket: 3200, comissao: 22400 },
  { vendedor: "Ana Santos", vendas: 32, meta: 30, conversao: 21.2, ticket: 3800, comissao: 30400 },
  { vendedor: "Pedro Costa", vendas: 24, meta: 25, conversao: 16.8, ticket: 2900, comissao: 17400 },
  { vendedor: "Mariana Lima", vendas: 35, meta: 30, conversao: 23.4, ticket: 4100, comissao: 35875 },
  { vendedor: "João Oliveira", vendas: 29, meta: 25, conversao: 19.3, ticket: 3400, comissao: 24650 },
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

const metasTime = [
  { month: "Jan", meta: 120, realizado: 118 },
  { month: "Fev", meta: 125, realizado: 132 },
  { month: "Mar", meta: 130, realizado: 127 },
  { month: "Abr", meta: 135, realizado: 145 },
  { month: "Mai", meta: 140, realizado: 138 },
  { month: "Jun", meta: 145, realizado: 152 },
];

export default function Sales() {
  const { filters, setFilter } = useFilters();

  const totalVendas = vendedoresPerformance.reduce((acc, curr) => acc + curr.vendas, 0);
  const totalMeta = vendedoresPerformance.reduce((acc, curr) => acc + curr.meta, 0);
  const atingimentoMeta = ((totalVendas / totalMeta) * 100).toFixed(1);
  const conversaoMedia = (vendedoresPerformance.reduce((acc, curr) => acc + curr.conversao, 0) / vendedoresPerformance.length).toFixed(1);
  const ticketMedio = Math.round(vendedoresPerformance.reduce((acc, curr) => acc + curr.ticket, 0) / vendedoresPerformance.length);

  const vendedorFilters = vendedoresPerformance.map(v => ({ label: v.vendedor, value: v.vendedor }));

  const handleVendedorClick = (data: any) => {
    if (data && data.activeLabel) {
      toast.info(`Vendedor: ${data.activeLabel}`);
    }
  };

  return (
    <div className="p-8 space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Comercial & Vendas</h1>
          <p className="text-muted-foreground">Performance individual e metas do time comercial</p>
        </div>
        <FilterButtons
          filters={vendedorFilters}
          currentValue={filters.region}
          onValueChange={(val) => setFilter("region", val || undefined)}
          placeholder="Filtrar vendedor"
        />
      </div>

      <FilterBadges />

      {/* KPIs do Time */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-5 gradient-card border-border shadow-soft hover:shadow-hover transition-all">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-muted-foreground break-words">Vendas do Mês</h3>
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
            <h3 className="text-sm font-medium text-muted-foreground break-words">Ticket Médio</h3>
            <Award className="h-5 w-5 text-primary flex-shrink-0" />
          </div>
          <p className="text-3xl font-bold text-foreground">R$ {ticketMedio.toLocaleString("pt-BR")}</p>
          <p className="text-xs text-muted-foreground mt-2">Por contrato</p>
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

      {/* Performance Individual */}
      <div className="grid grid-cols-1 gap-6">
        <ChartCard title="Ranking de Vendedores - Performance Individual">
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
              <Bar dataKey="vendas" fill="url(#gradVendas)" name="Realizado" cursor="pointer" radius={[0, 8, 8, 0]} />
              <Bar dataKey="meta" fill="url(#gradMeta)" name="Meta" cursor="pointer" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard title="Meta do Time vs Realizado">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={metasTime}>
                <defs>
                  <linearGradient id="gradLineMeta" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(217 91% 60%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(217 91% 60%)" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="gradLineReal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(142 76% 36%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(142 76% 36%)" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
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
                  name="Meta"
                  dot={{ fill: "hsl(217 91% 60%)", r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="realizado"
                  stroke="hsl(142 76% 36%)"
                  strokeWidth={3}
                  name="Realizado"
                  cursor="pointer"
                  dot={{ fill: "hsl(142 76% 36%)", r: 6, strokeWidth: 2, stroke: "#fff" }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Pipeline por Estágio do Funil">
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
                <Bar dataKey="quantidade" fill="url(#gradPipeline)" name="Qtd" cursor="pointer" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <ChartCard title="Vendas por Linha de Serviço">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={vendasPorServico}>
              <defs>
                <linearGradient id="gradServico" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(142 76% 36%)" stopOpacity={1} />
                  <stop offset="100%" stopColor="hsl(142 76% 50%)" stopOpacity={0.7} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis dataKey="servico" stroke="hsl(var(--muted-foreground))" angle={-15} textAnchor="end" height={80} />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip content={<CustomTooltip valuePrefix="R$ " />} />
              <Legend />
              <Bar dataKey="vendas" fill="hsl(217 91% 60%)" name="Quantidade" cursor="pointer" radius={[8, 8, 0, 0]} />
              <Bar dataKey="valor" fill="url(#gradServico)" name="Valor (R$)" cursor="pointer" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Detalhamento de Vendedores */}
      <Card className="p-6 gradient-card border-border shadow-soft">
        <h3 className="text-lg font-semibold text-foreground mb-6">Detalhamento por Vendedor</h3>
        <div className="space-y-6">
          {vendedoresPerformance.map((vendedor) => {
            const atingimento = ((vendedor.vendas / vendedor.meta) * 100).toFixed(0);
            return (
              <div key={vendedor.vendedor} className="space-y-2">
                <div className="flex justify-between items-center flex-wrap gap-2">
                  <div>
                    <p className="font-medium text-foreground">{vendedor.vendedor}</p>
                    <p className="text-xs text-muted-foreground break-words">
                      {vendedor.vendas}/{vendedor.meta} vendas • 
                      Conversão: {vendedor.conversao}% • 
                      Ticket: R$ {vendedor.ticket.toLocaleString("pt-BR")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${Number(atingimento) >= 100 ? 'text-success' : 'text-warning'}`}>
                      {atingimento}%
                    </p>
                    <p className="text-xs text-muted-foreground">
                      R$ {vendedor.comissao.toLocaleString("pt-BR")} comissão
                    </p>
                  </div>
                </div>
                <Progress value={Number(atingimento)} className="h-2" />
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
