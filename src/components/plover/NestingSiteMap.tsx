import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bird, 
  AlertTriangle, 
  Eye, 
  MapPin, 
  Waves,
  ThermometerSun,
  Wind,
  X,
  ExternalLink,
  Clock
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

// ============= TYPES =============
interface NestingSite {
  id: string;
  zone: string;
  status: "active" | "fledged" | "abandoned" | "monitoring";
  eggs: number;
  chicks: number;
  lastCheck: string;
  threats: string[];
  coordinates: { lat: number; lon: number };
}

interface MapProps {
  sites: NestingSite[];
  onSiteSelect?: (site: NestingSite | null) => void;
  selectedSiteId?: string | null;
}

// Cape Cod bounding box (outer cape focus)
const MAP_BOUNDS = {
  minLat: 41.65,
  maxLat: 42.05,
  minLon: -70.25,
  maxLon: -69.90,
};

// Convert geo coordinates to SVG coordinates
function geoToSvg(lat: number, lon: number, width: number, height: number) {
  const x = ((lon - MAP_BOUNDS.minLon) / (MAP_BOUNDS.maxLon - MAP_BOUNDS.minLon)) * width;
  const y = height - ((lat - MAP_BOUNDS.minLat) / (MAP_BOUNDS.maxLat - MAP_BOUNDS.minLat)) * height;
  return { x, y };
}

// Status color mapping
function getStatusColor(status: NestingSite["status"]) {
  switch (status) {
    case "active": return { fill: "#10b981", stroke: "#34d399", glow: "rgba(16, 185, 129, 0.6)" };
    case "fledged": return { fill: "#22d3ee", stroke: "#67e8f9", glow: "rgba(34, 211, 238, 0.6)" };
    case "abandoned": return { fill: "#ef4444", stroke: "#f87171", glow: "rgba(239, 68, 68, 0.6)" };
    case "monitoring": return { fill: "#f59e0b", stroke: "#fbbf24", glow: "rgba(245, 158, 11, 0.6)" };
    default: return { fill: "#6b7280", stroke: "#9ca3af", glow: "rgba(107, 114, 128, 0.6)" };
  }
}

// Cape Cod coastline path (simplified outer cape)
const CAPE_COD_PATH = `
  M 50,380 
  C 60,350 80,300 100,250
  L 120,200 
  C 130,170 145,140 160,110
  L 180,80
  C 200,50 220,30 250,20
  L 280,15
  C 320,10 360,15 400,30
  L 420,40
  C 440,55 455,75 465,100
  L 475,130
  C 480,160 478,190 470,220
  L 455,260
  C 440,300 420,340 395,370
  L 365,400
  C 340,420 310,435 280,440
  L 240,445
  C 200,445 160,435 130,415
  L 100,390
  C 80,375 65,360 50,380
  Z
`;

// Inner bay line
const BAY_LINE = `
  M 80,360
  C 100,330 130,290 165,250
  L 200,200
  C 220,160 245,130 275,105
  L 305,85
  C 335,70 370,65 400,75
`;

