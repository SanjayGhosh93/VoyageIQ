// frontend/src/components/IntroVideoSplash.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX, FastForward } from 'lucide-react';

const VIDEO_URL = 'https://res.cloudinary.com/q5farw7j/video/upload/v1788196718/Cargo_ship_sailing_ocean_202608312246.mp4';
const SOUND_SOURCES = [
  '/sounds/Ocean Cruise Liner Ship.mp3',
  '/sounds/Ocean-Cruise-Liner-Ship.mp3',
  '/sounds/ocean-cruise-liner-ship.mp3',
  '/sounds/city-ocean-cruise-liner-ship-32308.mp3',
  '/sounds/freesound_community-ocean-cruise-liner-ship-32308.mp3',
  '/Ocean Cruise Liner Ship.mp3',
  '/ocean-cruise-liner-ship.mp3',
  '/city-ocean-cruise-liner-ship-32308.mp3',
  '/freesound_community-ocean-cruise-liner-ship-32308.mp3'
];
const INTRO_DURATION_SECONDS = 7;

// Web Audio API Maritime Horn & Engine Ambiance Synthesizer
class MaritimeSoundEngine {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.gainNode = null;
    this.oscillators = [];
    this.noiseNode = null;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
  }

  playCruiseLinerSound() {
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      // Stop previous active nodes if any
      this.oscillators.forEach(osc => {
        try { osc.stop(); osc.disconnect(); } catch (e) {}
      });
      this.oscillators = [];
      if (this.noiseNode) {
        try { this.noiseNode.stop(); this.noiseNode.disconnect(); } catch (e) {}
        this.noiseNode = null;
      }

      this.isPlaying = true;
      const now = this.ctx.currentTime;

      // Master Gain
      this.gainNode = this.ctx.createGain();
      this.gainNode.gain.setValueAtTime(0.20, now);
      this.gainNode.connect(this.ctx.destination);

      // Sub-bass heavy engine hum (48Hz)
      const engineOsc = this.ctx.createOscillator();
      const engineGain = this.ctx.createGain();
      engineOsc.type = 'sawtooth';
      engineOsc.frequency.setValueAtTime(48, now);
      engineGain.gain.setValueAtTime(0.10, now);
      engineOsc.connect(engineGain);
      engineGain.connect(this.gainNode);
      engineOsc.start(now);
      this.oscillators.push(engineOsc);

      // Ocean Wave & Swell
      const bufferSize = this.ctx.sampleRate * 4;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(340, now);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.045, now);

      whiteNoise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.gainNode);
      whiteNoise.start(now);
      this.noiseNode = whiteNoise;

      // Horn Blasts
      const triggerHornBlast = (startTime, duration) => {
        const hornFrequencies = [110, 138.59, 164.81, 220];
        hornFrequencies.forEach((freq, idx) => {
          const hornOsc = this.ctx.createOscillator();
          const hornGain = this.ctx.createGain();
          hornOsc.type = idx % 2 === 0 ? 'triangle' : 'sawtooth';
          hornOsc.frequency.setValueAtTime(freq, startTime);
          
          hornGain.gain.setValueAtTime(0.001, startTime);
          hornGain.gain.exponentialRampToValueAtTime(0.15, startTime + 0.3);
          hornGain.gain.setValueAtTime(0.15, startTime + duration - 0.5);
          hornGain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

          hornOsc.connect(hornGain);
          hornGain.connect(this.gainNode);
          hornOsc.start(startTime);
          hornOsc.stop(startTime + duration);
          this.oscillators.push(hornOsc);
        });
      };

      triggerHornBlast(now + 0.5, 2.5);
      triggerHornBlast(now + 3.5, 2.8);

    } catch (e) {
      console.warn('Audio synthesizer notice:', e);
    }
  }

  stop() {
    try {
      if (this.gainNode && this.ctx) {
        this.gainNode.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);
      }
      setTimeout(() => {
        this.oscillators.forEach(osc => {
          try { osc.stop(); } catch(e) {}
        });
        if (this.noiseNode) {
          try { this.noiseNode.stop(); } catch(e) {}
        }
        this.oscillators = [];
        this.isPlaying = false;
      }, 400);
    } catch (e) {}
  }
}

