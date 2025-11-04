import { ChartCard } from "@/components/ChartCard";
import { FilterBadges } from "@/components/FilterBadges";
import { CustomTooltip } from "@/components/CustomTooltip";
import { useFilters } from "@/contexts/FilterContext";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { toast } from "sonner";

const allSalesByRegion = [
  { region: "Norte", value: 45000 },
  { region: "Sul", value: 38000 },
  { region: "Leste", value: 52000 },
  { region: "Oeste", value: 41000 },
];

const customerSegments = [
  { name: "Novos", value: 35 },
  { name: "Recorrentes", value: 65 },
];

const COLORS = ["hsl(217 91% 60%)", "hsl(142 76% 36%)"];

export default function Sales() {
  const { filters, setFilter } = useFilters();

  const salesByRegion = filters.region
    ? allSalesByRegion.filter((d) => d.region === filters.region)
    : allSalesByRegion;

  const handleRegionClick = (data: any) => {
    if (data && data.activeLabel) {
      setFilter("region", filters.region === data.activeLabel ? undefined : data.activeLabel);
      toast.success(
        filters.region === data.activeLabel
          ? "Filtro removido"
          : `Filtrado por: ${data.activeLabel}`
      );
    }
  };

  const handlePieClick = (data: any) => {
    if (data && data.name) {
      toast.info(`Segmento: ${data.name} - ${data.value}%`);
    }
  };

  return (
    <div className="p-8 space-y-8 animate-fade-in">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Vendas & Clientes</h1>
        <p className="text-muted-foreground">Analise o desempenho de vendas e comportamento de clientes</p>
      </div>

      <FilterBadges />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Vendas por Região">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={salesByRegion} onClick={handleRegionClick}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="region" stroke="hsl(var(--muted-foreground))" />
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

        <ChartCard title="Segmentos de Clientes">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={customerSegments}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                onClick={handlePieClick}
                cursor="pointer"
              >
                {customerSegments.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
