import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import GlobalWeatherProvider from "@/components/GlobalWeatherProvider";
import Index from "./pages/Index";
import Strata from "./pages/Strata";
import Logs from "./pages/Logs";
import PatriotWay from "./pages/PatriotWay";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <GlobalWeatherProvider>
          <Routes>
            <Route path="/" element={<PatriotWay />} />
            <Route path="/strata" element={<Strata />} />
            <Route path="/logs" element={<Logs />} />
            <Route path="/launch" element={<Index />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </GlobalWeatherProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
