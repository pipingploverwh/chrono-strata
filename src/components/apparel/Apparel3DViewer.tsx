import { useState, useRef, Suspense, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Float, Html, MeshTransmissionMaterial, RoundedBox } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import { 
  RotateCcw, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Grid3X3, 
  Layers, 
  Ruler, 
  Move3D,
  Eye,
  EyeOff,
  Palette,
  Box,
  Camera,
  ShoppingBag,
  Monitor
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { PatternPiece, Colorway, Viewer3DState } from './types';
import { STRATA_PATTERN_PIECES, STRATA_COLORWAYS, STRATA_MATERIALS } from './data/strataShellPatterns';

interface Apparel3DViewerProps {
  terrain?: 'standard' | 'marine' | 'polar' | 'desert' | 'urban';
  onPieceSelect?: (pieceId: string | null) => void;
  onScreenshot?: (dataUrl: string) => void;
  onAddToCart?: () => void;
  showPricing?: boolean;
  className?: string;
}

// Enhanced realistic jacket piece component
function JacketPiece3D({ 
  piece, 
  colorway, 
  isSelected, 
  isHighlighted,
  explodeDistance,
  showWireframe,
  showHUD,
  onClick 
}: { 
  piece: PatternPiece;
  colorway: Colorway;
  isSelected: boolean;
  isHighlighted: boolean;
  explodeDistance: number;
  showWireframe: boolean;
  showHUD: boolean;
  onClick: () => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const hudRef = useRef<THREE.Mesh>(null);
  
  // Animate on hover/selection
  useFrame((state) => {
    if (meshRef.current) {
      const targetScale = isHighlighted ? 1.03 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
    // HUD glow animation
    if (hudRef.current && piece.id === 'hud-bezel') {
      const glowIntensity = 0.5 + Math.sin(state.clock.elapsedTime * 2) * 0.3;
      (hudRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = glowIntensity;
    }
  });

  // Calculate exploded position with smooth easing
  const explodedPosition: [number, number, number] = useMemo(() => [
    piece.position[0] * (1 + explodeDistance * 0.6),
    piece.position[1] * (1 + explodeDistance * 0.4),
    piece.position[2] * (1 + explodeDistance * 0.6),
  ], [piece.position, explodeDistance]);

  // Color based on fabric type with enhanced material properties
  const getColor = () => {
    if (isSelected) return '#7c3aed';
    if (isHighlighted) return colorway.accent;
    switch (piece.fabricType) {
      case 'shell': return colorway.primary;
      case 'lining': return colorway.secondary;
      case 'hardware': return colorway.trim;
      case 'insulation': return '#f5f5f5';
      default: return colorway.primary;
    }
  };

  // Geometry based on piece type for more realistic shapes
  const getGeometry = () => {
    switch (piece.id) {
      case 'front-left':
      case 'front-right':
        return <boxGeometry args={[0.35, 0.55, 0.03]} />;
      case 'back':
        return <boxGeometry args={[0.7, 0.6, 0.025]} />;
      case 'sleeve-left':
      case 'sleeve-right':
        return <cylinderGeometry args={[0.08, 0.12, 0.5, 12]} />;
      case 'hood':
        return <sphereGeometry args={[0.2, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.6]} />;
      case 'pocket-left':
      case 'pocket-right':
        return <boxGeometry args={[0.12, 0.1, 0.02]} />;
      case 'hud-bezel':
        return <boxGeometry args={[0.08, 0.05, 0.015]} />;
      default:
        return <boxGeometry args={[0.3, 0.4, 0.02]} />;
    }
  };

  // HUD Display special rendering
  if (piece.id === 'hud-bezel' && showHUD) {
    return (
      <group position={explodedPosition}>
        <mesh
          ref={hudRef}
          rotation={piece.rotation}
          scale={piece.scale}
          onClick={(e) => { e.stopPropagation(); onClick(); }}
        >
          <boxGeometry args={[0.1, 0.06, 0.02]} />
          <meshStandardMaterial 
            color="#00ffff"
            emissive="#00ffff"
            emissiveIntensity={0.8}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
        {/* HUD Screen glow */}
        <mesh position={[0, 0, 0.012]} rotation={piece.rotation}>
          <planeGeometry args={[0.08, 0.04]} />
          <meshBasicMaterial color="#00ffff" transparent opacity={0.6} />
        </mesh>
        {/* HUD data overlay */}
        <Html position={[0, 0, 0.02]} center style={{ pointerEvents: 'none' }}>
          <div className="px-1 py-0.5 bg-cyan-500/20 text-cyan-400 text-[6px] font-mono rounded backdrop-blur-sm border border-cyan-500/30">
            <div>TEMP: -12°C</div>
            <div>ALT: 2,400m</div>
          </div>
        </Html>
      </group>
    );
  }

  return (
    <mesh
      ref={meshRef}
      position={explodedPosition}
      rotation={piece.rotation}
      scale={piece.scale}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      {getGeometry()}
      <meshStandardMaterial 
        color={getColor()}
        wireframe={showWireframe}
        metalness={piece.fabricType === 'hardware' ? 0.85 : 0.15}
        roughness={piece.fabricType === 'hardware' ? 0.15 : 0.7}
        transparent
        opacity={isSelected ? 1 : 0.92}
        envMapIntensity={piece.fabricType === 'shell' ? 0.8 : 0.3}
      />
      
      {/* Selection highlight ring */}
      {isSelected && (
        <mesh scale={1.05}>
          {getGeometry()}
          <meshBasicMaterial color="#7c3aed" transparent opacity={0.3} />
        </mesh>
      )}
      
      {/* Label on hover */}
      {isHighlighted && (
        <Html
          position={[0, 0.35, 0]}
          center
          style={{ pointerEvents: 'none' }}
        >
          <div className="px-3 py-1.5 bg-zinc-900/95 text-white text-xs rounded-lg font-mono whitespace-nowrap backdrop-blur-sm border border-lavender-500/40 shadow-lg">
            <div className="font-semibold">{piece.name}</div>
            <div className="text-zinc-400 text-[10px]">{piece.area} sq in</div>
          </div>
        </Html>
      )}
    </mesh>
  );
}

// Assembled jacket mesh with realistic form
function JacketMesh({ 
  pieces, 
  colorway, 
  selectedPiece, 
  highlightedPiece,
  explodeDistance,
  showWireframe,
  showHUD,
  onPieceClick 
}: {
  pieces: PatternPiece[];
  colorway: Colorway;
  selectedPiece: string | null;
  highlightedPiece: string | null;
  explodeDistance: number;
  showWireframe: boolean;
  showHUD: boolean;
  onPieceClick: (pieceId: string) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);

  // Gentle rotation when idle
  useFrame((state) => {
    if (groupRef.current && explodeDistance === 0) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.15) * 0.08;
    }
  });

  return (
    <group ref={groupRef}>
      {pieces.map((piece) => (
        <JacketPiece3D
          key={piece.id}
          piece={piece}
          colorway={colorway}
          isSelected={selectedPiece === piece.id}
          isHighlighted={highlightedPiece === piece.id}
          explodeDistance={explodeDistance}
          showWireframe={showWireframe}
          showHUD={showHUD}
          onClick={() => onPieceClick(piece.id)}
        />
      ))}
    </group>
  );
}

// Camera presets
const CAMERA_PRESETS = {
  front: { position: [0, 0, 3] as [number, number, number], label: 'Front' },
  back: { position: [0, 0, -3] as [number, number, number], label: 'Back' },
  side: { position: [3, 0, 0] as [number, number, number], label: 'Side' },
  top: { position: [0, 3, 0] as [number, number, number], label: 'Top' },
  iso: { position: [2, 1.5, 2] as [number, number, number], label: 'Isometric' },
};

// Pricing data
const PRICING = {
  standard: 1495,
  marine: 1595,
  polar: 1695,
  desert: 1545,
  urban: 1445,
};

export function Apparel3DViewer({ 
  terrain = 'standard', 
  onPieceSelect,
  onScreenshot,
  onAddToCart,
  showPricing = true,
  className = '' 
}: Apparel3DViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const colorway = STRATA_COLORWAYS[terrain];
  const price = PRICING[terrain];
  
  // Viewer state
  const [viewerState, setViewerState] = useState<Viewer3DState>({
    cameraPosition: CAMERA_PRESETS.iso.position,
    cameraTarget: [0, 0, 0],
    rotation: [0, 0, 0],
    zoom: 1,
    showWireframe: false,
    showSeams: true,
    showMeasurements: false,
    explodedView: false,
    explodeDistance: 0,
    selectedPiece: null,
    highlightedPiece: null,
  });
  
  const [showHUD, setShowHUD] = useState(true);
  const [screenshotCount, setScreenshotCount] = useState(0);
  const [savedConfigs, setSavedConfigs] = useState<string[]>([]);

  const handlePieceClick = (pieceId: string) => {
    const newSelected = viewerState.selectedPiece === pieceId ? null : pieceId;
    setViewerState(prev => ({ ...prev, selectedPiece: newSelected }));
    onPieceSelect?.(newSelected);
  };

  const handlePieceHover = (pieceId: string | null) => {
    setViewerState(prev => ({ ...prev, highlightedPiece: pieceId }));
  };

  const toggleExplodedView = () => {
    setViewerState(prev => ({
      ...prev,
      explodedView: !prev.explodedView,
      explodeDistance: prev.explodedView ? 0 : 1,
    }));
  };

  const handleScreenshot = () => {
    if (canvasRef.current) {
      const dataUrl = canvasRef.current.toDataURL('image/png');
      setScreenshotCount(prev => prev + 1);
      setSavedConfigs(prev => [...prev.slice(-4), dataUrl]);
      onScreenshot?.(dataUrl);
      
      // Auto-download screenshot
      const link = document.createElement('a');
      link.download = `strata-shell-${terrain}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    }
  };

  const selectedPieceData = STRATA_PATTERN_PIECES.find(p => p.id === viewerState.selectedPiece);

  return (
    <div className={`relative bg-zinc-950 rounded-2xl overflow-hidden border border-zinc-800 ${className}`}>
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4 flex items-center justify-between bg-gradient-to-b from-zinc-950/95 to-transparent">
        <div className="flex items-center gap-3">
          <Badge className="bg-lavender-600 text-white font-mono text-xs">
            3D CONFIGURATOR
          </Badge>
          <span className="text-zinc-400 text-sm font-mono">
            STRATA Shell — {colorway.name}
          </span>
          <Badge className="bg-emerald-600/20 text-emerald-400 border-0 text-[10px]">
            <Monitor className="w-3 h-3 mr-1" />
            DESKTOP 100%
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          {Object.entries(CAMERA_PRESETS).map(([key, preset]) => (
            <Button
              key={key}
              variant="ghost"
              size="sm"
              className="text-zinc-400 hover:text-white text-xs font-mono h-7 px-2"
              onClick={() => setViewerState(prev => ({ 
                ...prev, 
                cameraPosition: preset.position 
              }))}
            >
              {preset.label}
            </Button>
          ))}
        </div>
      </div>

      {/* 3D Canvas */}
      <Canvas
        ref={canvasRef}
        className="!h-[500px]"
        gl={{ preserveDrawingBuffer: true, antialias: true }}
        onPointerMissed={() => handlePieceClick('')}
      >
        <Suspense fallback={null}>
          <PerspectiveCamera 
            makeDefault 
            position={viewerState.cameraPosition}
            fov={45}
          />
          <OrbitControls 
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={1.5}
            maxDistance={8}
            dampingFactor={0.05}
            enableDamping
          />
          
          {/* Enhanced Lighting */}
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 8, 5]} intensity={1} castShadow shadow-mapSize={2048} />
          <directionalLight position={[-5, 3, -5]} intensity={0.5} />
          <spotLight position={[0, 10, 0]} intensity={0.4} angle={0.4} penumbra={1} />
          <pointLight position={[2, 2, 2]} intensity={0.3} color="#7c3aed" />
          
          {/* Environment */}
          <Environment preset="studio" />
          
          {/* Grid floor */}
          <gridHelper args={[10, 20, '#3f3f46', '#27272a']} position={[0, -1.5, 0]} />
          
          {/* Jacket mesh */}
          <Float speed={0.8} rotationIntensity={0.08} floatIntensity={0.15}>
            <JacketMesh
              pieces={STRATA_PATTERN_PIECES}
              colorway={colorway}
              selectedPiece={viewerState.selectedPiece}
              highlightedPiece={viewerState.highlightedPiece}
              explodeDistance={viewerState.explodeDistance}
              showWireframe={viewerState.showWireframe}
              showHUD={showHUD}
              onPieceClick={handlePieceClick}
            />
          </Float>
        </Suspense>
      </Canvas>

      {/* Pricing Panel - Real-time */}
      {showPricing && (
        <div className="absolute top-20 left-4 z-10 p-4 bg-zinc-900/95 backdrop-blur-sm rounded-xl border border-zinc-700 min-w-[180px]">
          <div className="text-[10px] font-mono text-zinc-500 uppercase mb-1">Configuration Total</div>
          <div className="text-2xl font-bold text-white mb-2">${price.toLocaleString()}</div>
          <div className="space-y-1 text-xs text-zinc-400 mb-3">
            <div className="flex justify-between">
              <span>Base Shell</span>
              <span className="text-white">${(price - 200).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>HUD Display</span>
              <span className="text-cyan-400">+$200</span>
            </div>
          </div>
          <Button 
            onClick={onAddToCart}
            className="w-full bg-lavender-600 hover:bg-lavender-700 text-white text-sm"
            size="sm"
          >
            <ShoppingBag className="w-4 h-4 mr-2" />
            Add to Cart
          </Button>
        </div>
      )}

      {/* Controls Panel */}
      <div className="absolute bottom-0 left-0 right-0 z-10 p-4 bg-gradient-to-t from-zinc-950 via-zinc-950/95 to-transparent">
        <div className="flex items-center justify-between">
          {/* Left controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className={`h-8 border-zinc-700 ${viewerState.explodedView ? 'bg-lavender-600 border-lavender-500 text-white' : 'text-zinc-400'}`}
              onClick={toggleExplodedView}
            >
              <Layers className="w-4 h-4 mr-1" />
              Explode
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              className={`h-8 border-zinc-700 ${viewerState.showWireframe ? 'bg-lavender-600 border-lavender-500 text-white' : 'text-zinc-400'}`}
              onClick={() => setViewerState(prev => ({ ...prev, showWireframe: !prev.showWireframe }))}
            >
              <Grid3X3 className="w-4 h-4 mr-1" />
              Wire
            </Button>

            <Button
              variant="outline"
              size="sm"
              className={`h-8 border-zinc-700 ${showHUD ? 'bg-cyan-600 border-cyan-500 text-white' : 'text-zinc-400'}`}
              onClick={() => setShowHUD(!showHUD)}
            >
              <Monitor className="w-4 h-4 mr-1" />
              HUD
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="h-8 border-zinc-700 text-zinc-400 hover:text-white hover:border-lavender-500"
              onClick={handleScreenshot}
            >
              <Camera className="w-4 h-4 mr-1" />
              Capture {screenshotCount > 0 && `(${screenshotCount})`}
            </Button>
          </div>

          {/* Explode slider */}
          {viewerState.explodedView && (
            <div className="flex items-center gap-3 px-4">
              <span className="text-zinc-500 text-xs font-mono">EXPLODE</span>
              <Slider
                value={[viewerState.explodeDistance]}
                onValueChange={([value]) => setViewerState(prev => ({ ...prev, explodeDistance: value }))}
                min={0}
                max={2}
                step={0.1}
                className="w-32"
              />
            </div>
          )}

          {/* Right controls */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 px-3 py-1.5 bg-zinc-900 rounded-lg border border-zinc-800">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colorway.primary }} />
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colorway.accent }} />
              <span className="text-zinc-400 text-xs ml-1 font-mono">{colorway.name}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Selected piece info panel */}
      <AnimatePresence>
        {selectedPieceData && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute top-20 right-4 z-10 w-72 p-4 bg-zinc-900/95 backdrop-blur-sm rounded-xl border border-zinc-700"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-semibold">{selectedPieceData.name}</h3>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 text-zinc-400"
                onClick={() => handlePieceClick('')}
              >
                <EyeOff className="w-3 h-3" />
              </Button>
            </div>
            
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-zinc-800">
                <span className="text-zinc-500">Fabric Type</span>
                <span className="text-zinc-300 font-mono capitalize">{selectedPieceData.fabricType}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-800">
                <span className="text-zinc-500">Area</span>
                <span className="text-zinc-300 font-mono">{selectedPieceData.area} sq in</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-800">
                <span className="text-zinc-500">Seam Allowance</span>
                <span className="text-zinc-300 font-mono">{selectedPieceData.seamAllowance}"</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-zinc-500">Position</span>
                <span className="text-zinc-300 font-mono text-[10px]">
                  {selectedPieceData.position.map(p => p.toFixed(2)).join(', ')}
                </span>
              </div>
            </div>

            {/* Material info */}
            <div className="mt-3 pt-3 border-t border-zinc-800">
              <div className="text-[10px] font-mono text-zinc-500 uppercase mb-2">Material Spec</div>
              <div className="text-xs text-zinc-400">
                {selectedPieceData.fabricType === 'shell' && 'Vulcanized Hydrophobic Membrane • 20,000mm H₂O'}
                {selectedPieceData.fabricType === 'lining' && 'Thermal Retention Lining • 25,000 g/m²/24h'}
                {selectedPieceData.fabricType === 'hardware' && 'Anodized Aluminum • Cyan HUD Display'}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Apparel3DViewer;
