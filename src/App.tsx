import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import GlobalWeatherProvider from "@/components/GlobalWeatherProvider";
import { SiteNavigation, SiteMapPage } from "@/components/SiteNavigation";
import SkipLinks from "@/components/SkipLinks";
import Footer from "@/components/Footer";
import AcquisitionPitch from "./pages/AcquisitionPitch";
import LavandarHome from "./pages/LavandarHome";
import Index from "./pages/Index";
import Strata from "./pages/Strata";
import Logs from "./pages/Logs";
import WeatherCoordinateLogs from "./pages/WeatherCoordinateLogs";
import WeatherShowcase from "./pages/WeatherShowcase";
import WeatherIntelligence from "./pages/WeatherIntelligence";
import StrataAviation from "./pages/StrataAviation";
import StrataMarine from "./pages/StrataMarine";
import StrataConstruction from "./pages/StrataConstruction";
import StrataEvents from "./pages/StrataEvents";
import ValidationReport from "./pages/ValidationReport";
import RecruiterOutreach from "./pages/RecruiterOutreach";
import SecurityTestSuite from "./pages/SecurityTestSuite";
import Portfolio from "./pages/Portfolio";
import KraftHarmony from "./pages/KraftHarmony";
import KraftCaseStudy from "./pages/KraftCaseStudy";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <GlobalWeatherProvider>
          {/* Skip Links for Accessibility */}
          <SkipLinks />
          
          <div className="flex flex-col min-h-screen">
            <main id="main-content" className="flex-1" role="main">
              <Routes>
                <Route path="/" element={<LavandarHome />} />
                <Route path="/alpha-os" element={<AcquisitionPitch />} />
                <Route path="/weather-showcase" element={<WeatherShowcase />} />
                <Route path="/strata" element={<Strata />} />
                <Route path="/logs" element={<Logs />} />
                <Route path="/coordinate-logs" element={<WeatherCoordinateLogs />} />
                <Route path="/launch" element={<Index />} />
                <Route path="/aviation" element={<StrataAviation />} />
                <Route path="/marine" element={<StrataMarine />} />
                <Route path="/construction" element={<StrataConstruction />} />
                <Route path="/events" element={<StrataEvents />} />
                <Route path="/weather-intelligence" element={<WeatherIntelligence />} />
                <Route path="/validation-report" element={<ValidationReport />} />
                <Route path="/recruiter-outreach" element={<RecruiterOutreach />} />
                <Route path="/security" element={<SecurityTestSuite />} />
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/kraft-harmony" element={<KraftHarmony />} />
                <Route path="/case-study/kraft" element={<KraftCaseStudy />} />
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
