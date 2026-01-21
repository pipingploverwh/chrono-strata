import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import GlobalWeatherProvider from "@/components/GlobalWeatherProvider";
import { TemperatureProvider } from "@/hooks/useTemperatureUnit";
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
import WeatherHistory from "./pages/WeatherHistory";
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
import ShareableLinks from "./pages/ShareableLinks";
import InvestorHub from "./pages/InvestorHub";
import LinkedInCompanyPage from "./pages/LinkedInCompanyPage";
import LinkedInCEOPage from "./pages/LinkedInCEOPage";
import ShibuyaStartup from "./pages/ShibuyaStartup";
import OdooTransferPortal from "./pages/OdooTransferPortal";
import ScreenshotTools from "./pages/ScreenshotTools";

import AllocationCheckout from "./pages/AllocationCheckout";
import AllocationSuccess from "./pages/AllocationSuccess";
import AllocationCanceled from "./pages/AllocationCanceled";
import DJTableShowcase from "./pages/DJTableShowcase";
import Apex1Landing from "./pages/Apex1Landing";
import ChronoStrataClub from "./pages/ChronoStrataClub";
import ThermalMusicVisualizer from "./pages/ThermalMusicVisualizer";
import ThermalVisualizerLanding from "./pages/ThermalVisualizerLanding";
import ThermalLandingSlash from "./pages/ThermalLandingSlash";
import ThermalLandingAnti from "./pages/ThermalLandingAnti";
import BeenaRedTeam from "./pages/BeenaRedTeam";
import AIShowcase from "./pages/AIShowcase";
import TalentRecruitment from "./pages/TalentRecruitment";
import ProjectSummary from "./pages/ProjectSummary";
import ExecutiveSummary from "./pages/ExecutiveSummary";
import PilotInterestTracker from "./pages/PilotInterestTracker";
import SecurityHoneypot from "./pages/SecurityHoneypot";
import StrataWorldThree from "./pages/StrataWorldThree";
import StrataWorldFive from "./pages/StrataWorldFive";
import StrataWorldSeven from "./pages/StrataWorldSeven";
import StrataGate from "./pages/StrataGate";
import StrataWelcome from "./pages/StrataWelcome";
import ChronoStrataGate from "./pages/ChronoStrataGate";
import Shop from "./pages/Shop";
import ShopSuccess from "./pages/ShopSuccess";
import KidsStrataShell from "./pages/KidsStrataShell";
import HackerNewsPost from "./pages/HackerNewsPost";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TemperatureProvider>
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
                <Route path="/vc-summary" element={<VCSummary />} />
                <Route path="/launch" element={<Index />} />
                <Route path="/strata" element={<ChronoStrataGate />} />
                <Route path="/strata-instrument" element={<Strata />} />
                <Route path="/aviation" element={<StrataAviation />} />
                <Route path="/marine" element={<StrataMarine />} />
                <Route path="/construction" element={<StrataConstruction />} />
                <Route path="/events" element={<StrataEvents />} />
                <Route path="/weather-showcase" element={<WeatherShowcase />} />
                <Route path="/weather-history" element={<WeatherHistory />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/sitemap" element={<SiteMapPage />} />
                <Route path="/links" element={<ShareableLinks />} />
                <Route path="/investor-hub" element={<InvestorHub />} />
                <Route path="/linkedin-company" element={<LinkedInCompanyPage />} />
                <Route path="/linkedin-ceo" element={<LinkedInCEOPage />} />
                <Route path="/shibuya" element={<ShibuyaStartup />} />
                
                <Route path="/allocation-checkout" element={<AllocationCheckout />} />
                <Route path="/allocation-success" element={<AllocationSuccess />} />
                <Route path="/allocation-canceled" element={<AllocationCanceled />} />
                <Route path="/dj-table" element={<DJTableShowcase />} />
                <Route path="/apex-1" element={<Apex1Landing />} />
                <Route path="/chrono-strata" element={<ChronoStrataClub />} />
                <Route path="/thermal-visualizer" element={<ThermalMusicVisualizer />} />
                <Route path="/thermal" element={<ThermalVisualizerLanding />} />
                <Route path="/thermal-slash" element={<ThermalLandingSlash />} />
                <Route path="/thermal-anti" element={<ThermalLandingAnti />} />
                <Route path="/beena" element={<BeenaRedTeam />} />
                <Route path="/ai" element={<AIShowcase />} />
                <Route path="/careers" element={<TalentRecruitment />} />
                <Route path="/summary" element={<ProjectSummary />} />
                <Route path="/exec" element={<ExecutiveSummary />} />
                <Route path="/pilot" element={<PilotInterestTracker />} />
                <Route path="/security-honeypot" element={<SecurityHoneypot />} />
                <Route path="/strata-gate" element={<StrataGate />} />
                <Route path="/strata-welcome" element={<StrataWelcome />} />
                <Route path="/world-3" element={<StrataWorldThree />} />
                <Route path="/world-5" element={<StrataWorldFive />} />
                <Route path="/world-7" element={<StrataWorldSeven />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/shop-success" element={<ShopSuccess />} />
                <Route path="/kids" element={<KidsStrataShell />} />
                <Route path="/hn" element={<HackerNewsPost />} />
                
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
                <Route path="/odoo" element={<ProtectedRoute><OdooTransferPortal /></ProtectedRoute>} />
                <Route path="/screenshots" element={<ProtectedRoute><ScreenshotTools /></ProtectedRoute>} />
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
    </TemperatureProvider>
  </QueryClientProvider>
);

export default App;
