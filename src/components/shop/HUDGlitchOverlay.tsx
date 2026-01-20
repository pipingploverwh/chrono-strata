import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

interface HUDGlitchOverlayProps {
  isActive: boolean;
  terrainColor?: string;
}

/**
 * Cinematic HUD glitch overlay for terrain transitions.
 * Creates a "smart fabric recalibrating" effect with scan lines,
 * glitch distortion, and topographic line redrawing.
 */
export const HUDGlitchOverlay = ({ isActive, terrainColor = "strata-cyan" }: HUDGlitchOverlayProps) => {
  const [glitchPhase, setGlitchPhase] = useState(0);

  useEffect(() => {
    if (isActive) {
      // Rapid glitch phases
      const phases = [0, 1, 2, 3, 4, 0];
      let index = 0;
      const interval = setInterval(() => {
        setGlitchPhase(phases[index]);
        index++;
        if (index >= phases.length) {
          clearInterval(interval);
        }
      }, 80);
      return () => clearInterval(interval);
    }
  }, [isActive]);

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          className="absolute inset-0 pointer-events-none z-20 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1 }}
        >
          {/* Scan lines sweep */}
          <motion.div
            className="absolute inset-0"
            initial={{ y: "-100%" }}
            animate={{ y: "100%" }}
            transition={{ duration: 0.4, ease: "linear" }}
            style={{
              background: `repeating-linear-gradient(
                0deg,
                transparent,
                transparent 2px,
                rgba(0, 255, 255, 0.1) 2px,
                rgba(0, 255, 255, 0.1) 4px
              )`,
            }}
          />

          {/* RGB split / chromatic aberration */}
          {glitchPhase > 0 && glitchPhase < 4 && (
            <>
              <motion.div
                className="absolute inset-0 mix-blend-screen"
                style={{
                  background: `linear-gradient(90deg, 
                    rgba(255, 0, 0, ${0.1 * glitchPhase}) ${glitchPhase * 2}px, 
                    transparent ${glitchPhase * 2}px
                  )`,
                  transform: `translateX(${glitchPhase * 2}px)`,
                }}
              />
              <motion.div
                className="absolute inset-0 mix-blend-screen"
                style={{
                  background: `linear-gradient(90deg, 
                    transparent ${glitchPhase * 2}px,
                    rgba(0, 0, 255, ${0.1 * glitchPhase}) ${glitchPhase * 2}px
                  )`,
                  transform: `translateX(-${glitchPhase * 2}px)`,
                }}
              />
            </>
          )}

          {/* Horizontal glitch bars */}
          {glitchPhase > 1 && (
            <motion.div className="absolute inset-0">
              {[15, 35, 55, 75].map((top, i) => (
                <motion.div
                  key={i}
                  className="absolute left-0 right-0 h-1 bg-strata-cyan/30"
                  style={{ top: `${top + (glitchPhase % 2) * 5}%` }}
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ 
                    scaleX: [0, 1.2, 0.8, 1], 
                    opacity: [0, 1, 0.5, 0],
                    x: [(i % 2 ? -20 : 20), 0, (i % 2 ? 10 : -10), 0]
                  }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                />
              ))}
            </motion.div>
          )}

          {/* Topographic lines redrawing */}
          <svg className="absolute inset-0 w-full h-full opacity-30">
            {[20, 40, 60, 80].map((y, i) => (
              <motion.path
                key={i}
                d={`M 0 ${y}% Q 25% ${y - 5 + (i * 2)}%, 50% ${y}% T 100% ${y - 3 + i}%`}
                fill="none"
                stroke={`hsl(var(--${terrainColor}))`}
                strokeWidth="1"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: [0, 0.8, 0.4] }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              />
            ))}
          </svg>

          {/* Flash overlay */}
          <motion.div
            className="absolute inset-0 bg-white"
            initial={{ opacity: 0.15 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />

          {/* Status text */}
          <motion.div
            className="absolute bottom-4 left-4 font-mono text-[10px] text-strata-cyan uppercase tracking-widest"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: [0, 1, 1, 0], x: 0 }}
            transition={{ duration: 0.6 }}
          >
            ▸ RECALIBRATING TERRAIN MATRIX...
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default HUDGlitchOverlay;
