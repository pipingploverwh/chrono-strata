import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Flame, ArrowUpRight } from 'lucide-react';

const navItems = [
  { path: '/thermal', label: 'THERMAL', shortLabel: 'THR' },
  { path: '/thermal-slash', label: 'SLASH', shortLabel: 'SLH' },
  { path: '/thermal-visualizer', label: 'VISUALIZER', shortLabel: 'VIS' },
];

interface ThermalNavigationProps {
  variant?: 'light' | 'dark';
}

const ThermalNavigation = ({ variant = 'dark' }: ThermalNavigationProps) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;

  const textColor = variant === 'light' ? 'text-zinc-900' : 'text-white';
  const mutedColor = variant === 'light' ? 'text-zinc-500' : 'text-white/40';
  const accentColor = variant === 'light' ? 'border-zinc-400' : 'border-white/20';
  const hoverColor = variant === 'light' ? 'hover:text-zinc-700' : 'hover:text-white/80';

  return (
    <motion.header 
      className="fixed top-0 left-0 right-0 z-50"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* Kuma glass panel backdrop */}
      <div 
        className="absolute inset-0 border-b border-white/[0.03]"
        style={{ 
          background: 'linear-gradient(180deg, hsl(var(--kuma-glass-1)) 0%, transparent 100%)',
          backdropFilter: 'blur(12px)',
        }}
      />

      <nav className="relative flex items-center justify-between px-6 sm:px-8 py-4">
        {/* Left: Logo with geometric accent */}
        <motion.div 
          className="flex items-center gap-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Precision geometric prefix */}
          <motion.div 
            className="hidden sm:flex items-center gap-2"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="w-4 h-px bg-gradient-to-r from-transparent to-orange-500/40" />
            <motion.div 
              className="w-1 h-1 rotate-45 border border-orange-500/50"
              initial={{ scale: 0, rotate: 0 }}
              animate={{ scale: 1, rotate: 45 }}
              transition={{ duration: 0.3, delay: 0.6 }}
            />
          </motion.div>

          <Link 
            to="/thermal"
            className="flex items-center gap-2 group"
          >
            <Flame 
              className="w-4 h-4 transition-colors duration-300" 
              style={{ color: 'hsl(24 100% 50%)' }}
            />
            <span className={`text-[10px] tracking-[0.4em] font-light ${mutedColor} group-hover:text-orange-400 transition-colors`}>
              THERMAL RESONANCE
            </span>
          </Link>
        </motion.div>

        {/* Center: Navigation links with geometric separators */}
        <motion.div 
          className="hidden md:flex items-center gap-1"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {navItems.map((item, index) => (
            <div key={item.path} className="flex items-center">
              {index > 0 && (
                <motion.div 
                  className="flex items-center gap-1 mx-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                >
                  <div className="w-3 h-px bg-white/10" />
                  <div className="w-0.5 h-0.5 rotate-45 border border-white/15" />
                  <div className="w-3 h-px bg-white/10" />
                </motion.div>
              )}
              
              <Link
                to={item.path}
                className={`relative px-3 py-1.5 text-[9px] tracking-[0.25em] font-light transition-all duration-300 ${
                  isActive(item.path) 
                    ? 'text-orange-400' 
                    : `${mutedColor} ${hoverColor}`
                }`}
              >
                {isActive(item.path) && (
                  <motion.div
                    className="absolute inset-0 border border-orange-500/20 rounded-sm"
                    layoutId="activeNav"
                    style={{ 
                      background: 'hsl(24 100% 50% / 0.05)',
                    }}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">{item.label}</span>
              </Link>
            </div>
          ))}
        </motion.div>

        {/* Mobile: Compact nav */}
        <motion.div 
          className="flex md:hidden items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {navItems.map((item, index) => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-2 py-1 text-[8px] tracking-[0.2em] font-light transition-all duration-300 ${
                isActive(item.path) 
                  ? 'text-orange-400 border-b border-orange-500/30' 
                  : `${mutedColor} ${hoverColor}`
              }`}
            >
              {item.shortLabel}
            </Link>
          ))}
        </motion.div>

        {/* Right: CTA with geometric suffix */}
        <motion.div 
          className="flex items-center gap-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Link 
            to="/thermal-visualizer"
            className={`group flex items-center gap-1.5 text-[9px] tracking-[0.2em] font-light ${mutedColor} hover:text-orange-400 transition-colors`}
          >
            <span className="hidden sm:inline">LAUNCH</span>
            <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>

          {/* Precision geometric suffix */}
          <motion.div 
            className="hidden sm:flex items-center gap-2"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            style={{ originX: 1 }}
          >
            <motion.div 
              className="w-1 h-1 rotate-45 border border-white/15"
              initial={{ scale: 0, rotate: 0 }}
              animate={{ scale: 1, rotate: 45 }}
              transition={{ duration: 0.3, delay: 0.6 }}
            />
            <div className="w-6 h-px bg-gradient-to-r from-white/15 to-transparent" />
          </motion.div>
        </motion.div>
      </nav>

      {/* Kuma horizontal strata line */}
      <motion.div 
        className="absolute bottom-0 left-0 right-0 h-px"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.2, ease: "easeOut", delay: 0.5 }}
        style={{
          background: 'linear-gradient(90deg, transparent 0%, hsl(var(--kuma-slat)) 20%, hsl(var(--kuma-slat)) 80%, transparent 100%)',
          opacity: 0.15,
        }}
      />
    </motion.header>
  );
};

export default ThermalNavigation;
