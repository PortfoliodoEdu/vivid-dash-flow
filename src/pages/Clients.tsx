import { ChartCard } from "@/components/ChartCard";
import { FilterBadges } from "@/components/FilterBadges";
import { CustomTooltip } from "@/components/CustomTooltip";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend, PieChart, Pie, Cell } from "recharts";
import { Users, UserPlus, UserX, TrendingUp, Award } from "lucide-react";

const baseClientesData = [
  { month: "Jan", ativos: 1482, novos: 45, perdidos: 8, reativados: 3 },
  { month: "Fev", ativos: 1519, novos: 42, perdidos: 5, reativados: 4 },
  { month: "Mar", ativos: 1556, novos: 39, perdidos: 7, reativados: 2 },
  { month: "Abr", ativos: 1588, novos: 48, perdidos: 6, reativados: 5 },
  { month: "Mai", ativos: 1625, novos: 43, perdidos: 4, reativados: 3 },
  { month: "Jun", ativos: 1542, novos: 52, perdidos: 6, reativados: 7 },
];

const clientesPorServico = [
  { servico: "Contabilidade", clientes: 856, percentual: 55.5 },
  { servico: "BPO Estratégico", clientes: 342, percentual: 22.2 },
  { servico: "BPO RH", clientes: 289, percentual: 18.7 },
  { servico: "ClickOn", clientes: 178, percentual: 11.5 },
  { servico: "Certificado Digital", clientes: 445, percentual: 28.9 },
  { servico: "FN EUA", clientes: 67, percentual: 4.3 },
];

const segmentacaoTamanho = [
  { tamanho: "Pequeno", clientes: 892, percentual: 57.8 },
  { tamanho: "Médio", clientes: 512, percentual: 33.2 },
  { tamanho: "Grande", clientes: 138, percentual: 8.9 },
];

const multiServicos = [
  { name: "1 Serviço", value: 687, percentual: 44.5 },
  { name: "2 Serviços", value: 524, percentual: 34.0 },
  { name: "3+ Serviços", value: 331, percentual: 21.5 },
];

const npsData = [
  { month: "Jan", nps: 72, promotores: 65, detratores: 8 },
  { month: "Fev", nps: 74, promotores: 68, detratores: 7 },
  { month: "Mar", nps: 76, promotores: 70, detratores: 6 },
  { month: "Abr", nps: 78, promotores: 72, detratores: 6 },
  { month: "Mai", nps: 79, promotores: 73, detratores: 5 },
  { month: "Jun", nps: 81, promotores: 75, detratores: 5 },
];

const COLORS = ["hsl(217 91% 60%)", "hsl(142 76% 36%)", "hsl(38 92% 50%)"];

export default function Clients() {
  const clientesAtuais = baseClientesData[baseClientesData.length - 1].ativos;
  const churnRate = 0.67;
  const npsAtual = npsData[npsData.length - 1].nps;

  return (
    <div className="p-8 space-y-8 animate-fade-in">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Clientes & Retenção</h1>
        <p className="text-muted-foreground">Análise completa da base de clientes do Grupo FN</p>
      </div>

      <FilterBadges />

      {/* KPIs Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-5 gradient-card border-border shadow-soft">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-muted-foreground">Clientes Ativos</h3>
            <Users className="h-5 w-5 text-primary" />
          </div>
          <p className="text-3xl font-bold text-foreground">{clientesAtuais.toLocaleString("pt-BR")}</p>
          <p className="text-xs text-success mt-2">Meta: 1.500+ (✓ Atingido)</p>
        </Card>

        <Card className="p-5 gradient-card border-border shadow-soft">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-muted-foreground">Churn Rate</h3>
            <UserX className="h-5 w-5 text-success" />
          </div>
          <p className="text-3xl font-bold text-success">{churnRate}%</p>
          <p className="text-xs text-muted-foreground mt-2">Meta: &lt; 2% (✓ Excelente)</p>
        </Card>

        <Card className="p-5 gradient-card border-border shadow-soft">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-muted-foreground">NPS Score</h3>
            <Award className="h-5 w-5 text-primary" />
          </div>
          <p className="text-3xl font-bold text-primary">{npsAtual}</p>
          <p className="text-xs text-success mt-2">Zona de Excelência (75+)</p>
        </Card>

        <Card className="p-5 gradient-card border-border shadow-soft">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-muted-foreground">Novos (Mês)</h3>
            <UserPlus className="h-5 w-5 text-success" />
          </div>
          <p className="text-3xl font-bold text-success">+52</p>
          <p className="text-xs text-muted-foreground mt-2">vs 43 mês anterior</p>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Evolução da Base de Clientes">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={baseClientesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" domain={[1400, 1650]} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="ativos"
                stroke="hsl(217 91% 60%)"
                strokeWidth={3}
                name="Clientes Ativos"
                cursor="pointer"
                dot={{ fill: "hsl(217 91% 60%)", r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Movimentação Mensal de Clientes">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={baseClientesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="novos" fill="hsl(142 76% 36%)" name="Novos" cursor="pointer" />
              <Bar dataKey="reativados" fill="hsl(217 91% 60%)" name="Reativados" cursor="pointer" />
              <Bar dataKey="perdidos" fill="hsl(0 84% 60%)" name="Perdidos" cursor="pointer" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Clientes por Serviço">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={clientesPorServico} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
              <YAxis dataKey="servico" type="category" stroke="hsl(var(--muted-foreground))" width={120} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="clientes" fill="hsl(217 91% 60%)" name="Clientes" cursor="pointer" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Cross-sell: Clientes com Múltiplos Serviços">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={multiServicos}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percentual }) => `${name}: ${percentual}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                cursor="pointer"
              >
                {multiServicos.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Evolução do NPS (Net Promoter Score)">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={npsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" domain={[0, 100]} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="nps"
                stroke="hsl(142 76% 36%)"
                strokeWidth={3}
                name="NPS"
                cursor="pointer"
                dot={{ fill: "hsl(142 76% 36%)", r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <Card className="p-6 gradient-card border-border shadow-soft">
          <h3 className="text-lg font-semibold text-foreground mb-6">Segmentação por Tamanho</h3>
          <div className="space-y-6">
            {segmentacaoTamanho.map((seg) => (
              <div key={seg.tamanho} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-foreground font-medium">{seg.tamanho}</span>
                  <span className="text-muted-foreground">
                    {seg.clientes} ({seg.percentual}%)
                  </span>
                </div>
                <Progress value={seg.percentual} className="h-2" />
              </div>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground">
              <strong>Oportunidade:</strong> {multiServicos[0].value} clientes ({multiServicos[0].percentual}%) 
              usam apenas 1 serviço - potencial para cross-sell
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
