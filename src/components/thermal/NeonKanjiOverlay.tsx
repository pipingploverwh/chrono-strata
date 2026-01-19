import { useMemo } from 'react';
import { motion } from 'framer-motion';

interface NeonKanjiOverlayProps {
  spectralData: {
    low: number;
    mid: number;
    high: number;
    energy: number;
  };
  isPlaying: boolean;
  getThermalColor: (temp: number) => string;
  temperature: number;
}

// Tokyo nightclub kanji vocabulary - audio-related terms
const KANJI_SETS = {
  energy: ['熱', '炎', '力', '音', '響', '波'],      // heat, flame, power, sound, echo, wave
  mood: ['夜', '闇', '光', '夢', '舞', '狂'],        // night, darkness, light, dream, dance, madness
  rhythm: ['拍', '律', '節', '動', '揺', '振'],      // beat, rhythm, tempo, motion, sway, vibration
  space: ['空', '深', '広', '遠', '近', '間'],       // sky, deep, wide, far, near, space
  emotion: ['愛', '痛', '酔', '熱', '冷', '燃'],     // love, pain, drunk, heat, cold, burn
  club: ['渋', '谷', '新', '宿', '夜', '遊'],        // Shibuya, Shinjuku, night, play
};

// Generate floating kanji particles
const NeonKanjiOverlay = ({ 
  spectralData, 
  isPlaying, 
  getThermalColor, 
  temperature 
}: NeonKanjiOverlayProps) => {
  
  // Generate kanji particles based on audio energy
  const kanjiParticles = useMemo(() => {
    const particles = [];
    const particleCount = 24;
    
    for (let i = 0; i < particleCount; i++) {
      // Select kanji based on position and variety
      const setKeys = Object.keys(KANJI_SETS) as (keyof typeof KANJI_SETS)[];
      const setIndex = i % setKeys.length;
      const set = KANJI_SETS[setKeys[setIndex]];
      const kanji = set[i % set.length];
      
      particles.push({
        id: i,
        kanji,
        // Distribute across the viewport
        x: (i % 6) * 16 + Math.random() * 8,
        y: Math.floor(i / 6) * 25 + Math.random() * 10,
        // Vary sizes
        size: 0.8 + Math.random() * 1.4,
        // Different animation delays
        delay: (i * 0.15) % 3,
        // Frequency band influence
        band: i % 3 === 0 ? 'low' : i % 3 === 1 ? 'mid' : 'high',
        // Rotation variation
        rotation: Math.random() * 20 - 10,
      });
    }
    
    return particles;
  }, []);

  // Get band-specific intensity
  const getBandIntensity = (band: 'low' | 'mid' | 'high') => {
    if (!isPlaying) return 0.15;
    switch (band) {
      case 'low': return Math.max(0.2, spectralData.low);
      case 'mid': return Math.max(0.2, spectralData.mid);
      case 'high': return Math.max(0.2, spectralData.high);
    }
  };

  // Dynamic color based on temperature and band
  const getKanjiColor = (band: 'low' | 'mid' | 'high', intensity: number) => {
    const baseTemp = temperature;
    const offset = band === 'low' ? -15 : band === 'high' ? 15 : 0;
    return getThermalColor(baseTemp + offset);
  };

  // Pulsing kanji that respond to specific frequency bands
  const PulsingKanji = ({ 
    kanji, 
    x, 
    y, 
    size, 
    delay, 
    band, 
    rotation 
  }: { 
    kanji: string; 
    x: number; 
    y: number; 
    size: number; 
    delay: number; 
    band: 'low' | 'mid' | 'high'; 
    rotation: number;
  }) => {
    const intensity = getBandIntensity(band);
    const color = getKanjiColor(band, intensity);
    const glowStrength = isPlaying ? 8 + intensity * 20 : 4;
    const scale = isPlaying ? 0.9 + intensity * 0.3 : 1;
    
    return (
      <motion.div
        className="absolute pointer-events-none select-none font-bold"
        style={{
          left: `${x}%`,
          top: `${y}%`,
          fontSize: `${size * (isPlaying ? 1 + spectralData.energy * 0.3 : 1)}rem`,
          color: color,
          textShadow: `
            0 0 ${glowStrength}px ${color},
            0 0 ${glowStrength * 2}px ${color},
            0 0 ${glowStrength * 3}px ${color}88
          `,
          opacity: isPlaying ? 0.3 + intensity * 0.5 : 0.15,
          transform: `rotate(${rotation}deg) scale(${scale})`,
          filter: `blur(${isPlaying ? 0 : 1}px)`,
          fontFamily: '"Noto Sans JP", "Hiragino Kaku Gothic Pro", "Yu Gothic", sans-serif',
          transition: 'all 0.08s ease-out',
        }}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ 
          opacity: isPlaying ? 0.3 + intensity * 0.5 : 0.15,
          scale,
          y: isPlaying ? [0, -5 * intensity, 0] : 0,
        }}
        transition={{
          opacity: { duration: 0.15 },
          scale: { duration: 0.1 },
          y: { 
            duration: 0.4 + delay * 0.1, 
            repeat: Infinity, 
            ease: 'easeInOut',
            delay: delay * 0.1 
          },
        }}
      >
        {kanji}
      </motion.div>
    );
  };

  // Large center kanji that responds to overall energy
  const CenterKanji = () => {
    const centerKanji = useMemo(() => {
      // Choose kanji based on temperature
      if (temperature > 60) return '燃'; // burning
      if (temperature > 40) return '熱'; // hot
      if (temperature > 25) return '響'; // resonance
      if (temperature > 10) return '音'; // sound
      return '静'; // quiet
    }, [temperature]);

    const intensity = spectralData.energy;
    const color = getThermalColor(temperature);
    const glowStrength = isPlaying ? 20 + intensity * 40 : 10;

    return (
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none"
        style={{
          fontSize: isPlaying ? `${4 + intensity * 3}rem` : '4rem',
          color: color,
          textShadow: `
            0 0 ${glowStrength}px ${color},
            0 0 ${glowStrength * 1.5}px ${color},
            0 0 ${glowStrength * 2.5}px ${color}66,
            0 0 ${glowStrength * 4}px ${color}33
          `,
          opacity: isPlaying ? 0.15 + intensity * 0.25 : 0.08,
          fontFamily: '"Noto Sans JP", "Hiragino Kaku Gothic Pro", "Yu Gothic", sans-serif',
          fontWeight: 900,
          transition: 'all 0.1s ease-out',
        }}
        animate={{
          scale: isPlaying ? [1, 1.05 + intensity * 0.1, 1] : 1,
          rotate: isPlaying ? [0, 2, -2, 0] : 0,
        }}
        transition={{
          duration: 0.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {centerKanji}
      </motion.div>
    );
  };

  // Vertical text strips - Tokyo street sign aesthetic
  const VerticalTextStrip = ({ 
    text, 
    x, 
    band 
  }: { 
    text: string; 
    x: number; 
    band: 'low' | 'mid' | 'high';
  }) => {
    const intensity = getBandIntensity(band);
    const color = getKanjiColor(band, intensity);
    const glowStrength = isPlaying ? 6 + intensity * 12 : 3;

    return (
      <motion.div
        className="absolute top-0 h-full pointer-events-none select-none"
        style={{
          left: `${x}%`,
          writingMode: 'vertical-rl',
          textOrientation: 'upright',
          fontSize: '0.65rem',
          letterSpacing: '0.3em',
          color: color,
          textShadow: `
            0 0 ${glowStrength}px ${color},
            0 0 ${glowStrength * 2}px ${color}88
          `,
          opacity: isPlaying ? 0.2 + intensity * 0.3 : 0.1,
          fontFamily: '"Noto Sans JP", "Hiragino Kaku Gothic Pro", "Yu Gothic", sans-serif',
          transition: 'all 0.1s ease-out',
        }}
        animate={{
          opacity: isPlaying ? [0.2 + intensity * 0.3, 0.3 + intensity * 0.4, 0.2 + intensity * 0.3] : 0.1,
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {text}
      </motion.div>
    );
  };

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
      {/* Background ambient kanji particles */}
      {kanjiParticles.map((particle) => (
        <PulsingKanji
          key={particle.id}
          kanji={particle.kanji}
          x={particle.x}
          y={particle.y}
          size={particle.size}
          delay={particle.delay}
          band={particle.band as 'low' | 'mid' | 'high'}
          rotation={particle.rotation}
        />
      ))}

      {/* Large center kanji - main focal point */}
      <CenterKanji />

      {/* Vertical text strips - Tokyo street aesthetic */}
      <VerticalTextStrip text="渋谷夜遊" x={3} band="low" />
      <VerticalTextStrip text="音響共振" x={97} band="high" />
      
      {/* Horizontal scrolling text at bottom */}
      <motion.div
        className="absolute bottom-4 left-0 right-0 overflow-hidden pointer-events-none"
        style={{ opacity: isPlaying ? 0.25 : 0.1 }}
      >
        <motion.div
          className="whitespace-nowrap"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          style={{
            fontSize: '0.75rem',
            letterSpacing: '0.5em',
            color: getThermalColor(temperature),
            textShadow: `0 0 10px ${getThermalColor(temperature)}`,
            fontFamily: '"Noto Sans JP", sans-serif',
          }}
        >
          夜の音楽 • THERMAL RESONANCE • 熱波共振 • DJ KREMBO × KAZUMA 551 • 
          夜の音楽 • THERMAL RESONANCE • 熱波共振 • DJ KREMBO × KAZUMA 551 • 
        </motion.div>
      </motion.div>

      {/* Corner kanji accents */}
      <motion.div
        className="absolute top-4 left-4 pointer-events-none"
        style={{
          fontSize: '1.5rem',
          color: getThermalColor(temperature - 10),
          textShadow: `0 0 15px ${getThermalColor(temperature - 10)}`,
          opacity: isPlaying ? 0.4 + spectralData.low * 0.4 : 0.2,
          fontFamily: '"Noto Sans JP", sans-serif',
          fontWeight: 700,
        }}
        animate={{ 
          scale: isPlaying ? [1, 1.1, 1] : 1,
        }}
        transition={{ duration: 0.5, repeat: Infinity }}
      >
        低
      </motion.div>
      
      <motion.div
        className="absolute top-4 right-4 pointer-events-none"
        style={{
          fontSize: '1.5rem',
          color: getThermalColor(temperature + 10),
          textShadow: `0 0 15px ${getThermalColor(temperature + 10)}`,
          opacity: isPlaying ? 0.4 + spectralData.high * 0.4 : 0.2,
          fontFamily: '"Noto Sans JP", sans-serif',
          fontWeight: 700,
        }}
        animate={{ 
          scale: isPlaying ? [1, 1.1, 1] : 1,
        }}
        transition={{ duration: 0.4, repeat: Infinity }}
      >
        高
      </motion.div>
    </div>
  );
};

export default NeonKanjiOverlay;