function SiteMarker({ 
  site, 
  position, 
  isSelected, 
  onClick 
}: { 
  site: NestingSite; 
  position: { x: number; y: number }; 
  isSelected: boolean;
  onClick: () => void;
}) {
  const colors = getStatusColor(site.status);
  const hasThreats = site.threats.length > 0;

  return (
    <g className="cursor-pointer" onClick={onClick}>
      {/* Outer glow ring for active sites */}
      {site.status === "active" && (
        <motion.circle
          cx={position.x}
          cy={position.y}
          r={18}
          fill="none"
          stroke={colors.stroke}
          strokeWidth={1}
          opacity={0.3}
          animate={{ 
            r: [18, 25, 18],
            opacity: [0.3, 0.1, 0.3]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}

      {/* Threat pulse ring */}
      {hasThreats && (
        <motion.circle
          cx={position.x}
          cy={position.y}
          r={22}
          fill="none"
          stroke="#f59e0b"
          strokeWidth={2}
          strokeDasharray="4 4"
          opacity={0.6}
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: `${position.x}px ${position.y}px` }}
        />
      )}

      {/* Selection highlight */}
      {isSelected && (
        <motion.circle
          cx={position.x}
          cy={position.y}
          r={28}
          fill="none"
          stroke="#22d3ee"
          strokeWidth={2}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        />
      )}

      {/* Main marker */}
      <motion.circle
        cx={position.x}
        cy={position.y}
        r={12}
        fill={colors.fill}
        stroke={colors.stroke}
        strokeWidth={2}
        filter={`drop-shadow(0 0 6px ${colors.glow})`}
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.95 }}
      />

      {/* Bird icon indicator */}
      <motion.circle
        cx={position.x}
        cy={position.y}
        r={4}
        fill="white"
        opacity={0.9}
      />

      {/* Egg count badge */}
      {site.eggs > 0 && (
        <g>
          <circle
            cx={position.x + 10}
            cy={position.y - 10}
            r={8}
            fill="#1f2937"
            stroke={colors.stroke}
            strokeWidth={1}
          />
          <text
            x={position.x + 10}
            y={position.y - 6}
            textAnchor="middle"
            fontSize={8}
            fontFamily="monospace"
            fill="white"
          >
            {site.eggs}
          </text>
        </g>
      )}

      {/* Zone label */}
      <text
        x={position.x}
        y={position.y + 26}
        textAnchor="middle"
        fontSize={9}
        fontFamily="monospace"
        fill="#9ca3af"
        className="pointer-events-none"
      >
        {site.zone.split(' ')[0]}
      </text>
    </g>
  );
}

