import React, { useState } from "react";
import { motion } from "framer-motion";

// ═══════════════════════════════════════════════════════════════════════════════
// SMOOTH SPRING CONFIGS - AAL Motion Language
// ═══════════════════════════════════════════════════════════════════════════════

export const springConfig = {
  gentle: { type: "spring" as const, stiffness: 120, damping: 20 },
  smooth: { type: "spring" as const, stiffness: 200, damping: 25 },
  snappy: { type: "spring" as const, stiffness: 300, damping: 30 },
  float: { type: "spring" as const, stiffness: 80, damping: 15 },
};

// ═══════════════════════════════════════════════════════════════════════════════
// ARCHITECTURAL ELEMENTS - AAL Glass & Precision
// ═══════════════════════════════════════════════════════════════════════════════

export const GlassPanel = ({ 
  children, 
  className = "",
  intensity = 1,
  onClick
}: { 
  children: React.ReactNode; 
  className?: string;
  intensity?: 1 | 2 | 3;
  onClick?: () => void;
}) => (
  <div 
    onClick={onClick}
    className={`
      relative overflow-hidden rounded-2xl
      bg-white/[0.02]
      backdrop-blur-[12px]
      border border-white/[0.06]
      shadow-[0_8px_32px_-8px_hsl(0_0%_0%/0.3)]
      ${onClick ? 'cursor-pointer' : ''}
      ${className}
    `}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-transparent pointer-events-none" />
    {children}
  </div>
);

export const GeometricAccent = ({ position = "top-left" }: { position?: "top-left" | "top-right" | "bottom-left" | "bottom-right" }) => {
  const positionClasses = {
    "top-left": "top-0 left-0",
    "top-right": "top-0 right-0 rotate-90",
    "bottom-left": "bottom-0 left-0 -rotate-90",
    "bottom-right": "bottom-0 right-0 rotate-180",
  };
  
  return (
    <div className={`absolute ${positionClasses[position]} w-8 h-8 pointer-events-none`}>
      <svg viewBox="0 0 32 32" className="w-full h-full">
        <path 
          d="M0 0 L32 0 L32 4 L4 4 L4 32 L0 32 Z" 
          fill="currentColor" 
          className="text-emerald-500/20"
        />
      </svg>
    </div>
  );
};

export const VerticalSlats = ({ count = 12 }: { count?: number }) => (
  <div className="absolute inset-0 flex justify-between pointer-events-none overflow-hidden">
    {[...Array(count)].map((_, i) => (
      <motion.div 
        key={i} 
        className="w-px bg-gradient-to-b from-transparent via-emerald-500/5 to-transparent"
        initial={{ opacity: 0, scaleY: 0 }}
        animate={{ opacity: 1, scaleY: 1 }}
        transition={{ delay: i * 0.03, duration: 0.8, ease: "easeOut" }}
      />
    ))}
  </div>
);

export const RuledLines = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
    {[...Array(8)].map((_, i) => (
      <div 
        key={i} 
        className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-500/10 to-transparent"
        style={{ top: `${(i + 1) * 12}%` }}
      />
    ))}
  </div>
);

export const LumeGlow = () => (
  <div className="absolute inset-0 pointer-events-none">
    <div className="absolute top-0 left-1/4 w-1/2 h-32 bg-gradient-to-b from-emerald-500/8 to-transparent blur-3xl" />
    <div className="absolute bottom-0 right-1/4 w-1/2 h-24 bg-gradient-to-t from-emerald-500/5 to-transparent blur-2xl" />
  </div>
);

// Command Zone - Visual organizer for sections
export const CommandZone = ({ 
  title, 
  children, 
  icon: Icon,
  badge,
  collapsible = false,
  defaultOpen = true,
  className = ""
}: { 
  title: string; 
  children: React.ReactNode;
  icon?: React.ElementType;
  badge?: React.ReactNode;
  collapsible?: boolean;
  defaultOpen?: boolean;
  className?: string;
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <motion.section 
      className={`relative ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={springConfig.gentle}
    >
      {/* Zone Header */}
      <div 
        className={`flex items-center gap-3 mb-4 ${collapsible ? 'cursor-pointer' : ''}`}
        onClick={collapsible ? () => setIsOpen(!isOpen) : undefined}
      >
        <div className="h-px flex-1 bg-gradient-to-r from-emerald-500/20 via-emerald-500/10 to-transparent" />
        <div className="flex items-center gap-2">
          {Icon && <Icon className="w-3.5 h-3.5 text-emerald-400/60" />}
          <span className="text-[9px] uppercase tracking-[0.25em] text-zinc-500 font-medium">
            {title}
          </span>
          {badge}
          {collapsible && (
            <motion.div
              animate={{ rotate: isOpen ? 0 : -90 }}
              transition={springConfig.snappy}
            >
              <svg className="w-3 h-3 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </motion.div>
          )}
        </div>
        <div className="h-px flex-1 bg-gradient-to-l from-emerald-500/20 via-emerald-500/10 to-transparent" />
      </div>
      
      {/* Zone Content */}
      {(!collapsible || isOpen) && (
        <motion.div
          initial={collapsible ? { opacity: 0, height: 0 } : false}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={springConfig.smooth}
        >
          {children}
        </motion.div>
      )}
    </motion.section>
  );
};
