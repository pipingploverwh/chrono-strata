import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  Play, 
  Pause, 
  Maximize2, 
  Sparkles, 
  Loader2, 
  Download, 
  Music,
  Mic,
  Radio,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface AudioIngestHubProps {
  audioFile: File | null;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isPlaying: boolean;
  onTogglePlayback: () => void;
  onEnterImmersive: () => void;
  onGenerateMagic: () => void;
  isGeneratingMagic: boolean;
  magicAudio: HTMLAudioElement | null;
  isMagicPlaying: boolean;
  onToggleMagic: () => void;
  onDownloadMagic: () => void;
  magicAnalysis?: {
    emotionalTone: string;
    frequencyProfile: string;
  } | null;
  // Demo tracks for quick start
  demoTracks?: Array<{
    id: string;
    title: string;
    artist: string;
    audioUrl: string;
  }>;
  onDemoTrackSelect?: (audioUrl: string, title: string) => void;
}

const AudioIngestHub = ({
  audioFile,
  onFileUpload,
  isPlaying,
  onTogglePlayback,
  onEnterImmersive,
  onGenerateMagic,
  isGeneratingMagic,
  magicAudio,
  isMagicPlaying,
  onToggleMagic,
  onDownloadMagic,
  magicAnalysis,
  demoTracks,
  onDemoTrackSelect,
}: AudioIngestHubProps) => {
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const hasAudio = !!audioFile;

  return (
    <motion.div
      className="w-full max-w-2xl mx-auto space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Main Audio Control Hub */}
      <div 
        className="rounded-2xl p-6 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, hsl(280 25% 10% / 0.95) 0%, hsl(300 25% 8% / 0.95) 100%)',
          border: '1px solid hsl(280 40% 25% / 0.5)',
          backdropFilter: 'blur(20px)',
        }}
      >
        {/* Ambient glow */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: hasAudio 
              ? 'radial-gradient(circle at 50% 100%, hsl(300 60% 40% / 0.15) 0%, transparent 60%)'
              : 'radial-gradient(circle at 50% 100%, hsl(280 40% 30% / 0.1) 0%, transparent 60%)',
            transition: 'background 0.5s ease',
          }}
        />

        <div className="relative z-10 space-y-5">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, hsl(280 50% 45%) 0%, hsl(320 60% 50%) 100%)',
                  boxShadow: '0 0 20px hsl(300 60% 50% / 0.3)',
                }}
              >
                <Music className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 
                  className="text-sm font-medium tracking-wide"
                  style={{ color: 'hsl(300 60% 80%)' }}
                >
                  AUDIO INGEST
                </h3>
                <p 
                  className="text-xs"
                  style={{ color: 'hsl(280 30% 50%)' }}
                >
                  Upload, analyze, transform
                </p>
              </div>
            </div>

            {/* Status indicator */}
            <div 
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs"
              style={{
                background: hasAudio 
                  ? 'hsl(300 50% 40% / 0.2)' 
                  : 'hsl(280 30% 20% / 0.5)',
                border: hasAudio 
                  ? '1px solid hsl(300 50% 50% / 0.3)' 
                  : '1px solid hsl(280 20% 30%)',
                color: hasAudio 
                  ? 'hsl(300 60% 70%)' 
                  : 'hsl(280 30% 50%)',
              }}
            >
              <div 
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  background: hasAudio ? 'hsl(300 70% 60%)' : 'hsl(280 30% 40%)',
                  boxShadow: hasAudio ? '0 0 6px hsl(300 70% 60%)' : 'none',
                }}
              />
              {hasAudio ? 'Ready' : 'Awaiting Input'}
            </div>
          </div>

          {/* Primary Actions Row */}
          <div className="flex items-center gap-3">
            {/* Upload Button - Primary CTA when no audio */}
            <label 
              className="flex-1 group cursor-pointer"
            >
              <motion.div
                className="flex items-center justify-center gap-3 px-5 py-4 rounded-xl transition-all"
                style={{
                  background: hasAudio 
                    ? 'hsl(280 25% 15%)' 
                    : 'linear-gradient(135deg, hsl(280 50% 35%) 0%, hsl(320 60% 45%) 100%)',
                  border: hasAudio 
                    ? '1px solid hsl(280 30% 25%)' 
                    : '1px solid hsl(300 50% 50% / 0.3)',
                  boxShadow: hasAudio 
                    ? 'none' 
                    : '0 0 30px hsl(300 60% 50% / 0.25)',
                }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <Upload 
                  className="w-5 h-5 transition-transform group-hover:scale-110"
                  style={{ color: hasAudio ? 'hsl(300 50% 60%)' : 'white' }}
                />
                <span 
                  className="font-medium"
                  style={{ color: hasAudio ? 'hsl(300 40% 75%)' : 'white' }}
                >
                  {hasAudio ? audioFile.name : 'Drop or Upload Audio'}
                </span>
              </motion.div>
              <input 
                ref={fileInputRef}
                type="file" 
                accept="audio/*" 
                onChange={onFileUpload} 
                className="hidden" 
              />
            </label>

            {/* Play/Pause */}
            <motion.button
              onClick={onTogglePlayback}
              disabled={!hasAudio}
              className="w-14 h-14 rounded-full flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background: hasAudio 
                  ? 'linear-gradient(135deg, hsl(280 60% 50%) 0%, hsl(320 70% 55%) 100%)'
                  : 'hsl(280 25% 20%)',
                boxShadow: hasAudio 
                  ? '0 0 25px hsl(300 70% 50% / 0.4)' 
                  : 'none',
              }}
              whileHover={hasAudio ? { scale: 1.05 } : {}}
              whileTap={hasAudio ? { scale: 0.95 } : {}}
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 text-white" />
              ) : (
                <Play className="w-6 h-6 text-white ml-0.5" />
              )}
            </motion.button>
          </div>

          {/* Quick Start: Demo Tracks */}
          {demoTracks && demoTracks.length > 0 && (
            <Collapsible open={isDemoOpen} onOpenChange={setIsDemoOpen}>
              <CollapsibleTrigger asChild>
                <button 
                  className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg transition-colors"
                  style={{
                    background: 'hsl(280 25% 12%)',
                    border: '1px solid hsl(280 25% 20%)',
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Radio className="w-4 h-4" style={{ color: 'hsl(300 50% 60%)' }} />
                    <span className="text-sm" style={{ color: 'hsl(280 30% 65%)' }}>
                      Quick Start: Demo Tracks
                    </span>
                  </div>
                  <ChevronDown 
                    className="w-4 h-4 transition-transform"
                    style={{ 
                      color: 'hsl(280 30% 50%)',
                      transform: isDemoOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    }}
                  />
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="grid grid-cols-2 gap-2 pt-3">
                  {demoTracks.slice(0, 4).map((track) => (
                    <motion.button
                      key={track.id}
                      onClick={() => onDemoTrackSelect?.(track.audioUrl, track.title)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-all"
                      style={{
                        background: 'hsl(280 25% 14%)',
                        border: '1px solid hsl(280 25% 22%)',
                      }}
                      whileHover={{ 
                        background: 'hsl(280 30% 18%)',
                        borderColor: 'hsl(300 40% 35%)',
                      }}
                    >
                      <Play className="w-3 h-3 flex-shrink-0" style={{ color: 'hsl(300 50% 60%)' }} />
                      <div className="min-w-0">
                        <div className="text-xs font-medium truncate" style={{ color: 'hsl(300 40% 75%)' }}>
                          {track.title}
                        </div>
                        <div className="text-[10px] truncate" style={{ color: 'hsl(280 25% 45%)' }}>
                          {track.artist}
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}

          {/* Secondary Actions */}
          <div className="flex items-center gap-3">
            <Button
              onClick={onEnterImmersive}
              variant="outline"
              className="flex-1 flex items-center justify-center gap-2"
              style={{
                borderColor: 'hsl(300 40% 35% / 0.5)',
                color: 'hsl(300 50% 70%)',
                background: 'hsl(280 25% 12% / 0.5)',
              }}
            >
              <Maximize2 className="w-4 h-4" />
              <span>Immersive Mode</span>
            </Button>

            <Button
              onClick={onGenerateMagic}
              disabled={!hasAudio || isGeneratingMagic}
              className="flex-1 flex items-center justify-center gap-2 disabled:opacity-50"
              style={{
                background: 'linear-gradient(135deg, hsl(280 60% 45%) 0%, hsl(320 70% 55%) 100%)',
                boxShadow: hasAudio ? '0 0 20px hsl(300 60% 50% / 0.3)' : 'none',
              }}
            >
              {isGeneratingMagic ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>AI Magic</span>
                </>
              )}
            </Button>
          </div>

          {/* Keyboard hint */}
          <div className="text-center">
            <p 
              className="text-[10px] tracking-wide"
              style={{ color: 'hsl(280 20% 40%)' }}
            >
              Press <kbd 
                className="px-1.5 py-0.5 rounded mx-1"
                style={{ background: 'hsl(280 25% 18%)', color: 'hsl(300 40% 65%)' }}
              >F</kbd> for fullscreen • 
              <kbd 
                className="px-1.5 py-0.5 rounded mx-1"
                style={{ background: 'hsl(280 25% 18%)', color: 'hsl(300 40% 65%)' }}
              >SPACE</kbd> to play/pause
            </p>
          </div>
        </div>
      </div>

      {/* Magic Audio Player - Appears when magic is generated */}
      <AnimatePresence>
        {magicAudio && (
          <motion.div
            initial={{ opacity: 0, y: 10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            className="rounded-xl overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, hsl(280 40% 15% / 0.9) 0%, hsl(320 40% 12% / 0.9) 100%)',
              border: '1px solid hsl(300 50% 40% / 0.4)',
            }}
          >
            <div className="p-4 flex items-center gap-4">
              <motion.button
                onClick={onToggleMagic}
                className="w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, hsl(280 70% 55%) 0%, hsl(320 80% 60%) 100%)',
                  boxShadow: '0 0 20px hsl(300 70% 50% / 0.4)',
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isMagicPlaying ? (
                  <Pause className="w-5 h-5 text-white" />
                ) : (
                  <Play className="w-5 h-5 text-white ml-0.5" />
                )}
              </motion.button>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 flex-shrink-0" style={{ color: 'hsl(300 70% 70%)' }} />
                  <span 
                    className="font-medium text-sm truncate"
                    style={{ color: 'hsl(300 60% 80%)' }}
                  >
                    Thermal Magic Layer
                  </span>
                </div>
                {magicAnalysis && (
                  <p 
                    className="text-xs mt-1 truncate"
                    style={{ color: 'hsl(300 30% 55%)' }}
                  >
                    {magicAnalysis.emotionalTone} • {magicAnalysis.frequencyProfile}
                  </p>
                )}
              </div>

              <Button
                onClick={onDownloadMagic}
                size="sm"
                variant="outline"
                className="flex items-center gap-2 flex-shrink-0"
                style={{
                  borderColor: 'hsl(300 50% 45% / 0.5)',
                  color: 'hsl(300 60% 75%)',
                  background: 'hsl(300 30% 20% / 0.5)',
                }}
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Save MP3</span>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AudioIngestHub;
