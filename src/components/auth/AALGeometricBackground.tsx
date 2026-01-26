import { motion } from 'framer-motion';

/**
 * AAL Geometric Background
 * Inspired by Arielle Assouline-Lichten's bold angular forms with brass/copper accents
 * Features geometric corner accents, ruled precision lines, and layered depth
 */
export function AALGeometricBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950" />
      
      {/* Subtle grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(to right, hsl(var(--strata-steel)) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(var(--strata-steel)) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px'
        }}
      />

      {/* Top-left corner accent - AAL angular form */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="absolute top-0 left-0"
      >
        <svg width="200" height="200" viewBox="0 0 200 200" className="opacity-20">
          {/* Outer corner */}
          <path
            d="M0 0 L200 0 L200 4 L4 4 L4 200 L0 200 Z"
            fill="url(#brassGradient)"
          />
          {/* Inner geometric lines */}
          <line x1="24" y1="0" x2="24" y2="120" stroke="hsl(var(--strata-emerald))" strokeWidth="1" opacity="0.4" />
          <line x1="0" y1="24" x2="120" y2="24" stroke="hsl(var(--strata-emerald))" strokeWidth="1" opacity="0.4" />
          {/* Corner accent triangle */}
          <path
            d="M0 80 L80 0 L84 0 L0 84 Z"
            fill="hsl(var(--strata-emerald))"
            opacity="0.15"
          />
          <defs>
            <linearGradient id="brassGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#d4a574" />
              <stop offset="50%" stopColor="#c4956a" />
              <stop offset="100%" stopColor="#a07850" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>

      {/* Bottom-right corner accent */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="absolute bottom-0 right-0 rotate-180"
      >
        <svg width="200" height="200" viewBox="0 0 200 200" className="opacity-20">
          <path
            d="M0 0 L200 0 L200 4 L4 4 L4 200 L0 200 Z"
            fill="url(#brassGradient2)"
          />
          <line x1="24" y1="0" x2="24" y2="120" stroke="hsl(var(--strata-emerald))" strokeWidth="1" opacity="0.4" />
          <line x1="0" y1="24" x2="120" y2="24" stroke="hsl(var(--strata-emerald))" strokeWidth="1" opacity="0.4" />
          <defs>
            <linearGradient id="brassGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#d4a574" />
              <stop offset="100%" stopColor="#a07850" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>

      {/* Horizontal ruled precision lines */}
      <div className="absolute top-1/4 left-0 right-0 flex flex-col gap-[2px] opacity-10">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={`h-${i}`}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.2, delay: 0.4 + i * 0.1 }}
            className="h-px bg-gradient-to-r from-transparent via-strata-steel to-transparent origin-left"
          />
        ))}
      </div>

      {/* Vertical ruled precision lines */}
      <div className="absolute top-0 bottom-0 right-1/4 flex gap-[2px] opacity-10">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={`v-${i}`}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 1.2, delay: 0.5 + i * 0.1 }}
            className="w-px bg-gradient-to-b from-transparent via-strata-steel to-transparent origin-top"
          />
        ))}
      </div>

      {/* Floating geometric accent */}
      <motion.div
        initial={{ opacity: 0, rotate: 45, scale: 0.8 }}
        animate={{ opacity: 0.1, rotate: 45, scale: 1 }}
        transition={{ duration: 1, delay: 0.6 }}
        className="absolute top-1/2 -translate-y-1/2 -right-32 w-64 h-64 border border-strata-emerald/30"
      />
      
      {/* Secondary floating diamond */}
      <motion.div
        initial={{ opacity: 0, rotate: 45, scale: 0.8 }}
        animate={{ opacity: 0.05, rotate: 45, scale: 1 }}
        transition={{ duration: 1, delay: 0.8 }}
        className="absolute bottom-1/4 -left-16 w-32 h-32 border border-amber-500/30"
      />
    </div>
  );
}
