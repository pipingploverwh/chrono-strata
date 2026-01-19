import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, Volume2, VolumeX, Zap, Waves, Thermometer, Music, Play, Sparkles, ChevronDown } from 'lucide-react';
import thermalDemoVideo from '@/assets/thermal-demo.mp4';
import SpatialAudioCAD, { VINYL_COLLECTION, VinylRecord } from '@/components/SpatialAudioCAD';
import ThermalNavigation from '@/components/ThermalNavigation';
import ThermalFooter from '@/components/ThermalFooter';

const VALUE_PROPS = [
  {
    icon: Thermometer,
    title: 'Thermal Physics Engine',
    desc: 'First-principles heat transfer modeling converts audio energy to visual temperature',
  },
  {
    icon: Waves,
    title: 'Multi-Band Spectral Analysis',
    desc: 'Real-time FFT processing isolates bass, mid, and high frequencies',
  },
  {
    icon: Zap,
    title: 'Psychoacoustic Mapping',
    desc: 'Scientifically calibrated presets for analog warmth to crystalline clarity',
  },
];

const FEATURES = [
  { label: '3D Spatial Audio', desc: 'Immersive sound positioning' },
  { label: 'AI Magic Generation', desc: 'ElevenLabs ambient layers' },
  { label: 'Vinyl Crate Selection', desc: 'Curated track library' },
  { label: 'Fullscreen Immersive', desc: 'Performance-ready mode' },
  { label: 'Waveform Visualization', desc: 'Oscilloscope display' },
  { label: 'Thermal Diffusion', desc: "Newton's law cooling" },
];

