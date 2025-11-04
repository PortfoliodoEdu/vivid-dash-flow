import { createContext, useContext, useState, ReactNode } from "react";

interface Filters {
  month?: string;
  region?: string;
  category?: string;
  businessUnit?: string;
}

interface FilterContextType {
  filters: Filters;
  setFilter: (key: keyof Filters, value: string | undefined) => void;
  clearFilters: () => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider = ({ children }: { children: ReactNode }) => {
  const [filters, setFilters] = useState<Filters>({});

  const setFilter = (key: keyof Filters, value: string | undefined) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  return (
    <FilterContext.Provider value={{ filters, setFilter, clearFilters }}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilters = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error("useFilters must be used within FilterProvider");
  }
  return context;
};
