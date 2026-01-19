import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface VerticalKatakanaColumnsProps {
  spectralData: {
    bass: number;
    mid: number;
    treble: number;
  };
  isPlaying: boolean;
  getThermalColor: (temp: number) => string;
  temperature: number;
}

// Katakana character set
const KATAKANA = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンガギグゲゴザジズゼゾダヂヅデドバビブベボパピプペポ'.split('');

const VerticalKatakanaColumns: React.FC<VerticalKatakanaColumnsProps> = ({
  spectralData,
  isPlaying,
  getThermalColor,
  temperature
}) => {
  // Generate columns with random characters
  const columns = useMemo(() => {
    const leftColumns = Array.from({ length: 3 }, (_, colIndex) => ({
      id: `left-${colIndex}`,
      side: 'left' as const,
      offset: colIndex * 24,
      chars: Array.from({ length: 30 }, () => KATAKANA[Math.floor(Math.random() * KATAKANA.length)]),
      speed: 15 + colIndex * 5,
      delay: colIndex * 0.5,
    }));

    const rightColumns = Array.from({ length: 3 }, (_, colIndex) => ({
      id: `right-${colIndex}`,
      side: 'right' as const,
      offset: colIndex * 24,
      chars: Array.from({ length: 30 }, () => KATAKANA[Math.floor(Math.random() * KATAKANA.length)]),
      speed: 18 + colIndex * 4,
      delay: colIndex * 0.3,
    }));

    return [...leftColumns, ...rightColumns];
  }, []);

  const thermalColor = getThermalColor(temperature);
  const bassGlow = spectralData.bass * 30;

  return (
    <>
      {columns.map((column) => {
        const speedMultiplier = isPlaying ? 1 + spectralData.mid * 0.5 : 0.3;
        const duration = column.speed / speedMultiplier;

        return (
          <div
            key={column.id}
            className="fixed top-0 bottom-0 overflow-hidden pointer-events-none z-10"
            style={{
              [column.side]: `${8 + column.offset}px`,
              width: '20px',
            }}
          >
            {/* Scrolling column */}
            <motion.div
              className="flex flex-col items-center gap-1"
              animate={{
                y: ['-100%', '0%'],
              }}
              transition={{
                duration,
                repeat: Infinity,
                ease: 'linear',
                delay: column.delay,
              }}
            >
              {[...column.chars, ...column.chars].map((char, i) => {
                const charOpacity = 0.2 + (i % 10) * 0.08;
                const isHighlighted = i % 7 === 0;
                
                return (
                  <motion.span
                    key={`${column.id}-${i}`}
                    className="font-mono text-sm leading-tight"
                    style={{
                      color: isHighlighted ? thermalColor : `${thermalColor}80`,
                      opacity: isPlaying ? charOpacity + spectralData.bass * 0.3 : charOpacity * 0.5,
                      textShadow: isHighlighted 
                        ? `0 0 ${5 + bassGlow}px ${thermalColor}, 0 0 ${10 + bassGlow}px rgba(220, 38, 127, 0.5)`
                        : 'none',
                      filter: isHighlighted ? 'none' : 'blur(0.5px)',
                    }}
                    animate={isPlaying && isHighlighted ? {
                      opacity: [charOpacity, 1, charOpacity],
                      scale: [1, 1.1, 1],
                    } : {}}
                    transition={{
                      duration: 0.5 + (i % 3) * 0.2,
                      repeat: Infinity,
                    }}
                  >
                    {char}
                  </motion.span>
                );
              })}
            </motion.div>

            {/* Gradient fade at top and bottom */}
            <div 
              className="absolute top-0 left-0 right-0 h-32 pointer-events-none"
              style={{
                background: 'linear-gradient(to bottom, hsl(270 30% 4%) 0%, transparent 100%)',
              }}
            />
            <div 
              className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
              style={{
                background: 'linear-gradient(to top, hsl(270 30% 4%) 0%, transparent 100%)',
              }}
            />
          </div>
        );
      })}

      {/* Side glow effects */}
      <div 
        className="fixed top-0 bottom-0 left-0 w-24 pointer-events-none z-5"
        style={{
          background: `linear-gradient(to right, ${thermalColor}${isPlaying ? '15' : '08'} 0%, transparent 100%)`,
        }}
      />
      <div 
        className="fixed top-0 bottom-0 right-0 w-24 pointer-events-none z-5"
        style={{
          background: `linear-gradient(to left, ${thermalColor}${isPlaying ? '15' : '08'} 0%, transparent 100%)`,
        }}
      />
    </>
  );
};

export default VerticalKatakanaColumns;