const STATS = [
  { value: '256', label: 'FFT Bins' },
  { value: '60', label: 'FPS Render' },
  { value: '5', label: 'Presets' },
  { value: '∞', label: 'Tracks' },
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

  const getThermalColor = (temp: number): string => {
    const n = (temp - 20) / 50;
    if (n < 0.3) return `hsl(15, 60%, ${20 + n * 60}%)`;
    if (n < 0.6) return `hsl(${15 + (n - 0.3) * 40}, 80%, ${40 + (n - 0.3) * 30}%)`;
    return `hsl(${35 + (n - 0.6) * 25}, 95%, ${55 + (n - 0.6) * 30}%)`;
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Kengo Kuma - Layered slat pattern overlay */}
      <motion.div 
        className="fixed inset-0 pointer-events-none z-10"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 0.4, x: 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        style={{
          backgroundImage: `repeating-linear-gradient(
            90deg,
            transparent,
            transparent 23px,
            hsl(var(--kuma-slat-color)) 23px,
            hsl(var(--kuma-slat-color)) 24px
          )`,
        }}
      />
      
      {/* Arielle Assouline-Lichten - Geometric ruled surface lines */}
      <motion.div 
        className="fixed inset-0 pointer-events-none z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, ease: "easeOut", delay: 0.3 }}
        style={{
          backgroundImage: `
            linear-gradient(to right, hsl(0 0% 100% / 0.03) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(0 0% 100% / 0.02) 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px',
        }}
      />
      
      <ThermalNavigation />

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 1: HERO - Immediate Impact & Primary CTA
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="min-h-screen flex flex-col items-center justify-center relative px-6">
        {/* Thermal glow background */}
        <motion.div 
          className="absolute inset-0 transition-all duration-700"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.8, ease: "easeOut" }}
          style={{
            background: `radial-gradient(ellipse 80% 60% at 50% 50%, ${getThermalColor(temperature)}20 0%, transparent 70%)`,
            filter: 'blur(60px)',
          }}
        />
        
        {/* Kuma glass layers */}
        <motion.div 
          className="absolute inset-16 sm:inset-24 border border-white/5 rounded-sm"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
          style={{ 
            background: 'hsl(var(--kuma-glass-1))',
            backdropFilter: 'blur(1px)',
          }}
        />

        <div className="relative z-20 text-center max-w-5xl">
          {/* Eyebrow */}
          <motion.div 
            className="flex items-center justify-center gap-3 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-xs tracking-[0.4em] text-primary/80 font-medium">THERMAL RESONANCE</span>
            <Sparkles className="w-4 h-4 text-primary" />
          </motion.div>

          {/* Headline */}
          <motion.h1 
            className="text-5xl sm:text-7xl lg:text-8xl font-extralight tracking-tight leading-[0.95] mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <span className="text-white/90">See Your Music</span>
            <br />
            <span 
              className="transition-colors duration-300"
              style={{ color: getThermalColor(temperature) }}
            >
              As Heat
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p 
            className="text-lg sm:text-xl text-white/50 max-w-2xl mx-auto mb-10 font-light"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1 }}
          >
            The world's first audio-thermal physics engine. Transform sound energy 
            into stunning heat visualizations with scientific precision.
          </motion.p>

          {/* Primary CTA */}
          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            <Link 
              to="/thermal-visualizer"
              className="group relative px-8 py-4 bg-foreground text-background font-medium tracking-wide overflow-hidden transition-all hover:shadow-[0_0_40px_hsl(var(--foreground)/0.3)]"
            >
              <span className="relative z-10 flex items-center gap-2">
                <Play className="w-4 h-4" />
                Launch Visualizer
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </Link>
            
            <button
              onClick={toggleAudio}
              className="px-8 py-4 border border-white/20 font-medium tracking-wide hover:border-white/40 hover:bg-white/5 transition-all flex items-center gap-2"
            >
              {isPlaying ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              {isPlaying ? 'Stop Demo' : 'Hear It Live'}
            </button>
          </motion.div>

          {/* Live temperature display */}
          <motion.div 
            className="mt-12 inline-flex items-center gap-4 px-6 py-3 border border-white/10 bg-white/5 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.5 }}
          >
            <Thermometer className="w-5 h-5 opacity-50" />
            <span 
              className="text-4xl font-extralight tabular-nums transition-colors duration-300"
              style={{ color: getThermalColor(temperature) }}
            >
              {temperature.toFixed(1)}°
            </span>
            <span className="text-xs opacity-40 tracking-wider">LIVE</span>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 0.6, delay: 2 }}
        >
          <span className="text-[10px] tracking-[0.3em]">SCROLL</span>
          <ChevronDown className="w-4 h-4 animate-bounce" />
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 2: VALUE PROPOSITIONS - Why This Matters
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-32 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs tracking-[0.5em] text-primary/60 mb-4 font-mono">THE TECHNOLOGY</p>
            <h2 className="text-4xl sm:text-5xl font-extralight tracking-tight">
              Built on Science,<br />
              <span className="text-muted-foreground">Not Gimmicks</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {VALUE_PROPS.map((prop, i) => (
              <motion.div
                key={prop.title}
                className="group p-8 border border-white/10 hover:border-white/20 bg-white/[0.02] hover:bg-white/[0.04] transition-all"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
              >
                <prop.icon className="w-8 h-8 mb-6 text-primary/70 group-hover:text-primary transition-colors" />
                <h3 className="text-xl font-light mb-3 tracking-wide">{prop.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{prop.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 3: STATS BAR - Quick Credibility
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-16 border-y border-white/10 bg-white/[0.01]">
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
                <div className="text-4xl sm:text-5xl font-extralight text-primary/80 mb-2 tabular-nums">
                  {stat.value}
                </div>
                <div className="text-xs tracking-[0.3em] text-white/30">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 4: 3D SPATIAL AUDIO - Interactive Demo
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="h-screen relative bg-black">
        <div className="absolute inset-0 border border-white/10">
          <SpatialAudioCAD 
            spectralData={spectralData} 
            temperature={temperature} 
            isPlaying={isPlaying}
            selectedVinyl={selectedVinyl}
            onVinylSelect={setSelectedVinyl}
          />
        </div>
        
        {/* Section label */}
        <div className="absolute top-8 left-8 z-10">
          <p className="text-xs tracking-[0.3em] text-primary/60 mb-2 font-mono">INTERACTIVE DEMO</p>
          <p className="text-2xl font-extralight tracking-wide">3D Spatial Audio</p>
          <p className="text-sm text-muted-foreground mt-2 max-w-xs">
            Explore the sound field. Select vinyl from the crate to change tracks.
          </p>
        </div>
        
        {/* Audio control overlay */}
        <div className="absolute bottom-8 right-8 z-10">
          <button
            onClick={toggleAudio}
            className="group flex items-center gap-3 px-5 py-3 border border-border hover:border-primary/50 bg-background/80 backdrop-blur transition-all"
          >
            <span className="w-10 h-10 rounded-full border border-border flex items-center justify-center group-hover:border-primary/50 transition-colors">
              {isPlaying ? (
                <VolumeX className="w-4 h-4 opacity-60" />
              ) : (
                <Volume2 className="w-4 h-4 opacity-60" />
              )}
            </span>
            <span className="text-sm tracking-wider font-mono">
              {isPlaying ? 'STOP' : 'PLAY AUDIO'}
            </span>
          </button>
        </div>

        {/* Spectral readout */}
        <div className="absolute bottom-8 left-8 z-10 flex items-end gap-3">
          {['LOW', 'MID', 'HIGH'].map((label, i) => {
            const val = i === 0 ? spectralData.low : i === 1 ? spectralData.mid : spectralData.high;
            return (
              <div key={label} className="flex flex-col items-center gap-1">
                <div
                  className="w-3 rounded-full transition-all duration-75"
                  style={{ 
                    height: `${8 + val * 60}px`,
                    background: getThermalColor(25 + val * 40),
                    opacity: 0.5 + val * 0.5,
                  }}
                />
                <span className="text-[8px] font-mono text-white/30">{label}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 5: VIDEO SHOWCASE - Visual Impact
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative h-screen">
        <video
          src={thermalDemoVideo}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: 'brightness(0.7) contrast(1.1)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
        
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div 
            className="text-center px-6"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-xs tracking-[0.5em] text-primary/60 mb-6 font-mono">REAL-TIME VISUALIZATION</p>
            <h2 className="text-5xl sm:text-7xl font-extralight tracking-tight mb-4">
              Thermal Vision
            </h2>
            <p className="text-lg text-muted-foreground max-w-lg mx-auto">
              Every beat, every frequency, every sonic texture transformed into living heat
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 6: FEATURE GRID - Comprehensive Capabilities
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs tracking-[0.5em] text-primary/60 mb-4 font-mono">CAPABILITIES</p>
            <h2 className="text-4xl sm:text-5xl font-extralight tracking-tight">
              Full Feature Set
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10">
            {FEATURES.map((feature, i) => (
              <motion.div
                key={feature.label}
                className="p-8 bg-black hover:bg-white/[0.03] transition-colors"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 mt-2 bg-primary/60 rounded-full" />
                  <div>
                    <h3 className="text-lg font-light mb-1">{feature.label}</h3>
                    <p className="text-sm text-muted-foreground">{feature.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 7: FINAL CTA - Close the Deal
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="min-h-screen flex items-center justify-center relative px-6">
        {/* Ambient glow */}
        <div 
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse 60% 50% at 50% 50%, ${getThermalColor(temperature)}15 0%, transparent 60%)`,
          }}
        />

        <motion.div 
          className="relative z-10 text-center max-w-3xl"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Music className="w-12 h-12 mx-auto mb-8 text-primary/50" />
          
          <h2 className="text-5xl sm:text-7xl font-extralight tracking-tight mb-6">
            Ready to<br />
            <span 
              className="transition-colors duration-300"
              style={{ color: getThermalColor(temperature) }}
            >
              Feel the Heat?
            </span>
          </h2>
          
          <p className="text-lg text-muted-foreground mb-12 max-w-xl mx-auto">
            Upload your tracks. Watch them burn. Experience audio like never before.
          </p>

          <Link 
            to="/thermal-visualizer"
            className="group inline-flex items-center gap-3 px-10 py-5 bg-foreground text-background font-medium text-lg tracking-wide overflow-hidden transition-all hover:shadow-[0_0_60px_hsl(var(--foreground)/0.4)]"
          >
            <Play className="w-5 h-5" />
            <span>Launch Thermal Resonance</span>
            <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </Link>

          <div className="mt-12 flex items-center justify-center gap-8 text-xs text-muted-foreground">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
              Free to use
            </span>
            <span>No signup required</span>
            <span>Works in browser</span>
          </div>
        </motion.div>
      </section>

      <ThermalFooter />
    </div>
  );
};

export default ThermalLandingSlash;
