import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import GlobalWeatherProvider from "@/components/GlobalWeatherProvider";
import { SiteNavigation, SiteMapPage } from "@/components/SiteNavigation";
import Index from "./pages/Index";
import Strata from "./pages/Strata";
import Logs from "./pages/Logs";
import PatriotWay from "./pages/PatriotWay";
import StrataAviation from "./pages/StrataAviation";
import StrataMarine from "./pages/StrataMarine";
import StrataConstruction from "./pages/StrataConstruction";
import StrataEvents from "./pages/StrataEvents";
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
            <Route path="/aviation" element={<StrataAviation />} />
            <Route path="/marine" element={<StrataMarine />} />
            <Route path="/construction" element={<StrataConstruction />} />
            <Route path="/events" element={<StrataEvents />} />
            <Route path="/sitemap" element={<SiteMapPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <SiteNavigation />
        </GlobalWeatherProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