export const IntroVideoSplash = ({ onFinish }) => {
  const videoRef = useRef(null);
  const audioRef = useRef(null);
  const soundEngineRef = useRef(null);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    soundEngineRef.current = new MaritimeSoundEngine();

    // Start video and audio with sound immediately on mount
    const startMedia = async () => {
      if (videoRef.current) {
        videoRef.current.muted = false;
        try {
          await videoRef.current.play();
        } catch (err) {
          // If browser policy blocks unmuted autoplay without prior gesture,
          // play muted to ensure video runs smoothly while attempting audio context
          if (videoRef.current) {
            videoRef.current.muted = true;
            try {
              await videoRef.current.play();
            } catch (e) {}
          }
        }
      }

      // Try playing sound immediately
      if (audioRef.current) {
        audioRef.current.muted = false;
        try {
          await audioRef.current.play();
        } catch (err) {
          soundEngineRef.current?.playCruiseLinerSound();
        }
      } else {
        soundEngineRef.current?.playCruiseLinerSound();
      }
    };

    startMedia();

    // In case browser requires interaction to unlock audio context:
    const handleFirstInteraction = () => {
      if (!isMuted) {
        if (soundEngineRef.current?.ctx?.state === 'suspended') {
          soundEngineRef.current.ctx.resume();
        }
        if (audioRef.current && audioRef.current.paused) {
          audioRef.current.play().catch(() => {});
        }
        if (videoRef.current && videoRef.current.muted) {
          videoRef.current.muted = false;
        }
      }
    };

    window.addEventListener('click', handleFirstInteraction, { once: true });
    window.addEventListener('keydown', handleFirstInteraction, { once: true });
    window.addEventListener('touchstart', handleFirstInteraction, { once: true });

    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
      if (soundEngineRef.current) {
        soundEngineRef.current.stop();
      }
    };
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }

    if (audioRef.current) {
      audioRef.current.muted = isMuted;
      if (!isMuted) {
        audioRef.current.play().catch(() => {
          soundEngineRef.current?.playCruiseLinerSound();
        });
      } else {
        audioRef.current.pause();
        soundEngineRef.current?.stop();
      }
    } else {
      if (!isMuted) {
        soundEngineRef.current?.playCruiseLinerSound();
      } else {
        soundEngineRef.current?.stop();
      }
    }
  }, [isMuted]);

  // Auto transition after INTRO_DURATION_SECONDS
  useEffect(() => {
    const timer = setTimeout(() => {
      handleComplete();
    }, INTRO_DURATION_SECONDS * 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleComplete = () => {
    if (soundEngineRef.current) {
      soundEngineRef.current.stop();
    }
    if (audioRef.current) {
      audioRef.current.pause();
    }
    if (onFinish) {
      onFinish();
    }
  };

  const toggleSound = (e) => {
    e?.stopPropagation?.();
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);

    if (!nextMuted) {
      if (videoRef.current) {
        videoRef.current.muted = false;
      }
      if (audioRef.current) {
        audioRef.current.muted = false;
        audioRef.current.play().catch(() => {
          soundEngineRef.current?.playCruiseLinerSound();
        });
      } else {
        soundEngineRef.current?.playCruiseLinerSound();
      }
    } else {
      if (videoRef.current) {
        videoRef.current.muted = true;
      }
      if (audioRef.current) {
        audioRef.current.pause();
      }
      soundEngineRef.current?.stop();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: 'blur(10px)' }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
      className="fixed inset-0 z-50 w-screen h-screen bg-black overflow-hidden select-none"
    >
      {/* Audio element for Ocean Cruise Liner Ship sound */}
      <audio
        ref={audioRef}
        loop
        preload="auto"
      >
        {SOUND_SOURCES.map((src, idx) => (
          <source key={idx} src={src} type="audio/mpeg" />
        ))}
      </audio>

      {/* Fullscreen Video */}
      <video
        ref={videoRef}
        src={VIDEO_URL}
        autoPlay
        playsInline
        muted={isMuted}
        loop
        onEnded={handleComplete}
        className="w-full h-full object-cover object-center"
      />

      {/* Top Controls: Left Mute Button & Right Skip Intro Button */}
      <div className="absolute top-6 left-6 right-6 z-20 flex items-center justify-between pointer-events-none">
        {/* Left: Mute / Unmute Button */}
        <button
          onClick={toggleSound}
          aria-label={isMuted ? "Unmute sound" : "Mute sound"}
          className="pointer-events-auto px-4 py-2.5 rounded-full bg-black/60 hover:bg-black/85 text-white border border-white/25 backdrop-blur-md transition-all flex items-center gap-2 text-xs font-mono tracking-wider shadow-lg shadow-black/50 hover:scale-105 active:scale-95 cursor-pointer"
        >
          {isMuted ? (
            <>
              <VolumeX className="w-4 h-4 text-rose-400" />
              <span className="text-slate-200 font-semibold">Unmute</span>
            </>
          ) : (
            <>
              <Volume2 className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span className="text-cyan-300 font-semibold">Mute</span>
            </>
          )}
        </button>

        {/* Right: Skip Intro Button */}
        <button
          onClick={handleComplete}
          aria-label="Skip Intro"
          className="pointer-events-auto px-4 py-2.5 rounded-full bg-black/60 hover:bg-black/85 text-white border border-white/25 backdrop-blur-md transition-all flex items-center gap-2 text-xs font-mono font-bold tracking-wider group shadow-lg shadow-black/50 hover:scale-105 active:scale-95 cursor-pointer"
        >
          <span>Skip Intro</span>
          <FastForward className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
};

export default IntroVideoSplash;
