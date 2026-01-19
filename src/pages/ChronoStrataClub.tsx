import { useState, useRef, useEffect } from "react";
import { Music, Play, Pause, Volume2, VolumeX, Calendar, MapPin, Clock, ExternalLink, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Bilingual content
const content = {
  en: {
    comingSoon: "Coming Soon",
    title: "Chrono-Strata Club",
    subtitle: "A Listening Bar Experience",
    location: "Tokyo",
    date: "March 5, 2026",
    description: "Where time meets sound. An immersive listening bar featuring curated vinyl selections, AI-generated disco house, and meticulously crafted cocktails in the heart of Tokyo.",
    waitlist: "Join the Waitlist",
    waitlistDesc: "Be the first to experience Tokyo's newest listening sanctuary",
    whatsapp: "Sign Up via WhatsApp",
    musicTitle: "Preview the Vibe",
    musicDesc: "AI-generated disco house inspired by Tokyo nights",
    moods: {
      energetic: "Energetic",
      chill: "Chill",
      deep: "Deep",
      vintage: "Vintage",
    },
    generating: "Generating...",
    languageToggle: "日本語",
    footer: "Chrono-Strata Club • Tokyo • 2026",
    features: {
      vinyl: "Curated Vinyl",
      cocktails: "Craft Cocktails",
      sound: "Immersive Sound",
    },
  },
  ja: {
    comingSoon: "まもなくオープン",
    title: "クロノ・ストラータ クラブ",
    subtitle: "リスニングバー体験",
    location: "東京",
    date: "2026年3月5日",
    description: "時と音が出会う場所。厳選されたレコード、AI生成のディスコハウス、こだわりのカクテルを東京の中心でお届けします。",
    waitlist: "ウェイトリストに登録",
    waitlistDesc: "東京の新しいリスニングサンクチュアリを最初に体験",
    whatsapp: "WhatsAppで登録",
    musicTitle: "雰囲気をプレビュー",
    musicDesc: "東京の夜からインスピレーションを得たAI生成ディスコハウス",
    moods: {
      energetic: "エナジェティック",
      chill: "チル",
      deep: "ディープ",
      vintage: "ヴィンテージ",
    },
    generating: "生成中...",
    languageToggle: "English",
    footer: "クロノ・ストラータ クラブ • 東京 • 2026",
    features: {
      vinyl: "厳選レコード",
      cocktails: "クラフトカクテル",
      sound: "没入サウンド",
    },
  },
};

const ChronoStrataClub = () => {
  const [lang, setLang] = useState<'en' | 'ja'>('en');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeMood, setActiveMood] = useState<'energetic' | 'chill' | 'deep' | 'vintage'>('energetic');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const t = content[lang];

  // Cleanup audio URL on unmount
  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  const generateMusic = async (mood: 'energetic' | 'chill' | 'deep' | 'vintage') => {
    setIsGenerating(true);
    setActiveMood(mood);
    
    // Stop current audio
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chrono-music`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ mood }),
        }
      );

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to generate music');
      }

      // Use data URI for base64 audio
      const newAudioUrl = `data:audio/mpeg;base64,${data.audioContent}`;
      setAudioUrl(newAudioUrl);
      
      // Play the audio
      if (audioRef.current) {
        audioRef.current.src = newAudioUrl;
        audioRef.current.load();
        await audioRef.current.play();
        setIsPlaying(true);
      }

      toast.success(lang === 'ja' ? '音楽を生成しました' : 'Music generated!');
    } catch (error) {
      console.error('Error generating music:', error);
      toast.error(lang === 'ja' ? '音楽の生成に失敗しました' : 'Failed to generate music');
    } finally {
      setIsGenerating(false);
    }
  };

  const togglePlay = () => {
    if (!audioRef.current || !audioUrl) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const openWhatsApp = () => {
    const message = lang === 'ja' 
      ? 'クロノ・ストラータ クラブのウェイトリストに登録希望です。3月5日東京オープン！'
      : 'I want to join the Chrono-Strata Club waitlist. Opening March 5 in Tokyo!';
    const encodedMessage = encodeURIComponent(message);
    // Replace with your actual WhatsApp business number
    window.open(`https://wa.me/818012345678?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 relative overflow-hidden">
      {/* Hidden audio element */}
      <audio 
        ref={audioRef} 
        onEnded={() => setIsPlaying(false)}
        loop
      />

      {/* Ambient background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div 
          className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(236,72,153,0.3) 0%, transparent 70%)',
            filter: 'blur(100px)',
            animation: 'pulse 8s ease-in-out infinite',
          }}
        />
        <div 
          className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(16,185,129,0.3) 0%, transparent 70%)',
            filter: 'blur(100px)',
            animation: 'pulse 10s ease-in-out infinite reverse',
          }}
        />
      </div>

      {/* Language toggle */}
      <div className="fixed top-6 right-6 z-50">
        <button
          onClick={() => setLang(lang === 'en' ? 'ja' : 'en')}
          className="px-4 py-2 bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-full text-xs tracking-widest uppercase hover:border-pink-500/50 transition-colors"
        >
          {t.languageToggle}
        </button>
      </div>

      {/* Main content */}
      <main className="relative z-10 max-w-4xl mx-auto px-6 py-24">
        {/* Hero section */}
        <section className="text-center mb-24">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink-500/10 border border-pink-500/30 rounded-full mb-8">
            <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
            <span className="text-xs tracking-widest text-pink-400 uppercase">{t.comingSoon}</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extralight tracking-tight mb-4">
            {t.title}
          </h1>
          <p className="text-xl text-zinc-500 font-light mb-8">{t.subtitle}</p>
          
          {/* Date & Location */}
          <div className="flex flex-wrap justify-center gap-6 mb-12">
            <div className="flex items-center gap-2 text-zinc-400">
              <Calendar className="w-4 h-4 text-pink-400" />
              <span className="text-sm">{t.date}</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-400">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span className="text-sm">{t.location}</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-400">
              <Clock className="w-4 h-4 text-amber-400" />
              <span className="text-sm">19:00 - 02:00</span>
            </div>
          </div>

          <p className="text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed mb-12">
            {t.description}
          </p>

          {/* Feature badges */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {Object.entries(t.features).map(([key, value]) => (
              <div 
                key={key}
                className="px-4 py-2 bg-zinc-900/50 border border-zinc-800 rounded-full text-xs text-zinc-400 uppercase tracking-widest"
              >
                {value}
              </div>
            ))}
          </div>
        </section>

        {/* WhatsApp Waitlist */}
        <section className="mb-24 p-8 bg-zinc-900/50 border border-zinc-800 rounded-2xl backdrop-blur-sm">
          <div className="text-center">
            <h2 className="text-2xl font-light mb-3">{t.waitlist}</h2>
            <p className="text-zinc-500 mb-8">{t.waitlistDesc}</p>
            
            <Button
              onClick={openWhatsApp}
              className="px-8 py-6 bg-[#25D366] hover:bg-[#20bd5a] text-white text-sm tracking-widest uppercase transition-all"
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              {t.whatsapp}
              <ExternalLink className="w-4 h-4 ml-3" />
            </Button>
          </div>
        </section>

        {/* AI Music Generation */}
        <section className="p-8 bg-zinc-900/50 border border-zinc-800 rounded-2xl backdrop-blur-sm">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-4">
              <Music className="w-5 h-5 text-pink-400" />
              <h2 className="text-2xl font-light">{t.musicTitle}</h2>
            </div>
            <p className="text-zinc-500">{t.musicDesc}</p>
          </div>

          {/* Mood selector */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {(['energetic', 'chill', 'deep', 'vintage'] as const).map((mood) => (
              <button
                key={mood}
                onClick={() => generateMusic(mood)}
                disabled={isGenerating}
                className={`px-5 py-2.5 rounded-full text-xs tracking-widest uppercase transition-all ${
                  activeMood === mood 
                    ? 'bg-pink-500/20 border border-pink-500/50 text-pink-400' 
                    : 'bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:border-zinc-700'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isGenerating && activeMood === mood ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    {t.generating}
                  </span>
                ) : (
                  t.moods[mood]
                )}
              </button>
            ))}
          </div>

          {/* Audio controls */}
          {audioUrl && (
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={togglePlay}
                className="w-14 h-14 rounded-full bg-pink-500/20 border border-pink-500/50 flex items-center justify-center hover:bg-pink-500/30 transition-colors"
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6 text-pink-400" />
                ) : (
                  <Play className="w-6 h-6 text-pink-400 ml-1" />
                )}
              </button>
              <button
                onClick={toggleMute}
                className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:border-zinc-700 transition-colors"
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4 text-zinc-500" />
                ) : (
                  <Volume2 className="w-4 h-4 text-zinc-400" />
                )}
              </button>
              
              {/* Visualizer bars */}
              <div className="flex items-end gap-1 h-8">
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 bg-gradient-to-t from-pink-500 to-emerald-400 rounded-full"
                    style={{
                      height: isPlaying ? `${Math.random() * 100}%` : '20%',
                      transition: 'height 0.15s ease',
                      animation: isPlaying ? `visualizer 0.5s ease-in-out ${i * 0.05}s infinite alternate` : 'none',
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {!audioUrl && !isGenerating && (
            <p className="text-center text-zinc-600 text-sm">
              {lang === 'ja' ? 'ムードを選択して音楽を生成' : 'Select a mood to generate music'}
            </p>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-12 text-center">
        <p className="text-xs tracking-[0.3em] text-zinc-700 uppercase">
          {t.footer}
        </p>
      </footer>

      {/* CSS animations */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.15; transform: scale(1); }
          50% { opacity: 0.25; transform: scale(1.1); }
        }
        @keyframes visualizer {
          0% { height: 20%; }
          100% { height: 100%; }
        }
      `}</style>
    </div>
  );
};

export default ChronoStrataClub;
