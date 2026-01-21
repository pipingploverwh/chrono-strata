import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, 
  User, 
  Smartphone, 
  Maximize2, 
  RotateCcw, 
  Sparkles,
  X,
  Check,
  AlertCircle,
  Ruler,
  ScanLine
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { STRATA_COLORWAYS, STRATA_SIZES } from './data/strataShellPatterns';

interface ARPreviewOverlayProps {
  terrain?: 'standard' | 'marine' | 'polar' | 'desert' | 'urban';
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

// Simulated body detection state
type DetectionState = 'initializing' | 'scanning' | 'detected' | 'error';

export function ARPreviewOverlay({
  terrain = 'standard',
  isOpen,
  onClose,
  className = ''
}: ARPreviewOverlayProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const colorway = STRATA_COLORWAYS[terrain];
  
  const [detectionState, setDetectionState] = useState<DetectionState>('initializing');
  const [cameraActive, setCameraActive] = useState(false);
  const [overlayOpacity, setOverlayOpacity] = useState(0.85);
  const [selectedSize, setSelectedSize] = useState('M');
  const [fitScore, setFitScore] = useState<number | null>(null);

  // Initialize camera
  useEffect(() => {
    if (isOpen && !cameraActive) {
      initCamera();
    }
    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, [isOpen]);

  const initCamera = async () => {
    try {
      setDetectionState('initializing');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 640, height: 480 }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
        
        // Simulate detection flow
        setTimeout(() => setDetectionState('scanning'), 1000);
        setTimeout(() => {
          setDetectionState('detected');
          setFitScore(Math.floor(Math.random() * 15) + 85); // 85-100
        }, 3000);
      }
    } catch (error) {
      console.error('Camera access denied:', error);
      setDetectionState('error');
    }
  };

