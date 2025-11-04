import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FilterProvider } from "./contexts/FilterContext";
import { DashboardLayout } from "./components/DashboardLayout";
import Overview from "./pages/Overview";
import Financial from "./pages/Financial";
import Sales from "./pages/Sales";
import Operations from "./pages/Operations";
import Forecasts from "./pages/Forecasts";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <FilterProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <DashboardLayout>
            <Routes>
              <Route path="/" element={<Overview />} />
              <Route path="/financial" element={<Financial />} />
              <Route path="/sales" element={<Sales />} />
              <Route path="/operations" element={<Operations />} />
              <Route path="/forecasts" element={<Forecasts />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </DashboardLayout>
        </BrowserRouter>
      </FilterProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
