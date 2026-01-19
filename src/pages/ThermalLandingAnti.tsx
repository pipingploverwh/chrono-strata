import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import thermalDemoVideo from '@/assets/thermal-demo.mp4';
import { SpatialAudioCAD, VINYL_COLLECTION, VinylRecord } from '@/components/SpatialAudioCAD';
import ThermalNavigation from '@/components/ThermalNavigation';

const ThermalLandingAnti = () => {
  const [temperature, setTemperature] = useState(35);
  const [isPlaying, setIsPlaying] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [spectralData, setSpectralData] = useState({ low: 0, mid: 0, high: 0 });
  const [time, setTime] = useState(0);
  const [selectedVinyl, setSelectedVinyl] = useState<VinylRecord>(VINYL_COLLECTION[0]);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const interval = setInterval(() => setTime(t => t + 1), 100);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      if (!isPlaying) {
        setTemperature(20 + (e.clientX / window.innerWidth) * 50);
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
      audioRef.current?.pause();
      audioContextRef.current?.close();
    };
  }, [selectedVinyl]);

  // Handle vinyl change - switch audio source
  const handleVinylSelect = useCallback((vinyl: VinylRecord) => {
    const wasPlaying = isPlaying;
    
    // Stop current playback
    if (audioRef.current && isPlaying) {
      audioRef.current.pause();
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      setIsPlaying(false);
    }
    
    // Update selected vinyl
    setSelectedVinyl(vinyl);
    
    // Create new audio with new source
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
      sourceRef.current = null;
    }
    
    audioRef.current = new Audio(vinyl.audioUrl);
    audioRef.current.crossOrigin = 'anonymous';
    audioRef.current.volume = 0.6;
    
    // Resume playback if was playing
    if (wasPlaying) {
      setTimeout(() => toggleAudio(), 100);
    }
  }, [isPlaying]);

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

  // Technical drawing helpers
  const freqToHz = (normalized: number) => Math.round(20 + normalized * 19980);
  const tempToKelvin = (c: number) => (c + 273.15).toFixed(1);

  return (
    <div 
      className="min-h-screen overflow-hidden cursor-crosshair select-none"
      style={{ 
        background: '#050508',
        fontFamily: 'ui-monospace, "SF Mono", Monaco, monospace',
      }}
    >
      {/* Kengo Kuma - Layered transparency panels */}
      <motion.div 
        className="fixed inset-0 pointer-events-none z-[1]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        {/* Vertical slat rhythm - timber screen inspiration */}
        <motion.div 
          className="absolute inset-0 opacity-[0.03]"
          initial={{ x: -20 }}
          animate={{ x: 0 }}
          transition={{ duration: 1.8, ease: "easeOut", delay: 0.2 }}
          style={{
            background: 'repeating-linear-gradient(90deg, transparent, transparent 60px, hsl(var(--kuma-slat)) 60px, hsl(var(--kuma-slat)) 61px)',
          }}
        />
        {/* Horizontal strata - geological layering */}
        <motion.div 
          className="absolute inset-0 opacity-[0.02]"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ duration: 1.8, ease: "easeOut", delay: 0.3 }}
          style={{
            background: 'repeating-linear-gradient(0deg, transparent, transparent 120px, hsl(var(--kuma-slat)) 120px, hsl(var(--kuma-slat)) 121px)',
          }}
        />
      </motion.div>

      {/* AAL - Ruled surface lines (geometric precision) */}
      <motion.div 
        className="fixed inset-0 pointer-events-none z-[2] opacity-[0.04]"
        initial={{ opacity: 0, rotate: -1 }}
        animate={{ opacity: 1, rotate: 0 }}
        transition={{ duration: 2, ease: "easeOut", delay: 0.4 }}
      >
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, transparent 49.5%, hsl(var(--aal-line)) 49.5%, hsl(var(--aal-line)) 50.5%, transparent 50.5%)',
            backgroundSize: '200px 200px',
          }}
        />
      </motion.div>

      {/* Kuma - Floating glass panels (depth layering) */}
      <motion.div 
        className="fixed top-[8%] right-[5%] w-48 h-64 pointer-events-none z-[3] opacity-60"
        initial={{ opacity: 0, x: 60, y: -30 }}
        animate={{ opacity: 0.6, x: 0, y: 0 }}
        transition={{ duration: 1.5, ease: "easeOut", delay: 0.6 }}
      >
        <div 
          className="absolute inset-0 border border-white/[0.03] rounded-sm"
          style={{ 
            background: 'linear-gradient(145deg, hsl(var(--kuma-glass-1)) 0%, transparent 100%)',
            backdropFilter: 'blur(1px)',
          }}
        />
      </motion.div>
      <motion.div 
        className="fixed bottom-[12%] left-[3%] w-32 h-80 pointer-events-none z-[3] opacity-40 -rotate-2"
        initial={{ opacity: 0, x: -40, y: 40 }}
        animate={{ opacity: 0.4, x: 0, y: 0 }}
        transition={{ duration: 1.5, ease: "easeOut", delay: 0.8 }}
      >
        <div 
          className="absolute inset-0 border border-white/[0.02]"
          style={{ 
            background: 'linear-gradient(180deg, transparent 0%, hsl(var(--kuma-glass-2)) 100%)',
          }}
        />
      </motion.div>

      {/* CAD Grid - Blueprint style */}
      <svg className="fixed inset-0 w-full h-full pointer-events-none z-0" style={{ opacity: 0.12 }}>
        <defs>
          <pattern id="smallGrid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1a3a5c" strokeWidth="0.5"/>
          </pattern>
          <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
            <rect width="100" height="100" fill="url(#smallGrid)"/>
            <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#1a3a5c" strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Cursor tracking crosshair */}
      <div 
        className="fixed pointer-events-none z-50 transition-transform duration-75"
        style={{ 
          left: mousePos.x,
          top: mousePos.y,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <svg width="60" height="60" viewBox="0 0 60 60">
          <circle cx="30" cy="30" r="28" fill="none" stroke="#ff6b35" strokeWidth="0.5" strokeDasharray="4 4" />
          <line x1="0" y1="30" x2="20" y2="30" stroke="#ff6b35" strokeWidth="0.5" />
          <line x1="40" y1="30" x2="60" y2="30" stroke="#ff6b35" strokeWidth="0.5" />
          <line x1="30" y1="0" x2="30" y2="20" stroke="#ff6b35" strokeWidth="0.5" />
          <line x1="30" y1="40" x2="30" y2="60" stroke="#ff6b35" strokeWidth="0.5" />
        </svg>
      </div>

      {/* Unified Thermal Navigation */}
      <ThermalNavigation />

      {/* Main CAD Board */}
      <main className="relative z-10 min-h-screen pt-20 pb-20">
        
        {/* Section A: Waveform Analysis */}
        <section className="px-8 py-16">
          <div className="max-w-6xl mx-auto">
            {/* Section label */}
            <div className="flex items-center gap-4 mb-8">
              <div className="w-8 h-8 border border-cyan-500/30 flex items-center justify-center">
                <span className="text-[10px] text-cyan-500">A</span>
              </div>
              <div>
                <div className="text-[9px] tracking-[0.3em] text-white/40">SECTION A</div>
                <div className="text-xs text-white/70">WAVEFORM DECOMPOSITION</div>
              </div>
              <div className="flex-1 h-px bg-gradient-to-r from-cyan-500/30 to-transparent" />
            </div>

            {/* Technical waveform display */}
            <div className="relative border border-white/10 p-6" style={{ background: 'rgba(10, 20, 30, 0.5)' }}>
              {/* Corner markers */}
              <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-cyan-500/50" />
              <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-cyan-500/50" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-cyan-500/50" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-cyan-500/50" />

              <svg className="w-full h-48" viewBox="0 0 800 200" preserveAspectRatio="none">
                {/* Axis lines */}
                <line x1="50" y1="100" x2="750" y2="100" stroke="#1a3a5c" strokeWidth="1" />
                <line x1="50" y1="20" x2="50" y2="180" stroke="#1a3a5c" strokeWidth="1" />
                
                {/* Axis labels */}
                <text x="400" y="195" textAnchor="middle" fill="#4a5568" fontSize="8">t (ms)</text>
                <text x="30" y="100" textAnchor="middle" fill="#4a5568" fontSize="8" transform="rotate(-90 30 100)">A</text>

                {/* Dynamic waveform */}
                <path
                  d={`M 50 100 ${Array.from({ length: 70 }, (_, i) => {
                    const x = 50 + i * 10;
                    const bassWave = Math.sin((i + time) * 0.3) * 30 * spectralData.low;
                    const midWave = Math.sin((i + time) * 0.8) * 20 * spectralData.mid;
                    const highWave = Math.sin((i + time) * 2) * 10 * spectralData.high;
                    const y = 100 - (bassWave + midWave + highWave);
                    return `L ${x} ${y}`;
                  }).join(' ')}`}
                  fill="none"
                  stroke="#ff6b35"
                  strokeWidth="1.5"
                />

                {/* Frequency markers */}
                {[0, 1, 2].map((i) => (
                  <g key={i}>
                    <line x1={200 + i * 200} y1="20" x2={200 + i * 200} y2="180" stroke="#ff6b35" strokeWidth="0.5" strokeDasharray="2 4" opacity="0.3" />
                    <text x={200 + i * 200} y="15" textAnchor="middle" fill="#ff6b35" fontSize="7" opacity="0.6">
                      {['20Hz', '1kHz', '20kHz'][i]}
                    </text>
                  </g>
                ))}
              </svg>

              {/* Data readouts */}
              <div className="flex justify-between mt-4 pt-4 border-t border-white/5">
                <div className="text-[9px] text-white/40">
                  SAMPLE RATE: <span className="text-cyan-400">44.1kHz</span>
                </div>
                <div className="text-[9px] text-white/40">
                  BIT DEPTH: <span className="text-cyan-400">24-bit</span>
                </div>
                <div className="text-[9px] text-white/40">
                  CHANNELS: <span className="text-cyan-400">STEREO</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section B: Spectral Analysis */}
        <section className="px-8 py-16">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-8 h-8 border border-orange-500/30 flex items-center justify-center">
                <span className="text-[10px] text-orange-500">B</span>
              </div>
              <div>
                <div className="text-[9px] tracking-[0.3em] text-white/40">SECTION B</div>
                <div className="text-xs text-white/70">SPECTRAL FREQUENCY ANALYSIS</div>
              </div>
              <div className="flex-1 h-px bg-gradient-to-r from-orange-500/30 to-transparent" />
            </div>

            <div className="grid grid-cols-3 gap-6">
              {[
                { label: 'LOW FREQ', range: '20-250Hz', value: spectralData.low, color: '#ff3333' },
                { label: 'MID FREQ', range: '250-4kHz', value: spectralData.mid, color: '#ff6b35' },
                { label: 'HIGH FREQ', range: '4-20kHz', value: spectralData.high, color: '#ffaa00' },
              ].map((band, i) => (
                <div 
                  key={band.label}
                  className="relative border border-white/10 p-4"
                  style={{ background: 'rgba(10, 20, 30, 0.5)' }}
                >
                  {/* Technical corner */}
                  <div className="absolute -top-2 -left-2 w-4 h-4">
                    <svg viewBox="0 0 16 16">
                      <path d="M 0 8 L 8 0 L 16 8 L 8 16 Z" fill="none" stroke={band.color} strokeWidth="1" opacity="0.5" />
                    </svg>
                  </div>

                  <div className="text-[8px] tracking-[0.3em] text-white/40 mb-1">{band.label}</div>
                  <div className="text-[10px] text-white/60 mb-4">{band.range}</div>
                  
                  {/* Vertical bar meter */}
                  <div className="h-32 w-full flex items-end justify-center gap-1">
                    {Array.from({ length: 8 }, (_, j) => {
                      const threshold = (j + 1) / 8;
                      const active = band.value >= threshold;
                      return (
                        <div 
                          key={j}
                          className="w-2 transition-all duration-75"
                          style={{ 
                            height: `${(j + 1) * 12.5}%`,
                            background: active ? band.color : '#1a1a2a',
                            opacity: active ? 1 : 0.3,
                          }}
                        />
                      );
                    })}
                  </div>

                  <div className="mt-4 pt-2 border-t border-white/5 text-center">
                    <span className="text-lg font-mono" style={{ color: band.color }}>
                      {(band.value * 100).toFixed(0)}%
                    </span>
                    <div className="text-[8px] text-white/30 mt-1">
                      {freqToHz(band.value)} Hz
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section C: Thermal Mapping */}
        <section className="px-8 py-16">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-8 h-8 border border-red-500/30 flex items-center justify-center">
                <span className="text-[10px] text-red-500">C</span>
              </div>
              <div>
                <div className="text-[9px] tracking-[0.3em] text-white/40">SECTION C</div>
                <div className="text-xs text-white/70">THERMAL ENERGY CONVERSION</div>
              </div>
              <div className="flex-1 h-px bg-gradient-to-r from-red-500/30 to-transparent" />
            </div>

            <div className="grid grid-cols-2 gap-8">
              {/* Thermal gauge */}
              <div className="border border-white/10 p-6" style={{ background: 'rgba(10, 20, 30, 0.5)' }}>
                <div className="relative">
                  <svg className="w-full" viewBox="0 0 300 200">
                    {/* Arc gauge background */}
                    <path
                      d="M 30 170 A 120 120 0 0 1 270 170"
                      fill="none"
                      stroke="#1a1a2a"
                      strokeWidth="20"
                      strokeLinecap="round"
                    />
                    {/* Arc gauge fill */}
                    <path
                      d="M 30 170 A 120 120 0 0 1 270 170"
                      fill="none"
                      stroke="url(#thermalGradient)"
                      strokeWidth="20"
                      strokeLinecap="round"
                      strokeDasharray={`${((temperature - 20) / 50) * 377} 377`}
                    />
                    <defs>
                      <linearGradient id="thermalGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#0066ff" />
                        <stop offset="50%" stopColor="#ff6b35" />
                        <stop offset="100%" stopColor="#ff0000" />
                      </linearGradient>
                    </defs>
                    
                    {/* Temperature labels */}
                    <text x="30" y="190" fill="#4a5568" fontSize="10" textAnchor="middle">20°</text>
                    <text x="150" y="40" fill="#4a5568" fontSize="10" textAnchor="middle">45°</text>
                    <text x="270" y="190" fill="#4a5568" fontSize="10" textAnchor="middle">70°</text>
                    
                    {/* Center readout */}
                    <text x="150" y="130" fill="#ff6b35" fontSize="36" textAnchor="middle" fontFamily="monospace">
                      {temperature.toFixed(1)}°
                    </text>
                    <text x="150" y="155" fill="#4a5568" fontSize="10" textAnchor="middle">
                      {tempToKelvin(temperature)}K
                    </text>
                  </svg>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-white/5">
                  <div>
                    <div className="text-[8px] text-white/40">CELSIUS</div>
                    <div className="text-sm font-mono text-white/80">{temperature.toFixed(2)}°C</div>
                  </div>
                  <div>
                    <div className="text-[8px] text-white/40">KELVIN</div>
                    <div className="text-sm font-mono text-white/80">{tempToKelvin(temperature)}K</div>
                  </div>
                </div>
              </div>

              {/* Video preview with technical overlay */}
              <div className="border border-white/10 p-2 relative" style={{ background: 'rgba(10, 20, 30, 0.5)' }}>
                <video
                  src={thermalDemoVideo}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full aspect-video object-cover"
                  style={{ filter: 'saturate(0.8) contrast(1.1)' }}
                />
                {/* Technical overlay */}
                <div className="absolute inset-2 pointer-events-none border border-cyan-500/20">
                  <div className="absolute top-2 left-2 text-[8px] text-cyan-500/60">REC ●</div>
                  <div className="absolute top-2 right-2 text-[8px] text-white/40">1920×1080</div>
                  <div className="absolute bottom-2 left-2 text-[8px] text-white/40">THERMAL.PREVIEW</div>
                  <div className="absolute bottom-2 right-2 text-[8px] text-cyan-500/60">30fps</div>
                  
                  {/* Scan lines */}
                  {[1, 2, 3].map((i) => (
                    <div 
                      key={i}
                      className="absolute left-0 right-0 h-px bg-cyan-500/10"
                      style={{ top: `${i * 25}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section D: Audio Control */}
        <section className="px-8 py-16">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-8 h-8 border border-green-500/30 flex items-center justify-center">
                <span className="text-[10px] text-green-500">D</span>
              </div>
              <div>
                <div className="text-[9px] tracking-[0.3em] text-white/40">SECTION D</div>
                <div className="text-xs text-white/70">AUDIO INPUT CONTROL</div>
              </div>
              <div className="flex-1 h-px bg-gradient-to-r from-green-500/30 to-transparent" />
            </div>

            <div className="flex items-center justify-center gap-12">
              {/* Play control */}
              <button
                onClick={toggleAudio}
                className="group relative"
              >
                <svg width="120" height="120" viewBox="0 0 120 120">
                  {/* Outer ring */}
                  <circle cx="60" cy="60" r="55" fill="none" stroke="#1a3a5c" strokeWidth="1" />
                  <circle 
                    cx="60" cy="60" r="55" 
                    fill="none" 
                    stroke={isPlaying ? '#22c55e' : '#ff6b35'} 
                    strokeWidth="2"
                    strokeDasharray={isPlaying ? '345' : '0 345'}
                    className="transition-all duration-300"
                  />
                  
                  {/* Inner technical marks */}
                  {Array.from({ length: 12 }, (_, i) => {
                    const angle = (i * 30 * Math.PI) / 180;
                    const x1 = 60 + Math.cos(angle) * 45;
                    const y1 = 60 + Math.sin(angle) * 45;
                    const x2 = 60 + Math.cos(angle) * 50;
                    const y2 = 60 + Math.sin(angle) * 50;
                    return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#3a3a4a" strokeWidth="1" />;
                  })}
                  
                  {/* Play/Pause icon */}
                  {isPlaying ? (
                    <>
                      <rect x="48" y="45" width="8" height="30" fill="#22c55e" />
                      <rect x="64" y="45" width="8" height="30" fill="#22c55e" />
                    </>
                  ) : (
                    <polygon points="50,40 50,80 80,60" fill="#ff6b35" />
                  )}
                </svg>
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] tracking-widest" style={{ color: isPlaying ? '#22c55e' : '#ff6b35' }}>
                  {isPlaying ? 'ACTIVE' : 'ENGAGE'}
                </div>
              </button>

              {/* Status panel */}
              <div className="border border-white/10 p-4 min-w-[200px]" style={{ background: 'rgba(10, 20, 30, 0.5)' }}>
                <div className="text-[8px] tracking-[0.3em] text-white/40 mb-3">SYSTEM STATUS</div>
                {[
                  { label: 'AUDIO ENGINE', status: isPlaying, value: isPlaying ? 'RUNNING' : 'STANDBY' },
                  { label: 'FFT ANALYSIS', status: isPlaying, value: isPlaying ? '256 BINS' : 'IDLE' },
                  { label: 'THERMAL MAP', status: true, value: 'LINKED' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between py-1 border-b border-white/5 last:border-0">
                    <span className="text-[9px] text-white/50">{item.label}</span>
                    <span className="flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${item.status ? 'bg-green-500' : 'bg-white/20'}`} />
                      <span className="text-[9px] text-white/70">{item.value}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section - Kuma/AAL refined */}
        <section className="px-8 py-24 relative">
          {/* AAL geometric frame lines */}
          <div className="absolute inset-x-8 top-16 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
          <div className="absolute inset-x-8 bottom-16 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
          
          <div className="max-w-6xl mx-auto text-center">
            {/* Kuma-inspired layered container */}
            <div className="relative inline-block">
              {/* Background shadow layer */}
              <div className="absolute inset-0 translate-x-2 translate-y-2 border border-white/[0.02] bg-white/[0.01]" />
              
              {/* Main container */}
              <div 
                className="relative border border-white/10 p-10"
                style={{ 
                  background: 'linear-gradient(135deg, rgba(10, 20, 30, 0.6) 0%, rgba(5, 10, 15, 0.8) 100%)',
                  backdropFilter: 'blur(8px)',
                }}
              >
                {/* AAL corner accents */}
                <div className="absolute -top-px -left-px w-8 h-px bg-gradient-to-r from-cyan-500/60 to-transparent" />
                <div className="absolute -top-px -left-px h-8 w-px bg-gradient-to-b from-cyan-500/60 to-transparent" />
                <div className="absolute -bottom-px -right-px w-8 h-px bg-gradient-to-l from-orange-500/40 to-transparent" />
                <div className="absolute -bottom-px -right-px h-8 w-px bg-gradient-to-t from-orange-500/40 to-transparent" />
                
                {/* AAL geometric separator */}
                <div className="flex items-center justify-center gap-3 mb-6">
                  <div className="w-12 h-px bg-white/10" />
                  <div className="w-1.5 h-1.5 rotate-45 border border-white/20" />
                  <div className="w-12 h-px bg-white/10" />
                </div>
                
                <div className="text-[9px] tracking-[0.5em] text-white/30 mb-6">INITIALIZE FULL INTERFACE</div>
                <Link 
                  to="/thermal-visualizer"
                  className="inline-block group"
                >
                  <div className="text-4xl font-mono tracking-tight text-transparent hover:text-orange-500 transition-colors duration-500"
                    style={{ WebkitTextStroke: '1px #ff6b35' }}
                  >
                    LAUNCH →
                  </div>
                  {/* Hover underline - AAL precision */}
                  <div className="h-px w-0 group-hover:w-full bg-gradient-to-r from-orange-500/60 to-cyan-500/40 transition-all duration-500 mt-2" />
                </Link>
                <div className="text-[8px] text-white/30 mt-6">THERMAL.VISUALIZER.EXE</div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Technical Footer with Kuma layering */}
      <footer className="fixed bottom-0 left-0 right-0 z-40">
        {/* Kuma horizontal strata line */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        
        <div className="p-4 flex justify-between items-end backdrop-blur-sm bg-black/20">
          <div className="text-[8px] text-white/30">
            {/* AAL geometric prefix */}
            <div className="flex items-center gap-2 mb-1">
              <div className="w-4 h-px bg-cyan-500/30" />
              <div className="w-0.5 h-0.5 rotate-45 bg-cyan-500/40" />
            </div>
            <div>BUILD: 2024.01.19</div>
            <div>ENGINE: WEB AUDIO API</div>
          </div>
          <div className="text-[8px] text-right text-white/30">
            {/* AAL geometric suffix */}
            <div className="flex items-center justify-end gap-2 mb-1">
              <div className="w-0.5 h-0.5 rotate-45 bg-white/20" />
              <div className="w-4 h-px bg-white/20" />
            </div>
            <div>SCALE: 1:1</div>
            <div>UNITS: SI</div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ThermalLandingAnti;