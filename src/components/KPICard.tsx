import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";

interface KPICardProps {
  title: string;
  value: string;
  change: number;
  icon: LucideIcon;
  delay?: number;
}

export const KPICard = ({ title, value, change, icon: Icon, delay = 0 }: KPICardProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const isPositive = change >= 0;

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <Card
      className={`p-6 gradient-card border-border shadow-soft hover:shadow-hover transition-all duration-300 ${
        isVisible ? "animate-slide-up" : "opacity-0"
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 rounded-lg bg-primary/10 flex-shrink-0">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <div
          className={`text-sm font-medium px-2 py-1 rounded flex-shrink-0 ${
            isPositive ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
          }`}
        >
          {isPositive ? "+" : ""}{change}%
        </div>
      </div>
      <h3 className="text-sm font-medium text-muted-foreground mb-2 break-words">{title}</h3>
      <p className="text-3xl font-bold text-foreground break-words">{value}</p>
    </Card>
  );
};
