import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import thermalDemoVideo from '@/assets/thermal-demo.mp4';

const DEMO_AUDIO_URL = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';

const ThermalLandingAnti = () => {
  const [temperature, setTemperature] = useState(35);
  const [isPlaying, setIsPlaying] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [spectralData, setSpectralData] = useState({ low: 0, mid: 0, high: 0 });
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const animationRef = useRef<number | null>(null);

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
    audioRef.current = new Audio(DEMO_AUDIO_URL);
    audioRef.current.crossOrigin = 'anonymous';
    audioRef.current.volume = 0.6;
    
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      audioRef.current?.pause();
      audioContextRef.current?.close();
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

  return (
    <div 
      className="min-h-screen overflow-hidden cursor-crosshair"
      style={{ 
        background: '#0a0a0a',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* Chaotic floating elements */}
      <div 
        className="fixed pointer-events-none z-0 transition-transform duration-100"
        style={{ 
          left: mousePos.x - 100,
          top: mousePos.y - 100,
          width: 200,
          height: 200,
          background: `radial-gradient(circle, hsl(${temperature}, 100%, 50%) 0%, transparent 70%)`,
          opacity: 0.3,
          filter: 'blur(40px)',
        }}
      />

      {/* Brutalist grid overlay */}
      <div 
        className="fixed inset-0 pointer-events-none z-10 opacity-[0.03]"
        style={{
          backgroundImage: `
            repeating-linear-gradient(0deg, white 0px, white 1px, transparent 1px, transparent 100px),
            repeating-linear-gradient(90deg, white 0px, white 1px, transparent 1px, transparent 100px)
          `,
        }}
      />

      {/* Scattered text elements */}
      <div className="fixed top-4 left-4 z-20">
        <span 
          className="text-[10px] tracking-widest"
          style={{ color: '#666', writingMode: 'vertical-rl' }}
        >
          THERMAL.EXE
        </span>
      </div>

      <div className="fixed top-4 right-4 z-20 text-right">
        <span className="text-[10px] block" style={{ color: '#444' }}>
          {new Date().toISOString().split('T')[0]}
        </span>
        <span 
          className="text-xs font-mono"
          style={{ color: `hsl(${temperature}, 80%, 50%)` }}
        >
          {temperature.toFixed(1)}°C
        </span>
      </div>

      {/* Main content - asymmetric layout */}
      <main className="relative z-20 min-h-screen">
        {/* Hero - offset positioning */}
        <section className="h-screen flex items-end pb-[20vh] pl-[10vw]">
          <div>
            <h1 
              className="text-[20vw] leading-none font-black tracking-tighter"
              style={{ 
                color: 'transparent',
                WebkitTextStroke: `1px hsl(${temperature}, 70%, 45%)`,
                transform: `skewX(${(mousePos.x / window.innerWidth - 0.5) * -5}deg)`,
              }}
            >
              HEAT
            </h1>
            <p 
              className="text-xs mt-4 max-w-[200px]"
              style={{ color: '#555' }}
            >
              audio → thermal
            </p>
          </div>
        </section>

        {/* Video - unconventional crop */}
        <section className="relative py-20">
          <div 
            className="mx-auto"
            style={{ 
              width: '70vw',
              marginLeft: '25vw',
              transform: 'rotate(-1deg)',
            }}
          >
            <video
              src={thermalDemoVideo}
              autoPlay
              loop
              muted
              playsInline
              className="w-full aspect-[2.5/1] object-cover"
              style={{ 
                filter: 'grayscale(0.3) contrast(1.2)',
                mixBlendMode: 'screen',
              }}
            />
            <div 
              className="absolute -bottom-4 -left-8 text-[100px] font-black leading-none pointer-events-none"
              style={{ 
                color: 'transparent',
                WebkitTextStroke: '1px #333',
              }}
            >
              01
            </div>
          </div>
        </section>

        {/* Audio interaction - raw */}
        <section className="py-32 px-8">
          <div className="max-w-screen-lg mx-auto">
            <div className="flex items-start justify-between gap-8 flex-wrap">
              <div>
                <span className="text-[8px] tracking-[0.5em] block mb-2" style={{ color: '#444' }}>
                  INTERACT
                </span>
                
                {/* Raw frequency display */}
                <div className="flex gap-2 mt-8">
                  {['LO', 'MD', 'HI'].map((label, i) => {
                    const val = [spectralData.low, spectralData.mid, spectralData.high][i];
                    return (
                      <div key={label} className="text-center">
                        <div 
                          className="w-8 mb-1"
                          style={{ 
                            height: `${20 + val * 80}px`,
                            background: `hsl(${temperature + i * 10}, 70%, 45%)`,
                            transition: 'height 50ms',
                          }}
                        />
                        <span className="text-[8px]" style={{ color: '#555' }}>{label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <button
                onClick={toggleAudio}
                className="group"
                style={{ marginTop: '60px' }}
              >
                <div 
                  className="w-24 h-24 border flex items-center justify-center transition-all"
                  style={{ 
                    borderColor: isPlaying ? `hsl(${temperature}, 70%, 45%)` : '#333',
                    transform: isPlaying ? 'rotate(45deg)' : 'rotate(0deg)',
                  }}
                >
                  <span 
                    className="text-[10px] tracking-widest"
                    style={{ 
                      color: isPlaying ? `hsl(${temperature}, 70%, 55%)` : '#666',
                      transform: isPlaying ? 'rotate(-45deg)' : 'rotate(0deg)',
                    }}
                  >
                    {isPlaying ? 'STOP' : 'PLAY'}
                  </span>
                </div>
              </button>
            </div>
          </div>
        </section>

        {/* CTA - aggressive */}
        <section className="py-32 relative">
          <Link 
            to="/thermal-visualizer"
            className="block text-center group"
          >
            <span 
              className="text-[8vw] font-black tracking-tight transition-all duration-300 inline-block hover:text-orange-500"
              style={{ 
                color: '#111',
                WebkitTextStroke: '1px #444',
              }}
            >
              ENTER→
            </span>
          </Link>
        </section>

        {/* Footer - minimal */}
        <footer 
          className="py-6 px-8 flex justify-between text-[9px]"
          style={{ color: '#333', borderTop: '1px solid #1a1a1a' }}
        >
          <span>THERMAL RESONANCE SYSTEM</span>
          <span>V.2024</span>
        </footer>
      </main>
    </div>
  );
};

export default ThermalLandingAnti;