  // Draw overlay on canvas
  useEffect(() => {
    if (detectionState === 'detected' && canvasRef.current && videoRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        // Draw jacket overlay silhouette
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        ctx.globalAlpha = overlayOpacity;
        
        // Jacket outline (simplified for demo)
        ctx.strokeStyle = colorway.accent;
        ctx.lineWidth = 2;
        ctx.setLineDash([8, 4]);
        
        // Draw torso area
        ctx.beginPath();
        ctx.moveTo(200, 120);
        ctx.lineTo(440, 120);
        ctx.lineTo(460, 160);
        ctx.lineTo(480, 380);
        ctx.lineTo(400, 400);
        ctx.lineTo(320, 400);
        ctx.lineTo(240, 400);
        ctx.lineTo(160, 380);
        ctx.lineTo(180, 160);
        ctx.closePath();
        ctx.stroke();
        
        // Fill with colorway
        ctx.globalAlpha = 0.3;
        ctx.fillStyle = colorway.primary;
        ctx.fill();
        
        // Size markers
        ctx.globalAlpha = 1;
        ctx.fillStyle = colorway.accent;
        ctx.font = '10px monospace';
        ctx.fillText(`SIZE ${selectedSize}`, 300, 420);
      }
    }
  }, [detectionState, overlayOpacity, colorway, selectedSize]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`fixed inset-0 z-50 bg-black ${className}`}
      >
        {/* Camera feed */}
        <div className="relative w-full h-full">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
          
          {/* AR overlay canvas */}
          <canvas
            ref={canvasRef}
            width={640}
            height={480}
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          />

          {/* Scanning overlay */}
          {detectionState === 'scanning' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <motion.div
                className="w-80 h-96 border-2 border-lavender-500 rounded-2xl"
                animate={{
                  borderColor: ['#7c3aed', '#a78bfa', '#7c3aed'],
                  boxShadow: [
                    '0 0 20px rgba(124, 58, 237, 0.3)',
                    '0 0 40px rgba(124, 58, 237, 0.5)',
                    '0 0 20px rgba(124, 58, 237, 0.3)',
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {/* Scanning line */}
                <motion.div
                  className="absolute left-0 right-0 h-0.5 bg-lavender-500"
                  animate={{ top: ['10%', '90%', '10%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                />
              </motion.div>
              
              <div className="absolute bottom-32 text-center">
                <ScanLine className="w-6 h-6 text-lavender-400 mx-auto mb-2 animate-pulse" />
                <p className="text-white text-sm font-medium">Detecting body position...</p>
                <p className="text-zinc-400 text-xs mt-1">Stand back and face the camera</p>
              </div>
            </motion.div>
          )}

          {/* Error state */}
          {detectionState === 'error' && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/80">
              <div className="text-center">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <p className="text-white text-lg font-medium mb-2">Camera Access Required</p>
                <p className="text-zinc-400 text-sm mb-4">Please enable camera access to use AR preview</p>
                <Button onClick={initCamera} className="bg-lavender-600 hover:bg-lavender-700">
                  Try Again
                </Button>
              </div>
            </div>
          )}

          {/* Header controls */}
          <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 to-transparent">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Badge className="bg-lavender-600 text-white font-mono">
                  AR PREVIEW
                </Badge>
                <span className="text-white text-sm">
                  STRATA Shell — {colorway.name}
                </span>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/10"
                onClick={onClose}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Detection status */}
          {detectionState === 'detected' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-20 left-4 right-4"
            >
              <div className="flex items-center justify-center gap-2 py-2 px-4 bg-green-500/20 border border-green-500/50 rounded-full mx-auto w-fit">
                <Check className="w-4 h-4 text-green-500" />
                <span className="text-green-400 text-sm font-medium">Body Detected</span>
              </div>
            </motion.div>
          )}

          {/* Bottom controls */}
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/80 to-transparent">
            {/* Fit score */}
            {fitScore && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-4 p-4 bg-zinc-900/90 backdrop-blur rounded-xl border border-zinc-800"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-lavender-400" />
                    <span className="text-white font-medium">Fit Analysis</span>
                  </div>
                  <Badge className={`${fitScore >= 90 ? 'bg-green-600' : 'bg-yellow-600'} text-white`}>
                    {fitScore}% Match
                  </Badge>
                </div>
                <p className="text-zinc-400 text-sm">
                  {fitScore >= 90 
                    ? 'Excellent fit! This size is recommended for your body type.'
                    : 'Good fit. Consider sizing up for a looser silhouette.'}
                </p>
              </motion.div>
            )}

            {/* Size selector */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-zinc-400 text-sm">Select Size</span>
                <Ruler className="w-4 h-4 text-zinc-500" />
              </div>
              <div className="flex gap-2">
                {STRATA_SIZES.map(size => (
                  <Button
                    key={size.code}
                    variant="outline"
                    size="sm"
                    className={`flex-1 font-mono ${
                      selectedSize === size.code
                        ? 'bg-lavender-600 border-lavender-500 text-white'
                        : 'border-zinc-700 text-zinc-400'
                    }`}
                    onClick={() => setSelectedSize(size.code)}
                  >
                    {size.code}
                  </Button>
                ))}
              </div>
            </div>

            {/* Opacity control */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-zinc-400 text-sm">Overlay Opacity</span>
                <span className="text-zinc-500 text-xs font-mono">{Math.round(overlayOpacity * 100)}%</span>
              </div>
              <Slider
                value={[overlayOpacity]}
                onValueChange={([v]) => setOverlayOpacity(v)}
                min={0.2}
                max={1}
                step={0.05}
                className="w-full"
              />
            </div>

            {/* Action buttons */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 border-zinc-700 text-zinc-300"
                onClick={initCamera}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
              <Button
                className="flex-1 bg-lavender-600 hover:bg-lavender-700 text-white"
                onClick={onClose}
              >
                <Check className="w-4 h-4 mr-2" />
                Confirm Size
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default ARPreviewOverlay;
