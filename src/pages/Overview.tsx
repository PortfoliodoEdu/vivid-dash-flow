import { DollarSign, Users, TrendingUp, ShoppingCart } from "lucide-react";
import { KPICard } from "@/components/KPICard";
import { ChartCard } from "@/components/ChartCard";
import { FilterBadges } from "@/components/FilterBadges";
import { CustomTooltip } from "@/components/CustomTooltip";
import { useFilters } from "@/contexts/FilterContext";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { toast } from "sonner";

const allRevenueData = [
  { month: "Jan", value: 45000 },
  { month: "Fev", value: 52000 },
  { month: "Mar", value: 48000 },
  { month: "Abr", value: 61000 },
  { month: "Mai", value: 55000 },
  { month: "Jun", value: 67000 },
];

const allSalesData = [
  { category: "Produto A", value: 4000 },
  { category: "Produto B", value: 3000 },
  { category: "Produto C", value: 2000 },
  { category: "Produto D", value: 2780 },
  { category: "Produto E", value: 1890 },
];

export default function Overview() {
  const { filters, setFilter } = useFilters();

  const revenueData = filters.month
    ? allRevenueData.filter((d) => d.month === filters.month)
    : allRevenueData;

  const salesData = filters.category
    ? allSalesData.filter((d) => d.category === filters.category)
    : allSalesData;

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

  const handleSalesClick = (data: any) => {
    if (data && data.activeLabel) {
      setFilter("category", filters.category === data.activeLabel ? undefined : data.activeLabel);
      toast.success(
        filters.category === data.activeLabel
          ? "Filtro removido"
          : `Filtrado por: ${data.activeLabel}`
      );
    }
  };

  return (
    <div className="p-8 space-y-8 animate-fade-in">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Visão Executiva</h1>
        <p className="text-muted-foreground">Seu negócio em um piscar de olhos</p>
      </div>

      <FilterBadges />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Receita Total"
          value="R$ 328K"
          change={12.5}
          icon={DollarSign}
          delay={100}
        />
        <KPICard
          title="Clientes Ativos"
          value="2.845"
          change={8.2}
          icon={Users}
          delay={200}
        />
        <KPICard
          title="Taxa de Crescimento"
          value="23,8%"
          change={5.4}
          icon={TrendingUp}
          delay={300}
        />
        <KPICard
          title="Total de Pedidos"
          value="1.429"
          change={-2.1}
          icon={ShoppingCart}
          delay={400}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Tendência de Receita" delay={500}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueData} onClick={handleRevenueClick}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(217 91% 60%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(217 91% 60%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip content={<CustomTooltip valuePrefix="R$ " />} />
              <Area
                type="monotone"
                dataKey="value"
                stroke="hsl(217 91% 60%)"
                strokeWidth={2}
                fill="url(#colorRevenue)"
                name="Receita"
                cursor="pointer"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Vendas por Categoria" delay={600}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={salesData} onClick={handleSalesClick}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="category" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip content={<CustomTooltip valuePrefix="R$ " />} />
              <Bar
                dataKey="value"
                fill="hsl(217 91% 60%)"
                radius={[8, 8, 0, 0]}
                name="Vendas"
                cursor="pointer"
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
