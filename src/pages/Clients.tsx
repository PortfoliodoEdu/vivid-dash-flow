import { useState } from "react";
import { ExpandableChart } from "@/components/ExpandableChart";
import { FilterBadges } from "@/components/FilterBadges";
import { CustomTooltip } from "@/components/CustomTooltip";
import { AccountSelector } from "@/components/AccountSelector";
import DataUploader from "@/components/DataUploader";
import { useData } from "@/contexts/DataContext";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend, PieChart, Pie, Cell } from "recharts";
import { Users, UserPlus, UserX, Award, ChevronDown, ChevronUp } from "lucide-react";

const baseClientesData = [
  { month: "Jan", ativos: 1482, novos: 45, perdidos: 8, reativados: 3 },
  { month: "Fev", ativos: 1519, novos: 42, perdidos: 5, reativados: 4 },
  { month: "Mar", ativos: 1556, novos: 39, perdidos: 7, reativados: 2 },
  { month: "Abr", ativos: 1588, novos: 48, perdidos: 6, reativados: 5 },
  { month: "Mai", ativos: 1625, novos: 43, perdidos: 4, reativados: 3 },
  { month: "Jun", ativos: 1542, novos: 52, perdidos: 6, reativados: 7 },
];

const clientesPorServico = [
  { 
    servico: "Contabilidade", 
    clientes: 856, 
    percentual: 55.5,
    produtos: [
      { nome: "Contabilidade Simples Nacional", clientes: 412 },
      { nome: "Contabilidade Lucro Presumido", clientes: 298 },
      { nome: "Contabilidade Lucro Real", clientes: 146 },
    ]
  },
  { 
    servico: "BPO Estratégico", 
    clientes: 342, 
    percentual: 22.2,
    produtos: [
      { nome: "BPO Financeiro Completo", clientes: 156 },
      { nome: "BPO Controladoria", clientes: 98 },
      { nome: "BPO Fiscal", clientes: 88 },
    ]
  },
  { 
    servico: "BPO RH", 
    clientes: 289, 
    percentual: 18.7,
    produtos: [
      { nome: "Folha de Pagamento", clientes: 189 },
      { nome: "Gestão de Benefícios", clientes: 67 },
      { nome: "Recrutamento", clientes: 33 },
    ]
  },
  { 
    servico: "ClickOn", 
    clientes: 178, 
    percentual: 11.5,
    produtos: [
      { nome: "ClickOn Basic", clientes: 89 },
      { nome: "ClickOn Pro", clientes: 56 },
      { nome: "ClickOn Enterprise", clientes: 33 },
    ]
  },
  { 
    servico: "Certificado Digital", 
    clientes: 445, 
    percentual: 28.9,
    produtos: [
      { nome: "e-CPF A1", clientes: 156 },
      { nome: "e-CPF A3", clientes: 123 },
      { nome: "e-CNPJ A1", clientes: 98 },
      { nome: "e-CNPJ A3", clientes: 68 },
    ]
  },
  { 
    servico: "FN EUA", 
    clientes: 67, 
    percentual: 4.3,
    produtos: [
      { nome: "LLC Formation", clientes: 34 },
      { nome: "Bookkeeping USA", clientes: 23 },
      { nome: "Tax Filing", clientes: 10 },
    ]
  },
];

