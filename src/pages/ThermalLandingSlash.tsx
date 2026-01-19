import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Volume2, VolumeX, Zap, Waves, Thermometer, Music, Play, Sparkles, ChevronDown, Check, Star, Quote, Mail, ArrowRight, Disc3 } from 'lucide-react';
import thermalDemoVideo from '@/assets/thermal-demo.mp4';
import SpatialAudioCAD, { VINYL_COLLECTION, VinylRecord } from '@/components/SpatialAudioCAD';
import ThermalNavigation from '@/components/ThermalNavigation';
import ThermalFooter from '@/components/ThermalFooter';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

// ═══════════════════════════════════════════════════════════════════
// DJ KREMBO × KAZUMA 551 — Japanese House / Berlin Underground
// A one-of-kind DJ console for the Tokyo-Paris-Berlin circuit
// ═══════════════════════════════════════════════════════════════════

const VALUE_PROPS = [
  {
    icon: Disc3,
    title: '和音エンジン',
    titleEn: 'Wa-On Engine',
    desc: 'Harmonic fusion algorithm blending Tokyo city-pop warmth with Berghain industrial precision',
  },
  {
    icon: Waves,
    title: '夜の波動',
    titleEn: 'Night Wave',
    desc: 'Deep groove spectral analysis tuned for warehouse acoustics and intimate listening bars',
  },
  {
    icon: Zap,
    title: '渋谷共鳴',
    titleEn: 'Shibuya Resonance',
    desc: 'Bass frequencies calibrated to the heartbeat of Dogenzaka nightclubs',
  },
];

const FEATURES = [
  { label: 'Kazuma 551 Mixer Integration', desc: '551系統制御' },
  { label: 'Japanese House Presets', desc: 'シティポップ調律' },
  { label: 'Berlin Warehouse Mode', desc: 'ベルリン倉庫モード' },
  { label: 'Paris Techno Settings', desc: 'パリテクノ設定' },
  { label: 'KitKat Club Algorithm', desc: 'キットカット音響' },
  { label: 'Analog Vinyl Simulation', desc: 'アナログ再現' },
];

const STATS = [
  { value: '渋谷', label: 'SHIBUYA' },
  { value: 'パリ', label: 'PARIS' },
  { value: 'ベルリン', label: 'BERLIN' },
  { value: '551', label: 'KAZUMA' },
];

const PRICING_TIERS = [
  {
    name: 'KREMBO Lite',
    nameJp: 'ライト',
    price: '¥380,000',
    period: '',
    description: 'Entry to the underground',
    features: [
      'Japanese house presets',
      'Basic 551 integration',
      'Standard vinyl simulation',
      'Community access',
    ],
    cta: '参加する',
    highlighted: false,
  },
  {
    name: 'KREMBO Studio',
    nameJp: 'スタジオ',
    price: '¥1,250,000',
    period: '',
    description: 'Professional club installation',
    features: [
      'All Lite features',
      'Full Kazuma 551 control',
      'Berlin warehouse mode',
      'Paris techno tuning',
      'Custom algorithm access',
      'Priority installation',
    ],
    cta: '予約する',
    highlighted: true,
  },
  {
    name: 'KREMBO Black',
    nameJp: 'ブラック',
    price: '¥4,750,000',
    period: '',
    description: 'Legendary venue specification',
    features: [
      'All Studio features',
      'Bespoke console design',
      'Direct Krembo collaboration',
      'Exclusive sound library',
      'White glove installation',
      'Lifetime support',
    ],
    cta: '問い合わせ',
    highlighted: false,
  },
];

const TESTIMONIALS = [
  {
    quote: "Finally, a console that understands the tension between Tokyo's precision and Berlin's chaos. My sets have never felt more alive.",
    author: 'DJ KREMBO',
    role: 'Kazuma 551 Productions',
    avatar: 'K',
  },
  {
    quote: "夜明けまで回し続けられる。まさに渋谷のために作られた機材。",
    author: 'Yuki Tanaka',
    role: 'Sound Bar OATH, Shibuya',
    avatar: '田',
  },
  {
    quote: "Le son est parfait. From Pigalle to Berghain, this is the only table I trust.",
    author: 'Antoine Deveraux',
    role: 'Concrete, Paris',
    avatar: 'A',
  },
];

const TRUSTED_BY = [
  'Womb Tokyo',
  'Berghain',
  'Concrete Paris',
  'Sound Bar OATH',
  'Contact Tokyo',
];

