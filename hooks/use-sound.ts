'use client';

import { useCallback, useRef } from 'react';

type SoundType = 'order' | 'reservation' | 'table' | 'success';

const SOUND_CONFIGS: Record<SoundType, { freq: number[]; duration: number[]; volume: number }> = {
  order:       { freq: [880, 1100],       duration: [0.08, 0.12], volume: 0.3 },
  reservation: { freq: [660, 880, 1100],  duration: [0.06, 0.06, 0.1], volume: 0.2 },
  table:       { freq: [440, 550],        duration: [0.06, 0.08], volume: 0.15 },
  success:     { freq: [880, 1100, 1320], duration: [0.08, 0.08, 0.15], volume: 0.25 },
};

export function useSound() {
  const enabledRef  = useRef(true);
  const ctxRef      = useRef<AudioContext | null>(null);

  function getCtx(): AudioContext {
    if (!ctxRef.current) {
      ctxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return ctxRef.current;
  }

  const play = useCallback((type: SoundType) => {
    if (!enabledRef.current) return;
    try {
      const ctx    = getCtx();
      const config = SOUND_CONFIGS[type];
      let startTime = ctx.currentTime;

      config.freq.forEach((freq, i) => {
        const osc  = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type      = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(config.volume, startTime + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + config.duration[i]);

        osc.start(startTime);
        osc.stop(startTime + config.duration[i]);
        startTime += config.duration[i] * 0.9;
      });
    } catch {
      // Silently fail if Audio API is unavailable
    }
  }, []);

  const setEnabled = useCallback((val: boolean) => {
    enabledRef.current = val;
  }, []);

  const isEnabled = useCallback(() => enabledRef.current, []);

  return { play, setEnabled, isEnabled };
}
