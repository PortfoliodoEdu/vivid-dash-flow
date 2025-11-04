import { ChartCard } from "@/components/ChartCard";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CustomTooltip } from "@/components/CustomTooltip";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const forecastData = [
  { month: "Jan", actual: 45000, forecast: 43000 },
  { month: "Fev", actual: 52000, forecast: 50000 },
  { month: "Mar", actual: 48000, forecast: 52000 },
  { month: "Abr", actual: 61000, forecast: 58000 },
  { month: "Mai", actual: 55000, forecast: 60000 },
  { month: "Jun", actual: 67000, forecast: 65000 },
  { month: "Jul", actual: null, forecast: 70000 },
  { month: "Ago", actual: null, forecast: 73000 },
  { month: "Set", actual: null, forecast: 75000 },
];

const goals = [
  { label: "Meta de Receita Anual", current: 328000, target: 500000 },
  { label: "Aquisição de Clientes", current: 2845, target: 5000 },
  { label: "Participação de Mercado", current: 12, target: 20 },
];

export default function Forecasts() {
  return (
    <div className="p-8 space-y-8 animate-fade-in">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Previsões & Metas</h1>
        <p className="text-muted-foreground">Planeje o futuro e acompanhe o progresso</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <ChartCard title="Receita: Real vs Previsto">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={forecastData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip content={<CustomTooltip valuePrefix="R$ " />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="actual"
                stroke="hsl(217 91% 60%)"
                strokeWidth={2}
                name="Real"
                cursor="pointer"
              />
              <Line
                type="monotone"
                dataKey="forecast"
                stroke="hsl(142 76% 36%)"
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Previsão"
                cursor="pointer"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <Card className="p-6 gradient-card border-border shadow-soft">
          <h3 className="text-lg font-semibold text-foreground mb-6">Progresso das Metas</h3>
          <div className="space-y-6">
            {goals.map((goal) => {
              const progress = (goal.current / goal.target) * 100;
              return (
                <div key={goal.label} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground font-medium">{goal.label}</span>
                    <span className="text-muted-foreground">
                      {goal.current.toLocaleString("pt-BR")} / {goal.target.toLocaleString("pt-BR")}
                    </span>
                  </div>
                  <Progress value={progress} className="h-2" />
                  <p className="text-xs text-muted-foreground">{progress.toFixed(1)}% completo</p>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
