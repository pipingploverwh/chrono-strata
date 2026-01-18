import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import GlobalWeatherProvider from "@/components/GlobalWeatherProvider";
import { SiteNavigation, SiteMapPage } from "@/components/SiteNavigation";
import SkipLinks from "@/components/SkipLinks";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import ProtectedRoute from "@/components/ProtectedRoute";
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
import ZeroLemonMobile from "./pages/ZeroLemonMobile";
import StrataCoordinator from "./pages/StrataCoordinator";
import VCSummary from "./pages/VCSummary";
import Auth from "./pages/Auth";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import WebScraper from "./pages/WebScraper";
import LavenderAgent from "./pages/LavenderAgent";
import SourcedInventory from "./pages/SourcedInventory";
import StartupVisa from "./pages/StartupVisa";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <GlobalWeatherProvider>
          {/* Smooth scroll to top on route changes */}
          <ScrollToTop />
          
          {/* Skip Links for Accessibility */}
          <SkipLinks />
          
          <div className="flex flex-col min-h-screen">
            <main id="main-content" className="flex-1" role="main">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LavandarHome />} />
                <Route path="/vc" element={<VCSummary />} />
                <Route path="/launch" element={<Index />} />
                <Route path="/strata" element={<Strata />} />
                <Route path="/aviation" element={<StrataAviation />} />
                <Route path="/marine" element={<StrataMarine />} />
                <Route path="/construction" element={<StrataConstruction />} />
                <Route path="/events" element={<StrataEvents />} />
                <Route path="/weather-showcase" element={<WeatherShowcase />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/sitemap" element={<SiteMapPage />} />
                
                {/* Protected Routes - Require Authentication */}
                <Route path="/alpha-os" element={<ProtectedRoute><AcquisitionPitch /></ProtectedRoute>} />
                <Route path="/validation-report" element={<ProtectedRoute><ValidationReport /></ProtectedRoute>} />
                <Route path="/portfolio" element={<ProtectedRoute><Portfolio /></ProtectedRoute>} />
                <Route path="/kraft-harmony" element={<ProtectedRoute><KraftHarmony /></ProtectedRoute>} />
                <Route path="/case-study/kraft" element={<ProtectedRoute><KraftCaseStudy /></ProtectedRoute>} />
                <Route path="/coordinator" element={<ProtectedRoute><StrataCoordinator /></ProtectedRoute>} />
                <Route path="/weather-intelligence" element={<ProtectedRoute><WeatherIntelligence /></ProtectedRoute>} />
                <Route path="/recruiter-outreach" element={<ProtectedRoute><RecruiterOutreach /></ProtectedRoute>} />
                <Route path="/zero-lemon" element={<ProtectedRoute><ZeroLemonMobile /></ProtectedRoute>} />
                <Route path="/web-scraper" element={<ProtectedRoute><WebScraper /></ProtectedRoute>} />
                <Route path="/lavender-agent" element={<ProtectedRoute><LavenderAgent /></ProtectedRoute>} />
                <Route path="/sourced-inventory" element={<ProtectedRoute><SourcedInventory /></ProtectedRoute>} />
                <Route path="/startup-visa" element={<ProtectedRoute><StartupVisa /></ProtectedRoute>} />
                <Route path="/logs" element={<ProtectedRoute><Logs /></ProtectedRoute>} />
                
                {/* Admin Routes */}
                <Route path="/coordinate-logs" element={<ProtectedRoute requireAdmin><WeatherCoordinateLogs /></ProtectedRoute>} />
                <Route path="/security" element={<ProtectedRoute requireAdmin><SecurityTestSuite /></ProtectedRoute>} />
                <Route path="/admin" element={<ProtectedRoute requireAdmin><AdminDashboard /></ProtectedRoute>} />
                
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
