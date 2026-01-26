import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Box, 
  Layers, 
  FileText, 
  Camera, 
  ArrowLeft,
  Palette,
  Maximize2,
  Sparkles,
  AlertTriangle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Apparel3DViewer, 
  PatternLayout2D, 
  TechnicalBlueprintExport,
  ARPreviewOverlay,
  STRATA_COLORWAYS,
  STRATA_SIZES
} from '@/components/apparel';

// Mobile Safari detection for performance optimizations
const isMobileSafari = () => {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent;
  return /iPad|iPhone|iPod/.test(ua) && /WebKit/.test(ua) && !/CriOS/.test(ua);
};

// Detect low memory conditions
const isLowMemoryDevice = () => {
  if (typeof navigator === 'undefined') return false;
  // @ts-ignore - deviceMemory is not standard
  return navigator.deviceMemory && navigator.deviceMemory < 4;
};

type TerrainType = 'standard' | 'marine' | 'polar' | 'desert' | 'urban';

const TERRAIN_OPTIONS: { id: TerrainType; label: string; color: string }[] = [
  { id: 'standard', label: 'CHRONO-TOPO', color: '#f97316' },
  { id: 'marine', label: 'BATHYMETRIC', color: '#22d3ee' },
  { id: 'polar', label: 'GLACIAL', color: '#93c5fd' },
  { id: 'desert', label: 'GEOLOGICAL', color: '#f97316' },
  { id: 'urban', label: 'METROPOLITAN', color: '#a78bfa' },
];

