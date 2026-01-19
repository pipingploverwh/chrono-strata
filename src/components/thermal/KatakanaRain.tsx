import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface KatakanaRainProps {
  spectralData: {
    bass: number;
    lowMid: number;
    mid: number;
    highMid: number;
    treble: number;
  };
  isPlaying: boolean;
  getThermalColor: (temp: number) => string;
}

interface RainDrop {
  id: string;
  x: number;
  char: string;
  delay: number;
  duration: number;
  size: number;
  opacity: number;
  column: number;
}

// Full katakana character set
const KATAKANA = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン'.split('');

const KatakanaRain: React.FC<KatakanaRainProps> = ({
  spectralData,
  isPlaying,
  getThermalColor
}) => {
  const [drops, setDrops] = useState<RainDrop[]>([]);
  const columnCount = 24;
  const lastBeatRef = useRef(0);
  const dropIdCounter = useRef(0);

  // Detect beats from bass energy
  useEffect(() => {
    if (!isPlaying) return;

    const bassEnergy = spectralData.bass;
    const beatThreshold = 0.6;
    
    // Trigger new drops on beat
    if (bassEnergy > beatThreshold && Date.now() - lastBeatRef.current > 100) {
      lastBeatRef.current = Date.now();
      
      // Create multiple drops on strong beats
      const dropCount = Math.floor(bassEnergy * 8) + 2;
      const newDrops: RainDrop[] = [];
      
      for (let i = 0; i < dropCount; i++) {
        const column = Math.floor(Math.random() * columnCount);
        dropIdCounter.current++;
        
        newDrops.push({
          id: `drop-${dropIdCounter.current}`,
          x: (column / columnCount) * 100,
          char: KATAKANA[Math.floor(Math.random() * KATAKANA.length)],
          delay: Math.random() * 0.2,
          duration: 2 + Math.random() * 2,
          size: 14 + Math.random() * 10,
          opacity: 0.4 + bassEnergy * 0.6,
          column
        });
      }
      
      setDrops(prev => [...prev, ...newDrops]);
    }

    // Continuous rain based on energy
    const interval = setInterval(() => {
      if (!isPlaying) return;
      
      const energy = (spectralData.bass + spectralData.mid) / 2;
      if (energy > 0.2) {
        const column = Math.floor(Math.random() * columnCount);
        dropIdCounter.current++;
        
        setDrops(prev => [...prev, {
          id: `drop-${dropIdCounter.current}`,
          x: (column / columnCount) * 100,
          char: KATAKANA[Math.floor(Math.random() * KATAKANA.length)],
          delay: 0,
          duration: 3 + Math.random() * 2,
          size: 12 + Math.random() * 8,
          opacity: 0.2 + energy * 0.4,
          column
        }]);
      }
    }, 150);

    return () => clearInterval(interval);
  }, [spectralData, isPlaying]);

  // Clean up old drops
  useEffect(() => {
    const cleanup = setInterval(() => {
      setDrops(prev => prev.slice(-100)); // Keep max 100 drops
    }, 1000);
    return () => clearInterval(cleanup);
  }, []);

  // Get dynamic glow color based on spectral data
  const getGlowColor = (opacity: number) => {
    const temp = (spectralData.bass * 0.4 + spectralData.mid * 0.3 + spectralData.treble * 0.3) * 100;
    return getThermalColor(temp);
  };

  const bassGlow = spectralData.bass * 20;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
      {/* Grid overlay for cyberpunk effect */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(90deg, rgba(220, 38, 127, 0.1) 1px, transparent 1px),
            linear-gradient(rgba(220, 38, 127, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: `${100 / columnCount}% 20px`
        }}
      />

      {/* Rain drops */}
      <AnimatePresence mode="popLayout">
        {drops.map((drop) => (
          <motion.div
            key={drop.id}
            initial={{ 
              y: -50,
              opacity: 0,
              scale: 0.5
            }}
            animate={{ 
              y: '110vh',
              opacity: [0, drop.opacity, drop.opacity, 0],
              scale: [0.5, 1, 1, 0.8]
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: drop.duration,
              delay: drop.delay,
              ease: 'linear',
              opacity: {
                times: [0, 0.1, 0.8, 1]
              }
            }}
            className="absolute font-mono"
            style={{
              left: `${drop.x}%`,
              fontSize: `${drop.size}px`,
              color: getGlowColor(drop.opacity),
              textShadow: `
                0 0 ${5 + bassGlow}px ${getGlowColor(drop.opacity)},
                0 0 ${10 + bassGlow}px ${getGlowColor(drop.opacity)},
                0 0 ${20 + bassGlow}px rgba(220, 38, 127, 0.5)
              `,
              filter: `blur(${spectralData.treble > 0.7 ? 0 : 0.5}px)`
            }}
          >
            {drop.char}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Trail effect - fading characters */}
      <AnimatePresence>
        {drops.slice(-30).map((drop, index) => (
          <motion.div
            key={`trail-${drop.id}`}
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0, 0.15, 0],
              y: ['0%', '20%']
            }}
            transition={{
              duration: 1,
              delay: drop.delay + 0.3
            }}
            className="absolute font-mono"
            style={{
              left: `${drop.x}%`,
              top: '10%',
              fontSize: `${drop.size * 0.8}px`,
              color: 'rgba(220, 38, 127, 0.3)',
              textShadow: `0 0 10px rgba(220, 38, 127, 0.3)`
            }}
          >
            {KATAKANA[Math.floor(Math.random() * KATAKANA.length)]}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Bottom glow reflection */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background: `linear-gradient(to top, 
            rgba(220, 38, 127, ${0.1 + spectralData.bass * 0.15}) 0%,
            transparent 100%
          )`
        }}
      />
    </div>
  );
};

export default KatakanaRain;
