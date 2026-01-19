import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, Volume2, VolumeX } from 'lucide-react';
import thermalDemoVideo from '@/assets/thermal-demo.mp4';
import SpatialAudioCAD, { VINYL_COLLECTION, VinylRecord } from '@/components/SpatialAudioCAD';
import ThermalNavigation from '@/components/ThermalNavigation';
import ThermalFooter from '@/components/ThermalFooter';

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
      
      {/* Unified Thermal Navigation */}
      <ThermalNavigation />

      {/* Hero - Full screen with Kuma depth layering */}
      <section className="h-screen flex items-center justify-center relative">
        {/* Layer 1: Deep background blur (far) */}
        <motion.div 
          className="absolute inset-0 transition-all duration-700"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.8, ease: "easeOut" }}
          style={{
            background: `radial-gradient(ellipse 80% 60% at 50% 50%, ${getThermalColor(temperature)}15 0%, transparent 70%)`,
            filter: 'blur(40px)',
          }}
        />
        
        {/* Layer 2: Mid-ground glass panels (Kuma layering) */}
        <motion.div 
          className="absolute inset-20 border border-white/5 rounded-sm"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
          style={{ 
            background: 'hsl(var(--kuma-glass-1))',
            backdropFilter: 'blur(1px)',
          }}
        />
        
        {/* Layer 3: Inner frame with AAL geometric shadow */}
        <motion.div 
          className="absolute inset-32 border border-white/8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.5 }}
          style={{ 
            background: 'hsl(var(--kuma-glass-2))',
            boxShadow: 'inset 0 0 100px 20px hsl(0 0% 0% / 0.3)',
          }}
        />
        
        {/* Thermal glow - near layer */}
        <div 
          className="absolute inset-0 transition-all duration-500"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${getThermalColor(temperature)}25 0%, transparent 40%)`,
          }}
        />

        {/* Content - sharp foreground */}
        <motion.div 
          className="relative z-20 text-center px-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.7 }}
        >
          {/* AAL - Ruled surface accent lines */}
          <motion.div 
            className="absolute -top-8 left-1/2 -translate-x-1/2 w-px h-16 bg-gradient-to-b from-transparent to-white/10"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 1.0 }}
            style={{ originY: 0 }}
          />
          
          <h1 
            className="text-[15vw] leading-[0.85] font-extralight tracking-tighter transition-colors duration-300"
            style={{ 
              color: getThermalColor(temperature),
              textShadow: `0 0 120px ${getThermalColor(temperature)}40`,
            }}
          >
            {temperature.toFixed(0)}°
          </h1>
          
          {/* AAL - Geometric separator */}
          <motion.div 
            className="mt-6 flex items-center justify-center gap-3"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 1.2 }}
          >
            <div className="w-8 h-px bg-white/20" />
            <motion.div 
              className="w-1.5 h-1.5 rotate-45 border border-white/30"
              initial={{ scale: 0, rotate: 0 }}
              animate={{ scale: 1, rotate: 45 }}
              transition={{ duration: 0.4, ease: "easeOut", delay: 1.4 }}
            />
            <div className="w-8 h-px bg-white/20" />
          </motion.div>
          
          <motion.p 
            className="mt-6 text-[10px] tracking-[0.5em] opacity-40 font-light"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ duration: 0.8, delay: 1.5 }}
          >
            MUSIC → HEAT
          </motion.p>
          
          {/* AAL - Bottom ruled line */}
          <motion.div 
            className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-px h-20 bg-gradient-to-b from-white/10 to-transparent"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 1.6 }}
            style={{ originY: 0 }}
          />
        </motion.div>

        {/* Scroll line - AAL geometric precision */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <div className="w-px h-16 bg-gradient-to-b from-transparent via-white/20 to-white/5" />
          <div className="w-1 h-1 rounded-full bg-white/30" />
        </div>
      </section>

      {/* 3D Spatial Audio CAD Section */}
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
        <div className="absolute bottom-8 left-8 z-10">
          <p className="text-xs tracking-[0.3em] opacity-40 mb-2 font-mono">01</p>
          <p className="text-xl font-extralight tracking-wide">SPATIAL AUDIO</p>
          <p className="text-xs opacity-40 mt-1 font-mono">3D SOUND POSITIONING</p>
        </div>
        
        {/* Audio control overlay */}
        <div className="absolute bottom-8 right-8 z-10">
          <button
            onClick={toggleAudio}
            className="group flex items-center gap-3"
          >
            <span className="text-xs tracking-[0.3em] opacity-40 group-hover:opacity-60 transition-opacity font-mono">
              {isPlaying ? 'STOP' : 'PLAY'}
            </span>
            <span className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:border-white/40 transition-colors bg-black/50 backdrop-blur">
              {isPlaying ? (
                <VolumeX className="w-4 h-4 opacity-60" />
              ) : (
                <Volume2 className="w-4 h-4 opacity-60" />
              )}
            </span>
          </button>
        </div>
      </section>

      {/* Video section - full bleed */}
      <section className="relative h-screen">
        <video
          src={thermalDemoVideo}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: 'brightness(0.8)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
        
        <div className="absolute bottom-12 left-8 right-8 flex justify-between items-end">
          <div>
            <p className="text-xs tracking-[0.3em] opacity-40 mb-2 font-mono">02</p>
            <p className="text-2xl font-extralight">Thermal Vision</p>
          </div>
          <p className="text-xs tracking-[0.2em] opacity-40 max-w-xs text-right font-mono">
            REAL-TIME RESPONSE
          </p>
        </div>
      </section>

      {/* Interactive audio section */}
      <section className="min-h-screen flex flex-col items-center justify-center px-8 py-24 relative">
        <div 
          className="absolute inset-0 transition-opacity duration-500"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${getThermalColor(temperature)}15 0%, transparent 60%)`,
            opacity: isPlaying ? 1 : 0,
          }}
        />

        <div className="relative z-10 text-center">
          <p className="text-xs tracking-[0.3em] opacity-40 mb-8 font-mono">03</p>
          
          {/* Spectral bars */}
          <div className="flex items-end justify-center gap-2 h-40 mb-12">
            {['LOW', 'MID', 'HIGH'].map((label, i) => {
              const val = i === 0 ? spectralData.low : i === 1 ? spectralData.mid : spectralData.high;
              return (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div
                    className="w-2 bg-white/80 transition-all duration-75 rounded-full"
                    style={{ 
                      height: `${10 + val * 130}px`,
                      opacity: 0.4 + val * 0.6,
                    }}
                  />
                  <span className="text-[8px] font-mono opacity-30">{label}</span>
                </div>
              );
            })}
          </div>

          <div className="font-mono text-xs opacity-30 mb-8">
            FREQUENCY ANALYSIS
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="h-screen flex items-center justify-center relative">
        <Link 
          to="/thermal-visualizer"
          className="group text-center"
        >
          <p className="text-xs tracking-[0.3em] opacity-40 mb-6 font-mono">04</p>
          <h2 className="text-6xl sm:text-8xl font-extralight tracking-tight group-hover:tracking-normal transition-all duration-500">
            Launch
          </h2>
          <div className="mt-8 flex items-center justify-center gap-2 opacity-40 group-hover:opacity-100 transition-opacity">
            <span className="text-xs tracking-[0.2em] font-mono">OPEN VISUALIZER</span>
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </Link>
      </section>

      {/* Unified Thermal Footer */}
      <ThermalFooter />
    </div>
  );
};

export default ThermalLandingSlash;