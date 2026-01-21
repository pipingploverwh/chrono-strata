import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Ruler, 
  Scissors, 
  Download, 
  ZoomIn, 
  ZoomOut, 
  Move,
  Grid,
  RotateCcw,
  Printer
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PatternPiece } from './types';
import { STRATA_PATTERN_PIECES, STRATA_COLORWAYS } from './data/strataShellPatterns';

interface PatternLayout2DProps {
  terrain?: 'standard' | 'marine' | 'polar' | 'desert' | 'urban';
  showSeamAllowance?: boolean;
  showGrainLine?: boolean;
  scale?: number;
  onExportSVG?: (svg: string) => void;
  className?: string;
}

// Pattern piece 2D component
function PatternPiece2D({ 
  piece, 
  accentColor,
  showSeamAllowance,
  showGrainLine,
  isSelected,
  onClick,
  index
}: { 
  piece: PatternPiece;
  accentColor: string;
  showSeamAllowance: boolean;
  showGrainLine: boolean;
  isSelected: boolean;
  onClick: () => void;
  index: number;
}) {
  // Calculate grid position (2 columns)
  const col = index % 3;
  const row = Math.floor(index / 3);
  const offsetX = 20 + col * 200;
  const offsetY = 20 + row * 180;

  return (
    <g 
      transform={`translate(${offsetX}, ${offsetY})`}
      onClick={onClick}
      style={{ cursor: 'pointer' }}
    >
      {/* Pattern piece shape */}
      <motion.path
        d={piece.svgPath}
        fill={isSelected ? `${accentColor}20` : '#27272a'}
        stroke={isSelected ? accentColor : '#52525b'}
        strokeWidth={isSelected ? 2 : 1}
        transform="scale(0.35)"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.05 }}
      />
      
      {/* Seam allowance indicator */}
      {showSeamAllowance && (
        <motion.path
          d={piece.svgPath}
          fill="none"
          stroke="#7c3aed"
          strokeWidth={0.5}
          strokeDasharray="4,2"
          transform={`scale(0.38) translate(-4, -4)`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
        />
      )}
      
      {/* Grain line */}
      {showGrainLine && piece.fabricType !== 'hardware' && (
        <line
          x1={50}
          y1={20}
          x2={50}
          y2={100}
          stroke="#71717a"
          strokeWidth={1}
          markerEnd="url(#arrowhead)"
        />
      )}
      
      {/* Label */}
      <text
        x={60}
        y={130}
        fill="#a1a1aa"
        fontSize="10"
        fontFamily="monospace"
      >
        {piece.name}
      </text>
      
      {/* Area badge */}
      <text
        x={60}
        y={145}
        fill="#71717a"
        fontSize="8"
        fontFamily="monospace"
      >
        {piece.area} sq in
      </text>
    </g>
  );
}

