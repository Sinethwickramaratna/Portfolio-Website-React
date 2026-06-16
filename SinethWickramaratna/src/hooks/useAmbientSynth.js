import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import bgMusicUrl from '../assets/Music/onetent-ethnic-flute-samurai-relaxing-cinematic-ambient-meditation-music-248252.mp3';

const SoundContext = createContext();

export function AudioProvider({ children }) {
  const [isPlaying, setIsPlaying] = useState(() => {
    return typeof window !== 'undefined' && window.innerWidth > 768;
  });
  
  // Web Audio API refs (for ambient drone/wind/bell)
  const audioCtxRef = useRef(null);
  const humOscRef = useRef(null);
  const windSourceRef = useRef(null);
  const windFilterRef = useRef(null);
  const windLfoRef = useRef(null);
  const masterGainRef = useRef(null);
  const bellIntervalRef = useRef(null);

  // Background Music HTML5 Audio element ref
  const bgAudioRef = useRef(null);

  const initSynth = () => {
    // 1. Create Audio Context for ambient soundscape
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioContextClass();
    audioCtxRef.current = ctx;

    // 2. Master Gain (Volume: 12% max)
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.12, ctx.currentTime);
    masterGain.connect(ctx.destination);
    masterGainRef.current = masterGain;

    // 3. --- CORE HUM SYNTHESIS (55Hz low drone) ---
    const humOsc = ctx.createOscillator();
    const humFilter = ctx.createBiquadFilter();
    const humGain = ctx.createGain();

    humOsc.type = 'triangle';
    humOsc.frequency.setValueAtTime(55, ctx.currentTime); // A1 note
    humFilter.type = 'lowpass';
    humFilter.frequency.setValueAtTime(150, ctx.currentTime);
    humGain.gain.setValueAtTime(0.06, ctx.currentTime);

    humOsc.connect(humFilter);
    humFilter.connect(humGain);
    humGain.connect(masterGain);

    humOsc.start();
    humOscRef.current = humOsc;

    // 4. --- DISTANT WIND SYNTHESIS (Filtered White Noise) ---
    const bufferSize = ctx.sampleRate * 2; // 2 seconds of noise
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const outputData = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      outputData[i] = Math.random() * 2 - 1;
    }

    const windSource = ctx.createBufferSource();
    windSource.buffer = noiseBuffer;
    windSource.loop = true;

    const windFilter = ctx.createBiquadFilter();
    windFilter.type = 'bandpass';
    windFilter.Q.setValueAtTime(1.5, ctx.currentTime);

    // Slowly modulate wind cutoff using LFO (0.08Hz)
    const windLfo = ctx.createOscillator();
    const windLfoGain = ctx.createGain();
    windLfo.frequency.setValueAtTime(0.08, ctx.currentTime);
    windLfoGain.gain.setValueAtTime(300, ctx.currentTime); // range +/- 300Hz

    windFilter.frequency.setValueAtTime(500, ctx.currentTime); // base cutoff

    const windGain = ctx.createGain();
    windGain.gain.setValueAtTime(0.025, ctx.currentTime);

    // Connections
    windLfo.connect(windLfoGain);
    windLfoGain.connect(windFilter.frequency);
    
    windSource.connect(windFilter);
    windFilter.connect(windGain);
    windGain.connect(masterGain);

    windSource.start();
    windLfo.start();

    windSourceRef.current = windSource;
    windFilterRef.current = windFilter;
    windLfoRef.current = windLfo;

    // 5. --- TEMPLE BELL CHIME FUNCTION (Periodic trigger) ---
    const playBell = () => {
      if (!ctx || ctx.state === 'suspended') return;
      const now = ctx.currentTime;
      
      const baseFreq = 146.8; // D3 note
      const frequencies = [baseFreq, baseFreq * 1.5, baseFreq * 2.0, baseFreq * 2.6];
      const gains = [0.035, 0.02, 0.015, 0.008];

      frequencies.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        
        if (idx > 0) {
          osc.detune.setValueAtTime((Math.random() - 0.5) * 15, now);
        }

        gainNode.gain.setValueAtTime(0.0, now);
        gainNode.gain.linearRampToValueAtTime(gains[idx], now + 0.08);
        gainNode.gain.exponentialRampToValueAtTime(0.00001, now + 12);

        osc.connect(gainNode);
        gainNode.connect(masterGain);

        osc.start();
        osc.stop(now + 12.2);
      });
    };

    playBell();
    bellIntervalRef.current = setInterval(playBell, 18000);
  };

  const toggleSound = () => {
    if (isPlaying) {
      // Suspend Web Audio API Synth
      if (audioCtxRef.current) {
        audioCtxRef.current.suspend();
      }

      // Pause background music
      if (bgAudioRef.current) {
        bgAudioRef.current.pause();
      }
      setIsPlaying(false);
    } else {
      // Initialize Web Audio API Synth if first time
      if (!audioCtxRef.current) {
        initSynth();
      } else if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }

      // Initialize background music audio element if first time
      if (!bgAudioRef.current) {
        const audio = new Audio(bgMusicUrl);
        audio.loop = true;
        audio.volume = 0.22; // low non-intrusive background volume
        bgAudioRef.current = audio;
      }

      bgAudioRef.current.play().catch(err => console.log("Audio play blocked:", err));
      setIsPlaying(true);
    }
  };

  // Auto-play music loop on mount (or first interaction fallback)
  useEffect(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;

    // Pre-initialize background music element
    if (!bgAudioRef.current) {
      const audio = new Audio(bgMusicUrl);
      audio.loop = true;
      audio.volume = 0.22;
      bgAudioRef.current = audio;
    }

    if (isMobile) {
      setIsPlaying(false);
      return;
    }

    let cleanupInteraction = null;

    const startAudio = () => {
      if (bgAudioRef.current) {
        bgAudioRef.current.play()
          .then(() => {
            setIsPlaying(true);
            if (!audioCtxRef.current) initSynth();
          })
          .catch(err => console.log("Play failed on interaction:", err));
      }
    };

    // Try autoplaying immediately on mount
    bgAudioRef.current.play()
      .then(() => {
        setIsPlaying(true);
        if (!audioCtxRef.current) initSynth();
      })
      .catch((err) => {
        console.log("Audio autoplay waiting for user interaction.");
        
        const handleFirstInteraction = (e) => {
          if (
            e.target.closest('.sound-toggle-btn') || 
            e.target.closest('.global-audio-widget')
          ) {
            cleanup();
            return;
          }
          startAudio();
          cleanup();
        };

        const cleanup = () => {
          document.removeEventListener('click', handleFirstInteraction);
          document.removeEventListener('keydown', handleFirstInteraction);
          document.removeEventListener('touchstart', handleFirstInteraction);
        };

        cleanupInteraction = cleanup;

        document.addEventListener('click', handleFirstInteraction);
        document.addEventListener('keydown', handleFirstInteraction);
        document.addEventListener('touchstart', handleFirstInteraction);
      });

    return () => {
      if (cleanupInteraction) cleanupInteraction();
    };
  }, []);

  // Cleanup only on provider unmount (i.e. app exit / reload)
  useEffect(() => {
    return () => {
      if (bellIntervalRef.current) clearInterval(bellIntervalRef.current);
      if (windSourceRef.current) {
        try { windSourceRef.current.stop(); } catch(e){}
      }
      if (windLfoRef.current) {
        try { windLfoRef.current.stop(); } catch(e){}
      }
      if (humOscRef.current) {
        try { humOscRef.current.stop(); } catch(e){}
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
      if (bgAudioRef.current) {
        bgAudioRef.current.pause();
        bgAudioRef.current = null;
      }
    };
  }, []);

  return React.createElement(SoundContext.Provider, { value: { isPlaying, toggleSound } }, children);
}

// Compatibility hook for components importing useAmbientSynth
export function useAmbientSynth() {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error('useAmbientSynth must be used within an AudioProvider');
  }
  return context;
}
