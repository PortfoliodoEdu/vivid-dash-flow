import { ChartCard } from "@/components/ChartCard";
import { FilterBadges } from "@/components/FilterBadges";
import { CustomTooltip } from "@/components/CustomTooltip";
import { useFilters } from "@/contexts/FilterContext";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from "recharts";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

const allSalesByRegion = [
  { region: "Norte", vendas: 145000, clientes: 287, ticket: 505 },
  { region: "Sul", vendas: 238000, clientes: 512, ticket: 465 },
  { region: "Leste", vendas: 352000, clientes: 698, ticket: 504 },
  { region: "Oeste", vendas: 241000, clientes: 456, ticket: 529 },
];

const ltvCacData = [
  { month: "Jan", ltv: 11200, cac: 3100, ratio: 3.61 },
  { month: "Fev", ltv: 11500, cac: 3050, ratio: 3.77 },
  { month: "Mar", ltv: 11800, cac: 2980, ratio: 3.96 },
  { month: "Abr", ltv: 12100, cac: 2900, ratio: 4.17 },
  { month: "Mai", ltv: 12300, cac: 2880, ratio: 4.27 },
  { month: "Jun", ltv: 12450, cac: 2850, ratio: 4.37 },
];

const cohortData = [
  { mes: "Mês 1", retencao: 100 },
  { mes: "Mês 2", retencao: 75 },
  { mes: "Mês 3", retencao: 62 },
  { mes: "Mês 4", retencao: 55 },
  { mes: "Mês 5", retencao: 51 },
  { mes: "Mês 6", retencao: 48 },
];

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

  const totalVendas = salesByRegion.reduce((acc, curr) => acc + curr.vendas, 0);
  const totalClientes = salesByRegion.reduce((acc, curr) => acc + curr.clientes, 0);
  const ticketMedio = totalVendas / totalClientes;

  const currentLTV = ltvCacData[ltvCacData.length - 1].ltv;
  const currentCAC = ltvCacData[ltvCacData.length - 1].cac;
  const currentRatio = ltvCacData[ltvCacData.length - 1].ratio;

  return (
    <div className="p-8 space-y-8 animate-fade-in">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Vendas & LTV/CAC</h1>
        <p className="text-muted-foreground">Análise de vendas, lifetime value e custo de aquisição</p>
      </div>

      <FilterBadges />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="p-5 gradient-card border-border shadow-soft">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">LTV (Lifetime Value)</h3>
          <p className="text-2xl font-bold text-foreground">
            R$ {currentLTV.toLocaleString("pt-BR")}
          </p>
          <div className="flex items-center mt-2 text-success text-sm">
            <TrendingUp className="h-4 w-4 mr-1" />
            +11.2% vs mês anterior
          </div>
        </Card>
        <Card className="p-5 gradient-card border-border shadow-soft">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">CAC (Custo Aquisição)</h3>
          <p className="text-2xl font-bold text-foreground">
            R$ {currentCAC.toLocaleString("pt-BR")}
          </p>
          <div className="flex items-center mt-2 text-success text-sm">
            <TrendingDown className="h-4 w-4 mr-1" />
            -8.1% vs mês anterior
          </div>
        </Card>
        <Card className="p-5 gradient-card border-border shadow-soft">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Ratio LTV/CAC</h3>
          <p className="text-2xl font-bold text-success">
            {currentRatio.toFixed(2)}x
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Ideal: &gt; 3.0x | Ótimo: {currentRatio >= 3 ? "✓" : "✗"}
          </p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Vendas por Região">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={salesByRegion} onClick={handleRegionClick}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="region" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip content={<CustomTooltip valuePrefix="R$ " />} />
              <Bar
                dataKey="vendas"
                fill="hsl(217 91% 60%)"
                radius={[8, 8, 0, 0]}
                name="Vendas"
                cursor="pointer"
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Evolução LTV vs CAC">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={ltvCacData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip content={<CustomTooltip valuePrefix="R$ " />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="ltv"
                stroke="hsl(142 76% 36%)"
                strokeWidth={2}
                name="LTV"
                cursor="pointer"
              />
              <Line
                type="monotone"
                dataKey="cac"
                stroke="hsl(0 84% 60%)"
                strokeWidth={2}
                name="CAC"
                cursor="pointer"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Retenção de Clientes (Cohort)">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={cohortData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="mes" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" domain={[0, 100]} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="retencao"
                stroke="hsl(217 91% 60%)"
                strokeWidth={2}
                name="Retenção %"
                cursor="pointer"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <Card className="p-6 gradient-card border-border shadow-soft">
          <h3 className="text-lg font-semibold text-foreground mb-6">Métricas de Vendas</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Total de Vendas</p>
              <p className="text-2xl font-bold text-foreground">
                R$ {(totalVendas / 1000).toFixed(0)}K
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total de Clientes</p>
              <p className="text-2xl font-bold text-foreground">
                {totalClientes.toLocaleString("pt-BR")}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Ticket Médio</p>
              <p className="text-2xl font-bold text-foreground">
                R$ {ticketMedio.toFixed(0)}
              </p>
            </div>
            <div className="pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground">
                <strong>Payback Period:</strong> {(currentCAC / (currentLTV / 24)).toFixed(1)} meses
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
