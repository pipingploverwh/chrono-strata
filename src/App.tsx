import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import GlobalWeatherProvider from "@/components/GlobalWeatherProvider";
import { SiteNavigation, SiteMapPage } from "@/components/SiteNavigation";
import Footer from "@/components/Footer";
import AcquisitionPitch from "./pages/AcquisitionPitch";
import Index from "./pages/Index";
import Strata from "./pages/Strata";
import Logs from "./pages/Logs";
import PatriotWay from "./pages/PatriotWay";
import PatriotsEvaluation from "./pages/PatriotsEvaluation";
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
          <div className="flex flex-col min-h-screen">
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<AcquisitionPitch />} />
                <Route path="/patriot-way" element={<PatriotWay />} />
                <Route path="/strata" element={<Strata />} />
                <Route path="/logs" element={<Logs />} />
                <Route path="/launch" element={<Index />} />
                <Route path="/strata-aviation" element={<StrataAviation />} />
                <Route path="/strata-marine" element={<StrataMarine />} />
                <Route path="/strata-construction" element={<StrataConstruction />} />
                <Route path="/strata-events" element={<StrataEvents />} />
                <Route path="/patriots-evaluation" element={<PatriotsEvaluation />} />
                <Route path="/sitemap" element={<SiteMapPage />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
          <SiteNavigation />
        </GlobalWeatherProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
