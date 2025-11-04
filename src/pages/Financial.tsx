import { ChartCard } from "@/components/ChartCard";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const profitData = [
  { month: "Jan", revenue: 45000, expenses: 32000, profit: 13000 },
  { month: "Feb", revenue: 52000, expenses: 35000, profit: 17000 },
  { month: "Mar", revenue: 48000, expenses: 33000, profit: 15000 },
  { month: "Apr", revenue: 61000, expenses: 38000, profit: 23000 },
  { month: "May", revenue: 55000, expenses: 36000, profit: 19000 },
  { month: "Jun", revenue: 67000, expenses: 40000, profit: 27000 },
];

const businessUnits = [
  { unit: "Unit A", value: 28000 },
  { unit: "Unit B", value: 21000 },
  { unit: "Unit C", value: 18000 },
  { unit: "Unit D", value: 15000 },
];

export default function Financial() {
  return (
    <div className="p-8 space-y-8 animate-fade-in">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Financial Performance</h1>
        <p className="text-muted-foreground">Track revenue, expenses, and profitability</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <ChartCard title="Revenue, Expenses & Profit">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={profitData}>
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
              <Line type="monotone" dataKey="revenue" stroke="hsl(217 91% 60%)" strokeWidth={2} name="Revenue" />
              <Line type="monotone" dataKey="expenses" stroke="hsl(0 84% 60%)" strokeWidth={2} name="Expenses" />
              <Line type="monotone" dataKey="profit" stroke="hsl(142 76% 36%)" strokeWidth={2} name="Profit" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Revenue by Business Unit">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={businessUnits} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
              <YAxis dataKey="unit" type="category" stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="value" fill="hsl(217 91% 60%)" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
