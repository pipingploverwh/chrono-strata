import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  Maximize2, 
  Sparkles, 
  Loader2, 
  Download, 
  Mic,
  MicOff,
  Radio,
  Waves
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface AudioIngestHubProps {
  audioFile: File | null;
  onAudioStream: (stream: MediaStream) => void;
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
}

const AudioIngestHub = ({
  audioFile,
  onAudioStream,
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
}: AudioIngestHubProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const streamRef = useRef<MediaStream | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number>(0);

  const hasAudio = isRecording || !!audioFile;

  // Monitor audio levels when recording
  useEffect(() => {
    if (!isRecording || !analyserRef.current) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    
    const updateLevel = () => {
      if (!analyserRef.current) return;
      analyserRef.current.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
      setAudioLevel(average / 255);
      animationRef.current = requestAnimationFrame(updateLevel);
    };
    
    updateLevel();

    return () => cancelAnimationFrame(animationRef.current);
  }, [isRecording]);

  const startSystemAudio = async () => {
    try {
      // Request system audio capture (screen share with audio)
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true, // Required for getDisplayMedia
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        }
      });

      // Stop video track - we only want audio
      stream.getVideoTracks().forEach(track => track.stop());

      // Check if we have audio
      const audioTracks = stream.getAudioTracks();
      if (audioTracks.length === 0) {
        toast.error('No audio detected. Make sure to share a tab or window with audio.');
        return;
      }

      // Create audio context for level monitoring
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      streamRef.current = stream;
      setIsRecording(true);
      onAudioStream(stream);

      // Handle stream end
      audioTracks[0].addEventListener('ended', () => {
        stopSystemAudio();
      });

      toast.success('🎧 System audio connected! Play your music to visualize.');
    } catch (err) {
      console.error('Error capturing system audio:', err);
      if ((err as Error).name === 'NotAllowedError') {
        toast.error('Permission denied. Please allow audio capture.');
      } else {
        toast.error('Failed to capture system audio. Try selecting a browser tab with audio.');
      }
    }
  };

  const stopSystemAudio = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    analyserRef.current = null;
    setIsRecording(false);
    setAudioLevel(0);
    cancelAnimationFrame(animationRef.current);
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopSystemAudio();
    } else {
      startSystemAudio();
    }
  };

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
        {/* Ambient glow - reacts to audio */}
        <motion.div 
          className="absolute inset-0 pointer-events-none"
          animate={{
            background: isRecording 
              ? `radial-gradient(circle at 50% 100%, hsl(300 60% ${40 + audioLevel * 30}% / ${0.15 + audioLevel * 0.2}) 0%, transparent 60%)`
              : 'radial-gradient(circle at 50% 100%, hsl(280 40% 30% / 0.1) 0%, transparent 60%)',
          }}
          transition={{ duration: 0.1 }}
        />

        <div className="relative z-10 space-y-5">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div 
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, hsl(280 50% 45%) 0%, hsl(320 60% 50%) 100%)',
                  boxShadow: `0 0 ${20 + audioLevel * 30}px hsl(300 60% 50% / ${0.3 + audioLevel * 0.4})`,
                }}
                animate={isRecording ? {
                  scale: [1, 1 + audioLevel * 0.1, 1],
                } : {}}
                transition={{ duration: 0.1 }}
              >
                <Waves className="w-5 h-5 text-white" />
              </motion.div>
              <div>
                <h3 
                  className="text-sm font-medium tracking-wide"
                  style={{ color: 'hsl(300 60% 80%)' }}
                >
                  SYSTEM AUDIO CAPTURE
                </h3>
                <p 
                  className="text-xs"
                  style={{ color: 'hsl(280 30% 50%)' }}
                >
                  Capture & visualize your music
                </p>
              </div>
            </div>

            {/* Status indicator */}
            <div 
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs"
              style={{
                background: isRecording 
                  ? 'hsl(300 50% 40% / 0.2)' 
                  : 'hsl(280 30% 20% / 0.5)',
                border: isRecording 
                  ? '1px solid hsl(300 50% 50% / 0.3)' 
                  : '1px solid hsl(280 20% 30%)',
                color: isRecording 
                  ? 'hsl(300 60% 70%)' 
                  : 'hsl(280 30% 50%)',
              }}
            >
              <motion.div 
                className="w-2 h-2 rounded-full"
                style={{
                  background: isRecording ? 'hsl(0 70% 55%)' : 'hsl(280 30% 40%)',
                }}
                animate={isRecording ? {
                  scale: [1, 1.3, 1],
                  opacity: [1, 0.7, 1],
                } : {}}
                transition={{ duration: 1, repeat: Infinity }}
              />
              {isRecording ? 'Listening...' : 'Ready'}
            </div>
          </div>

          {/* Audio Level Meter */}
          {isRecording && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-2"
            >
              <div className="flex items-center justify-between text-xs" style={{ color: 'hsl(280 30% 55%)' }}>
                <span>Audio Level</span>
                <span>{Math.round(audioLevel * 100)}%</span>
              </div>
              <div 
                className="h-2 rounded-full overflow-hidden"
                style={{ background: 'hsl(280 25% 15%)' }}
              >
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background: `linear-gradient(90deg, hsl(270 60% 50%) 0%, hsl(300 70% 60%) 50%, hsl(320 80% 65%) 100%)`,
                    boxShadow: `0 0 10px hsl(300 70% 50% / 0.5)`,
                  }}
                  animate={{ width: `${audioLevel * 100}%` }}
                  transition={{ duration: 0.05 }}
                />
              </div>
            </motion.div>
          )}

          {/* Primary Actions Row */}
          <div className="flex items-center gap-3">
            {/* System Audio Capture Button */}
            <motion.button
              onClick={toggleRecording}
              className="flex-1 flex items-center justify-center gap-3 px-5 py-4 rounded-xl transition-all"
              style={{
                background: isRecording 
                  ? 'linear-gradient(135deg, hsl(0 50% 35%) 0%, hsl(320 60% 40%) 100%)'
                  : 'linear-gradient(135deg, hsl(280 50% 35%) 0%, hsl(320 60% 45%) 100%)',
                border: '1px solid hsl(300 50% 50% / 0.3)',
                boxShadow: `0 0 30px hsl(300 60% 50% / 0.25)`,
              }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              {isRecording ? (
                <MicOff className="w-5 h-5 text-white" />
              ) : (
                <Mic className="w-5 h-5 text-white" />
              )}
              <span className="font-medium text-white">
                {isRecording ? 'Stop Capture' : 'Capture System Audio'}
              </span>
            </motion.button>

            {/* Play/Pause for visual feedback */}
            <motion.button
              onClick={onTogglePlayback}
              disabled={!hasAudio}
              className="w-14 h-14 rounded-full flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background: hasAudio 
                  ? 'linear-gradient(135deg, hsl(280 60% 50%) 0%, hsl(320 70% 55%) 100%)'
                  : 'hsl(280 25% 20%)',
                boxShadow: hasAudio 
                  ? `0 0 ${25 + audioLevel * 20}px hsl(300 70% 50% / 0.4)` 
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

          {/* Instructions */}
          <div 
            className="px-4 py-3 rounded-lg text-center"
            style={{
              background: 'hsl(280 25% 12%)',
              border: '1px solid hsl(280 25% 20%)',
            }}
          >
            <div className="flex items-center justify-center gap-2 mb-1">
              <Radio className="w-4 h-4" style={{ color: 'hsl(300 50% 60%)' }} />
              <span className="text-sm font-medium" style={{ color: 'hsl(300 50% 70%)' }}>
                House Vibes Mode
              </span>
            </div>
            <p className="text-xs" style={{ color: 'hsl(280 25% 50%)' }}>
              Click capture, select a browser tab playing music, and watch the thermal warmth react to your beats
            </p>
          </div>

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
                  <span>Synth...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>AI House Synth</span>
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
                    House Synth Layer
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
