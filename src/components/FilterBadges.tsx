import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { useFilters } from "@/contexts/FilterContext";
import { Button } from "@/components/ui/button";

export const FilterBadges = () => {
  const { filters, setFilter, clearFilters } = useFilters();

  const hasFilters = Object.keys(filters).some((key) => filters[key as keyof typeof filters]);

  if (!hasFilters) return null;

  const filterLabels: Record<string, string> = {
    month: "Mês",
    region: "Região",
    category: "Categoria",
    businessUnit: "Unidade",
  };

  return (
    <div className="flex flex-wrap items-center gap-2 p-4 bg-muted/30 rounded-lg border border-border animate-slide-up">
      <span className="text-sm font-medium text-muted-foreground">Filtros ativos:</span>
      {Object.entries(filters).map(
        ([key, value]) =>
          value && (
            <Badge
              key={key}
              variant="secondary"
              className="gap-1 px-3 py-1 hover:bg-secondary/80 transition-colors"
            >
              <span className="text-xs">
                {filterLabels[key]}: <strong>{value}</strong>
              </span>
              <button
                onClick={() => setFilter(key as keyof typeof filters, undefined)}
                className="ml-1 hover:text-destructive transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )
      )}
      <Button
        variant="ghost"
        size="sm"
        onClick={clearFilters}
        className="h-7 text-xs text-muted-foreground hover:text-foreground"
      >
        Limpar todos
      </Button>
    </div>
  );
};