const ThermalLandingSlash = () => {
  const [temperature, setTemperature] = useState(35);
  const [isPlaying, setIsPlaying] = useState(false);
  const [spectralData, setSpectralData] = useState({ low: 0, mid: 0, high: 0 });
  const [selectedVinyl, setSelectedVinyl] = useState<VinylRecord>(VINYL_COLLECTION[0]);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isPlaying) {
        const temp = 20 + (e.clientX / window.innerWidth) * 50;
        setTemperature(temp);
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isPlaying]);

  useEffect(() => {
    audioRef.current = new Audio(selectedVinyl.audioUrl);
    audioRef.current.crossOrigin = 'anonymous';
    audioRef.current.volume = 0.6;
    
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (audioContextRef.current) audioContextRef.current.close();
    };
  }, [selectedVinyl]);

  const analyzeAudio = useCallback(() => {
    if (!analyserRef.current) return;
    
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);
    
    const bassEnd = Math.floor(dataArray.length * 0.1);
    const midEnd = Math.floor(dataArray.length * 0.5);
    
    let bass = 0, mid = 0, high = 0;
    for (let i = 0; i < bassEnd; i++) bass += dataArray[i];
    for (let i = bassEnd; i < midEnd; i++) mid += dataArray[i];
    for (let i = midEnd; i < dataArray.length; i++) high += dataArray[i];
    
    bass = (bass / bassEnd) / 255;
    mid = (mid / (midEnd - bassEnd)) / 255;
    high = (high / (dataArray.length - midEnd)) / 255;
    
    setSpectralData({ low: bass, mid, high });
    const energy = bass * 0.5 + mid * 0.3 + high * 0.2;
    setTemperature(prev => prev + ((25 + energy * 45) - prev) * 0.15);
    
    if (isPlaying) animationRef.current = requestAnimationFrame(analyzeAudio);
  }, [isPlaying]);

  const toggleAudio = async () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      setIsPlaying(false);
    } else {
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext();
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 256;
        sourceRef.current = audioContextRef.current.createMediaElementSource(audioRef.current);
        sourceRef.current.connect(analyserRef.current);
        analyserRef.current.connect(audioContextRef.current.destination);
      }
      await audioRef.current.play();
      setIsPlaying(true);
      analyzeAudio();
    }
  };

  // KREMBO color system - deep crimson to neon pink transition
  const getKremboColor = (temp: number): string => {
    const n = (temp - 20) / 50;
    if (n < 0.25) return `hsl(350, 80%, ${15 + n * 40}%)`; // Deep crimson
    if (n < 0.5) return `hsl(${350 - (n - 0.25) * 40}, 85%, ${25 + (n - 0.25) * 35}%)`; // Rose
    if (n < 0.75) return `hsl(${340 - (n - 0.5) * 30}, 90%, ${40 + (n - 0.5) * 30}%)`; // Hot pink
    return `hsl(${320 - (n - 0.75) * 20}, 100%, ${55 + (n - 0.75) * 35}%)`; // Neon magenta
  };

  // Keep original for backwards compatibility
  const getThermalColor = getKremboColor;

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Japanese lattice pattern (Kumiko-inspired) */}
      <motion.div 
        className="fixed inset-0 pointer-events-none z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 2, ease: "easeOut" }}
        style={{
          backgroundImage: `
            repeating-linear-gradient(
              60deg,
              transparent,
              transparent 40px,
              hsl(350 60% 30% / 0.1) 40px,
              hsl(350 60% 30% / 0.1) 41px
            ),
            repeating-linear-gradient(
              -60deg,
              transparent,
              transparent 40px,
              hsl(350 60% 30% / 0.1) 40px,
              hsl(350 60% 30% / 0.1) 41px
            )
          `,
        }}
      />
      
      {/* Berlin industrial grid overlay */}
      <motion.div 
        className="fixed inset-0 pointer-events-none z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
        style={{
          backgroundImage: `
            linear-gradient(to right, hsl(0 0% 100% / 0.02) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(0 0% 100% / 0.015) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />
      
      {/* Animated neon scan lines */}
      <motion.div 
        className="fixed inset-0 pointer-events-none z-10 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
      >
        <motion.div 
          className="absolute inset-0"
          animate={{ y: ['0%', '100%'] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          style={{
            background: `repeating-linear-gradient(
              180deg,
              transparent,
              transparent 4px,
              hsl(330 100% 60% / 0.05) 4px,
              hsl(330 100% 60% / 0.05) 5px
            )`,
          }}
        />
      </motion.div>
      
      <ThermalNavigation />

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 1: HERO - DJ KREMBO × KAZUMA 551
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="min-h-screen flex flex-col items-center justify-center relative px-6">
        {/* Neon glow background */}
        <motion.div 
          className="absolute inset-0 transition-all duration-700"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.8, ease: "easeOut" }}
          style={{
            background: `
              radial-gradient(ellipse 70% 50% at 30% 40%, ${getKremboColor(temperature)}15 0%, transparent 60%),
              radial-gradient(ellipse 60% 40% at 70% 60%, hsl(280 80% 40% / 0.1) 0%, transparent 50%)
            `,
            filter: 'blur(80px)',
          }}
        />
        
        {/* Kuma glass layers with rose tint */}
        <motion.div 
          className="absolute inset-12 sm:inset-20 border border-rose-500/10 rounded-sm"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
          style={{ 
            background: 'linear-gradient(135deg, hsl(350 50% 10% / 0.3), hsl(280 40% 8% / 0.2))',
            backdropFilter: 'blur(2px)',
          }}
        />

        <div className="relative z-20 text-center max-w-5xl">
          {/* Japanese title eyebrow */}
          <motion.div 
            className="flex items-center justify-center gap-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-rose-500/50" />
            <span className="text-sm tracking-[0.5em] text-rose-400/80 font-light">DJ KREMBO × KAZUMA 551</span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-rose-500/50" />
          </motion.div>

          {/* Main headline - bilingual */}
          <motion.h1 
            className="text-5xl sm:text-7xl lg:text-8xl font-extralight tracking-tight leading-[0.9] mb-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <span className="text-rose-100/90 block">夜のコンソール</span>
          </motion.h1>
          
          <motion.p 
            className="text-2xl sm:text-3xl font-extralight tracking-wide text-white/60 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
          >
            The Night Console
          </motion.p>

          {/* Subheadline */}
          <motion.p 
            className="text-base sm:text-lg text-white/40 max-w-2xl mx-auto mb-12 font-light leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.1 }}
          >
            A one-of-kind DJ table engineered for the Japan party scene. 
            From Shibuya listening bars to Berlin warehouses to Paris afterhours — 
            <span className="text-rose-400/80"> where Japanese house meets the underground</span>.
          </motion.p>

          {/* Primary CTA */}
          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.3 }}
          >
            <Link 
              to="/dj-table"
              className="group relative px-10 py-5 bg-gradient-to-r from-rose-600 to-pink-500 text-white font-medium tracking-wider overflow-hidden transition-all hover:shadow-[0_0_60px_hsl(350_80%_50%/0.4)]"
            >
              <span className="relative z-10 flex items-center gap-3">
                <Disc3 className="w-5 h-5" />
                コンソールを予約
                <span className="text-rose-200/60 text-sm">Reserve Console</span>
              </span>
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-pink-500 to-fuchsia-500"
                initial={{ x: '-100%' }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
            </Link>
            
            <button
              onClick={toggleAudio}
              className="px-8 py-5 border border-rose-500/30 font-medium tracking-wide hover:border-rose-500/60 hover:bg-rose-500/10 transition-all flex items-center gap-3"
            >
              {isPlaying ? <VolumeX className="w-5 h-5 text-rose-400" /> : <Volume2 className="w-5 h-5 text-rose-400" />}
              <span>{isPlaying ? '停止' : '試聴する'}</span>
              <span className="text-white/40 text-sm">{isPlaying ? 'Stop' : 'Listen'}</span>
            </button>
          </motion.div>

          {/* Live groove meter */}
          <motion.div 
            className="mt-16 inline-flex items-center gap-6 px-8 py-4 border border-rose-500/20 bg-rose-950/30 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.6 }}
          >
            <div className="flex items-center gap-3">
              <div 
                className="w-3 h-3 rounded-full animate-pulse"
                style={{ background: getKremboColor(temperature), boxShadow: `0 0 20px ${getKremboColor(temperature)}` }}
              />
              <span className="text-xs tracking-[0.3em] text-rose-400/60">GROOVE</span>
            </div>
            <span 
              className="text-4xl font-extralight tabular-nums transition-colors duration-300"
              style={{ color: getKremboColor(temperature) }}
            >
              {temperature.toFixed(1)}°
            </span>
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <motion.div 
                  key={i}
                  className="w-1 rounded-full bg-rose-500/40"
                  animate={{ 
                    height: isPlaying ? [8, 16 + Math.random() * 16, 8] : 8,
                    background: isPlaying ? [getKremboColor(30), getKremboColor(60), getKremboColor(30)] : 'hsl(350 50% 40% / 0.4)'
                  }}
                  transition={{ duration: 0.3 + i * 0.1, repeat: Infinity }}
                />
              ))}
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator - Japanese */}
        <motion.div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 0.6, delay: 2 }}
        >
          <span className="text-[10px] tracking-[0.4em] text-rose-400/60">スクロール</span>
          <ChevronDown className="w-4 h-4 animate-bounce text-rose-400/40" />
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 2: VALUE PROPOSITIONS - Japanese House Technology
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-32 px-6 relative">
        {/* Rose gradient accent */}
        <div className="absolute inset-0 bg-gradient-to-b from-rose-950/20 via-transparent to-transparent" />
        
        <div className="max-w-6xl mx-auto relative">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs tracking-[0.5em] text-rose-400/60 mb-4 font-mono">テクノロジー / TECHNOLOGY</p>
            <h2 className="text-4xl sm:text-5xl font-extralight tracking-tight">
              <span className="text-rose-100">東京の精密さ</span><br />
              <span className="text-white/50">Meets Berlin Chaos</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {VALUE_PROPS.map((prop, i) => (
              <motion.div
                key={prop.title}
                className="group p-8 border border-rose-500/10 hover:border-rose-500/30 bg-gradient-to-br from-rose-950/20 to-transparent backdrop-blur-sm transition-all"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
              >
                <prop.icon className="w-8 h-8 mb-6 text-rose-400/60 group-hover:text-rose-400 transition-colors" />
                <h3 className="text-2xl font-extralight mb-1 text-rose-100">{prop.title}</h3>
                <p className="text-sm text-rose-400/50 mb-3 tracking-wider">{prop.titleEn}</p>
                <p className="text-sm text-white/40 leading-relaxed">{prop.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 3: CITY CIRCUIT - Tokyo / Paris / Berlin
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-20 border-y border-rose-500/10 bg-gradient-to-r from-rose-950/20 via-fuchsia-950/10 to-rose-950/20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((stat, i) => (
              <motion.div 
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <div className="text-4xl sm:text-5xl font-extralight text-rose-300/80 mb-2">
                  {stat.value}
                </div>
                <div className="text-xs tracking-[0.4em] text-rose-400/40">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 4: 3D SPATIAL AUDIO - Interactive Demo
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="h-screen relative bg-black">
        <div className="absolute inset-0 border border-rose-500/10">
          <SpatialAudioCAD 
            spectralData={spectralData} 
            temperature={temperature} 
            isPlaying={isPlaying}
            selectedVinyl={selectedVinyl}
            onVinylSelect={setSelectedVinyl}
          />
        </div>
        
        {/* Section label - bilingual */}
        <div className="absolute top-8 left-8 z-10">
          <p className="text-xs tracking-[0.3em] text-rose-400/60 mb-2 font-mono">インタラクティブデモ</p>
          <p className="text-2xl font-extralight tracking-wide text-rose-100">3D Spatial Audio</p>
          <p className="text-sm text-white/40 mt-2 max-w-xs">
            Explore the sound field. レコードを選んでトラックを変更。
          </p>
        </div>
        
        {/* Audio control overlay */}
        <div className="absolute bottom-8 right-8 z-10">
          <button
            onClick={toggleAudio}
            className="group flex items-center gap-3 px-5 py-3 border border-rose-500/20 hover:border-rose-500/50 bg-black/80 backdrop-blur transition-all"
          >
            <span className="w-10 h-10 rounded-full border border-rose-500/30 flex items-center justify-center group-hover:border-rose-500/60 transition-colors">
              {isPlaying ? (
                <VolumeX className="w-4 h-4 text-rose-400/60" />
              ) : (
                <Volume2 className="w-4 h-4 text-rose-400/60" />
              )}
            </span>
            <span className="text-sm tracking-wider font-mono text-rose-100/80">
              {isPlaying ? '停止 / STOP' : '再生 / PLAY'}
            </span>
          </button>
        </div>

        {/* Spectral readout */}
        <div className="absolute bottom-8 left-8 z-10 flex items-end gap-3">
          {['低', '中', '高'].map((label, i) => {
            const val = i === 0 ? spectralData.low : i === 1 ? spectralData.mid : spectralData.high;
            return (
              <div key={label} className="flex flex-col items-center gap-1">
                <div
                  className="w-3 rounded-full transition-all duration-75"
                  style={{ 
                    height: `${8 + val * 60}px`,
                    background: getKremboColor(25 + val * 40),
                    opacity: 0.5 + val * 0.5,
                  }}
                />
                <span className="text-[8px] font-mono text-rose-400/40">{label}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 5: VIDEO SHOWCASE - KREMBO Performance
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative h-screen">
        <video
          src={thermalDemoVideo}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: 'brightness(0.5) contrast(1.2) hue-rotate(-15deg)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-rose-950/20 to-black" />
        
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div 
            className="text-center px-6"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-xs tracking-[0.5em] text-rose-400/60 mb-6 font-mono">ライブパフォーマンス</p>
            <h2 className="text-5xl sm:text-7xl font-extralight tracking-tight mb-4 text-rose-100">
              夜を支配する
            </h2>
            <p className="text-2xl font-extralight text-white/50 mb-4">Command the Night</p>
            <p className="text-lg text-white/40 max-w-lg mx-auto">
              Every set, every drop, every moment — engineered for legendary performances
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 6: FEATURE GRID - KREMBO Capabilities
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-32 px-6 bg-gradient-to-b from-transparent via-rose-950/10 to-transparent">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs tracking-[0.5em] text-rose-400/60 mb-4 font-mono">機能 / CAPABILITIES</p>
            <h2 className="text-4xl sm:text-5xl font-extralight tracking-tight text-rose-100">
              フル機能セット
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-rose-500/10">
            {FEATURES.map((feature, i) => (
              <motion.div
                key={feature.label}
                className="p-8 bg-black hover:bg-rose-950/30 transition-colors"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 mt-2 bg-rose-500/60 rounded-full" />
                  <div>
                    <h3 className="text-lg font-light mb-1 text-rose-100">{feature.label}</h3>
                    <p className="text-sm text-rose-400/50">{feature.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 7: EMAIL CAPTURE - KREMBO Underground
      ═══════════════════════════════════════════════════════════════════ */}
      <EmailCaptureSection getThermalColor={getThermalColor} temperature={temperature} />

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 8: PRICING TIERS - Console Editions
      ═══════════════════════════════════════════════════════════════════ */}
      <PricingSection getThermalColor={getThermalColor} temperature={temperature} />

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 9: SOCIAL PROOF - Club Circuit
      ═══════════════════════════════════════════════════════════════════ */}
      <TestimonialsSection />

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 10: FINAL CTA - Join the Underground
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="min-h-screen flex items-center justify-center relative px-6">
        {/* Ambient glow */}
        <div 
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 50% 40% at 30% 50%, ${getKremboColor(temperature)}10 0%, transparent 50%),
              radial-gradient(ellipse 50% 40% at 70% 50%, hsl(280 70% 30% / 0.1) 0%, transparent 50%)
            `,
          }}
        />

        <motion.div 
          className="relative z-10 text-center max-w-3xl"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Disc3 className="w-16 h-16 mx-auto mb-8 text-rose-500/50" />
          
          <h2 className="text-5xl sm:text-7xl font-extralight tracking-tight mb-4 text-rose-100">
            地下へ参加
          </h2>
          <p className="text-2xl font-extralight text-white/50 mb-4">Join the Underground</p>
          
          <p className="text-lg text-white/40 mb-12 max-w-xl mx-auto">
            Reserve your console. Claim your place in the circuit. 
            <span className="text-rose-400/60"> Tokyo — Paris — Berlin</span>
          </p>

          <Link 
            to="/dj-table"
            className="group inline-flex items-center gap-4 px-12 py-6 bg-gradient-to-r from-rose-600 to-pink-500 text-white font-medium text-lg tracking-wide overflow-hidden transition-all hover:shadow-[0_0_80px_hsl(350_80%_50%/0.4)]"
          >
            <Disc3 className="w-6 h-6" />
            <span>コンソールを予約する</span>
            <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </Link>

          <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-xs text-white/30">
            <span className="flex items-center gap-2">
              <span 
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ background: getKremboColor(50) }}
              />
              限定生産 / Limited Production
            </span>
            <span>ホワイトグローブ設置 / White Glove Install</span>
            <span>551認定 / 551 Certified</span>
          </div>
        </motion.div>
      </section>

      <ThermalFooter />
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════
   EMAIL CAPTURE COMPONENT
