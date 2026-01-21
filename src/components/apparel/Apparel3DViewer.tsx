import { useState, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Float, Html, useHelper } from '@react-three/drei';
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
  Camera
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { PatternPiece, Colorway, Viewer3DState } from './types';
import { STRATA_PATTERN_PIECES, STRATA_COLORWAYS } from './data/strataShellPatterns';

interface Apparel3DViewerProps {
  terrain?: 'standard' | 'marine' | 'polar' | 'desert' | 'urban';
  onPieceSelect?: (pieceId: string | null) => void;
  onScreenshot?: (dataUrl: string) => void;
  className?: string;
}

// Individual pattern piece 3D component
function PatternPiece3D({ 
  piece, 
  colorway, 
  isSelected, 
  isHighlighted,
  explodeDistance,
  showWireframe,
  onClick 
}: { 
  piece: PatternPiece;
  colorway: Colorway;
  isSelected: boolean;
  isHighlighted: boolean;
  explodeDistance: number;
  showWireframe: boolean;
  onClick: () => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Animate on hover/selection
  useFrame((state) => {
    if (meshRef.current) {
      const targetScale = isHighlighted ? 1.02 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
  });

  // Calculate exploded position
  const explodedPosition: [number, number, number] = [
    piece.position[0] * (1 + explodeDistance * 0.5),
    piece.position[1] * (1 + explodeDistance * 0.3),
    piece.position[2] * (1 + explodeDistance * 0.5),
  ];

  // Color based on fabric type
  const getColor = () => {
    if (isSelected) return '#7c3aed'; // lavender-600
    if (isHighlighted) return colorway.accent;
    switch (piece.fabricType) {
      case 'shell': return colorway.primary;
      case 'lining': return colorway.secondary;
      case 'hardware': return colorway.trim;
      default: return colorway.primary;
    }
  };

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
      {/* Use simple box geometry for pattern pieces */}
      <boxGeometry args={[0.3, 0.4, 0.02]} />
      <meshStandardMaterial 
        color={getColor()}
        wireframe={showWireframe}
        metalness={piece.fabricType === 'hardware' ? 0.8 : 0.1}
        roughness={piece.fabricType === 'hardware' ? 0.2 : 0.8}
        transparent
        opacity={isSelected ? 1 : 0.9}
      />
      
      {/* Label on hover */}
      {isHighlighted && (
        <Html
          position={[0, 0.3, 0]}
          center
          style={{ pointerEvents: 'none' }}
        >
          <div className="px-2 py-1 bg-zinc-900/90 text-white text-xs rounded font-mono whitespace-nowrap backdrop-blur-sm border border-lavender-500/30">
            {piece.name}
          </div>
        </Html>
      )}
    </mesh>
  );
}

// Assembled jacket mesh
function JacketMesh({ 
  pieces, 
  colorway, 
  selectedPiece, 
  highlightedPiece,
  explodeDistance,
  showWireframe,
  onPieceClick 
}: {
  pieces: PatternPiece[];
  colorway: Colorway;
  selectedPiece: string | null;
  highlightedPiece: string | null;
  explodeDistance: number;
  showWireframe: boolean;
  onPieceClick: (pieceId: string) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);

  // Gentle rotation when idle
  useFrame((state) => {
    if (groupRef.current && explodeDistance === 0) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {pieces.map((piece) => (
        <PatternPiece3D
          key={piece.id}
          piece={piece}
          colorway={colorway}
          isSelected={selectedPiece === piece.id}
          isHighlighted={highlightedPiece === piece.id}
          explodeDistance={explodeDistance}
          showWireframe={showWireframe}
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

export function Apparel3DViewer({ 
  terrain = 'standard', 
  onPieceSelect,
  onScreenshot,
  className = '' 
}: Apparel3DViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const colorway = STRATA_COLORWAYS[terrain];
  
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
      onScreenshot?.(dataUrl);
    }
  };

  const selectedPieceData = STRATA_PATTERN_PIECES.find(p => p.id === viewerState.selectedPiece);

  return (
    <div className={`relative bg-zinc-950 rounded-2xl overflow-hidden border border-zinc-800 ${className}`}>
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4 flex items-center justify-between bg-gradient-to-b from-zinc-950/90 to-transparent">
        <div className="flex items-center gap-3">
          <Badge className="bg-lavender-600 text-white font-mono text-xs">
            3D BLUEPRINT
          </Badge>
          <span className="text-zinc-400 text-sm font-mono">
            STRATA Shell — {colorway.name}
          </span>
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
        gl={{ preserveDrawingBuffer: true }}
        onPointerMissed={() => handlePieceClick('')}
      >
        <Suspense fallback={null}>
          <PerspectiveCamera 
            makeDefault 
            position={viewerState.cameraPosition}
            fov={50}
          />
          <OrbitControls 
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={1.5}
            maxDistance={8}
          />
          
          {/* Lighting */}
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 5, 5]} intensity={0.8} castShadow />
          <directionalLight position={[-5, 3, -5]} intensity={0.4} />
          <spotLight position={[0, 8, 0]} intensity={0.3} angle={0.5} penumbra={1} />
          
          {/* Environment */}
          <Environment preset="studio" />
          
          {/* Grid floor */}
          <gridHelper args={[10, 20, '#3f3f46', '#27272a']} position={[0, -1.5, 0]} />
          
          {/* Jacket mesh */}
          <Float speed={1} rotationIntensity={0.1} floatIntensity={0.2}>
            <JacketMesh
              pieces={STRATA_PATTERN_PIECES}
              colorway={colorway}
              selectedPiece={viewerState.selectedPiece}
              highlightedPiece={viewerState.highlightedPiece}
              explodeDistance={viewerState.explodeDistance}
              showWireframe={viewerState.showWireframe}
              onPieceClick={handlePieceClick}
            />
          </Float>
        </Suspense>
      </Canvas>

      {/* Controls Panel */}
      <div className="absolute bottom-0 left-0 right-0 z-10 p-4 bg-gradient-to-t from-zinc-950 via-zinc-950/90 to-transparent">
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
              className="h-8 border-zinc-700 text-zinc-400"
              onClick={handleScreenshot}
            >
              <Camera className="w-4 h-4 mr-1" />
              Capture
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
            <div className="flex items-center gap-1 px-2 py-1 bg-zinc-900 rounded border border-zinc-800">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colorway.primary }} />
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colorway.accent }} />
              <span className="text-zinc-500 text-xs ml-1 font-mono">{colorway.name}</span>
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
            className="absolute top-20 right-4 z-10 w-64 p-4 bg-zinc-900/95 backdrop-blur-sm rounded-xl border border-zinc-700"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-semibold text-sm">{selectedPieceData.name}</h3>
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
              <div className="flex justify-between">
                <span className="text-zinc-500">Fabric Type</span>
                <span className="text-zinc-300 font-mono capitalize">{selectedPieceData.fabricType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Area</span>
                <span className="text-zinc-300 font-mono">{selectedPieceData.area} sq in</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Seam Allowance</span>
                <span className="text-zinc-300 font-mono">{selectedPieceData.seamAllowance}"</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Position</span>
                <span className="text-zinc-300 font-mono">
                  {selectedPieceData.position.map(p => p.toFixed(1)).join(', ')}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Apparel3DViewer;
