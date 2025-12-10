import { useState } from "react";
import { ExpandableChart } from "@/components/ExpandableChart";
import { FilterBadges } from "@/components/FilterBadges";
import { CustomTooltip } from "@/components/CustomTooltip";
import DataUploader from "@/components/DataUploader";
import { useFilters } from "@/contexts/FilterContext";
import { useData } from "@/contexts/DataContext";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";

const allDREData = [
  { 
    month: "Jan", 
    receitaBruta: 450000,
    impostos: 60750,
    receitaLiquida: 389250,
    custos: 247425,
    despesas: 74178,
    lucro: 67647
  },
  { 
    month: "Fev", 
    receitaBruta: 520000,
    impostos: 70200,
    receitaLiquida: 449800,
    custos: 269892,
    despesas: 89964,
    lucro: 89944
  },
  { 
    month: "Mar", 
    receitaBruta: 480000,
    impostos: 64800,
    receitaLiquida: 415200,
    custos: 274032,
    despesas: 74952,
    lucro: 66216
  },
  { 
    month: "Abr", 
    receitaBruta: 610000,
    impostos: 82350,
    receitaLiquida: 527650,
    custos: 316590,
    despesas: 105530,
    lucro: 105530
  },
  { 
    month: "Mai", 
    receitaBruta: 550000,
    impostos: 74250,
    receitaLiquida: 475750,
    custos: 309988,
    despesas: 85748,
    lucro: 80014
  },
  { 
    month: "Jun", 
    receitaBruta: 670000,
    impostos: 90450,
    receitaLiquida: 579550,
    custos: 347730,
    despesas: 115910,
    lucro: 115910
  },
];

const allIndicadores = [
  { indicador: "Liquidez Corrente", valor: 2.8 },
  { indicador: "Liquidez Seca", valor: 2.1 },
  { indicador: "Endividamento", valor: 35 },
  { indicador: "ROE (%)", valor: 18.5 },
  { indicador: "ROA (%)", valor: 12.3 },
];

export default function Financial() {
  const { filters, setFilter } = useFilters();
  const { getData } = useData();
  const [refreshKey, setRefreshKey] = useState(0);

  const dreData = filters.month
    ? allDREData.filter((d) => d.month === filters.month)
    : allDREData;

  const handleDREClick = (data: any) => {
    if (data && data.activeLabel) {
      setFilter("month", filters.month === data.activeLabel ? undefined : data.activeLabel);
      toast.success(
        filters.month === data.activeLabel
          ? "Filtro removido"
          : `Filtrado por: ${data.activeLabel}`
      );
    }
  };

  const totalReceita = dreData.reduce((acc, curr) => acc + curr.receitaLiquida, 0);
  const totalCustos = dreData.reduce((acc, curr) => acc + curr.custos, 0);
  const totalDespesas = dreData.reduce((acc, curr) => acc + curr.despesas, 0);
  const totalLucro = dreData.reduce((acc, curr) => acc + curr.lucro, 0);

  return (
    <div className="p-8 space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Financeiro & DRE</h1>
          <p className="text-muted-foreground">Demonstrativo de Resultado e análise contábil</p>
        </div>
        <DataUploader pageId="financial" onDataUpdated={() => setRefreshKey(k => k + 1)} />
      </div>

      <FilterBadges />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <Card className="p-5 gradient-card border-border shadow-soft">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Receita Líquida</h3>
          <p className="text-2xl font-bold text-foreground">
            R$ {(totalReceita / 1000).toFixed(0)}K
          </p>
          <p className="text-xs text-success mt-1">100%</p>
        </Card>
        <Card className="p-5 gradient-card border-border shadow-soft">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Custos</h3>
          <p className="text-2xl font-bold text-foreground">
            R$ {(totalCustos / 1000).toFixed(0)}K
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {((totalCustos / totalReceita) * 100).toFixed(1)}%
          </p>
        </Card>
        <Card className="p-5 gradient-card border-border shadow-soft">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Despesas</h3>
          <p className="text-2xl font-bold text-foreground">
            R$ {(totalDespesas / 1000).toFixed(0)}K
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {((totalDespesas / totalReceita) * 100).toFixed(1)}%
          </p>
        </Card>
        <Card className="p-5 gradient-card border-border shadow-soft">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Lucro Líquido</h3>
          <p className="text-2xl font-bold text-success">
            R$ {(totalLucro / 1000).toFixed(0)}K
          </p>
          <p className="text-xs text-success mt-1">
            {((totalLucro / totalReceita) * 100).toFixed(1)}%
          </p>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <ExpandableChart 
          title="DRE - Demonstrativo de Resultado"
          description="Demonstrativo de Resultado do Exercício (DRE): análise mensal da Receita Líquida, Custos Operacionais, Despesas Administrativas e Lucro Líquido. Ferramenta essencial para avaliar a saúde financeira."
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dreData} onClick={handleDREClick}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip content={<CustomTooltip valuePrefix="R$ " />} />
              <Legend />
              <Bar dataKey="receitaLiquida" fill="hsl(217 91% 60%)" name="Receita Líquida" cursor="pointer" />
              <Bar dataKey="custos" fill="hsl(0 84% 60%)" name="Custos" cursor="pointer" />
              <Bar dataKey="despesas" fill="hsl(38 92% 50%)" name="Despesas" cursor="pointer" />
              <Bar dataKey="lucro" fill="hsl(142 76% 36%)" name="Lucro" cursor="pointer" />
            </BarChart>
          </ResponsiveContainer>
        </ExpandableChart>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ExpandableChart 
            title="Evolução do Resultado"
            description="Tendência de crescimento da Receita Líquida e Lucro ao longo dos meses. Permite visualizar a trajetória de rentabilidade e identificar sazonalidades."
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dreData} onClick={handleDREClick}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip content={<CustomTooltip valuePrefix="R$ " />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="receitaLiquida"
                  stroke="hsl(217 91% 60%)"
                  strokeWidth={2}
                  name="Receita"
                  cursor="pointer"
                />
                <Line
                  type="monotone"
                  dataKey="lucro"
                  stroke="hsl(142 76% 36%)"
                  strokeWidth={2}
                  name="Lucro"
                  cursor="pointer"
                />
              </LineChart>
            </ResponsiveContainer>
          </ExpandableChart>

          <Card className="p-6 gradient-card border-border shadow-soft">
            <h3 className="text-lg font-semibold text-foreground mb-6">Indicadores Financeiros</h3>
            <div className="space-y-4">
              {allIndicadores.map((item) => (
                <div key={item.indicador} className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">{item.indicador}</span>
                  <span className="text-lg font-bold text-foreground">
                    {item.indicador.includes("%") ? `${item.valor}%` : item.valor}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground">
                <strong>Liquidez Corrente:</strong> Capacidade de pagar dívidas de curto prazo<br/>
                <strong>ROE:</strong> Retorno sobre o patrimônio líquido<br/>
                <strong>ROA:</strong> Retorno sobre ativos totais
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
