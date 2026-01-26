import { useState, useRef, useCallback } from 'react';
import { toast } from 'sonner';

// Voice options for TTS
export const VOICE_OPTIONS = [
  { id: 'JBFqnCBsd6RMkjVDRZzb', name: 'George', style: 'Professional', description: 'Authoritative executive tone' },
  { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Sarah', style: 'Casual', description: 'Warm and conversational' },
  { id: 'onwK4e9ZLuTAKqWW03F9', name: 'Daniel', style: 'Urgent', description: 'Clear and direct delivery' },
] as const;

export type VoiceId = typeof VOICE_OPTIONS[number]['id'];

// IndexedDB for audio caching
const DB_NAME = 'briefing-tts-cache';
const STORE_NAME = 'audio-cache';
const DB_VERSION = 1;

const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'key' });
      }
    };
  });
};

const getCachedAudio = async (key: string): Promise<Blob | null> => {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.get(key);
      
      request.onsuccess = () => {
        const result = request.result;
        resolve(result?.blob || null);
      };
      request.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
};

const cacheAudio = async (key: string, blob: Blob): Promise<void> => {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.put({ key, blob, timestamp: Date.now() });
  } catch (error) {
    console.warn('Failed to cache audio:', error);
  }
};

// Generate cache key from text + voice
const getCacheKey = (text: string, voiceId: string): string => {
  const hash = text.split('').reduce((acc, char) => {
    return ((acc << 5) - acc) + char.charCodeAt(0);
  }, 0);
  return `${voiceId}-${Math.abs(hash)}`;
};

interface UseBriefingTTSOptions {
  onPlaybackEnd?: () => void;
}

export function useBriefingTTS(options: UseBriefingTTSOptions = {}) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [speakingCardId, setSpeakingCardId] = useState<string | null>(null);
  const [selectedVoice, setSelectedVoice] = useState<VoiceId>(VOICE_OPTIONS[0].id);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (speechRef.current && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      speechRef.current = null;
    }
    setIsSpeaking(false);
    setIsGenerating(false);
    setSpeakingCardId(null);
  }, []);

  const speakWithWebSpeech = useCallback((text: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!('speechSynthesis' in window)) {
        reject(new Error('Web Speech API not supported'));
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      
      // Try to find a good voice
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(v => 
        v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Samantha'))
      ) || voices.find(v => v.lang.startsWith('en'));
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      speechRef.current = utterance;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => {
        setIsSpeaking(false);
        setSpeakingCardId(null);
        speechRef.current = null;
        resolve();
      };
      utterance.onerror = (e) => {
        setIsSpeaking(false);
        setSpeakingCardId(null);
        speechRef.current = null;
        reject(e);
      };

      window.speechSynthesis.speak(utterance);
      toast.info('Using browser voice (fallback)', { 
        description: 'ElevenLabs unavailable',
        duration: 2000 
      });
    });
  }, []);

  const speak = useCallback(async (
    cardId: string,
    text: string,
    isAutoRead = false
  ): Promise<void> => {
    // Toggle off if already speaking this card
    if (speakingCardId === cardId && isSpeaking && !isAutoRead) {
      stop();
      return;
    }

    // Stop any current playback
    stop();

    setSpeakingCardId(cardId);
    setIsGenerating(true);

    const cacheKey = getCacheKey(text, selectedVoice);

    try {
      // Check cache first
      let audioBlob = await getCachedAudio(cacheKey);
      let usedCache = false;

      if (audioBlob) {
        usedCache = true;
        console.log('Using cached audio for:', cacheKey);
      } else {
        // Fetch from ElevenLabs via edge function
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/briefing-tts`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
              'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
            },
            body: JSON.stringify({ text, voiceId: selectedVoice }),
          }
        );

        if (!response.ok) {
          throw new Error(`TTS request failed: ${response.status}`);
        }

        audioBlob = await response.blob();
        
        // Cache for offline use
        await cacheAudio(cacheKey, audioBlob);
      }

      setIsGenerating(false);
      setIsSpeaking(true);

      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      return new Promise((resolve, reject) => {
        audio.onended = () => {
          setIsSpeaking(false);
          setSpeakingCardId(null);
          URL.revokeObjectURL(audioUrl);
          audioRef.current = null;
          options.onPlaybackEnd?.();
          resolve();
        };

        audio.onerror = () => {
          setIsSpeaking(false);
          setSpeakingCardId(null);
          URL.revokeObjectURL(audioUrl);
          audioRef.current = null;
          toast.error('Audio playback failed');
          reject(new Error('Audio playback failed'));
        };

        audio.play().catch((playError) => {
          console.error('Play error:', playError);
          setIsSpeaking(false);
          setSpeakingCardId(null);
          reject(playError);
        });

        if (usedCache) {
          toast.success('Playing cached audio', { 
            description: 'Offline mode',
            duration: 1500 
          });
        }
      });

    } catch (error) {
      console.error('TTS error, falling back to Web Speech:', error);
      setIsGenerating(false);
      
      // Fallback to Web Speech API
      try {
        await speakWithWebSpeech(text);
        options.onPlaybackEnd?.();
      } catch (webSpeechError) {
        console.error('Web Speech fallback failed:', webSpeechError);
        setIsSpeaking(false);
        setSpeakingCardId(null);
        toast.error('Voice synthesis unavailable');
        throw webSpeechError;
      }
    }
  }, [selectedVoice, speakingCardId, isSpeaking, stop, speakWithWebSpeech, options]);

  return {
    isSpeaking,
    isGenerating,
    speakingCardId,
    selectedVoice,
    setSelectedVoice,
    speak,
    stop,
    voiceOptions: VOICE_OPTIONS,
  };
}
