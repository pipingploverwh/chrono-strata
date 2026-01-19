import { motion } from 'framer-motion';

interface LavandarBackgroundProps {
  variant?: 'dark' | 'light';
  showWaves?: boolean;
  showPolygons?: boolean;
  intensity?: number;
}

const LavandarBackground = ({ 
  variant = 'dark', 
  showWaves = true, 
  showPolygons = true,
  intensity = 1 
}: LavandarBackgroundProps) => {
  const isDark = variant === 'dark';
  
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Base gradient background */}
      <div 
        className="absolute inset-0"
        style={{
          background: isDark 
            ? 'linear-gradient(135deg, hsl(270 30% 8%) 0%, hsl(280 25% 12%) 50%, hsl(260 35% 10%) 100%)'
            : 'linear-gradient(135deg, hsl(270 20% 95%) 0%, hsl(280 15% 90%) 50%, hsl(260 25% 92%) 100%)',
        }}
      />

      {/* Geometric polygon pattern */}
      {showPolygons && (
        <div className="absolute inset-0">
          {/* Large polygons - subtle background layer */}
          <svg 
            className="absolute inset-0 w-full h-full opacity-20" 
            viewBox="0 0 1920 1080" 
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <linearGradient id="polyGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={isDark ? 'hsl(280 40% 25%)' : 'hsl(280 30% 80%)'} />
                <stop offset="100%" stopColor={isDark ? 'hsl(260 30% 15%)' : 'hsl(260 20% 85%)'} />
              </linearGradient>
              <linearGradient id="polyGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={isDark ? 'hsl(270 35% 20%)' : 'hsl(270 25% 82%)'} />
                <stop offset="100%" stopColor={isDark ? 'hsl(290 25% 12%)' : 'hsl(290 15% 88%)'} />
              </linearGradient>
            </defs>
            
            {/* Background polygons */}
            <polygon points="0,0 400,0 200,300 0,200" fill="url(#polyGrad1)" opacity="0.4" />
            <polygon points="300,0 700,0 500,400 300,250" fill="url(#polyGrad2)" opacity="0.3" />
            <polygon points="1400,0 1920,0 1920,350 1600,200" fill="url(#polyGrad1)" opacity="0.35" />
            <polygon points="1700,150 1920,300 1920,600 1750,450" fill="url(#polyGrad2)" opacity="0.25" />
            <polygon points="0,700 300,600 400,900 100,1080 0,1080" fill="url(#polyGrad1)" opacity="0.3" />
            <polygon points="1500,800 1920,700 1920,1080 1600,1080" fill="url(#polyGrad2)" opacity="0.35" />
            <polygon points="800,900 1100,850 1200,1080 900,1080" fill="url(#polyGrad1)" opacity="0.2" />
          </svg>
          
          {/* Small decorative triangles with dots */}
          <div className="absolute inset-0">
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={`poly-${i}`}
                className="absolute w-2 h-2 rounded-full"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 0.4 * intensity, scale: 1 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                style={{
                  left: `${10 + (i * 7) % 80}%`,
                  top: `${15 + (i * 11) % 70}%`,
                  background: isDark ? 'hsl(280 50% 60%)' : 'hsl(280 40% 50%)',
                  boxShadow: `0 0 8px hsl(280 50% 60% / 0.5)`,
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Flowing luminous wave ribbons */}
      {showWaves && (
        <div className="absolute inset-0">
          <svg 
            className="absolute inset-0 w-full h-full" 
            viewBox="0 0 1920 1080" 
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              {/* Main wave gradient */}
              <linearGradient id="waveGrad1" x1="0%" y1="50%" x2="100%" y2="50%">
                <stop offset="0%" stopColor="hsl(280 60% 50%)" stopOpacity="0.1" />
                <stop offset="30%" stopColor="hsl(300 70% 70%)" stopOpacity="0.6" />
                <stop offset="50%" stopColor="hsl(320 60% 80%)" stopOpacity="0.8" />
                <stop offset="70%" stopColor="hsl(300 70% 70%)" stopOpacity="0.6" />
                <stop offset="100%" stopColor="hsl(280 60% 50%)" stopOpacity="0.1" />
              </linearGradient>
              
              {/* Secondary wave gradient */}
              <linearGradient id="waveGrad2" x1="0%" y1="50%" x2="100%" y2="50%">
                <stop offset="0%" stopColor="hsl(260 50% 45%)" stopOpacity="0.05" />
                <stop offset="40%" stopColor="hsl(280 60% 60%)" stopOpacity="0.4" />
                <stop offset="60%" stopColor="hsl(300 50% 70%)" stopOpacity="0.5" />
                <stop offset="100%" stopColor="hsl(260 50% 45%)" stopOpacity="0.05" />
              </linearGradient>
              
              {/* Glow filter */}
              <filter id="waveGlow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            {/* Primary flowing wave */}
            <motion.path
              d="M-100,540 C200,400 400,650 700,500 S1000,350 1300,480 S1600,620 1920,450 L2020,450"
              fill="none"
              stroke="url(#waveGrad1)"
              strokeWidth="80"
              strokeLinecap="round"
              filter="url(#waveGlow)"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: intensity * 0.8 }}
              transition={{ duration: 2, ease: "easeOut" }}
            />
            
            {/* Secondary wave - offset */}
            <motion.path
              d="M-50,600 C250,500 450,720 750,580 S1050,420 1350,550 S1650,680 2000,520"
              fill="none"
              stroke="url(#waveGrad2)"
              strokeWidth="50"
              strokeLinecap="round"
              filter="url(#waveGlow)"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: intensity * 0.6 }}
              transition={{ duration: 2.5, ease: "easeOut", delay: 0.3 }}
            />
            
            {/* Tertiary subtle wave */}
            <motion.path
              d="M0,480 C300,380 500,600 800,450 S1100,300 1400,430 S1700,580 1920,400"
              fill="none"
              stroke="url(#waveGrad2)"
              strokeWidth="30"
              strokeLinecap="round"
              filter="url(#waveGlow)"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: intensity * 0.4 }}
              transition={{ duration: 3, ease: "easeOut", delay: 0.5 }}
            />
          </svg>
          
          {/* Particle sparkles along waves */}
          <div className="absolute inset-0">
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={`spark-${i}`}
                className="absolute rounded-full"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: [0, 0.8 * intensity, 0],
                  scale: [0, 1, 0.5],
                }}
                transition={{
                  duration: 2 + (i % 3),
                  delay: 0.5 + (i * 0.08),
                  repeat: Infinity,
                  repeatDelay: 1 + (i % 2),
                }}
                style={{
                  left: `${5 + (i * 3.2) % 90}%`,
                  top: `${35 + Math.sin(i * 0.5) * 20}%`,
                  width: `${2 + (i % 3)}px`,
                  height: `${2 + (i % 3)}px`,
                  background: 'hsl(300 80% 85%)',
                  boxShadow: '0 0 6px hsl(300 80% 75%), 0 0 12px hsl(280 60% 60%)',
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Soft vignette overlay */}
      <div 
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at center, transparent 40%, ${isDark ? 'hsl(270 30% 6%)' : 'hsl(270 20% 95%)'} 100%)`,
        }}
      />
      
      {/* Connection line grid - subtle architectural element */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(hsl(280 40% 50%) 1px, transparent 1px),
            linear-gradient(90deg, hsl(280 40% 50%) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />
    </div>
  );
};

export default LavandarBackground;