function SiteDetailPanel({ site, onClose }: { site: NestingSite; onClose: () => void }) {
  const colors = getStatusColor(site.status);
  
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="absolute right-4 top-4 w-72 z-20"
    >
      <Card className="bg-neutral-900/95 border-neutral-700 backdrop-blur-sm overflow-hidden">
        {/* Header */}
        <div 
          className="p-4 border-b border-neutral-800"
          style={{ borderTopColor: colors.fill, borderTopWidth: 3 }}
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-xs text-cyan-400">{site.id.toUpperCase()}</span>
                <Badge 
                  variant="outline" 
                  className="text-[10px]"
                  style={{ borderColor: colors.stroke, color: colors.fill }}
                >
                  {site.status}
                </Badge>
              </div>
              <h3 className="text-white font-medium">{site.zone}</h3>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-6 w-6 text-neutral-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="p-4 grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-[10px] font-mono uppercase text-neutral-500">Eggs</p>
            <p className="text-2xl font-light text-white">{site.eggs}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-mono uppercase text-neutral-500">Chicks</p>
            <p className="text-2xl font-light text-white">{site.chicks}</p>
          </div>
        </div>

        {/* Coordinates */}
        <div className="px-4 pb-3">
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-500">
            <MapPin className="w-3 h-3" />
            <span>{site.coordinates.lat.toFixed(4)}°N, {Math.abs(site.coordinates.lon).toFixed(4)}°W</span>
          </div>
        </div>

        {/* Last Check */}
        <div className="px-4 pb-3">
          <div className="flex items-center gap-2 text-xs text-neutral-500">
            <Clock className="w-3 h-3" />
            <span>Last check: {new Date(site.lastCheck).toLocaleString('en-US', { 
              month: 'short', 
              day: 'numeric',
              hour: '2-digit', 
              minute: '2-digit'
            })}</span>
          </div>
        </div>

        {/* Threats */}
        {site.threats.length > 0 && (
          <div className="px-4 pb-4">
            <div className="flex items-center gap-2 p-2 bg-amber-500/10 rounded border border-amber-500/20">
              <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <div className="text-xs text-amber-400">
                <span className="font-medium">Active Threats:</span>
                <span className="ml-1">{site.threats.map(t => t.replace('_', ' ')).join(', ')}</span>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="p-4 border-t border-neutral-800 flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 text-xs border-neutral-700 hover:bg-neutral-800"
          >
            <Eye className="w-3 h-3 mr-2" />
            Log Check
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 text-xs border-neutral-700 hover:bg-neutral-800"
          >
            <ExternalLink className="w-3 h-3 mr-2" />
            Navigate
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}

function MapLegend() {
  const statuses: Array<{ status: NestingSite["status"]; label: string }> = [
    { status: "active", label: "Active Nest" },
    { status: "fledged", label: "Fledged" },
    { status: "monitoring", label: "Monitoring" },
    { status: "abandoned", label: "Abandoned" },
  ];

  return (
    <div className="absolute left-4 bottom-4 z-10">
      <Card className="bg-neutral-900/90 border-neutral-800 backdrop-blur-sm p-3">
        <p className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 mb-2">Legend</p>
        <div className="space-y-1.5">
          {statuses.map(({ status, label }) => {
            const colors = getStatusColor(status);
            return (
              <div key={status} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: colors.fill, boxShadow: `0 0 6px ${colors.glow}` }}
                />
                <span className="text-xs text-neutral-400">{label}</span>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

function MapControls({ onZoomIn, onZoomOut, onReset }: { onZoomIn: () => void; onZoomOut: () => void; onReset: () => void }) {
  return (
    <div className="absolute right-4 bottom-4 z-10 flex flex-col gap-1">
      <Button
        variant="outline"
        size="icon"
        onClick={onZoomIn}
        className="h-8 w-8 bg-neutral-900/90 border-neutral-700 hover:bg-neutral-800"
      >
        <span className="text-lg font-light">+</span>
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={onZoomOut}
        className="h-8 w-8 bg-neutral-900/90 border-neutral-700 hover:bg-neutral-800"
      >
        <span className="text-lg font-light">−</span>
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={onReset}
        className="h-8 w-8 bg-neutral-900/90 border-neutral-700 hover:bg-neutral-800"
      >
        <MapPin className="w-4 h-4" />
      </Button>
    </div>
  );
}

export default function NestingSiteMap({ sites, onSiteSelect, selectedSiteId }: MapProps) {
  const [selectedSite, setSelectedSite] = useState<NestingSite | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  // Sync with external selection
  useEffect(() => {
    if (selectedSiteId) {
      const site = sites.find(s => s.id === selectedSiteId);
      if (site) setSelectedSite(site);
    } else {
      setSelectedSite(null);
    }
  }, [selectedSiteId, sites]);

  const handleSiteClick = (site: NestingSite) => {
    const newSelection = selectedSite?.id === site.id ? null : site;
    setSelectedSite(newSelection);
    onSiteSelect?.(newSelection);
  };

  const handleClose = () => {
    setSelectedSite(null);
    onSiteSelect?.(null);
  };

  const SVG_WIDTH = 500;
  const SVG_HEIGHT = 500;

  return (
    <Card className="bg-neutral-900/50 border-neutral-800 overflow-hidden relative">
      {/* Header */}
      <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-500/10 rounded">
            <Bird className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="font-mono text-sm uppercase tracking-wider text-white">Nesting Site Map</h3>
            <p className="text-xs text-neutral-500">Cape Cod National Seashore • Outer Cape</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono text-neutral-500">
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            {sites.filter(s => s.status === "active").length} Active
          </span>
          <span>{currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} EST</span>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative h-[500px] overflow-hidden bg-neutral-950">
        {/* Ocean texture */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              radial-gradient(circle at 30% 70%, rgba(34, 211, 238, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 30%, rgba(34, 211, 238, 0.05) 0%, transparent 40%)
            `
          }}
        />

        {/* Grid overlay */}
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(rgba(34, 211, 238, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(34, 211, 238, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />

        {/* SVG Map */}
        <motion.svg
          viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
          className="w-full h-full"
          style={{ 
            transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
            transformOrigin: 'center'
          }}
        >
          <defs>
            {/* Ocean gradient */}
            <linearGradient id="oceanGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0f172a" />
              <stop offset="100%" stopColor="#1e293b" />
            </linearGradient>

            {/* Land gradient */}
            <linearGradient id="landGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#374151" />
              <stop offset="100%" stopColor="#1f2937" />
            </linearGradient>

            {/* Beach gradient */}
            <linearGradient id="beachGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#d4b896" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#a8896c" stopOpacity={0.2} />
            </linearGradient>

            {/* Glow filter */}
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Ocean background */}
          <rect width="100%" height="100%" fill="url(#oceanGradient)" />

          {/* Cape Cod landmass */}
          <motion.path
            d={CAPE_COD_PATH}
            fill="url(#landGradient)"
            stroke="#4b5563"
            strokeWidth={2}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />

          {/* Beach strip */}
          <path
            d={CAPE_COD_PATH}
            fill="none"
            stroke="url(#beachGradient)"
            strokeWidth={8}
            opacity={0.6}
          />

          {/* Bay line */}
          <motion.path
            d={BAY_LINE}
            fill="none"
            stroke="#374151"
            strokeWidth={1}
            strokeDasharray="4 4"
            opacity={0.5}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, delay: 0.5 }}
          />

          {/* Location labels */}
          <g className="text-[10px] font-mono" fill="#6b7280">
            <text x="140" y="80">Provincetown</text>
            <text x="80" y="280">Wellfleet</text>
            <text x="60" y="380">Eastham</text>
            <text x="350" y="50">Race Point</text>
            <text x="400" y="150">Atlantic Ocean</text>
          </g>

          {/* Cape Cod Bay label */}
          <text x="180" y="200" fill="#4b5563" fontSize={12} fontFamily="monospace">
            Cape Cod Bay
          </text>

          {/* Nesting site markers */}
          {sites.map(site => {
            const position = geoToSvg(site.coordinates.lat, site.coordinates.lon, SVG_WIDTH, SVG_HEIGHT);
            return (
              <SiteMarker
                key={site.id}
                site={site}
                position={position}
                isSelected={selectedSite?.id === site.id}
                onClick={() => handleSiteClick(site)}
              />
            );
          })}
        </motion.svg>

        {/* Map Legend */}
        <MapLegend />

        {/* Map Controls */}
        <MapControls
          onZoomIn={() => setZoom(z => Math.min(z + 0.25, 2))}
          onZoomOut={() => setZoom(z => Math.max(z - 0.25, 0.5))}
          onReset={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}
        />

        {/* Site Detail Panel */}
        <AnimatePresence>
          {selectedSite && (
            <SiteDetailPanel site={selectedSite} onClose={handleClose} />
          )}
        </AnimatePresence>

        {/* Compass */}
        <div className="absolute top-4 left-4 z-10">
          <div className="w-12 h-12 rounded-full border border-neutral-700 bg-neutral-900/80 flex items-center justify-center">
            <div className="text-center">
              <span className="text-[10px] font-mono text-cyan-400">N</span>
              <div className="w-px h-3 bg-cyan-400/50 mx-auto" />
            </div>
          </div>
        </div>
      </div>

      {/* Footer Stats */}
      <div className="p-3 border-t border-neutral-800 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-6 text-neutral-500">
          <span className="flex items-center gap-1">
            <Waves className="w-3 h-3 text-cyan-400" />
            High Tide: 14:32
          </span>
          <span className="flex items-center gap-1">
            <Wind className="w-3 h-3" />
            NW 12 mph
          </span>
          <span className="flex items-center gap-1">
            <ThermometerSun className="w-3 h-3" />
            38°F
          </span>
        </div>
        <span className="text-neutral-600">
          Coord System: NAD83 / UTM Zone 19N
        </span>
      </div>
    </Card>
  );
}
