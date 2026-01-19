import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { 
  Play, 
  Pause,
  Zap, 
  Music, 
  Thermometer, 
  Sparkles, 
  Download, 
  Share2, 
  ArrowRight,
  Flame,
  Waves,
  BarChart3,
  Monitor,
  Smartphone,
  Globe,
  Volume2,
  VolumeX
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import thermalDemoVideo from '@/assets/thermal-demo.mp4';

// Demo audio URL - using a free sample track
const DEMO_AUDIO_URL = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';

const ThermalVisualizerLanding = () => {
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const [temperature, setTemperature] = useState(35);
  
  // Audio demo state
  const [isPlaying, setIsPlaying] = useState(false);
  const [demoTemperature, setDemoTemperature] = useState(25);
  const [spectralData, setSpectralData] = useState({ low: 0, mid: 0, high: 0 });
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isAudioLoaded, setIsAudioLoaded] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const animationRef = useRef<number | null>(null);

  // Set meta tags for social sharing
  useEffect(() => {
    const originalTitle = document.title;
    const originalDescription = document.querySelector('meta[name="description"]')?.getAttribute('content');
    
    // Update page title
    document.title = 'Thermal Music Visualizer | See Your Music Come Alive';
    
    // Update/create meta description
    let descMeta = document.querySelector('meta[name="description"]');
    if (descMeta) {
      descMeta.setAttribute('content', 'Transform any audio into a living thermal landscape. Watch temperatures rise with the beat, generate AI magic, and experience music like never before.');
    }
    
    // Open Graph tags
    const ogTags = [
      { property: 'og:title', content: 'Thermal Music Visualizer | See Your Music Come Alive' },
      { property: 'og:description', content: 'Transform any audio into a living thermal landscape. Watch temperatures rise with the beat, generate AI magic.' },
      { property: 'og:type', content: 'website' },
      { property: 'og:image', content: `${window.location.origin}/og-thermal.jpg` },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'og:url', content: window.location.href },
    ];
    
    // Twitter Card tags
    const twitterTags = [
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: 'Thermal Music Visualizer | See Your Music Come Alive' },
      { name: 'twitter:description', content: 'Transform any audio into a living thermal landscape. Watch temperatures rise with the beat.' },
      { name: 'twitter:image', content: `${window.location.origin}/og-thermal.jpg` },
    ];
    
    // Create or update OG tags
    ogTags.forEach(({ property, content }) => {
      let meta = document.querySelector(`meta[property="${property}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('property', property);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    });
    
    // Create or update Twitter tags
    twitterTags.forEach(({ name, content }) => {
      let meta = document.querySelector(`meta[name="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', name);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    });
    
    // Cleanup on unmount
    return () => {
      document.title = originalTitle;
      if (descMeta && originalDescription) {
        descMeta.setAttribute('content', originalDescription);
      }
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
      // Temperature responds to mouse position (only when not playing)
      if (!isPlaying) {
        const newTemp = 20 + (e.clientX / window.innerWidth) * 50;
        setTemperature(newTemp);
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isPlaying]);

  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio(DEMO_AUDIO_URL);
    audioRef.current.crossOrigin = 'anonymous';
    audioRef.current.volume = volume;
    
    audioRef.current.addEventListener('canplaythrough', () => {
      setIsAudioLoaded(true);
    });
    
    audioRef.current.addEventListener('ended', () => {
      setIsPlaying(false);
      setDemoTemperature(25);
      setSpectralData({ low: 0, mid: 0, high: 0 });
    });
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Volume control
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const analyzeAudio = useCallback(() => {
    if (!analyserRef.current) return;
    
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);
    
    // Split frequency data into bands
    const bassEnd = Math.floor(dataArray.length * 0.1);
    const midEnd = Math.floor(dataArray.length * 0.5);
    
    let bass = 0, mid = 0, high = 0;
    for (let i = 0; i < bassEnd; i++) bass += dataArray[i];
    for (let i = bassEnd; i < midEnd; i++) mid += dataArray[i];
    for (let i = midEnd; i < dataArray.length; i++) high += dataArray[i];
    
    bass /= bassEnd;
    mid /= (midEnd - bassEnd);
    high /= (dataArray.length - midEnd);
    
    // Normalize and set spectral data
    const normalizedBass = bass / 255;
    const normalizedMid = mid / 255;
    const normalizedHigh = high / 255;
    
    setSpectralData({ low: normalizedBass, mid: normalizedMid, high: normalizedHigh });
    
    // Calculate temperature from audio energy
    const energy = (normalizedBass * 0.5 + normalizedMid * 0.3 + normalizedHigh * 0.2);
    const newTemp = 25 + energy * 45;
    setDemoTemperature(prev => prev + (newTemp - prev) * 0.15); // Smooth transition
    setTemperature(prev => prev + (newTemp - prev) * 0.15);
    
    if (isPlaying) {
      animationRef.current = requestAnimationFrame(analyzeAudio);
    }
  }, [isPlaying]);

  const togglePlayback = async () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      setIsPlaying(false);
    } else {
      // Initialize audio context on first play (user interaction required)
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
    const normalized = (temp - 20) / 50;
    if (normalized < 0.3) return `hsl(15, 60%, ${20 + normalized * 60}%)`;
    if (normalized < 0.6) return `hsl(${15 + (normalized - 0.3) * 40}, 80%, ${40 + (normalized - 0.3) * 30}%)`;
    return `hsl(${35 + (normalized - 0.6) * 25}, 95%, ${55 + (normalized - 0.6) * 30}%)`;
  };

  const features = [
    {
      icon: Thermometer,
      title: "Thermal Mapping",
      description: "Proprietary algorithm converts audio energy into real-time temperature visualization"
    },
    {
      icon: Waves,
      title: "Waveform Display",
      description: "Raw audio signal visualization layered beneath the thermal response"
    },
    {
      icon: Sparkles,
      title: "AI Magic Generation",
      description: "Generate complementary ambient soundscapes based on thermal analysis"
    },
    {
      icon: BarChart3,
      title: "Spectral Analysis",
      description: "Real-time breakdown of bass, mid, and treble frequency energy"
    },
    {
      icon: Monitor,
      title: "Immersive Mode",
      description: "Full-screen cinematic experience with ambient particle effects"
    },
    {
      icon: Download,
      title: "Export Magic",
      description: "Download AI-generated audio layers as MP3 files"
    }
  ];

  return (
    <div className="min-h-screen text-white overflow-hidden" style={{ background: 'hsl(15 30% 4%)' }}>
      {/* Dynamic thermal background */}
      <div 
        className="fixed inset-0 pointer-events-none transition-all duration-300"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, ${getThermalColor(temperature)} 0%, transparent 50%)`,
          opacity: 0.3,
        }}
      />

      {/* Animated grid pattern */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(hsl(24 100% 50% / 0.1) 1px, transparent 1px),
            linear-gradient(90deg, hsl(24 100% 50% / 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6">
        {/* Floating thermal orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full animate-pulse"
              style={{
                left: `${15 + i * 12}%`,
                top: `${20 + (i % 3) * 25}%`,
                width: `${80 + i * 20}px`,
                height: `${80 + i * 20}px`,
                background: `radial-gradient(circle, ${getThermalColor(30 + i * 8)} 0%, transparent 70%)`,
                animationDelay: `${i * 200}ms`,
                animationDuration: `${3000 + i * 500}ms`,
              }}
            />
          ))}
        </div>

        {/* Main content */}
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
            style={{ 
              background: 'hsl(20 40% 12% / 0.8)', 
              border: '1px solid hsl(24 100% 50% / 0.3)',
            }}
          >
            <Flame className="w-4 h-4" style={{ color: 'hsl(24 100% 50%)' }} />
            <span className="text-sm tracking-wider" style={{ color: 'hsl(40 30% 75%)' }}>
              THERMAL RESONANCE SYSTEM™
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'hsl(24 100% 50%)', color: 'hsl(15 30% 6%)' }}>
              NEW
            </span>
          </div>

          {/* Main headline */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extralight tracking-tight mb-6">
            <span style={{ color: 'hsl(40 30% 85%)' }}>See Your Music</span>
            <br />
            <span 
              className="font-light text-transparent bg-clip-text"
              style={{ 
                backgroundImage: 'linear-gradient(135deg, hsl(0 70% 45%) 0%, hsl(24 100% 55%) 50%, hsl(45 100% 80%) 100%)',
              }}
            >
              Come Alive
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl md:text-2xl max-w-2xl mx-auto mb-10 leading-relaxed" style={{ color: 'hsl(30 20% 60%)' }}>
            Transform any audio into a <span style={{ color: 'hsl(24 100% 60%)' }}>living thermal landscape</span>. 
            Watch temperatures rise with the beat, generate AI magic, and experience music like never before.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link to="/thermal-visualizer">
              <Button
                size="lg"
                className="text-lg px-8 py-6 rounded-full group"
                style={{ 
                  background: 'linear-gradient(135deg, hsl(0 70% 45%) 0%, hsl(24 100% 50%) 100%)',
                  boxShadow: '0 0 40px hsl(24 100% 50% / 0.4)',
                }}
              >
                <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Launch Visualizer
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 rounded-full"
              style={{ 
                borderColor: 'hsl(40 30% 30%)', 
                color: 'hsl(40 30% 75%)',
                background: 'transparent',
              }}
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: 'Thermal Music Visualizer',
                    text: 'Transform your music into living thermal landscapes',
                    url: window.location.href,
                  });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                }
              }}
            >
              <Share2 className="w-5 h-5 mr-2" />
              Share
            </Button>
          </div>

          {/* Live temperature display */}
          <div 
            className="inline-flex items-center gap-4 px-6 py-3 rounded-2xl"
            style={{ 
              background: 'hsl(20 25% 8% / 0.8)', 
              border: '1px solid hsl(30 30% 20%)',
            }}
          >
            <Thermometer className="w-5 h-5" style={{ color: getThermalColor(temperature) }} />
            <span className="text-sm" style={{ color: 'hsl(30 20% 55%)' }}>Move your cursor to feel the heat</span>
            <span 
              className="font-mono text-2xl font-bold transition-colors duration-150"
              style={{ color: getThermalColor(temperature) }}
            >
              {temperature.toFixed(1)}°C
            </span>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div 
            className="w-6 h-10 rounded-full flex items-start justify-center pt-2"
            style={{ border: '2px solid hsl(30 30% 30%)' }}
          >
            <div 
              className="w-1 h-2 rounded-full animate-pulse"
              style={{ background: 'hsl(24 100% 50%)' }}
            />
          </div>
        </div>
      </section>

      {/* Video Preview Section */}
      <section className="relative py-20 px-6" style={{ background: 'hsl(15 30% 4%)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <span 
              className="inline-block px-4 py-1 rounded-full text-sm mb-4"
              style={{ 
                background: 'hsl(24 100% 50% / 0.15)', 
                color: 'hsl(24 100% 60%)',
                border: '1px solid hsl(24 100% 50% / 0.3)',
              }}
            >
              INSTANT PREVIEW
            </span>
            <h2 className="text-3xl sm:text-4xl font-extralight" style={{ color: 'hsl(40 30% 85%)' }}>
              Watch It <span style={{ color: 'hsl(24 100% 55%)' }}>In Action</span>
            </h2>
          </div>

          {/* Video container */}
          <div 
            className="relative rounded-3xl overflow-hidden mx-auto max-w-4xl"
            style={{ 
              border: '2px solid hsl(24 100% 50% / 0.3)',
              boxShadow: '0 0 80px hsl(24 100% 50% / 0.2)',
            }}
          >
            {/* Glow effect */}
            <div 
              className="absolute inset-0 pointer-events-none z-10"
              style={{
                background: 'radial-gradient(ellipse at center, transparent 60%, hsl(15 30% 4%) 100%)',
              }}
            />
            
            <video
              src={thermalDemoVideo}
              autoPlay
              loop
              muted
              playsInline
              className="w-full aspect-video object-cover"
              style={{ filter: 'brightness(1.1) saturate(1.2)' }}
            />

            {/* Overlay label */}
            <div 
              className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full z-20"
              style={{ 
                background: 'hsl(15 30% 6% / 0.9)', 
                border: '1px solid hsl(30 30% 25%)',
              }}
            >
              <div 
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ background: 'hsl(0 70% 50%)' }}
              />
              <span className="text-xs" style={{ color: 'hsl(30 20% 60%)' }}>
                Live Demo Preview
              </span>
            </div>
          </div>

          <p className="text-center mt-6 text-sm" style={{ color: 'hsl(30 20% 50%)' }}>
            Sound off • Scroll down to try the interactive demo with audio
          </p>
        </div>
      </section>

      {/* Live Audio Demo Section */}
      <section className="relative py-24 px-6" style={{ background: 'linear-gradient(180deg, hsl(15 30% 4%) 0%, hsl(15 35% 6%) 50%, hsl(15 30% 4%) 100%)' }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extralight mb-4" style={{ color: 'hsl(40 30% 85%)' }}>
              <span style={{ color: 'hsl(24 100% 55%)' }}>Hear</span> the Heat
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: 'hsl(30 20% 55%)' }}>
              Press play and watch the visualization respond to the music in real-time
            </p>
          </div>

          {/* Demo Visualizer */}
          <div 
            className="relative rounded-3xl overflow-hidden p-8 transition-all duration-300"
            style={{ 
              background: 'hsl(20 25% 6%)', 
              border: `2px solid ${isPlaying ? getThermalColor(demoTemperature) : 'hsl(30 30% 18%)'}`,
              boxShadow: isPlaying ? `0 0 60px ${getThermalColor(demoTemperature)}40` : 'none',
            }}
          >
            {/* Thermal glow effect */}
            <div 
              className="absolute inset-0 pointer-events-none transition-opacity duration-500"
              style={{
                background: `radial-gradient(circle at 50% 50%, ${getThermalColor(demoTemperature)}30 0%, transparent 70%)`,
                opacity: isPlaying ? 1 : 0.3,
              }}
            />

            {/* Spectral bars visualization */}
            <div className="relative z-10 flex items-end justify-center gap-4 h-48 mb-8">
              {/* Bass bar */}
              <div className="flex flex-col items-center gap-2">
                <div 
                  className="w-16 sm:w-24 rounded-t-lg transition-all duration-75"
                  style={{ 
                    height: `${20 + spectralData.low * 150}px`,
                    background: `linear-gradient(180deg, hsl(0 70% 50%) 0%, hsl(15 80% 35%) 100%)`,
                    boxShadow: isPlaying ? `0 0 20px hsl(0 70% 50% / ${spectralData.low})` : 'none',
                  }}
                />
                <span className="text-xs" style={{ color: 'hsl(30 20% 50%)' }}>BASS</span>
              </div>
              
              {/* Mid bar */}
              <div className="flex flex-col items-center gap-2">
                <div 
                  className="w-16 sm:w-24 rounded-t-lg transition-all duration-75"
                  style={{ 
                    height: `${20 + spectralData.mid * 150}px`,
                    background: `linear-gradient(180deg, hsl(24 100% 55%) 0%, hsl(20 90% 40%) 100%)`,
                    boxShadow: isPlaying ? `0 0 20px hsl(24 100% 55% / ${spectralData.mid})` : 'none',
                  }}
                />
                <span className="text-xs" style={{ color: 'hsl(30 20% 50%)' }}>MID</span>
              </div>
              
              {/* High bar */}
              <div className="flex flex-col items-center gap-2">
                <div 
                  className="w-16 sm:w-24 rounded-t-lg transition-all duration-75"
                  style={{ 
                    height: `${20 + spectralData.high * 150}px`,
                    background: `linear-gradient(180deg, hsl(45 100% 70%) 0%, hsl(35 95% 55%) 100%)`,
                    boxShadow: isPlaying ? `0 0 20px hsl(45 100% 70% / ${spectralData.high})` : 'none',
                  }}
                />
                <span className="text-xs" style={{ color: 'hsl(30 20% 50%)' }}>HIGH</span>
              </div>
            </div>

            {/* Temperature display */}
            <div className="relative z-10 flex items-center justify-center gap-6 mb-8">
              <div 
                className="flex items-center gap-3 px-6 py-3 rounded-full"
                style={{ 
                  background: 'hsl(20 25% 10% / 0.8)', 
                  border: `1px solid ${getThermalColor(demoTemperature)}50`,
                }}
              >
                <Thermometer className="w-5 h-5" style={{ color: getThermalColor(demoTemperature) }} />
                <span 
                  className="font-mono text-3xl font-bold transition-colors duration-150"
                  style={{ color: getThermalColor(demoTemperature) }}
                >
                  {demoTemperature.toFixed(1)}°C
                </span>
              </div>
            </div>

            {/* Controls */}
            <div className="relative z-10 flex flex-col items-center gap-6">
              {/* Play button */}
              <Button
                size="lg"
                onClick={togglePlayback}
                disabled={!isAudioLoaded}
                className="text-lg px-10 py-7 rounded-full group transition-all duration-300"
                style={{ 
                  background: isPlaying 
                    ? `linear-gradient(135deg, ${getThermalColor(demoTemperature)} 0%, hsl(24 100% 40%) 100%)`
                    : 'linear-gradient(135deg, hsl(0 70% 45%) 0%, hsl(24 100% 50%) 100%)',
                  boxShadow: isPlaying 
                    ? `0 0 50px ${getThermalColor(demoTemperature)}60`
                    : '0 0 30px hsl(24 100% 50% / 0.3)',
                }}
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-6 h-6 mr-2" />
                    Pause Demo
                  </>
                ) : (
                  <>
                    <Play className="w-6 h-6 mr-2 group-hover:scale-110 transition-transform" />
                    {isAudioLoaded ? 'Play Demo' : 'Loading...'}
                  </>
                )}
              </Button>

              {/* Volume control */}
              <div className="flex items-center gap-4 w-full max-w-xs">
                <button 
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-2 rounded-full transition-colors"
                  style={{ color: 'hsl(30 20% 55%)' }}
                >
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
                <Slider
                  value={[isMuted ? 0 : volume * 100]}
                  onValueChange={(v) => {
                    setVolume(v[0] / 100);
                    if (v[0] > 0) setIsMuted(false);
                  }}
                  max={100}
                  step={1}
                  className="flex-1"
                />
              </div>
            </div>
          </div>

          {/* Call to action after demo */}
          <div className="text-center mt-10">
            <p className="mb-4" style={{ color: 'hsl(30 20% 55%)' }}>
              Want to visualize your own music?
            </p>
            <Link to="/thermal-visualizer">
              <Button
                variant="outline"
                size="lg"
                className="rounded-full group"
                style={{ 
                  borderColor: 'hsl(24 100% 50% / 0.5)', 
                  color: 'hsl(24 100% 55%)',
                  background: 'transparent',
                }}
              >
                Try with Your Audio
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extralight mb-4" style={{ color: 'hsl(40 30% 85%)' }}>
              Powered by <span style={{ color: 'hsl(24 100% 55%)' }}>Innovation</span>
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: 'hsl(30 20% 55%)' }}>
              Cutting-edge audio analysis meets stunning visualization technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="group relative p-6 rounded-2xl transition-all duration-300 hover:translate-y-[-4px]"
                style={{ 
                  background: 'hsl(20 25% 8% / 0.6)', 
                  border: '1px solid hsl(30 30% 18%)',
                }}
              >
                {/* Hover glow */}
                <div 
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ 
                    background: `radial-gradient(circle at 50% 0%, hsl(24 100% 50% / 0.15) 0%, transparent 70%)`,
                  }}
                />
                
                <div className="relative z-10">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                    style={{ 
                      background: 'linear-gradient(135deg, hsl(0 70% 35% / 0.3) 0%, hsl(24 100% 50% / 0.3) 100%)',
                      border: '1px solid hsl(24 100% 50% / 0.3)',
                    }}
                  >
                    <feature.icon className="w-6 h-6" style={{ color: 'hsl(24 100% 55%)' }} />
                  </div>
                  <h3 className="text-xl font-medium mb-2" style={{ color: 'hsl(40 30% 85%)' }}>
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'hsl(30 20% 55%)' }}>
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative py-24 px-6" style={{ background: 'hsl(15 35% 5%)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extralight mb-4" style={{ color: 'hsl(40 30% 85%)' }}>
              Three Steps to <span style={{ color: 'hsl(24 100% 55%)' }}>Magic</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Upload', desc: 'Drop any audio file into the visualizer', icon: Music },
              { step: '02', title: 'Experience', desc: 'Watch temperatures rise with every beat', icon: Zap },
              { step: '03', title: 'Create', desc: 'Generate AI magic and download your creation', icon: Sparkles },
            ].map((item, index) => (
              <div key={item.step} className="text-center">
                <div 
                  className="relative w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center"
                  style={{ 
                    background: `linear-gradient(135deg, hsl(0 70% 35% / 0.2) 0%, hsl(24 100% 50% / 0.2) 100%)`,
                    border: '2px solid hsl(24 100% 50% / 0.4)',
                  }}
                >
                  <item.icon className="w-10 h-10" style={{ color: 'hsl(24 100% 55%)' }} />
                  <span 
                    className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                    style={{ background: 'hsl(24 100% 50%)', color: 'hsl(15 30% 6%)' }}
                  >
                    {item.step}
                  </span>
                </div>
                <h3 className="text-2xl font-light mb-2" style={{ color: 'hsl(40 30% 85%)' }}>
                  {item.title}
                </h3>
                <p style={{ color: 'hsl(30 20% 55%)' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Device Support Section */}
      <section className="relative py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-extralight mb-6" style={{ color: 'hsl(40 30% 85%)' }}>
            Works <span style={{ color: 'hsl(24 100% 55%)' }}>Everywhere</span>
          </h2>
          <p className="text-lg mb-12" style={{ color: 'hsl(30 20% 55%)' }}>
            Fully responsive design optimized for any screen
          </p>

          <div className="flex items-center justify-center gap-8 flex-wrap">
            {[
              { icon: Monitor, label: 'Desktop' },
              { icon: Smartphone, label: 'Mobile' },
              { icon: Globe, label: 'Web' },
            ].map((device) => (
              <div 
                key={device.label}
                className="flex flex-col items-center gap-3 px-8 py-6 rounded-2xl"
                style={{ 
                  background: 'hsl(20 25% 8% / 0.5)', 
                  border: '1px solid hsl(30 30% 18%)',
                }}
              >
                <device.icon className="w-8 h-8" style={{ color: 'hsl(24 100% 55%)' }} />
                <span style={{ color: 'hsl(40 30% 75%)' }}>{device.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-32 px-6">
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center, hsl(24 100% 50% / 0.15) 0%, transparent 60%)',
          }}
        />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-extralight mb-6" style={{ color: 'hsl(40 30% 85%)' }}>
            Ready to <span style={{ color: 'hsl(24 100% 55%)' }}>Feel the Heat</span>?
          </h2>
          <p className="text-xl mb-10" style={{ color: 'hsl(30 20% 60%)' }}>
            Upload your favorite track and watch it transform
          </p>
          <Link to="/thermal-visualizer">
            <Button
              size="lg"
              className="text-xl px-12 py-8 rounded-full group"
              style={{ 
                background: 'linear-gradient(135deg, hsl(0 70% 45%) 0%, hsl(24 100% 50%) 100%)',
                boxShadow: '0 0 60px hsl(24 100% 50% / 0.5)',
              }}
            >
              <Flame className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" />
              Start Visualizing
              <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 text-center" style={{ borderTop: '1px solid hsl(30 30% 15%)' }}>
        <p className="text-sm" style={{ color: 'hsl(30 15% 40%)' }}>
          THERMAL RESONANCE SYSTEM™ • Patent Pending: TRS-2024
        </p>
      </footer>
    </div>
  );
};

export default ThermalVisualizerLanding;