export function PatternLayout2D({ 
  terrain = 'standard',
  showSeamAllowance = true,
  showGrainLine = true,
  scale = 1,
  onExportSVG,
  className = ''
}: PatternLayout2DProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const colorway = STRATA_COLORWAYS[terrain];
  const [selectedPiece, setSelectedPiece] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [showSeams, setShowSeams] = useState(showSeamAllowance);
  const [showGrain, setShowGrain] = useState(showGrainLine);

  // Group pieces by type
  const shellPieces = STRATA_PATTERN_PIECES.filter(p => p.fabricType === 'shell');
  const liningPieces = STRATA_PATTERN_PIECES.filter(p => p.fabricType === 'lining');
  const hardwarePieces = STRATA_PATTERN_PIECES.filter(p => p.fabricType === 'hardware');

  const handleExportSVG = () => {
    if (svgRef.current) {
      const svgData = new XMLSerializer().serializeToString(svgRef.current);
      onExportSVG?.(svgData);
      
      // Also trigger download
      const blob = new Blob([svgData], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `strata-shell-${terrain}-pattern.svg`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const totalArea = STRATA_PATTERN_PIECES.reduce((sum, p) => sum + p.area, 0);

  return (
    <div className={`bg-zinc-950 rounded-2xl overflow-hidden border border-zinc-800 ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Badge className="bg-zinc-800 text-zinc-300 font-mono text-xs">
            2D PATTERN LAYOUT
          </Badge>
          <span className="text-zinc-500 text-sm font-mono">
            {STRATA_PATTERN_PIECES.length} pieces • {totalArea.toLocaleString()} sq in
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className={`h-8 border-zinc-700 ${showSeams ? 'bg-lavender-600/20 border-lavender-500/50 text-lavender-400' : 'text-zinc-400'}`}
            onClick={() => setShowSeams(!showSeams)}
          >
            <Scissors className="w-4 h-4 mr-1" />
            Seams
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className={`h-8 border-zinc-700 ${showGrain ? 'bg-lavender-600/20 border-lavender-500/50 text-lavender-400' : 'text-zinc-400'}`}
            onClick={() => setShowGrain(!showGrain)}
          >
            <Grid className="w-4 h-4 mr-1" />
            Grain
          </Button>

          <div className="flex items-center gap-1 border-l border-zinc-700 pl-2 ml-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-zinc-400"
              onClick={() => setZoom(z => Math.max(0.5, z - 0.1))}
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            <span className="text-zinc-500 text-xs font-mono w-12 text-center">
              {Math.round(zoom * 100)}%
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-zinc-400"
              onClick={() => setZoom(z => Math.min(2, z + 0.1))}
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            className="h-8 border-zinc-700 text-zinc-400"
            onClick={handleExportSVG}
          >
            <Download className="w-4 h-4 mr-1" />
            Export SVG
          </Button>
        </div>
      </div>

      {/* Pattern canvas */}
      <div className="overflow-auto bg-zinc-900/50" style={{ maxHeight: '600px' }}>
        <svg
          ref={svgRef}
          viewBox={`0 0 ${620 / zoom} ${600 / zoom}`}
          className="w-full min-h-[500px]"
          style={{ background: '#18181b' }}
        >
          {/* Defs */}
          <defs>
            <marker
              id="arrowhead"
              markerWidth="6"
              markerHeight="6"
              refX="0"
              refY="3"
              orient="auto"
            >
              <polygon points="0 0, 6 3, 0 6" fill="#71717a" />
            </marker>
            
            <pattern
              id="grid-pattern"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 20 0 L 0 0 0 20"
                fill="none"
                stroke="#27272a"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          
          {/* Grid background */}
          <rect width="100%" height="100%" fill="url(#grid-pattern)" />
          
          {/* Section: Shell pieces */}
          <g>
            <text x="20" y="15" fill="#7c3aed" fontSize="10" fontFamily="monospace" fontWeight="bold">
              SHELL PIECES
            </text>
            {shellPieces.map((piece, i) => (
              <PatternPiece2D
                key={piece.id}
                piece={piece}
                accentColor={colorway.accent}
                showSeamAllowance={showSeams}
                showGrainLine={showGrain}
                isSelected={selectedPiece === piece.id}
                onClick={() => setSelectedPiece(selectedPiece === piece.id ? null : piece.id)}
                index={i}
              />
            ))}
          </g>
          
          {/* Section divider */}
          <line x1="20" y1="400" x2="600" y2="400" stroke="#3f3f46" strokeWidth="1" strokeDasharray="8,4" />
          
          {/* Section: Lining & Hardware */}
          <g transform="translate(0, 380)">
            <text x="20" y="35" fill="#7c3aed" fontSize="10" fontFamily="monospace" fontWeight="bold">
              LINING & HARDWARE
            </text>
            {[...liningPieces, ...hardwarePieces].map((piece, i) => (
              <PatternPiece2D
                key={piece.id}
                piece={piece}
                accentColor={colorway.accent}
                showSeamAllowance={showSeams}
                showGrainLine={showGrain}
                isSelected={selectedPiece === piece.id}
                onClick={() => setSelectedPiece(selectedPiece === piece.id ? null : piece.id)}
                index={i}
              />
            ))}
          </g>
          
          {/* Scale indicator */}
          <g transform="translate(520, 560)">
            <line x1="0" y1="0" x2="60" y2="0" stroke="#71717a" strokeWidth="1" />
            <line x1="0" y1="-5" x2="0" y2="5" stroke="#71717a" strokeWidth="1" />
            <line x1="60" y1="-5" x2="60" y2="5" stroke="#71717a" strokeWidth="1" />
            <text x="30" y="15" fill="#71717a" fontSize="8" fontFamily="monospace" textAnchor="middle">
              6 inches
            </text>
          </g>
        </svg>
      </div>

      {/* Footer stats */}
      <div className="p-4 border-t border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-4 text-xs font-mono text-zinc-500">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded border border-zinc-600 bg-zinc-800" />
            <span>Pattern Piece</span>
          </div>
          {showSeams && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-0 border-t border-dashed border-lavender-500" />
              <span>Seam Allowance</span>
            </div>
          )}
          {showGrain && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 flex items-center justify-center">↓</div>
              <span>Grain Line</span>
            </div>
          )}
        </div>
        
        <div className="text-xs font-mono text-zinc-400">
          STRATA Shell — {colorway.name}
        </div>
      </div>
    </div>
  );
}

export default PatternLayout2D;
