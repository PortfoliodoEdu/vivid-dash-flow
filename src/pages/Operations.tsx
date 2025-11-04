import { ChartCard } from "@/components/ChartCard";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const efficiencyData = [
  { week: "Week 1", efficiency: 85 },
  { week: "Week 2", efficiency: 88 },
  { week: "Week 3", efficiency: 82 },
  { week: "Week 4", efficiency: 92 },
  { week: "Week 5", efficiency: 89 },
  { week: "Week 6", efficiency: 94 },
];

const kpis = [
  { label: "On-Time Delivery", value: 94, target: 95 },
  { label: "Resource Utilization", value: 87, target: 85 },
  { label: "Quality Score", value: 91, target: 90 },
  { label: "Customer Satisfaction", value: 88, target: 90 },
];

export default function Operations() {
  return (
    <div className="p-8 space-y-8 animate-fade-in">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Operations & Efficiency</h1>
        <p className="text-muted-foreground">Monitor operational performance</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Efficiency Trend">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={efficiencyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" domain={[75, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Line type="monotone" dataKey="efficiency" stroke="hsl(142 76% 36%)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <Card className="p-6 gradient-card border-border shadow-soft">
          <h3 className="text-lg font-semibold text-foreground mb-6">Key Performance Indicators</h3>
          <div className="space-y-6">
            {kpis.map((kpi) => (
              <div key={kpi.label} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-foreground font-medium">{kpi.label}</span>
                  <span className="text-muted-foreground">
                    {kpi.value}% / {kpi.target}%
                  </span>
                </div>
                <Progress value={kpi.value} className="h-2" />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
