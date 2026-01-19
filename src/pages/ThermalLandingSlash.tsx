import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Volume2, VolumeX } from 'lucide-react';
import thermalDemoVideo from '@/assets/thermal-demo.mp4';

const DEMO_AUDIO_URL = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';

const ThermalLandingSlash = () => {
  const [temperature, setTemperature] = useState(35);
  const [isPlaying, setIsPlaying] = useState(false);
  const [spectralData, setSpectralData] = useState({ low: 0, mid: 0, high: 0 });
  
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
    audioRef.current = new Audio(DEMO_AUDIO_URL);
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
  }, []);

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
      {/* Minimal nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-8 py-6">
        <span className="text-xs tracking-[0.3em] opacity-50">THERMAL</span>
        <Link 
          to="/thermal-visualizer"
          className="text-xs tracking-[0.2em] opacity-50 hover:opacity-100 transition-opacity flex items-center gap-1"
        >
          OPEN <ArrowUpRight className="w-3 h-3" />
        </Link>
      </nav>

      {/* Hero - Full screen */}
      <section className="h-screen flex items-center justify-center relative">
        {/* Thermal glow background */}
        <div 
          className="absolute inset-0 transition-all duration-500"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${getThermalColor(temperature)}20 0%, transparent 50%)`,
          }}
        />

        <div className="relative z-10 text-center px-8">
          <h1 
            className="text-[15vw] leading-[0.85] font-extralight tracking-tighter transition-colors duration-300"
            style={{ color: getThermalColor(temperature) }}
          >
            {temperature.toFixed(0)}°
          </h1>
          <p className="mt-8 text-xs tracking-[0.4em] opacity-40">
            MUSIC → HEAT
          </p>
        </div>

        {/* Scroll line */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
          <div className="w-px h-16 bg-gradient-to-b from-transparent via-white/20 to-white/5" />
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
            <p className="text-xs tracking-[0.3em] opacity-40 mb-2">01</p>
            <p className="text-2xl font-extralight">Visualize</p>
          </div>
          <p className="text-xs tracking-[0.2em] opacity-40 max-w-xs text-right">
            Real-time thermal response
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
          <p className="text-xs tracking-[0.3em] opacity-40 mb-8">02</p>
          
          {/* Minimal frequency bars */}
          <div className="flex items-end justify-center gap-1 h-32 mb-12">
            {[spectralData.low, spectralData.mid, spectralData.high].map((val, i) => (
              <div
                key={i}
                className="w-1 bg-white transition-all duration-75"
                style={{ 
                  height: `${8 + val * 120}px`,
                  opacity: 0.3 + val * 0.7,
                }}
              />
            ))}
          </div>

          <button
            onClick={toggleAudio}
            className="group flex items-center gap-4 mx-auto"
          >
            <span className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center group-hover:border-white/40 transition-colors">
              {isPlaying ? (
                <VolumeX className="w-5 h-5 opacity-60" />
              ) : (
                <Volume2 className="w-5 h-5 opacity-60" />
              )}
            </span>
            <span className="text-xs tracking-[0.3em] opacity-40 group-hover:opacity-60 transition-opacity">
              {isPlaying ? 'PAUSE' : 'LISTEN'}
            </span>
          </button>
        </div>
      </section>

      {/* CTA section */}
      <section className="h-screen flex items-center justify-center relative">
        <Link 
          to="/thermal-visualizer"
          className="group text-center"
        >
          <p className="text-xs tracking-[0.3em] opacity-40 mb-6">03</p>
          <h2 className="text-6xl sm:text-8xl font-extralight tracking-tight group-hover:tracking-normal transition-all duration-500">
            Try it
          </h2>
          <div className="mt-8 flex items-center justify-center gap-2 opacity-40 group-hover:opacity-100 transition-opacity">
            <span className="text-xs tracking-[0.2em]">OPEN VISUALIZER</span>
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </Link>
      </section>

      {/* Footer */}
      <footer className="py-8 px-8 flex justify-between items-center border-t border-white/5">
        <span className="text-xs opacity-30">© 2024</span>
        <span className="text-xs opacity-30">THERMAL RESONANCE</span>
      </footer>
    </div>
  );
};

export default ThermalLandingSlash;