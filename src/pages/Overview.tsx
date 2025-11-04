import { DollarSign, TrendingUp, TrendingDown, Percent, Users, ShoppingCart } from "lucide-react";
import { KPICard } from "@/components/KPICard";
import { ChartCard } from "@/components/ChartCard";
import { FilterBadges } from "@/components/FilterBadges";
import { CustomTooltip } from "@/components/CustomTooltip";
import { useFilters } from "@/contexts/FilterContext";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, Legend } from "recharts";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";

const allRevenueData = [
  { month: "Jan", receita: 450000, lucro: 67500, margem: 15 },
  { month: "Fev", receita: 520000, lucro: 83200, margem: 16 },
  { month: "Mar", receita: 480000, lucro: 67200, margem: 14 },
  { month: "Abr", receita: 610000, lucro: 103700, margem: 17 },
  { month: "Mai", receita: 550000, lucro: 82500, margem: 15 },
  { month: "Jun", receita: 670000, lucro: 120600, margem: 18 },
];

const kpiMetrics = [
  { 
    label: "LTV (Lifetime Value)", 
    value: "R$ 12.450", 
    previous: "R$ 11.200",
    change: 11.2,
    period: "vs mês anterior"
  },
  { 
    label: "CAC (Custo Aquisição)", 
    value: "R$ 2.850", 
    previous: "R$ 3.100",
    change: -8.1,
    period: "vs mês anterior"
  },
  { 
    label: "LTV/CAC Ratio", 
    value: "4.37x", 
    previous: "3.61x",
    change: 21.1,
    period: "Ideal: > 3.0x"
  },
  { 
    label: "Ticket Médio", 
    value: "R$ 458", 
    previous: "R$ 425",
    change: 7.8,
    period: "vs mês anterior"
  },
];

export default function Overview() {
  const { filters, setFilter } = useFilters();

  const revenueData = filters.month
    ? allRevenueData.filter((d) => d.month === filters.month)
    : allRevenueData;

  const handleRevenueClick = (data: any) => {
    if (data && data.activeLabel) {
      setFilter("month", filters.month === data.activeLabel ? undefined : data.activeLabel);
      toast.success(
        filters.month === data.activeLabel
          ? "Filtro removido"
          : `Filtrado por: ${data.activeLabel}`
      );
    }
  };

  const totalReceita = revenueData.reduce((acc, curr) => acc + curr.receita, 0);
  const totalLucro = revenueData.reduce((acc, curr) => acc + curr.lucro, 0);
  const margemMedia = ((totalLucro / totalReceita) * 100).toFixed(1);

  return (
    <div className="p-8 space-y-8 animate-fade-in">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Visão Executiva</h1>
        <p className="text-muted-foreground">Principais indicadores financeiros e operacionais</p>
      </div>

      <FilterBadges />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Receita Total"
          value={`R$ ${(totalReceita / 1000).toFixed(0)}K`}
          change={12.5}
          icon={DollarSign}
          delay={100}
        />
        <KPICard
          title="Lucro Líquido"
          value={`R$ ${(totalLucro / 1000).toFixed(0)}K`}
          change={18.3}
          icon={TrendingUp}
          delay={200}
        />
        <KPICard
          title="Margem Líquida"
          value={`${margemMedia}%`}
          change={2.1}
          icon={Percent}
          delay={300}
        />
        <KPICard
          title="Clientes Ativos"
          value="2.845"
          change={8.2}
          icon={Users}
          delay={400}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpiMetrics.map((metric, index) => (
          <Card
            key={metric.label}
            className="p-5 gradient-card border-border shadow-soft hover:shadow-hover transition-all duration-300 animate-slide-up"
            style={{ animationDelay: `${500 + index * 100}ms` }}
          >
            <h3 className="text-xs font-medium text-muted-foreground mb-3">{metric.label}</h3>
            <div className="flex items-end justify-between mb-2">
              <p className="text-2xl font-bold text-foreground">{metric.value}</p>
              <div
                className={`flex items-center text-xs font-medium ${
                  metric.change >= 0 ? "text-success" : "text-destructive"
                }`}
              >
                {metric.change >= 0 ? (
                  <TrendingUp className="h-3 w-3 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 mr-1" />
                )}
                {Math.abs(metric.change)}%
              </div>
            </div>
            <p className="text-xs text-muted-foreground">{metric.previous}</p>
            <p className="text-xs text-muted-foreground mt-1">{metric.period}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Receita & Lucro Mensal" delay={900}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueData} onClick={handleRevenueClick}>
              <defs>
                <linearGradient id="colorReceita" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(217 91% 60%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(217 91% 60%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorLucro" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(142 76% 36%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(142 76% 36%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip content={<CustomTooltip valuePrefix="R$ " />} />
              <Legend />
              <Area
                type="monotone"
                dataKey="receita"
                stroke="hsl(217 91% 60%)"
                strokeWidth={2}
                fill="url(#colorReceita)"
                name="Receita"
                cursor="pointer"
              />
              <Area
                type="monotone"
                dataKey="lucro"
                stroke="hsl(142 76% 36%)"
                strokeWidth={2}
                fill="url(#colorLucro)"
                name="Lucro"
                cursor="pointer"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Evolução da Margem (%)" delay={1000}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revenueData} onClick={handleRevenueClick}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" domain={[0, 20]} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="margem"
                stroke="hsl(142 76% 36%)"
                strokeWidth={3}
                name="Margem %"
                cursor="pointer"
                dot={{ fill: "hsl(142 76% 36%)", r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
