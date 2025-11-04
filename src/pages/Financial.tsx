import { ChartCard } from "@/components/ChartCard";
import { FilterBadges } from "@/components/FilterBadges";
import { CustomTooltip } from "@/components/CustomTooltip";
import { useFilters } from "@/contexts/FilterContext";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { toast } from "sonner";

const allProfitData = [
  { month: "Jan", revenue: 45000, expenses: 32000, profit: 13000 },
  { month: "Fev", revenue: 52000, expenses: 35000, profit: 17000 },
  { month: "Mar", revenue: 48000, expenses: 33000, profit: 15000 },
  { month: "Abr", revenue: 61000, expenses: 38000, profit: 23000 },
  { month: "Mai", revenue: 55000, expenses: 36000, profit: 19000 },
  { month: "Jun", revenue: 67000, expenses: 40000, profit: 27000 },
];

const allBusinessUnits = [
  { unit: "Unidade A", value: 28000 },
  { unit: "Unidade B", value: 21000 },
  { unit: "Unidade C", value: 18000 },
  { unit: "Unidade D", value: 15000 },
];

export default function Financial() {
  const { filters, setFilter } = useFilters();

  const profitData = filters.month
    ? allProfitData.filter((d) => d.month === filters.month)
    : allProfitData;

  const businessUnits = filters.businessUnit
    ? allBusinessUnits.filter((d) => d.unit === filters.businessUnit)
    : allBusinessUnits;

  const handleProfitClick = (data: any) => {
    if (data && data.activeLabel) {
      setFilter("month", filters.month === data.activeLabel ? undefined : data.activeLabel);
      toast.success(
        filters.month === data.activeLabel
          ? "Filtro removido"
          : `Filtrado por: ${data.activeLabel}`
      );
    }
  };

  const handleUnitClick = (data: any) => {
    if (data && data.activeLabel) {
      setFilter("businessUnit", filters.businessUnit === data.activeLabel ? undefined : data.activeLabel);
      toast.success(
        filters.businessUnit === data.activeLabel
          ? "Filtro removido"
          : `Filtrado por: ${data.activeLabel}`
      );
    }
  };

  return (
    <div className="p-8 space-y-8 animate-fade-in">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Desempenho Financeiro</h1>
        <p className="text-muted-foreground">Acompanhe receita, despesas e lucratividade</p>
      </div>

      <FilterBadges />

      <div className="grid grid-cols-1 gap-6">
        <ChartCard title="Receita, Despesas & Lucro">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={profitData} onClick={handleProfitClick}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip content={<CustomTooltip valuePrefix="R$ " />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="hsl(217 91% 60%)"
                strokeWidth={2}
                name="Receita"
                cursor="pointer"
              />
              <Line
                type="monotone"
                dataKey="expenses"
                stroke="hsl(0 84% 60%)"
                strokeWidth={2}
                name="Despesas"
                cursor="pointer"
              />
              <Line
                type="monotone"
                dataKey="profit"
                stroke="hsl(142 76% 36%)"
                strokeWidth={2}
                name="Lucro"
                cursor="pointer"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Receita por Unidade de Negócio">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={businessUnits} layout="vertical" onClick={handleUnitClick}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
              <YAxis dataKey="unit" type="category" stroke="hsl(var(--muted-foreground))" />
              <Tooltip content={<CustomTooltip valuePrefix="R$ " />} />
              <Bar
                dataKey="value"
                fill="hsl(217 91% 60%)"
                radius={[0, 8, 8, 0]}
                name="Receita"
                cursor="pointer"
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
