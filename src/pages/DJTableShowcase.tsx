import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Volume2, Disc3, Gauge, Zap, Shield, Award, X, ChevronLeft, ChevronRight, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import DJTableConfigurator, { ConfigState } from "@/components/DJTableConfigurator";

// Import gallery images
import heroImage from "@/assets/dj-table-hero.jpg";
import turntableImage from "@/assets/dj-table-turntable.jpg";
import mixerImage from "@/assets/dj-table-mixer.jpg";
import topImage from "@/assets/dj-table-top.jpg";
import frameImage from "@/assets/dj-table-frame.jpg";
import lifestyleImage from "@/assets/dj-table-lifestyle.jpg";

// Kengo Kuma inspired vertical slat component
const KumaSlats = ({ count = 12, height = 200, className = "" }: { count?: number; height?: number; className?: string }) => (
  <div className={`flex items-end gap-[2px] ${className}`}>
    {Array.from({ length: count }).map((_, i) => {
      const delay = i * 0.03;
      const h = height * (0.5 + Math.sin((i / count) * Math.PI) * 0.5);
      return (
        <motion.div
          key={i}
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: h, opacity: 0.15 + (i / count) * 0.3 }}
          transition={{ delay, duration: 0.8, ease: "easeOut" }}
          className="w-[2px] bg-gradient-to-t from-apex-glow/60 to-transparent"
        />
      );
    })}
  </div>
);

// Precision-inspired geometric accent with ruled surface lines
const PrecisionCornerAccent = ({ position }: { position: 'tl' | 'tr' | 'bl' | 'br' }) => {
  const positionClasses = {
    tl: 'top-0 left-0',
    tr: 'top-0 right-0 rotate-90',
    bl: 'bottom-0 left-0 -rotate-90',
    br: 'bottom-0 right-0 rotate-180'
  };
  
  return (
    <div className={`absolute ${positionClasses[position]} w-16 h-16 pointer-events-none`}>
      <svg viewBox="0 0 64 64" className="w-full h-full">
        {/* Ruled surface lines */}
        {[...Array(8)].map((_, i) => (
          <line
            key={i}
            x1={i * 8}
            y1="0"
            x2="0"
            y2={i * 8}
            stroke="hsl(var(--apex-glow))"
            strokeWidth="0.5"
            opacity={0.2 + i * 0.05}
          />
        ))}
        {/* Corner precision accent */}
        <path
          d="M0 0 L12 0 L12 2 L2 2 L2 12 L0 12 Z"
          fill="hsl(var(--apex-glow))"
          opacity="0.6"
        />
      </svg>
    </div>
  );
};

