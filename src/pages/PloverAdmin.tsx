import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bird, 
  Anchor, 
  Leaf, 
  MapPin, 
  Clock, 
  Thermometer,
  Wind,
  Droplets,
  AlertTriangle,
  CheckCircle2,
  Plus,
  FileText,
  Package,
  Users,
  BarChart3,
  Settings,
  Globe,
  Shield,
  Eye,
  Activity,
  Waves,
  Sun,
  Moon,
  Map,
  Bell
} from "lucide-react";
import NestingSiteMap from "@/components/plover/NestingSiteMap";
import ThreatLogsPanel from "@/components/plover/ThreatLogsPanel";
import ThreatLevelSelector from "@/components/plover/ThreatLevelSelector";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { useLanguageState } from "@/hooks/useLanguage";
import { useTemperatureUnit } from "@/hooks/useTemperatureUnit";
import { supabase } from "@/integrations/supabase/client";

// ============= GATE RITUAL STATE =============
type GatePhase = "sealed" | "scanning" | "verified" | "open";

import { useNestingSites, NestingSiteDisplay } from "@/hooks/useNestingSites";

interface DockSlip {
  id: string;
  number: string;
  status: "occupied" | "available" | "maintenance" | "reserved";
  vessel?: string;
  owner?: string;
  size: "small" | "medium" | "large";
  monthlyRate: number;
}

interface InventoryItem {
  id: string;
  name: string;
  category: "flower" | "preroll" | "infused" | "edible";
  strain?: string;
  thc: number;
  stock: number;
  reorderPoint: number;
  supplier: string;
}

// Mock data for nesting sites removed - now using useNestingSites hook

const DOCK_SLIPS: DockSlip[] = [
  { id: "slip-a1", number: "A-1", status: "occupied", vessel: "Sea Witch", owner: "R. Atwood", size: "large", monthlyRate: 850 },
  { id: "slip-a2", number: "A-2", status: "occupied", vessel: "Cape Runner", owner: "M. Santos", size: "medium", monthlyRate: 650 },
  { id: "slip-b1", number: "B-1", status: "available", size: "small", monthlyRate: 450 },
  { id: "slip-b2", number: "B-2", status: "maintenance", size: "medium", monthlyRate: 650 },
  { id: "slip-c1", number: "C-1", status: "reserved", vessel: "Pending", owner: "J. Walsh", size: "large", monthlyRate: 850 },
  { id: "slip-c2", number: "C-2", status: "available", size: "small", monthlyRate: 450 },
];

const INVENTORY: InventoryItem[] = [
  { id: "inv-001", name: "Blue Dream", category: "flower", strain: "Hybrid", thc: 22.5, stock: 48, reorderPoint: 20, supplier: "Cape Cod Grow Labs" },
  { id: "inv-002", name: "Sour Diesel Pre-Roll 5pk", category: "preroll", strain: "Sativa", thc: 28.0, stock: 12, reorderPoint: 15, supplier: "Happy Valley" },
  { id: "inv-003", name: "Hash Rosin Infused", category: "infused", thc: 48.5, stock: 8, reorderPoint: 10, supplier: "Nature's Heritage" },
  { id: "inv-004", name: "Granddaddy Purple", category: "flower", strain: "Indica", thc: 24.0, stock: 35, reorderPoint: 20, supplier: "Root & Bloom" },
];

// ============= TRANSLATIONS =============
const translations = {
  en: {
    title: "Piping Plover | Wellfleet Harbor",
    subtitle: "Unified Operations Command",
    conservation: "Conservation",
    harbor: "Harbor Ops",
    dispensary: "Dispensary",
    reports: "Reports",
    settings: "Settings",
    activeNests: "Active Nests",
    totalEggs: "Total Eggs",
    chicksHatched: "Chicks Hatched",
    threatsDetected: "Threats Detected",
    slipsOccupied: "Slips Occupied",
    slipsAvailable: "Slips Available",
    monthlyRevenue: "Monthly Revenue",
    inventoryItems: "Inventory Items",
    lowStock: "Low Stock Alerts",
    scanningBiometrics: "Scanning Biometrics",
    accessVerified: "Access Verified",
    initiateAccess: "Initiate Access",
    securePortal: "Secure Admin Portal",
    wellfleetHarbor: "Wellfleet Harbor"
  },
  ja: {
    title: "パイピングプロバー | ウェルフリート港",
    subtitle: "統合運用司令部",
    conservation: "保全",
    harbor: "港湾運用",
    dispensary: "調剤",
    reports: "レポート",
    settings: "設定",
    activeNests: "活動中の巣",
    totalEggs: "卵の総数",
    chicksHatched: "孵化したヒナ",
    threatsDetected: "検出された脅威",
    slipsOccupied: "使用中のスリップ",
    slipsAvailable: "利用可能なスリップ",
    monthlyRevenue: "月間収益",
    inventoryItems: "在庫アイテム",
    lowStock: "在庫不足アラート",
    scanningBiometrics: "生体認証スキャン中",
    accessVerified: "アクセス確認済み",
    initiateAccess: "アクセスを開始",
    securePortal: "セキュアな管理ポータル",
    wellfleetHarbor: "ウェルフリート港"
  }
};