export default function ApparelBlueprint() {
  const [selectedTerrain, setSelectedTerrain] = useState<TerrainType>('standard');
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedPiece, setSelectedPiece] = useState<string | null>(null);
  const [isAROpen, setIsAROpen] = useState(false);
  const [activeTab, setActiveTab] = useState('3d');
  
  // Mobile Safari optimizations
  const isSafariMobile = useMemo(() => isMobileSafari(), []);
  const isLowMem = useMemo(() => isLowMemoryDevice(), []);
  const [performanceMode, setPerformanceMode] = useState<'full' | 'optimized'>(
    isSafariMobile || isLowMem ? 'optimized' : 'full'
  );
  const [showPerformanceWarning, setShowPerformanceWarning] = useState(isSafariMobile);

  // Dismiss warning after 5 seconds
  useEffect(() => {
    if (showPerformanceWarning) {
      const timer = setTimeout(() => setShowPerformanceWarning(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showPerformanceWarning]);

  const colorway = STRATA_COLORWAYS[selectedTerrain];

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Mobile Safari Performance Warning */}
      {showPerformanceWarning && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-0 left-0 right-0 z-50 bg-amber-900/90 text-amber-100 px-4 py-2 flex items-center justify-center gap-2 text-sm"
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Performance mode enabled for mobile Safari</span>
          <button 
            onClick={() => setShowPerformanceWarning(false)}
            className="ml-2 underline hover:no-underline"
          >
            Dismiss
          </button>
        </motion.div>
      )}

      {/* AR Overlay */}
      <ARPreviewOverlay
        terrain={selectedTerrain}
        isOpen={isAROpen}
        onClose={() => setIsAROpen(false)}
      />

      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/shop">
                <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Shop
                </Button>
              </Link>
              
              <div className="h-6 w-px bg-zinc-700" />
              
              <div className="flex items-center gap-3">
                <Badge className="bg-lavender-600 text-white font-mono">
                  3D BLUEPRINT
                </Badge>
                <h1 className="text-white font-semibold">
                  STRATA Shell — {colorway.name}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Terrain selector */}
              <div className="flex items-center gap-1 p-1 bg-zinc-800 rounded-lg">
                {TERRAIN_OPTIONS.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTerrain(t.id)}
                    className={`px-3 py-1.5 rounded-md text-xs font-mono transition-all ${
                      selectedTerrain === t.id
                        ? 'bg-zinc-700 text-white'
                        : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    <div 
                      className="w-2 h-2 rounded-full mb-0.5 mx-auto" 
                      style={{ backgroundColor: t.color }}
                    />
                    {t.id.charAt(0).toUpperCase()}
                  </button>
                ))}
              </div>

              {/* Size selector */}
              <div className="flex items-center gap-1 p-1 bg-zinc-800 rounded-lg">
                {STRATA_SIZES.slice(0, 4).map(s => (
                  <button
                    key={s.code}
                    onClick={() => setSelectedSize(s.code)}
                    className={`px-2 py-1 rounded text-xs font-mono transition-all ${
                      selectedSize === s.code
                        ? 'bg-lavender-600 text-white'
                        : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    {s.code}
                  </button>
                ))}
              </div>

              {/* AR button */}
              <Button
                onClick={() => setIsAROpen(true)}
                className="bg-gradient-to-r from-lavender-600 to-purple-600 hover:from-lavender-700 hover:to-purple-700 text-white"
              >
                <Camera className="w-4 h-4 mr-2" />
                AR Preview
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-zinc-900 border border-zinc-800 p-1">
            <TabsTrigger 
              value="3d" 
              className="data-[state=active]:bg-lavender-600 data-[state=active]:text-white"
            >
              <Box className="w-4 h-4 mr-2" />
              3D Viewer
            </TabsTrigger>
            <TabsTrigger 
              value="pattern"
              className="data-[state=active]:bg-lavender-600 data-[state=active]:text-white"
            >
              <Layers className="w-4 h-4 mr-2" />
              Pattern Layout
            </TabsTrigger>
            <TabsTrigger 
              value="export"
              className="data-[state=active]:bg-lavender-600 data-[state=active]:text-white"
            >
              <FileText className="w-4 h-4 mr-2" />
              Blueprint Export
            </TabsTrigger>
          </TabsList>

          {/* 3D Viewer Tab */}
          <TabsContent value="3d" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Apparel3DViewer
                  terrain={selectedTerrain}
                  onPieceSelect={setSelectedPiece}
                  className="h-[600px]"
                />
              </div>
              
              <div className="space-y-4">
                {/* Quick info panel */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 bg-zinc-900 rounded-2xl border border-zinc-800"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-lavender-600/20 rounded-lg">
                      <Sparkles className="w-5 h-5 text-lavender-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">Interactive 3D Model</h3>
                      <p className="text-zinc-500 text-sm">Rotate, zoom, and explore</p>
                    </div>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between py-2 border-b border-zinc-800">
                      <span className="text-zinc-400">Colorway</span>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colorway.primary }} />
                        <span className="text-white font-mono">{colorway.name}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-zinc-800">
                      <span className="text-zinc-400">Size</span>
                      <span className="text-white font-mono">{selectedSize}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-zinc-800">
                      <span className="text-zinc-400">Pattern Pieces</span>
                      <span className="text-white font-mono">10</span>
                    </div>
                    {selectedPiece && (
                      <div className="flex items-center justify-between py-2">
                        <span className="text-zinc-400">Selected</span>
                        <span className="text-lavender-400 font-mono capitalize">{selectedPiece}</span>
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* Controls guide */}
                <div className="p-4 bg-zinc-900/50 rounded-xl border border-zinc-800">
                  <h4 className="text-zinc-400 text-xs font-mono uppercase mb-3">Controls</h4>
                  <div className="space-y-2 text-xs text-zinc-500">
                    <div className="flex items-center gap-2">
                      <kbd className="px-2 py-1 bg-zinc-800 rounded text-zinc-400">Drag</kbd>
                      <span>Rotate model</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <kbd className="px-2 py-1 bg-zinc-800 rounded text-zinc-400">Scroll</kbd>
                      <span>Zoom in/out</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <kbd className="px-2 py-1 bg-zinc-800 rounded text-zinc-400">Click</kbd>
                      <span>Select piece</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Pattern Layout Tab */}
          <TabsContent value="pattern">
            <PatternLayout2D
              terrain={selectedTerrain}
              showSeamAllowance={true}
              showGrainLine={true}
            />
          </TabsContent>

          {/* Blueprint Export Tab */}
          <TabsContent value="export">
            <div className="grid lg:grid-cols-2 gap-6">
              <TechnicalBlueprintExport
                terrain={selectedTerrain}
                selectedSize={selectedSize}
                includePatterns={true}
                includeMaterials={true}
                includeSpecs={true}
              />

              {/* Quick export options */}
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-6 bg-zinc-900 rounded-2xl border border-zinc-800"
                >
                  <h3 className="text-white font-semibold mb-4">Export Formats</h3>
                  
                  <div className="space-y-3">
                    <button className="w-full p-4 bg-zinc-800/50 hover:bg-zinc-800 rounded-xl border border-zinc-700 text-left transition-colors group">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-white font-medium">PDF Blueprint</h4>
                          <p className="text-zinc-500 text-sm">Complete manufacturing documentation</p>
                        </div>
                        <FileText className="w-5 h-5 text-zinc-500 group-hover:text-lavender-400 transition-colors" />
                      </div>
                    </button>

                    <button className="w-full p-4 bg-zinc-800/50 hover:bg-zinc-800 rounded-xl border border-zinc-700 text-left transition-colors group">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-white font-medium">SVG Patterns</h4>
                          <p className="text-zinc-500 text-sm">Vector pattern pieces for cutting</p>
                        </div>
                        <Layers className="w-5 h-5 text-zinc-500 group-hover:text-lavender-400 transition-colors" />
                      </div>
                    </button>

                    <button className="w-full p-4 bg-zinc-800/50 hover:bg-zinc-800 rounded-xl border border-zinc-700 text-left transition-colors group">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-white font-medium">3D Screenshot</h4>
                          <p className="text-zinc-500 text-sm">High-res isometric render</p>
                        </div>
                        <Camera className="w-5 h-5 text-zinc-500 group-hover:text-lavender-400 transition-colors" />
                      </div>
                    </button>
                  </div>
                </motion.div>

                {/* Colorway preview */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="p-6 bg-zinc-900 rounded-2xl border border-zinc-800"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <Palette className="w-5 h-5 text-lavender-400" />
                    <h3 className="text-white font-semibold">Colorway: {colorway.name}</h3>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-3">
                    <div className="text-center">
                      <div 
                        className="w-full aspect-square rounded-lg mb-2 border border-zinc-700"
                        style={{ backgroundColor: colorway.primary }}
                      />
                      <span className="text-zinc-500 text-xs">Primary</span>
                    </div>
                    <div className="text-center">
                      <div 
                        className="w-full aspect-square rounded-lg mb-2 border border-zinc-700"
                        style={{ backgroundColor: colorway.secondary }}
                      />
                      <span className="text-zinc-500 text-xs">Secondary</span>
                    </div>
                    <div className="text-center">
                      <div 
                        className="w-full aspect-square rounded-lg mb-2 border border-zinc-700"
                        style={{ backgroundColor: colorway.accent }}
                      />
                      <span className="text-zinc-500 text-xs">Accent</span>
                    </div>
                    <div className="text-center">
                      <div 
                        className="w-full aspect-square rounded-lg mb-2 border border-zinc-700"
                        style={{ backgroundColor: colorway.trim }}
                      />
                      <span className="text-zinc-500 text-xs">Trim</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