const regimesTributarios = [
  { regime: "Simples Nacional", clientes: 892, faturamentoMedio: 180000, percentual: 57.8 },
  { regime: "Lucro Presumido", clientes: 412, faturamentoMedio: 850000, percentual: 26.7 },
  { regime: "Lucro Real", clientes: 156, faturamentoMedio: 4500000, percentual: 10.1 },
  { regime: "MEI", clientes: 82, faturamentoMedio: 65000, percentual: 5.3 },
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
  const [expandedServicos, setExpandedServicos] = useState<string[]>([]);
  const { getData } = useData();
  const [refreshKey, setRefreshKey] = useState(0);

  const toggleServico = (servico: string) => {
    setExpandedServicos(prev => 
      prev.includes(servico) 
        ? prev.filter(s => s !== servico)
        : [...prev, servico]
    );
  };

  const clientesAtuais = baseClientesData[baseClientesData.length - 1].ativos;
  const churnRate = 0.67;
  const npsAtual = npsData[npsData.length - 1].nps;

  return (
    <div className="p-8 space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Clientes & Retenção</h1>
          <p className="text-muted-foreground">Análise completa da base de clientes do Grupo FN</p>
        </div>
        <div className="flex items-center gap-3">
          <DataUploader pageId="clients" onDataUpdated={() => setRefreshKey(k => k + 1)} />
          <AccountSelector />
        </div>
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
        <ExpandableChart 
          title="Evolução da Base de Clientes"
          description="Acompanha o crescimento total de clientes ativos ao longo do tempo. Meta: manter 1.500+ clientes ativos."
        >
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
        </ExpandableChart>

        <ExpandableChart 
          title="Movimentação Mensal de Clientes"
          description="Detalha a dinâmica da base: novos clientes conquistados, reativações de antigos clientes e perdas (churn)."
        >
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
        </ExpandableChart>

        {/* Clientes por Serviço com Drill-down */}
        <Card className="p-6 gradient-card border-border shadow-soft lg:col-span-2">
          <h3 className="text-lg font-semibold text-foreground mb-6">Clientes por Serviço (clique para ver produtos)</h3>
          <div className="space-y-3">
            {clientesPorServico.map((item) => {
              const isExpanded = expandedServicos.includes(item.servico);
              return (
                <div key={item.servico} className="space-y-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-between p-4 h-auto hover:bg-muted/50"
                    onClick={() => toggleServico(item.servico)}
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <span className="font-medium text-foreground min-w-[160px] text-left">{item.servico}</span>
                      <div className="flex-1 max-w-md">
                        <Progress value={item.percentual} className="h-3" />
                      </div>
                      <span className="text-sm text-muted-foreground min-w-[120px] text-right">
                        {item.clientes} clientes ({item.percentual}%)
                      </span>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4 text-muted-foreground ml-2" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground ml-2" />
                    )}
                  </Button>
                  
                  {isExpanded && (
                    <div className="ml-8 pl-4 border-l-2 border-primary/20 space-y-2 animate-fade-in">
                      {item.produtos.map((produto) => (
                        <div 
                          key={produto.nome} 
                          className="flex items-center justify-between py-2 px-4 bg-muted/30 rounded-lg"
                        >
                          <span className="text-sm text-foreground">{produto.nome}</span>
                          <span className="text-sm font-medium text-primary">{produto.clientes} clientes</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        <ExpandableChart 
          title="Cross-sell: Clientes com Múltiplos Serviços"
          description="Mostra quantos serviços cada cliente contrata em média. Clientes com mais serviços têm maior valor (LTV) e menor taxa de churn."
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={multiServicos}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={({ name, percentual }) => `${percentual}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                cursor="pointer"
              >
                {multiServicos.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend 
                verticalAlign="bottom" 
                height={36}
                formatter={(value, entry: any) => `${value} (${entry.payload.value} clientes)`}
              />
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </ExpandableChart>

        <ExpandableChart 
          title="Evolução do NPS (Net Promoter Score)"
          description="NPS mede a satisfação e lealdade dos clientes (0-100). Scores 75+ indicam zona de excelência com alto nível de recomendação."
        >
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
        </ExpandableChart>

        {/* Regimes Tributários vs Faturamento */}
        <Card className="p-6 gradient-card border-border shadow-soft">
          <h3 className="text-lg font-semibold text-foreground mb-6">Regimes Tributários vs Faturamento</h3>
          <div className="space-y-6">
            {regimesTributarios.map((regime) => (
              <div key={regime.regime} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-foreground font-medium">{regime.regime}</span>
                  <span className="text-muted-foreground">
                    {regime.clientes} ({regime.percentual}%)
                  </span>
                </div>
                <Progress value={regime.percentual} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  Faturamento médio: R$ {(regime.faturamentoMedio / 1000).toLocaleString("pt-BR")}K/ano
                </p>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground">
              <strong>Insight:</strong> Clientes de Lucro Real representam apenas 10% da base mas possuem 
              faturamento médio 25x maior que Simples Nacional - potencial para upsell de serviços premium.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
