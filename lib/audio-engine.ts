"use client";

import type { AlarmSound, AmbientNoise } from "./sound";

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    return new AudioContextClass();
  } catch {
    return null;
  }
}

function playTone(
  ctx: AudioContext,
  options: {
    frequency: number;
    type: OscillatorType;
    startTime: number;
    duration: number;
    peakGain: number;
  },
) {
  const { frequency, type, startTime, duration, peakGain } = options;
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();

  oscillator.type = type;
  oscillator.frequency.value = frequency;
  gain.gain.setValueAtTime(0.0001, startTime);
  gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, peakGain), startTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

  oscillator.connect(gain);
  gain.connect(ctx.destination);
  oscillator.start(startTime);
  oscillator.stop(startTime + duration);
}

/** Toca o som de alarme escolhido, uma vez. volume vai de 0 a 100. */
export function playAlarm(sound: AlarmSound, volume: number) {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const peakGain = (Math.max(0, Math.min(100, volume)) / 100) * 0.3;
    const now = ctx.currentTime;

    switch (sound) {
      case "bell":
        playTone(ctx, { frequency: 880, type: "sine", startTime: now, duration: 0.6, peakGain });
        break;
      case "soft":
        playTone(ctx, {
          frequency: 523,
          type: "sine",
          startTime: now,
          duration: 1.1,
          peakGain: peakGain * 0.8,
        });
        break;
      case "classic":
        playTone(ctx, { frequency: 660, type: "square", startTime: now, duration: 0.15, peakGain });
        playTone(ctx, { frequency: 660, type: "square", startTime: now + 0.22, duration: 0.15, peakGain });
        break;
      case "digital":
        playTone(ctx, { frequency: 880, type: "square", startTime: now, duration: 0.1, peakGain });
        playTone(ctx, { frequency: 1046, type: "square", startTime: now + 0.13, duration: 0.15, peakGain });
        break;
    }
  } catch {
    // Web Audio indisponível — segue sem som.
  }
}

// Estado do ruído ambiente contínuo — um player por vez, controlado por
// start/stop/setVolume (ver PomodoroTimer.tsx: liga enquanto o timer está
// rodando, desliga ao pausar/pular/concluir).
let noiseCtx: AudioContext | null = null;
let noiseSource: AudioBufferSourceNode | null = null;
let noiseGain: GainNode | null = null;

function createNoiseBuffer(ctx: AudioContext, type: "white" | "pink", durationSeconds = 2) {
  const bufferSize = Math.floor(ctx.sampleRate * durationSeconds);
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  if (type === "white") {
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
  } else {
    // Ruído rosa via filtro de Paul Kellet — aproximação simples e barata.
    let b0 = 0;
    let b1 = 0;
    let b2 = 0;
    let b3 = 0;
    let b4 = 0;
    let b5 = 0;
    let b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.969 * b2 + white * 0.153852;
      b3 = 0.8665 * b3 + white * 0.3104856;
      b4 = 0.55 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.016898;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
      b6 = white * 0.115926;
    }
  }

  return buffer;
}

export function startAmbientNoise(type: Exclude<AmbientNoise, "none">, volume: number) {
  stopAmbientNoise();

  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const buffer = createNoiseBuffer(ctx, type);
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    const gain = ctx.createGain();
    gain.gain.value = (Math.max(0, Math.min(100, volume)) / 100) * 0.25;

    source.connect(gain);
    gain.connect(ctx.destination);
    source.start();

    noiseCtx = ctx;
    noiseSource = source;
    noiseGain = gain;
  } catch {
    // Web Audio indisponível — segue sem ruído ambiente.
  }
}

export function setAmbientNoiseVolume(volume: number) {
  if (noiseGain) {
    noiseGain.gain.value = (Math.max(0, Math.min(100, volume)) / 100) * 0.25;
  }
}

export function stopAmbientNoise() {
  if (noiseSource) {
    try {
      noiseSource.stop();
    } catch {
      // já parado.
    }
    noiseSource.disconnect();
    noiseSource = null;
  }
  if (noiseGain) {
    noiseGain.disconnect();
    noiseGain = null;
  }
  if (noiseCtx) {
    noiseCtx.close().catch(() => {});
    noiseCtx = null;
  }
}