═══════════════════════════════════════════════════════════════════════════ */
const EmailCaptureSection = ({ getThermalColor, temperature }: { getThermalColor: (t: number) => string; temperature: number }) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert({ 
          email: email.trim().toLowerCase(),
          source: 'thermal_landing'
        });
      
      if (error) {
        if (error.code === '23505') {
          // Unique constraint violation - already subscribed
          toast.info('You\'re already on the list!');
          setIsSubscribed(true);
        } else {
          throw error;
        }
      } else {
        setIsSubscribed(true);
        toast.success('Welcome to early access! Check your inbox.');
      }
    } catch (err) {
      console.error('Newsletter signup error:', err);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-32 px-6 relative overflow-hidden">
      {/* Animated rose gradient background */}
      <motion.div 
        className="absolute inset-0"
        animate={{ 
          background: [
            `radial-gradient(ellipse 80% 60% at 30% 50%, ${getThermalColor(temperature)}08 0%, transparent 50%)`,
            `radial-gradient(ellipse 80% 60% at 70% 50%, ${getThermalColor(temperature)}08 0%, transparent 50%)`,
          ]
        }}
        transition={{ duration: 8, repeat: Infinity, repeatType: 'reverse' }}
      />
      
      <div className="max-w-3xl mx-auto relative z-10">
        <motion.div
          className="text-center p-12 border border-rose-500/20 bg-gradient-to-br from-rose-950/30 to-fuchsia-950/20 backdrop-blur-sm"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="w-16 h-16 mx-auto mb-6 rounded-full border border-rose-500/30 flex items-center justify-center"
            animate={{ boxShadow: [`0 0 20px ${getThermalColor(temperature)}15`, `0 0 40px ${getThermalColor(temperature)}30`] }}
            transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
          >
            <Mail className="w-7 h-7 text-rose-400" />
          </motion.div>
          
          <p className="text-xs tracking-[0.5em] text-rose-400/60 mb-4 font-mono">地下アクセス / UNDERGROUND ACCESS</p>
          <h2 className="text-3xl sm:text-4xl font-extralight tracking-tight mb-4 text-rose-100">
            Be First to Know
          </h2>
          <p className="text-white/40 mb-8 max-w-lg mx-auto">
            Join the inner circle. Get exclusive drops, limited releases, and underground event access.
          </p>

          <AnimatePresence mode="wait">
            {isSubscribed ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center justify-center gap-3 py-4 text-rose-400"
              >
                <Check className="w-5 h-5" />
                <span className="font-medium">リストに追加されました！/ You&apos;re in!</span>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Input
                  type="email"
                  placeholder="メールアドレス / Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-rose-950/30 border-rose-500/20 focus:border-rose-500/50 text-white placeholder:text-rose-400/30"
                  required
                />
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-rose-600 to-pink-500 text-white hover:from-rose-500 hover:to-pink-400 px-6"
                >
                  {isSubmitting ? (
                    <motion.span
                      animate={{ opacity: [1, 0.5] }}
                      transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
                    >
                      参加中...
                    </motion.span>
                  ) : (
                    <>
                      参加する
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </motion.form>
            )}
          </AnimatePresence>

          <p className="text-xs text-white/30 mt-6">
            スパムなし。いつでも解約可能。 / No spam. Unsubscribe anytime.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════
   PRICING SECTION COMPONENT - KREMBO EDITIONS
═══════════════════════════════════════════════════════════════════════════ */
const PricingSection = ({ getThermalColor, temperature }: { getThermalColor: (t: number) => string; temperature: number }) => {
  const [hoveredTier, setHoveredTier] = useState<number | null>(1);

  return (
    <section className="py-32 px-6 relative bg-gradient-to-b from-transparent via-rose-950/10 to-transparent">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-xs tracking-[0.5em] text-rose-400/60 mb-4 font-mono">エディション / EDITIONS</p>
          <h2 className="text-4xl sm:text-5xl font-extralight tracking-tight mb-4 text-rose-100">
            コンソールを選ぶ
          </h2>
          <p className="text-white/40 max-w-lg mx-auto">
            Choose your console. From underground entry to legendary specification.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {PRICING_TIERS.map((tier, i) => (
            <motion.div
              key={tier.name}
              className={`relative p-8 border transition-all duration-500 ${
                tier.highlighted 
                  ? 'border-rose-500/50 bg-gradient-to-br from-rose-950/40 to-fuchsia-950/20' 
                  : 'border-rose-500/10 bg-rose-950/10'
              } ${hoveredTier === i ? 'scale-[1.02]' : ''}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              onMouseEnter={() => setHoveredTier(i)}
              onMouseLeave={() => setHoveredTier(1)}
            >
              {tier.highlighted && (
                <motion.div
                  className="absolute -top-px left-0 right-0 h-px"
                  style={{ background: `linear-gradient(90deg, transparent, ${getThermalColor(temperature)}, transparent)` }}
                  animate={{ opacity: [0.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
                />
              )}
              
              {tier.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-rose-600 to-pink-500 text-white text-xs tracking-wider font-medium">
                  おすすめ / RECOMMENDED
                </span>
              )}

              <div className="mb-2">
                <h3 className="text-xl font-light text-rose-100">{tier.name}</h3>
                <p className="text-xs text-rose-400/50">{tier.nameJp}</p>
              </div>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-3xl font-extralight" style={tier.highlighted ? { color: getThermalColor(temperature) } : { color: 'hsl(350 60% 70%)' }}>
                  {tier.price}
                </span>
                {tier.period && <span className="text-white/30 text-sm">{tier.period}</span>}
              </div>
              <p className="text-sm text-white/40 mb-6">{tier.description}</p>

              <ul className="space-y-3 mb-8">
                {tier.features.map((feature, fi) => (
                  <motion.li 
                    key={feature}
                    className="flex items-start gap-3 text-sm"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: i * 0.1 + fi * 0.05 }}
                  >
                    <Check className="w-4 h-4 text-rose-400 mt-0.5 flex-shrink-0" />
                    <span className="text-white/60">{feature}</span>
                  </motion.li>
                ))}
              </ul>

              <Button
                className={`w-full ${
                  tier.highlighted 
                    ? 'bg-gradient-to-r from-rose-600 to-pink-500 text-white hover:from-rose-500 hover:to-pink-400' 
                    : 'bg-rose-950/50 border border-rose-500/20 hover:bg-rose-900/50 text-rose-100'
                }`}
              >
                {tier.cta}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════
   TESTIMONIALS SECTION COMPONENT - CLUB CIRCUIT
═══════════════════════════════════════════════════════════════════════════ */
const TestimonialsSection = () => {
  return (
    <section className="py-32 px-6 border-y border-rose-500/10 bg-rose-950/5">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-xs tracking-[0.5em] text-rose-400/60 mb-4 font-mono">クラブサーキット / CLUB CIRCUIT</p>
          <h2 className="text-4xl sm:text-5xl font-extralight tracking-tight text-rose-100">
            伝説のDJたちの声
          </h2>
        </motion.div>

        {/* Testimonial Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {TESTIMONIALS.map((testimonial, i) => (
            <motion.div
              key={testimonial.author}
              className="relative p-8 border border-rose-500/10 bg-gradient-to-br from-rose-950/20 to-transparent hover:from-rose-950/30 transition-colors"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Quote className="w-8 h-8 text-rose-500/30 mb-4" />
              <p className="text-white/60 leading-relaxed mb-6 italic">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-600 to-pink-500 flex items-center justify-center text-white font-medium">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-medium text-sm text-rose-100">{testimonial.author}</p>
                  <p className="text-xs text-rose-400/50">{testimonial.role}</p>
                </div>
              </div>

              {/* Star rating */}
              <div className="absolute top-8 right-8 flex gap-0.5">
                {[...Array(5)].map((_, si) => (
                  <Star key={si} className="w-3 h-3 fill-rose-500 text-rose-500" />
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trusted By Venues */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-xs tracking-[0.4em] text-rose-400/30 mb-8">採用会場 / INSTALLED AT</p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
            {TRUSTED_BY.map((company, i) => (
              <motion.span
                key={company}
                className="text-lg font-light text-rose-300/20 hover:text-rose-300/40 transition-colors tracking-wide"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                {company}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ThermalLandingSlash;
