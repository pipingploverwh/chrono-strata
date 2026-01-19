import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface KatakanaMarqueeProps {
  bpm: number | null;
  spectralEnergy: number;
  isPlaying: boolean;
  getThermalColor: (temp: number) => string;
  temperature: number;
}

// Phrases for the marquee - mix of branding and atmospheric text
const MARQUEE_PHRASES = [
  'DJ KREMBO × KAZUMA 551',
  'サーマルレゾナンス',
  'TOKYO × PARIS × BERLIN',
  '夜のコンソール',
  'THE NIGHT CONSOLE',
  'ビートの温度',
  'THERMAL RESONANCE',
  '音楽の熱',
  'SOUND TEMPERATURE',
  '渋谷サウンド',
  'SHIBUYA SOUND',
  'クラブミュージック',
];

const KatakanaMarquee: React.FC<KatakanaMarqueeProps> = ({
  bpm,
  spectralEnergy,
  isPlaying,
  getThermalColor,
  temperature
}) => {
  // Calculate scroll duration based on BPM (faster BPM = faster scroll)
  const baseDuration = 30; // seconds for one complete scroll
  const scrollDuration = useMemo(() => {
    if (!isPlaying || !bpm) return baseDuration;
    // Scale: 60 BPM = normal speed, 180 BPM = 3x faster
    const bpmFactor = Math.max(0.3, Math.min(3, bpm / 90));
    const energyBoost = 1 + spectralEnergy * 0.5;
    return baseDuration / (bpmFactor * energyBoost);
  }, [bpm, spectralEnergy, isPlaying]);

  // Build the repeating marquee content
  const marqueeContent = useMemo(() => {
    return MARQUEE_PHRASES.map((phrase, i) => (
      <span key={i} className="mx-8 whitespace-nowrap">
        {phrase}
        <span className="mx-4 opacity-50">◆</span>
      </span>
    ));
  }, []);

  const thermalColor = getThermalColor(temperature);
  const glowIntensity = isPlaying ? 10 + spectralEnergy * 20 : 5;

  return (
    <div className="absolute inset-x-0 bottom-0 overflow-hidden pointer-events-none z-20">
      {/* Top marquee - scrolls left */}
      <div 
        className="relative h-10 flex items-center overflow-hidden"
        style={{
          background: `linear-gradient(to right, hsl(270 30% 4%) 0%, transparent 5%, transparent 95%, hsl(270 30% 4%) 100%)`,
        }}
      >
        <motion.div
          className="flex whitespace-nowrap font-mono text-sm tracking-widest"
          style={{
            color: thermalColor,
            textShadow: `0 0 ${glowIntensity}px ${thermalColor}, 0 0 ${glowIntensity * 2}px rgba(220, 38, 127, 0.5)`,
          }}
          animate={{
            x: [0, -2000],
          }}
          transition={{
            duration: scrollDuration,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          {marqueeContent}
          {marqueeContent}
          {marqueeContent}
        </motion.div>
        
        {/* Separator line */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{
            background: `linear-gradient(90deg, transparent 0%, ${thermalColor}40 20%, ${thermalColor}60 50%, ${thermalColor}40 80%, transparent 100%)`,
          }}
        />
      </div>

      {/* Bottom marquee - scrolls right (reverse) */}
      <div 
        className="relative h-8 flex items-center overflow-hidden opacity-60"
        style={{
          background: `linear-gradient(to right, hsl(270 30% 4%) 0%, transparent 5%, transparent 95%, hsl(270 30% 4%) 100%)`,
        }}
      >
        <motion.div
          className="flex whitespace-nowrap font-mono text-xs tracking-[0.3em] uppercase"
          style={{
            color: getThermalColor(temperature - 20),
            textShadow: `0 0 ${glowIntensity * 0.5}px ${thermalColor}`,
          }}
          animate={{
            x: [-2000, 0],
          }}
          transition={{
            duration: scrollDuration * 1.3,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          {marqueeContent}
          {marqueeContent}
          {marqueeContent}
        </motion.div>
      </div>

      {/* BPM indicator overlay */}
      {bpm && isPlaying && (
        <motion.div
          className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-xs"
          style={{ color: thermalColor }}
          animate={{
            opacity: [0.5, 1, 0.5],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 60 / bpm,
            repeat: Infinity,
          }}
        >
          {Math.round(bpm)} BPM
        </motion.div>
      )}
    </div>
  );
};

export default KatakanaMarquee;
