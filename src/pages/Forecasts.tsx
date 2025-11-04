import { ChartCard } from "@/components/ChartCard";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const forecastData = [
  { month: "Jan", actual: 45000, forecast: 43000 },
  { month: "Feb", actual: 52000, forecast: 50000 },
  { month: "Mar", actual: 48000, forecast: 52000 },
  { month: "Apr", actual: 61000, forecast: 58000 },
  { month: "May", actual: 55000, forecast: 60000 },
  { month: "Jun", actual: 67000, forecast: 65000 },
  { month: "Jul", actual: null, forecast: 70000 },
  { month: "Aug", actual: null, forecast: 73000 },
  { month: "Sep", actual: null, forecast: 75000 },
];

const goals = [
  { label: "Annual Revenue Target", current: 328000, target: 500000 },
  { label: "Customer Acquisition", current: 2845, target: 5000 },
  { label: "Market Share", current: 12, target: 20 },
];

export default function Forecasts() {
  return (
    <div className="p-8 space-y-8 animate-fade-in">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Forecasts & Goals</h1>
        <p className="text-muted-foreground">Plan for the future and track progress</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <ChartCard title="Revenue: Actual vs Forecast">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={forecastData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="actual" stroke="hsl(217 91% 60%)" strokeWidth={2} name="Actual" />
              <Line
                type="monotone"
                dataKey="forecast"
                stroke="hsl(142 76% 36%)"
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Forecast"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <Card className="p-6 gradient-card border-border shadow-soft">
          <h3 className="text-lg font-semibold text-foreground mb-6">Goal Progress</h3>
          <div className="space-y-6">
            {goals.map((goal) => {
              const progress = (goal.current / goal.target) * 100;
              return (
                <div key={goal.label} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground font-medium">{goal.label}</span>
                    <span className="text-muted-foreground">
                      {goal.current.toLocaleString()} / {goal.target.toLocaleString()}
                    </span>
                  </div>
                  <Progress value={progress} className="h-2" />
                  <p className="text-xs text-muted-foreground">{progress.toFixed(1)}% complete</p>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
