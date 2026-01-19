import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BassDropParticlesProps {
  bassEnergy: number;
  isPlaying: boolean;
  getThermalColor: (temp: number) => string;
  temperature: number;
}

interface Particle {
  id: string;
  x: number;
  y: number;
  angle: number;
  speed: number;
  size: number;
  color: string;
  delay: number;
}

interface Burst {
  id: string;
  x: number;
  y: number;
  particles: Particle[];
  timestamp: number;
}

const BassDropParticles: React.FC<BassDropParticlesProps> = ({
  bassEnergy,
  isPlaying,
  getThermalColor,
  temperature
}) => {
  const [bursts, setBursts] = useState<Burst[]>([]);
  const lastBurstRef = useRef(0);
  const burstIdRef = useRef(0);

  // Detect bass drops and create bursts
  useEffect(() => {
    if (!isPlaying) return;

    const bassThreshold = 0.75;
    const cooldown = 300; // ms between bursts

    if (bassEnergy > bassThreshold && Date.now() - lastBurstRef.current > cooldown) {
      lastBurstRef.current = Date.now();
      burstIdRef.current++;

      // Random position for burst center
      const centerX = 20 + Math.random() * 60; // 20-80% of screen width
      const centerY = 20 + Math.random() * 60; // 20-80% of screen height

      // Create particles for this burst
      const particleCount = Math.floor(12 + bassEnergy * 20);
      const particles: Particle[] = Array.from({ length: particleCount }, (_, i) => ({
        id: `p-${burstIdRef.current}-${i}`,
        x: centerX,
        y: centerY,
        angle: (i / particleCount) * 360 + Math.random() * 30,
        speed: 100 + Math.random() * 200 + bassEnergy * 150,
        size: 3 + Math.random() * 8 + bassEnergy * 5,
        color: getThermalColor(temperature + (Math.random() - 0.5) * 30),
        delay: Math.random() * 0.05,
      }));

      const newBurst: Burst = {
        id: `burst-${burstIdRef.current}`,
        x: centerX,
        y: centerY,
        particles,
        timestamp: Date.now(),
      };

      setBursts(prev => [...prev, newBurst]);
    }
  }, [bassEnergy, isPlaying, getThermalColor, temperature]);

  // Cleanup old bursts
  useEffect(() => {
    const cleanup = setInterval(() => {
      const now = Date.now();
      setBursts(prev => prev.filter(b => now - b.timestamp < 2000));
    }, 500);
    return () => clearInterval(cleanup);
  }, []);

  const thermalColor = getThermalColor(temperature);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-30">
      <AnimatePresence>
        {bursts.map((burst) => (
          <div key={burst.id} className="absolute inset-0">
            {/* Central flash */}
            <motion.div
              className="absolute rounded-full"
              style={{
                left: `${burst.x}%`,
                top: `${burst.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
              initial={{ 
                width: 20, 
                height: 20, 
                opacity: 1,
                boxShadow: `0 0 60px 30px ${thermalColor}`,
              }}
              animate={{ 
                width: 200, 
                height: 200, 
                opacity: 0,
                boxShadow: `0 0 100px 50px transparent`,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />

            {/* Shockwave ring */}
            <motion.div
              className="absolute rounded-full border-2"
              style={{
                left: `${burst.x}%`,
                top: `${burst.y}%`,
                transform: 'translate(-50%, -50%)',
                borderColor: thermalColor,
              }}
              initial={{ 
                width: 10, 
                height: 10, 
                opacity: 0.8,
              }}
              animate={{ 
                width: 400, 
                height: 400, 
                opacity: 0,
              }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />

            {/* Particles */}
            {burst.particles.map((particle) => {
              const radians = (particle.angle * Math.PI) / 180;
              const endX = Math.cos(radians) * particle.speed;
              const endY = Math.sin(radians) * particle.speed;

              return (
                <motion.div
                  key={particle.id}
                  className="absolute rounded-full"
                  style={{
                    left: `${particle.x}%`,
                    top: `${particle.y}%`,
                    width: particle.size,
                    height: particle.size,
                    background: particle.color,
                    boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
                  }}
                  initial={{ 
                    x: 0, 
                    y: 0, 
                    opacity: 1,
                    scale: 1,
                  }}
                  animate={{ 
                    x: endX, 
                    y: endY, 
                    opacity: 0,
                    scale: 0.2,
                  }}
                  transition={{ 
                    duration: 0.8 + Math.random() * 0.4,
                    delay: particle.delay,
                    ease: 'easeOut',
                  }}
                />
              );
            })}

            {/* Trailing sparks */}
            {burst.particles.slice(0, 6).map((particle, i) => {
              const radians = (particle.angle * Math.PI) / 180;
              const endX = Math.cos(radians) * particle.speed * 0.6;
              const endY = Math.sin(radians) * particle.speed * 0.6;

              return (
                <motion.div
                  key={`spark-${particle.id}`}
                  className="absolute"
                  style={{
                    left: `${particle.x}%`,
                    top: `${particle.y}%`,
                    width: 2,
                    height: 20,
                    background: `linear-gradient(to bottom, ${thermalColor}, transparent)`,
                    transformOrigin: 'center top',
                    rotate: `${particle.angle + 90}deg`,
                  }}
                  initial={{ 
                    x: 0, 
                    y: 0, 
                    opacity: 0.8,
                    scaleY: 1,
                  }}
                  animate={{ 
                    x: endX, 
                    y: endY, 
                    opacity: 0,
                    scaleY: 0,
                  }}
                  transition={{ 
                    duration: 0.5,
                    delay: 0.1 + i * 0.02,
                    ease: 'easeOut',
                  }}
                />
              );
            })}
          </div>
        ))}
      </AnimatePresence>

      {/* Ambient bass pulse overlay */}
      {isPlaying && bassEnergy > 0.5 && (
        <motion.div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${thermalColor}${Math.floor(bassEnergy * 15).toString(16).padStart(2, '0')} 0%, transparent 70%)`,
          }}
          animate={{
            opacity: [0, bassEnergy * 0.3, 0],
          }}
          transition={{
            duration: 0.15,
            repeat: Infinity,
          }}
        />
      )}
    </div>
  );
};

export default BassDropParticles;