// STRATA Live Screen Component with glass panel effect
const StrataLiveScreen = ({ type, size = 'normal' }: { type: 'dial' | 'metrics'; size?: 'normal' | 'large' }) => {
  const [time, setTime] = useState(new Date());
  
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();
  
  const hourAngle = (hours * 30) + (minutes * 0.5);
  const minuteAngle = minutes * 6;
  const secondAngle = seconds * 6;

  const screenSize = size === 'large' ? 'w-20 h-20' : 'w-14 h-14';
  const dialSize = size === 'large' ? 32 : 22;

  if (type === 'dial') {
    return (
      <div className={`${screenSize} bg-zinc-950/90 backdrop-blur-xl rounded-sm border border-apex-glow/30 flex items-center justify-center relative overflow-hidden`}>
        {/* Glass layer effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-br from-apex-glow/10 to-transparent animate-pulse" />
        
        <svg width={dialSize} height={dialSize} viewBox="0 0 40 40" className="relative z-10">
          <circle cx="20" cy="20" r="18" fill="none" stroke="hsl(var(--apex-glow) / 0.3)" strokeWidth="1" />
          
          {[...Array(12)].map((_, i) => {
            const angle = i * 30 - 90;
            const x1 = 20 + 15 * Math.cos(angle * Math.PI / 180);
            const y1 = 20 + 15 * Math.sin(angle * Math.PI / 180);
            const x2 = 20 + 17 * Math.cos(angle * Math.PI / 180);
            const y2 = 20 + 17 * Math.sin(angle * Math.PI / 180);
            return (
              <line 
                key={i} 
                x1={x1} y1={y1} x2={x2} y2={y2} 
                stroke="hsl(var(--apex-glow))" 
                strokeWidth={i % 3 === 0 ? 1.5 : 0.5}
                className="drop-shadow-[0_0_2px_hsl(var(--apex-glow))]"
              />
            );
          })}
          
          <line 
            x1="20" y1="20" 
            x2={20 + 8 * Math.cos((hourAngle - 90) * Math.PI / 180)} 
            y2={20 + 8 * Math.sin((hourAngle - 90) * Math.PI / 180)}
            stroke="hsl(var(--apex-glow))" 
            strokeWidth="2" 
            strokeLinecap="round"
            className="drop-shadow-[0_0_3px_hsl(var(--apex-glow))]"
          />
          
          <line 
            x1="20" y1="20" 
            x2={20 + 12 * Math.cos((minuteAngle - 90) * Math.PI / 180)} 
            y2={20 + 12 * Math.sin((minuteAngle - 90) * Math.PI / 180)}
            stroke="hsl(var(--apex-glow))" 
            strokeWidth="1.5" 
            strokeLinecap="round"
            className="drop-shadow-[0_0_3px_hsl(var(--apex-glow))]"
          />
          
          <line 
            x1="20" y1="20" 
            x2={20 + 14 * Math.cos((secondAngle - 90) * Math.PI / 180)} 
            y2={20 + 14 * Math.sin((secondAngle - 90) * Math.PI / 180)}
            stroke="hsl(var(--apex-glow-soft))" 
            strokeWidth="0.5" 
            strokeLinecap="round"
            className="drop-shadow-[0_0_4px_hsl(var(--apex-glow-soft))]"
          />
          
          <circle cx="20" cy="20" r="2" fill="hsl(var(--apex-glow))" className="drop-shadow-[0_0_4px_hsl(var(--apex-glow))]" />
        </svg>
        
        <div className="absolute bottom-0.5 left-0 right-0 text-center">
          <span className="text-[5px] tracking-[0.15em] text-apex-glow/80 uppercase font-medium drop-shadow-[0_0_4px_hsl(var(--apex-glow))]">
            STRATA
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`${screenSize} bg-zinc-950/90 backdrop-blur-xl rounded-sm border border-apex-glow/30 flex flex-col items-center justify-center relative overflow-hidden p-1`}>
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-br from-apex-glow/10 to-transparent animate-pulse" />
      
      <div className="relative z-10 space-y-0.5 text-center">
        <div className="flex items-center gap-1">
          <span className="text-[6px] text-apex-glow/60">W</span>
          <span className="text-[8px] text-apex-glow font-mono drop-shadow-[0_0_4px_hsl(var(--apex-glow))]">12</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[6px] text-apex-glow/60">P</span>
          <span className="text-[8px] text-apex-glow font-mono drop-shadow-[0_0_4px_hsl(var(--apex-glow))]">1013</span>
        </div>
        <div className="flex items-center justify-center gap-0.5 pt-0.5">
          <div className="w-1 h-1 rounded-full bg-apex-glow animate-pulse shadow-[0_0_4px_hsl(var(--apex-glow))]" />
          <span className="text-[5px] text-apex-glow/80 uppercase tracking-wider">LIVE</span>
        </div>
      </div>
    </div>
  );
};

const DJTableShowcase = () => {
  const navigate = useNavigate();
  const configuratorRef = useRef<HTMLDivElement>(null);
  const [activeView, setActiveView] = useState<'front' | 'top' | 'side'>('front');
  const [isHovered, setIsHovered] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [currentConfig, setCurrentConfig] = useState<ConfigState | null>(null);

  const scrollToConfigurator = () => {
    configuratorRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleConfigCheckout = (config: ConfigState, totalPrice: number) => {
    sessionStorage.setItem('apex1-config', JSON.stringify({ config, totalPrice }));
    navigate('/allocation-checkout?type=deposit');
  };

  const galleryImages = [
    { src: heroImage, title: "APEX-1 Overview", description: "3/4 angle with integrated STRATA live displays" },
    { src: topImage, title: "Top View", description: "Dual turntable layout with central STRATA screens" },
    { src: turntableImage, title: "Turntable Mount", description: "Precision-machined vibration isolation system" },
    { src: mixerImage, title: "Mixer Detail", description: "LED-illuminated controls with STRATA metrics integration" },
    { src: frameImage, title: "Frame Construction", description: "Aircraft-grade aluminum framework" },
    { src: lifestyleImage, title: "In Performance", description: "STRATA screens providing real-time weather intelligence" },
  ];

  const specs = [
    { label: "Dimensions", value: '72" × 36" × 34"' },
    { label: "Weight", value: "185 lbs" },
    { label: "Surface", value: "Carbon Fiber Composite" },
    { label: "Frame", value: "Aircraft-Grade Aluminum" },
    { label: "Finish", value: "Matte Obsidian" },
    { label: "LED System", value: "Programmable RGB Matrix" },
    { label: "STRATA Displays", value: "Dual 2.4\" OLED" },
    { label: "Weather Integration", value: "Real-time NOAA Feed" },
  ];

  const features = [
    {
      icon: Disc3,
      title: "Dual Turntable Integration",
      description: "Precision-engineered mounting system for industry-standard turntables with vibration isolation.",
    },
    {
      icon: Monitor,
      title: "STRATA Live Displays",
      description: "Integrated weather intelligence screens with real-time atmospheric data and luminous dial readouts.",
    },
    {
      icon: Volume2,
      title: "Acoustic Engineering",
      description: "Integrated bass isolation chambers eliminate feedback and resonance interference.",
    },
    {
      icon: Gauge,
      title: "Climate Control",
      description: "Active thermal management maintains optimal equipment temperature during extended sets.",
    },
    {
      icon: Zap,
      title: "Power Distribution",
      description: "Clean power delivery with surge protection and cable management throughout.",
    },
    {
      icon: Shield,
      title: "Road-Ready Construction",
      description: "Military-spec durability rated for touring. Modular assembly in under 15 minutes.",
    },
  ];

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const navigateLightbox = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setLightboxIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1));
    } else {
      setLightboxIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1));
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Kuma-inspired layered background */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Layered transparency panels */}
        <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-apex-glow/5 to-transparent" />
        <div className="absolute top-0 right-0 w-1/4 h-full bg-gradient-to-l from-apex-glow/3 to-transparent" />
        
        {/* Vertical slat rhythm elements */}
        <div className="absolute bottom-0 left-12 opacity-30">
          <KumaSlats count={16} height={300} />
        </div>
        <div className="absolute bottom-0 right-24 opacity-20">
          <KumaSlats count={12} height={200} />
        </div>
        
        {/* Glass panel overlays */}
        <div className="absolute top-1/4 right-0 w-[400px] h-[600px] bg-gradient-to-bl from-white/[0.02] to-transparent transform rotate-12 origin-right" />
        <div className="absolute bottom-1/4 left-0 w-[300px] h-[500px] bg-gradient-to-tr from-white/[0.01] to-transparent transform -rotate-6 origin-left" />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/60 backdrop-blur-2xl border-b border-border/20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm tracking-wider uppercase">Back</span>
          </Link>
          <div className="text-center">
            <span className="text-xs tracking-[0.3em] text-muted-foreground uppercase">LAVANDAR Tech</span>
          </div>
          <div className="w-20" />
        </div>
      </header>

      {/* Hero Section - Kuma/Precision Design */}
      <section className="pt-32 pb-20 px-6 relative">
        <PrecisionCornerAccent position="tl" />
        
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Product Visual with layered glass effect */}
            <motion.div 
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {/* Glass panel frame with precision corner accents */}
              <div className="relative aspect-[4/3] bg-gradient-to-br from-muted/30 to-muted/10 rounded-sm overflow-hidden border border-border/20">
                <PrecisionCornerAccent position="tl" />
                <PrecisionCornerAccent position="br" />
                
                {/* Layered transparency effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                <div className="absolute inset-0 backdrop-blur-[1px]" />
                
                {/* 3D View Container */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div 
                    className={`relative transition-all duration-700 ${isHovered ? 'scale-105' : 'scale-100'}`}
                    style={{ perspective: '1000px' }}
                  >
                    <div 
                      className="relative"
                      style={{
                        transform: activeView === 'front' 
                          ? 'rotateX(15deg) rotateY(-15deg)' 
                          : activeView === 'top' 
                          ? 'rotateX(60deg) rotateY(0deg)' 
                          : 'rotateX(15deg) rotateY(-45deg)',
                        transformStyle: 'preserve-3d',
                        transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                      }}
                    >
                      {/* Table Top with Kuma layering */}
                      <div className="w-80 h-48 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 rounded-sm shadow-2xl border border-zinc-700/50 relative">
                        {/* Glass layer on top */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent rounded-sm" />
                        
                        {/* LED Strips */}
                        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-apex-glow/60 via-apex-glow-soft/60 to-apex-glow/60 animate-pulse" />
                        <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-apex-glow-soft/60 via-apex-glow/60 to-apex-glow-soft/60 animate-pulse" />
                        
                        {/* Turntable Mounts */}
                        <div className="absolute top-6 left-6 w-20 h-20 rounded-full bg-zinc-950 border border-zinc-600/50 flex items-center justify-center">
                          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-800 flex items-center justify-center border border-zinc-600/30">
                            <div className="w-3 h-3 rounded-full bg-zinc-500" />
                          </div>
                        </div>
                        <div className="absolute top-6 right-6 w-20 h-20 rounded-full bg-zinc-950 border border-zinc-600/50 flex items-center justify-center">
                          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-800 flex items-center justify-center border border-zinc-600/30">
                            <div className="w-3 h-3 rounded-full bg-zinc-500" />
                          </div>
                        </div>
                        
                        {/* STRATA Screens + Mixer */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
                          <StrataLiveScreen type="dial" />
                          <div className="w-24 h-16 bg-zinc-950/90 backdrop-blur-sm rounded-sm border border-zinc-600/50 flex items-center justify-center gap-1.5 px-2">
                            <div className="w-1.5 h-8 bg-gradient-to-t from-apex-glow to-apex-glow/20 rounded-full" />
                            <div className="w-1.5 h-10 bg-gradient-to-t from-apex-glow-soft to-apex-glow-soft/20 rounded-full" />
                            <div className="w-1.5 h-6 bg-gradient-to-t from-apex-glow to-apex-glow/20 rounded-full" />
                            <div className="w-1.5 h-12 bg-gradient-to-t from-apex-glow-soft to-apex-glow-soft/20 rounded-full" />
                            <div className="w-1.5 h-7 bg-gradient-to-t from-apex-glow to-apex-glow/20 rounded-full" />
                          </div>
                          <StrataLiveScreen type="metrics" />
                        </div>
                        
                        {/* STRATA LIVE Badge */}
                        <div className="absolute top-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-2 py-0.5 bg-zinc-950/80 backdrop-blur-sm rounded-sm border border-apex-glow/30">
                          <div className="w-1.5 h-1.5 rounded-full bg-apex-glow animate-pulse shadow-[0_0_6px_hsl(var(--apex-glow))]" />
                          <span className="text-[8px] tracking-[0.2em] text-apex-glow uppercase font-medium drop-shadow-[0_0_4px_hsl(var(--apex-glow))]">
                            STRATA LIVE
                          </span>
                        </div>
                      </div>
                      
                      {/* Legs */}
                      <div className="absolute -bottom-20 left-4 w-3 h-20 bg-gradient-to-b from-zinc-700 to-zinc-900 rounded-sm" style={{ transform: 'translateZ(-10px)' }} />
                      <div className="absolute -bottom-20 right-4 w-3 h-20 bg-gradient-to-b from-zinc-700 to-zinc-900 rounded-sm" style={{ transform: 'translateZ(-10px)' }} />
                    </div>
                  </div>
                </div>
                
                {/* View Controls with precision styling */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1">
                  {(['front', 'top', 'side'] as const).map((view) => (
                    <button
                      key={view}
                      onClick={() => setActiveView(view)}
                      className={`px-4 py-2 text-xs tracking-wider uppercase transition-all border ${
                        activeView === view 
                          ? 'bg-apex-glow text-background border-apex-glow' 
                          : 'bg-background/50 backdrop-blur-sm text-muted-foreground border-border/30 hover:border-apex-glow/50 hover:text-apex-glow'
                      }`}
                    >
                      {view}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Product Info with geometric accents */}
            <motion.div 
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-8 relative"
            >
              {/* Ruled surface lines accent */}
              <div className="absolute -left-8 top-0 h-full w-px bg-gradient-to-b from-transparent via-apex-glow/30 to-transparent" />
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <p className="text-xs tracking-[0.3em] text-muted-foreground uppercase">Performance Series</p>
                  <div className="flex items-center gap-1.5 px-2 py-0.5 bg-apex-glow/10 border border-apex-glow/30 rounded-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-apex-glow animate-pulse" />
                    <span className="text-[10px] tracking-wider text-apex-glow uppercase">STRATA Integrated</span>
                  </div>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extralight tracking-tight">
                  APEX<span className="text-muted-foreground">-1</span>
                </h1>
                <p className="text-lg text-muted-foreground font-light leading-relaxed max-w-md">
                  The definitive professional DJ console. Engineered for precision. Built for permanence. With integrated STRATA weather intelligence.
                </p>
              </div>

              <div className="flex items-baseline gap-4">
                <span className="text-3xl font-light">$47,500</span>
                <span className="text-sm text-muted-foreground">USD</span>
              </div>

              <div className="space-y-4">
                <Button 
                  className="w-full py-6 text-sm tracking-widest uppercase bg-apex-glow text-background hover:bg-apex-glow/90 border-0"
                  onClick={scrollToConfigurator}
                >
                  Configure & Reserve
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  12-16 week lead time • $1,800 refundable deposit • Balance due at shipping
                </p>
              </div>

              {/* Quick Specs with Kuma layered cards */}
              <div className="pt-8 border-t border-border/20">
                <div className="grid grid-cols-2 gap-4">
                  {specs.slice(0, 4).map((spec, i) => (
                    <motion.div 
                      key={spec.label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + i * 0.1 }}
                      className="relative p-3 bg-muted/20 backdrop-blur-sm border border-border/20 rounded-sm"
                    >
                      <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-apex-glow/40" />
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">{spec.label}</p>
                      <p className="text-sm font-light mt-1">{spec.value}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Image Gallery with glass panel grid */}
      <section className="py-24 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/10 to-transparent" />
        
        <div className="max-w-7xl mx-auto relative">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-xs tracking-[0.3em] text-muted-foreground uppercase mb-4">Product Gallery</p>
            <h2 className="text-3xl md:text-4xl font-extralight tracking-tight">Every Angle, Every Detail</h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {galleryImages.map((image, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                onClick={() => openLightbox(index)}
                className={`relative overflow-hidden group cursor-pointer ${
                  index === 0 ? 'col-span-2 row-span-2' : ''
                }`}
              >
                <div className={`relative ${index === 0 ? 'aspect-[4/3]' : 'aspect-square'}`}>
                  <img 
                    src={image.src} 
                    alt={image.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Glass overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                      <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase mb-1">{image.title}</p>
                      <p className="text-sm text-foreground/80">{image.description}</p>
                    </div>
                  </div>
                  {/* Precision corner accents on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <PrecisionCornerAccent position="tl" />
                    <PrecisionCornerAccent position="br" />
                  </div>
                  <div className="absolute inset-0 border border-border/20 group-hover:border-apex-glow/30 transition-colors" />
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div 
          className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-xl flex items-center justify-center"
          onClick={() => setLightboxOpen(false)}
        >
          <button 
            className="absolute top-6 right-6 p-3 text-muted-foreground hover:text-foreground transition-colors z-10"
            onClick={() => setLightboxOpen(false)}
          >
            <X className="w-6 h-6" />
          </button>

          <button 
            className="absolute left-4 md:left-8 p-3 text-muted-foreground hover:text-foreground transition-colors z-10"
            onClick={(e) => { e.stopPropagation(); navigateLightbox('prev'); }}
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          <button 
            className="absolute right-4 md:right-8 p-3 text-muted-foreground hover:text-foreground transition-colors z-10"
            onClick={(e) => { e.stopPropagation(); navigateLightbox('next'); }}
          >
            <ChevronRight className="w-8 h-8" />
          </button>

          <div 
            className="max-w-5xl max-h-[80vh] mx-4 md:mx-16"
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={galleryImages[lightboxIndex].src} 
              alt={galleryImages[lightboxIndex].title}
              className="max-w-full max-h-[70vh] object-contain mx-auto"
            />
            <div className="text-center mt-6">
              <p className="text-xs tracking-[0.3em] text-muted-foreground uppercase mb-2">
                {galleryImages[lightboxIndex].title}
              </p>
              <p className="text-sm text-muted-foreground">
                {galleryImages[lightboxIndex].description}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Configuration Tool with Kuma layered aesthetic */}
      <section ref={configuratorRef} className="py-24 px-6 relative border-y border-border/20">
        <div className="absolute inset-0 bg-gradient-to-b from-apex-glow/5 via-transparent to-apex-glow/5" />
        
        {/* Vertical slat accents */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 opacity-20">
          <KumaSlats count={20} height={400} />
        </div>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-15 rotate-180">
          <KumaSlats count={16} height={350} />
        </div>
        
        <div className="max-w-5xl mx-auto relative">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-apex-glow/10 border border-apex-glow/30 rounded-sm mb-6">
              <div className="w-2 h-2 rounded-full bg-apex-glow animate-pulse shadow-[0_0_8px_hsl(var(--apex-glow))]" />
              <span className="text-xs tracking-widest text-apex-glow uppercase">Live Configuration</span>
            </div>
            <p className="text-xs tracking-[0.3em] text-muted-foreground uppercase mb-4">Customization Studio</p>
            <h2 className="text-3xl md:text-4xl font-extralight tracking-tight">Make It Yours</h2>
          </motion.div>
          
          <DJTableConfigurator 
            onConfigChange={setCurrentConfig}
            onCheckout={handleConfigCheckout}
          />
        </div>
      </section>

      {/* Features Grid with glass panel cards */}
      <section className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-xs tracking-[0.3em] text-muted-foreground uppercase mb-4">Engineering Excellence</p>
            <h2 className="text-3xl md:text-4xl font-extralight tracking-tight">Built Without Compromise</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="p-8 bg-muted/10 backdrop-blur-sm border border-border/20 hover:border-apex-glow/30 transition-all group relative"
              >
                <PrecisionCornerAccent position="tl" />
                <feature.icon className="w-8 h-8 text-muted-foreground group-hover:text-apex-glow transition-colors mb-6" />
                <h3 className="text-lg font-light mb-3">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Full Specifications with ruled surface aesthetic */}
      <section className="py-24 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-muted/10 via-transparent to-muted/10" />
        
        <div className="max-w-4xl mx-auto relative">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-xs tracking-[0.3em] text-muted-foreground uppercase mb-4">Technical Data</p>
            <h2 className="text-3xl md:text-4xl font-extralight tracking-tight">Specifications</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-x-16 gap-y-1">
            {specs.map((spec, i) => (
              <motion.div 
                key={spec.label} 
                initial={{ opacity: 0, x: i % 2 === 0 ? -10 : 10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="flex justify-between items-center py-4 border-b border-border/20 group hover:border-apex-glow/30 transition-colors"
              >
                <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">{spec.label}</span>
                <span className="text-sm font-light">{spec.value}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 relative border-t border-border/20">
        <div className="absolute inset-0 bg-gradient-to-t from-muted/20 to-transparent" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center relative"
        >
          <p className="text-xs tracking-[0.3em] text-muted-foreground uppercase mb-6">Limited Availability</p>
          <h2 className="text-3xl md:text-4xl font-extralight tracking-tight mb-6">
            Reserve Your Unit
          </h2>
          <p className="text-muted-foreground mb-10 max-w-xl mx-auto">
            Production is limited to 50 units per year. Secure your position with a refundable $1,800 deposit.
          </p>
          <Button 
            className="px-12 py-6 text-sm tracking-widest uppercase bg-apex-glow text-background hover:bg-apex-glow/90 border-0"
            onClick={() => window.location.href = '/allocation-checkout?type=deposit'}
          >
            Pay $1,800 Deposit
          </Button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border/20">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase">
            LAVANDAR Tech • Performance Division • STRATA Integrated
          </p>
        </div>
      </footer>
    </div>
  );
};

export default DJTableShowcase;
