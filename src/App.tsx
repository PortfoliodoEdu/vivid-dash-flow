import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FilterProvider } from "./contexts/FilterContext";
import { DashboardLayout } from "./components/DashboardLayout";
import Overview from "./pages/Overview";
import Clients from "./pages/Clients";
import Sales from "./pages/Sales";
import Services from "./pages/Services";
import Marketing from "./pages/Marketing";
import Financial from "./pages/Financial";
import Cashflow from "./pages/Cashflow";
import HR from "./pages/HR";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoad(false);
    }, 2100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <FilterProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <DashboardLayout isInitialLoad={isInitialLoad}>
              <Routes>
                <Route path="/" element={<Overview />} />
                <Route path="/clients" element={<Clients />} />
                <Route path="/sales" element={<Sales />} />
                <Route path="/services" element={<Services />} />
                <Route path="/marketing" element={<Marketing />} />
                <Route path="/financial" element={<Financial />} />
                <Route path="/cashflow" element={<Cashflow />} />
                <Route path="/hr" element={<HR />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </DashboardLayout>
          </BrowserRouter>
        </FilterProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