// ============= COMPONENTS =============

function GateRitual({ onAccessGranted }: { onAccessGranted: () => void }) {
  const [phase, setPhase] = useState<GatePhase>("sealed");
  const [scanProgress, setScanProgress] = useState(0);
  const { language, setLanguage } = useLanguageState();
  const t = translations[language as keyof typeof translations] || translations.en;

  useEffect(() => {
    if (phase === "scanning") {
      const interval = setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setPhase("verified");
            setTimeout(() => {
              setPhase("open");
              setTimeout(onAccessGranted, 800);
            }, 1200);
            return 100;
          }
          return prev + 2;
        });
      }, 30);
      return () => clearInterval(interval);
    }
  }, [phase, onAccessGranted]);

  const handleInitiate = () => {
    setPhase("scanning");
  };

  return (
    <div className="fixed inset-0 z-50 bg-neutral-950 flex items-center justify-center overflow-hidden">
      {/* CAD Grid Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(34, 211, 238, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34, 211, 238, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Crosshairs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-0 right-0 h-px bg-cyan-500/20" />
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-cyan-500/20" />
      </div>

      {/* Language Toggle */}
      <div className="absolute top-6 right-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setLanguage(language === 'en' ? 'ja' : 'en')}
          className="font-mono text-xs text-cyan-400/60 hover:text-cyan-400"
        >
          <Globe className="w-4 h-4 mr-2" />
          {language === 'en' ? 'JA' : 'EN'}
        </Button>
      </div>

      <motion.div
        className="relative z-10 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Plover Icon with Scanning Ring */}
        <div className="relative inline-block mb-8">
          <motion.div
            className="w-32 h-32 rounded-full border-2 border-cyan-500/30 flex items-center justify-center"
            animate={phase === "scanning" ? { 
              boxShadow: ["0 0 0 0 rgba(34, 211, 238, 0.4)", "0 0 0 20px rgba(34, 211, 238, 0)"]
            } : {}}
            transition={{ duration: 1.5, repeat: phase === "scanning" ? Infinity : 0 }}
          >
            <Bird className={`w-16 h-16 transition-colors duration-500 ${
              phase === "verified" || phase === "open" 
                ? "text-emerald-400" 
                : phase === "scanning" 
                  ? "text-cyan-400" 
                  : "text-cyan-500/60"
            }`} strokeWidth={1} />
          </motion.div>

          {/* Scanning overlay */}
          <AnimatePresence>
            {phase === "scanning" && (
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-cyan-400"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1.2, opacity: [0, 1, 0] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            )}
          </AnimatePresence>

          {/* Verified checkmark */}
          <AnimatePresence>
            {(phase === "verified" || phase === "open") && (
              <motion.div
                className="absolute -right-2 -bottom-2 w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500 }}
              >
                <CheckCircle2 className="w-6 h-6 text-white" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Title */}
        <div className="mb-2">
          <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-cyan-500/60">
            {t.securePortal}
          </span>
        </div>
        <h1 className="text-3xl font-light text-white tracking-wide mb-2">
          PIPING PLOVER
        </h1>
        <p className="text-sm font-mono text-neutral-500 tracking-widest uppercase">
          {t.wellfleetHarbor}
        </p>

        {/* Scan Progress */}
        {phase === "scanning" && (
          <motion.div
            className="mt-8 w-64 mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Progress value={scanProgress} className="h-1 bg-neutral-800" />
            <p className="text-xs font-mono text-cyan-400/60 mt-2">
              {t.scanningBiometrics}... {scanProgress}%
            </p>
          </motion.div>
        )}

        {/* Verified Message */}
        {phase === "verified" && (
          <motion.p
            className="mt-8 text-emerald-400 font-mono text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {t.accessVerified}
          </motion.p>
        )}

        {/* Initiate Button */}
        {phase === "sealed" && (
          <motion.div
            className="mt-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Button
              onClick={handleInitiate}
              className="bg-transparent border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 px-8 py-6 rounded-none font-mono text-xs tracking-[0.2em] uppercase"
            >
              <Shield className="w-4 h-4 mr-3" />
              {t.initiateAccess}
            </Button>
          </motion.div>
        )}

        {/* Location & Time */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-8 text-[10px] font-mono text-neutral-600">
          <span className="flex items-center gap-2">
            <MapPin className="w-3 h-3" />
            41.93°N, 70.03°W
          </span>
          <span className="flex items-center gap-2">
            <Clock className="w-3 h-3" />
            {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
        </div>
      </motion.div>
    </div>
  );
}

function StatCard({ 
  label, 
  value, 
  icon: Icon, 
  trend, 
  alert 
}: { 
  label: string; 
  value: string | number; 
  icon: React.ElementType; 
  trend?: "up" | "down" | "stable";
  alert?: boolean;
}) {
  return (
    <Card className={`bg-neutral-900/50 border-neutral-800 p-4 ${alert ? 'border-amber-500/50' : ''}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 mb-1">{label}</p>
          <p className={`text-2xl font-light ${alert ? 'text-amber-400' : 'text-white'}`}>{value}</p>
        </div>
        <div className={`p-2 rounded ${alert ? 'bg-amber-500/10' : 'bg-cyan-500/10'}`}>
          <Icon className={`w-5 h-5 ${alert ? 'text-amber-400' : 'text-cyan-400'}`} />
        </div>
      </div>
      {trend && (
        <div className="mt-2 flex items-center gap-1">
          <Activity className={`w-3 h-3 ${
            trend === 'up' ? 'text-emerald-400' : 
            trend === 'down' ? 'text-red-400' : 
            'text-neutral-500'
          }`} />
          <span className="text-[10px] font-mono text-neutral-500">
            {trend === 'up' ? '+12%' : trend === 'down' ? '-5%' : 'stable'}
          </span>
        </div>
      )}
    </Card>
  );
}

function ConservationPanel({ t }: { t: typeof translations.en }) {
  const [selectedSiteId, setSelectedSiteId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"map" | "list">("map");
  const [threatEditSite, setThreatEditSite] = useState<NestingSiteDisplay | null>(null);
  
  const { sites, loading, logCheck, updateSite } = useNestingSites();
  
  const activeNests = sites.filter(n => n.status === "active");
  const totalEggs = sites.reduce((sum, n) => sum + n.eggs, 0);
  const totalChicks = sites.reduce((sum, n) => sum + n.chicks, 0);
  const threats = sites.filter(n => n.threats.length > 0);

  const handleSiteSelect = (site: NestingSiteDisplay | null) => {
    setSelectedSiteId(site?.id || null);
  };

  const handleLogCheck = (siteId: string) => {
    logCheck(siteId);
  };

  const handleUpdateThreat = async (
    siteId: string,
    threatLevel: "low" | "medium" | "high",
    notes?: string
  ) => {
    await updateSite(siteId, {
      threat_level: threatLevel,
      observer_notes: notes,
    });
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label={t.activeNests} value={activeNests.length} icon={Bird} trend="stable" />
        <StatCard label={t.totalEggs} value={totalEggs} icon={Eye} trend="up" />
        <StatCard label={t.chicksHatched} value={totalChicks} icon={Sun} />
        <StatCard label={t.threatsDetected} value={threats.length} icon={AlertTriangle} alert={threats.length > 0} />
      </div>

      {/* View Toggle */}
      <div className="flex items-center justify-between">
        <h3 className="font-mono text-sm uppercase tracking-wider text-white">Monitoring Zones</h3>
        <div className="flex items-center gap-1 bg-neutral-900 rounded p-1">
          <Button
            variant={viewMode === "map" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setViewMode("map")}
            className="h-7 px-3 text-xs"
          >
            <Map className="w-3 h-3 mr-1.5" />
            Map
          </Button>
          <Button
            variant={viewMode === "list" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setViewMode("list")}
            className="h-7 px-3 text-xs"
          >
            <FileText className="w-3 h-3 mr-1.5" />
            List
          </Button>
        </div>
      </div>

      {/* Map View */}
      {viewMode === "map" && (
        <NestingSiteMap 
          sites={sites}
          onSiteSelect={handleSiteSelect}
          selectedSiteId={selectedSiteId}
          onLogCheck={handleLogCheck}
          loading={loading}
        />
      )}

      {/* List View */}
      {viewMode === "list" && (
        <Card className="bg-neutral-900/50 border-neutral-800">
          <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
            <span className="text-xs text-neutral-500">{sites.length} sites monitored</span>
            <Button variant="ghost" size="sm" className="text-cyan-400 hover:text-cyan-300">
              <Plus className="w-4 h-4 mr-2" />
              Add Site
            </Button>
          </div>
          <ScrollArea className="h-[400px]">
            <div className="divide-y divide-neutral-800">
              {sites.map(site => (
                <div 
                  key={site.id} 
                  className={`p-4 hover:bg-neutral-800/50 transition-colors cursor-pointer ${
                    selectedSiteId === site.id ? 'bg-cyan-500/5 border-l-2 border-l-cyan-500' : ''
                  }`}
                  onClick={() => setSelectedSiteId(selectedSiteId === site.id ? null : site.id)}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs text-cyan-400">{site.id.toUpperCase()}</span>
                        <Badge variant="outline" className={`text-[10px] ${
                          site.status === 'active' ? 'border-emerald-500/50 text-emerald-400' :
                          site.status === 'fledged' ? 'border-cyan-500/50 text-cyan-400' :
                          site.status === 'abandoned' ? 'border-red-500/50 text-red-400' :
                          'border-amber-500/50 text-amber-400'
                        }`}>
                          {site.status}
                        </Badge>
                        {site.threatLevel !== 'low' && (
                          <Badge variant="outline" className={`text-[10px] ${
                            site.threatLevel === 'high' 
                              ? 'border-red-500/50 text-red-400' 
                              : 'border-amber-500/50 text-amber-400'
                          }`}>
                            {site.threatLevel} threat
                          </Badge>
                        )}
                      </div>
                      <p className="text-white font-medium">{site.zone}</p>
                      <p className="text-xs text-neutral-500 mt-1">
                        {site.eggs} eggs • {site.chicks} chicks
                      </p>
                      <p className="text-[10px] font-mono text-neutral-600 mt-1">
                        {site.coordinates.lat.toFixed(4)}°N, {Math.abs(site.coordinates.lon).toFixed(4)}°W
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-mono text-neutral-600">
                        Last check: {new Date(site.lastCheck).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      {site.threats.length > 0 && (
                        <div className="flex items-center gap-1 mt-1 text-amber-400">
                          <AlertTriangle className="w-3 h-3" />
                          <span className="text-[10px]">{site.threats.join(', ')}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1 mt-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 text-[10px] text-cyan-400 hover:text-cyan-300"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLogCheck(site.id);
                          }}
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          Log Check
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`h-6 text-[10px] ${
                            site.threatLevel === 'high' 
                              ? 'text-red-400 hover:text-red-300' 
                              : site.threatLevel === 'medium'
                                ? 'text-amber-400 hover:text-amber-300'
                                : 'text-neutral-400 hover:text-neutral-300'
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setThreatEditSite(site);
                          }}
                        >
                          <Shield className="w-3 h-3 mr-1" />
                          Threat
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </Card>
      )}

      {/* Threat Logs Panel */}
      <div className="mt-6">
        <h3 className="font-mono text-sm uppercase tracking-wider text-white mb-4 flex items-center gap-2">
          <Bell className="w-4 h-4 text-red-400" />
          Threat Alert History
        </h3>
        <ThreatLogsPanel />
      </div>

      {/* Threat Level Selector Modal */}
      <AnimatePresence>
        {threatEditSite && (
          <ThreatLevelSelector
            site={threatEditSite}
            onUpdateThreat={handleUpdateThreat}
            onClose={() => setThreatEditSite(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function HarborPanel({ t }: { t: typeof translations.en }) {
  const occupied = DOCK_SLIPS.filter(s => s.status === "occupied").length;
  const available = DOCK_SLIPS.filter(s => s.status === "available").length;
  const monthlyRevenue = DOCK_SLIPS.filter(s => s.status === "occupied").reduce((sum, s) => sum + s.monthlyRate, 0);

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label={t.slipsOccupied} value={occupied} icon={Anchor} trend="stable" />
        <StatCard label={t.slipsAvailable} value={available} icon={Waves} />
        <StatCard label={t.monthlyRevenue} value={`$${monthlyRevenue.toLocaleString()}`} icon={BarChart3} trend="up" />
        <StatCard label="Maintenance" value={DOCK_SLIPS.filter(s => s.status === "maintenance").length} icon={Settings} alert />
      </div>

      {/* Dock Grid */}
      <Card className="bg-neutral-900/50 border-neutral-800">
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
          <h3 className="font-mono text-sm uppercase tracking-wider text-white">Slip Status</h3>
          <Button variant="ghost" size="sm" className="text-cyan-400 hover:text-cyan-300">
            <Plus className="w-4 h-4 mr-2" />
            Add Reservation
          </Button>
        </div>
        <div className="p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {DOCK_SLIPS.map(slip => (
            <div 
              key={slip.id}
              className={`p-4 rounded border text-center cursor-pointer transition-all hover:scale-105 ${
                slip.status === 'occupied' ? 'bg-cyan-500/10 border-cyan-500/30' :
                slip.status === 'available' ? 'bg-emerald-500/10 border-emerald-500/30' :
                slip.status === 'maintenance' ? 'bg-amber-500/10 border-amber-500/30' :
                'bg-purple-500/10 border-purple-500/30'
              }`}
            >
              <p className="font-mono text-lg text-white mb-1">{slip.number}</p>
              <p className="text-[10px] uppercase font-mono text-neutral-500">{slip.status}</p>
              {slip.vessel && (
                <p className="text-xs text-neutral-400 mt-2 truncate">{slip.vessel}</p>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function DispensaryPanel({ t }: { t: typeof translations.en }) {
  const lowStock = INVENTORY.filter(i => i.stock <= i.reorderPoint);

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label={t.inventoryItems} value={INVENTORY.length} icon={Package} />
        <StatCard label={t.lowStock} value={lowStock.length} icon={AlertTriangle} alert={lowStock.length > 0} />
        <StatCard label="Categories" value="4" icon={FileText} />
        <StatCard label="Suppliers" value="5" icon={Users} />
      </div>

      {/* Inventory Table */}
      <Card className="bg-neutral-900/50 border-neutral-800">
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
          <h3 className="font-mono text-sm uppercase tracking-wider text-white">Inventory</h3>
          <div className="flex items-center gap-2">
            <Input 
              placeholder="Search..." 
              className="w-48 h-8 bg-neutral-800 border-neutral-700 text-sm"
            />
            <Button variant="ghost" size="sm" className="text-cyan-400 hover:text-cyan-300">
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
          </div>
        </div>
        <ScrollArea className="h-[300px]">
          <table className="w-full">
            <thead className="bg-neutral-800/50 sticky top-0">
              <tr className="text-left text-[10px] font-mono uppercase text-neutral-500">
                <th className="p-3">Product</th>
                <th className="p-3">Category</th>
                <th className="p-3">THC %</th>
                <th className="p-3">Stock</th>
                <th className="p-3">Supplier</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {INVENTORY.map(item => (
                <tr key={item.id} className="hover:bg-neutral-800/30">
                  <td className="p-3">
                    <p className="text-white font-medium">{item.name}</p>
                    {item.strain && <p className="text-xs text-neutral-500">{item.strain}</p>}
                  </td>
                  <td className="p-3">
                    <Badge variant="outline" className="text-[10px] border-neutral-700">
                      {item.category}
                    </Badge>
                  </td>
                  <td className="p-3 font-mono text-sm text-neutral-400">{item.thc}%</td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <span className={`font-mono text-sm ${item.stock <= item.reorderPoint ? 'text-amber-400' : 'text-white'}`}>
                        {item.stock}
                      </span>
                      {item.stock <= item.reorderPoint && (
                        <AlertTriangle className="w-3 h-3 text-amber-400" />
                      )}
                    </div>
                  </td>
                  <td className="p-3 text-sm text-neutral-500">{item.supplier}</td>
                  <td className="p-3">
                    <Badge className={item.stock <= item.reorderPoint 
                      ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' 
                      : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                    }>
                      {item.stock <= item.reorderPoint ? 'Reorder' : 'In Stock'}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </ScrollArea>
      </Card>
    </div>
  );
}

function WorldClockStrip() {
  const [time, setTime] = useState(new Date());
  const { formatTemp } = useTemperatureUnit();

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const locations = [
    { name: "Wellfleet", tz: "America/New_York", temp: 38 },
    { name: "Tokyo", tz: "Asia/Tokyo", temp: 8 },
    { name: "London", tz: "Europe/London", temp: 7 },
  ];

  return (
    <div className="flex items-center gap-6 text-[10px] font-mono">
      {locations.map(loc => (
        <div key={loc.name} className="flex items-center gap-2 text-neutral-500">
          <span className="text-cyan-400">{loc.name}</span>
          <span>
            {time.toLocaleTimeString('en-US', { 
              timeZone: loc.tz, 
              hour: '2-digit', 
              minute: '2-digit',
              hour12: false 
            })}
          </span>
          <span className="text-neutral-600">{formatTemp(loc.temp)}</span>
        </div>
      ))}
    </div>
  );
}

// ============= MAIN COMPONENT =============
export default function PloverAdmin() {
  const [accessGranted, setAccessGranted] = useState(false);
  const [activeTab, setActiveTab] = useState("conservation");
  const { language, setLanguage } = useLanguageState();
  const t = translations[language as keyof typeof translations] || translations.en;

  // Check for existing access
  useEffect(() => {
    const access = sessionStorage.getItem("plover_admin_access");
    if (access === "true") setAccessGranted(true);
  }, []);

  const handleAccessGranted = () => {
    sessionStorage.setItem("plover_admin_access", "true");
    setAccessGranted(true);
  };

  if (!accessGranted) {
    return <GateRitual onAccessGranted={handleAccessGranted} />;
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      {/* CAD Grid Background */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(34, 211, 238, 0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34, 211, 238, 0.5) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }} />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-neutral-800 bg-neutral-950/90 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-4">
              <Bird className="w-8 h-8 text-cyan-400" strokeWidth={1.5} />
              <div>
                <h1 className="font-mono text-sm uppercase tracking-wider text-white">{t.title}</h1>
                <p className="text-[10px] font-mono text-neutral-500 tracking-widest">{t.subtitle}</p>
              </div>
            </div>

            {/* World Clock Strip */}
            <div className="hidden lg:block">
              <WorldClockStrip />
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLanguage(language === 'en' ? 'ja' : 'en')}
                className="font-mono text-xs text-neutral-400 hover:text-white"
              >
                <Globe className="w-4 h-4 mr-2" />
                {language.toUpperCase()}
              </Button>
              <Button variant="ghost" size="sm" className="text-neutral-400 hover:text-white">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-neutral-900/50 border border-neutral-800 mb-8">
            <TabsTrigger value="conservation" className="data-[state=active]:bg-neutral-800 gap-2">
              <Bird className="w-4 h-4" />
              {t.conservation}
            </TabsTrigger>
            <TabsTrigger value="harbor" className="data-[state=active]:bg-neutral-800 gap-2">
              <Anchor className="w-4 h-4" />
              {t.harbor}
            </TabsTrigger>
            <TabsTrigger value="dispensary" className="data-[state=active]:bg-neutral-800 gap-2">
              <Leaf className="w-4 h-4" />
              {t.dispensary}
            </TabsTrigger>
            <TabsTrigger value="reports" className="data-[state=active]:bg-neutral-800 gap-2">
              <BarChart3 className="w-4 h-4" />
              {t.reports}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="conservation">
            <ConservationPanel t={t} />
          </TabsContent>
          <TabsContent value="harbor">
            <HarborPanel t={t} />
          </TabsContent>
          <TabsContent value="dispensary">
            <DispensaryPanel t={t} />
          </TabsContent>
          <TabsContent value="reports">
            <Card className="bg-neutral-900/50 border-neutral-800 p-8 text-center">
              <BarChart3 className="w-12 h-12 text-neutral-600 mx-auto mb-4" />
              <p className="text-neutral-500">Reports module coming soon</p>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-800 py-4">
        <div className="container mx-auto px-6 flex items-center justify-between text-[10px] font-mono text-neutral-600">
          <span>© 2026 Piping Plover | Wellfleet Harbor Operations</span>
          <span className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Systems Operational
            </span>
            <span>v2.0.0</span>
          </span>
        </div>
      </footer>
    </div>
  );
}
