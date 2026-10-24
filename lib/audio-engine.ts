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
// rodando, desliga ao pausar/pular/concluir). Tudo passa por noiseGain (o
// "mestre"), então o volume se aplica igual pra qualquer um dos tipos.
let noiseCtx: AudioContext | null = null;
let noiseGain: GainNode | null = null;
let noiseNodes: AudioNode[] = [];
let noiseIntervalId: ReturnType<typeof setInterval> | null = null;

function createNoiseBuffer(ctx: AudioContext, type: "white" | "pink", durationSeconds = 3) {
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

function startLoopingNoise(ctx: AudioContext, destination: AudioNode, type: "white" | "pink") {
  const source = ctx.createBufferSource();
  source.buffer = createNoiseBuffer(ctx, type);
  source.loop = true;
  source.connect(destination);
  source.start();
  noiseNodes.push(source);
}

/** Chuva: ruído branco filtrado (grave de mais e agudo de mais cortados)
 * como um "chiado" constante, mais pingos ocasionais — um tom agudo curto
 * com ataque rápido, em intervalos aleatórios. */
function setupRain(ctx: AudioContext, destination: AudioNode) {
  const source = ctx.createBufferSource();
  source.buffer = createNoiseBuffer(ctx, "white");
  source.loop = true;

  const highpass = ctx.createBiquadFilter();
  highpass.type = "highpass";
  highpass.frequency.value = 400;

  const lowpass = ctx.createBiquadFilter();
  lowpass.type = "lowpass";
  lowpass.frequency.value = 3000;

  const bedGain = ctx.createGain();
  bedGain.gain.value = 0.6;

  source.connect(highpass);
  highpass.connect(lowpass);
  lowpass.connect(bedGain);
  bedGain.connect(destination);
  source.start();
  noiseNodes.push(source, highpass, lowpass, bedGain);

  function scheduleDrop() {
    if (!noiseCtx) return;
    const now = noiseCtx.currentTime;
    const drop = noiseCtx.createOscillator();
    drop.type = "sine";
    drop.frequency.value = 1200 + Math.random() * 800;

    const dropGain = noiseCtx.createGain();
    dropGain.gain.setValueAtTime(0.0001, now);
    dropGain.gain.exponentialRampToValueAtTime(0.15, now + 0.005);
    dropGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

    drop.connect(dropGain);
    dropGain.connect(destination);
    drop.start(now);
    drop.stop(now + 0.1);
  }

  noiseIntervalId = setInterval(scheduleDrop, 200 + Math.random() * 200);
}

/** Floresta: ruído branco bem filtrado (só os graves) como um vento suave
 * de fundo, mais "piados" ocasionais — um tom agudo com um pequeno glide
 * de frequência pra cima, em intervalos aleatórios e espaçados. */
function setupForest(ctx: AudioContext, destination: AudioNode) {
  const source = ctx.createBufferSource();
  source.buffer = createNoiseBuffer(ctx, "white");
  source.loop = true;

  const lowpass = ctx.createBiquadFilter();
  lowpass.type = "lowpass";
  lowpass.frequency.value = 500;

  const bedGain = ctx.createGain();
  bedGain.gain.value = 0.5;

  source.connect(lowpass);
  lowpass.connect(bedGain);
  bedGain.connect(destination);
  source.start();
  noiseNodes.push(source, lowpass, bedGain);

  function scheduleChirp() {
    if (!noiseCtx) return;
    const now = noiseCtx.currentTime;
    const startFreq = 1800 + Math.random() * 800;

    const chirp = noiseCtx.createOscillator();
    chirp.type = "sine";
    chirp.frequency.setValueAtTime(startFreq, now);
    chirp.frequency.exponentialRampToValueAtTime(startFreq * 1.4, now + 0.12);

    const chirpGain = noiseCtx.createGain();
    chirpGain.gain.setValueAtTime(0.0001, now);
    chirpGain.gain.exponentialRampToValueAtTime(0.1, now + 0.02);
    chirpGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);

    chirp.connect(chirpGain);
    chirpGain.connect(destination);
    chirp.start(now);
    chirp.stop(now + 0.2);
  }

  noiseIntervalId = setInterval(
    () => {
      if (Math.random() < 0.6) scheduleChirp();
    },
    1800 + Math.random() * 2200,
  );
}

/** Espaço: dois osciladores graves levemente dessintonizados, formando um
 * drone contínuo com um batimento lento, mais "brilhos" agudos esparsos. */
function setupSpace(ctx: AudioContext, destination: AudioNode) {
  const oscillatorA = ctx.createOscillator();
  oscillatorA.type = "triangle";
  oscillatorA.frequency.value = 80;

  const oscillatorB = ctx.createOscillator();
  oscillatorB.type = "triangle";
  oscillatorB.frequency.value = 80.6;

  const droneGain = ctx.createGain();
  droneGain.gain.value = 0.35;

  oscillatorA.connect(droneGain);
  oscillatorB.connect(droneGain);
  droneGain.connect(destination);
  oscillatorA.start();
  oscillatorB.start();
  noiseNodes.push(oscillatorA, oscillatorB, droneGain);

  function scheduleTwinkle() {
    if (!noiseCtx) return;
    const now = noiseCtx.currentTime;

    const twinkle = noiseCtx.createOscillator();
    twinkle.type = "sine";
    twinkle.frequency.value = 1500 + Math.random() * 2000;

    const twinkleGain = noiseCtx.createGain();
    twinkleGain.gain.setValueAtTime(0.0001, now);
    twinkleGain.gain.exponentialRampToValueAtTime(0.06, now + 0.05);
    twinkleGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

    twinkle.connect(twinkleGain);
    twinkleGain.connect(destination);
    twinkle.start(now);
    twinkle.stop(now + 1.3);
  }

  noiseIntervalId = setInterval(
    () => {
      if (Math.random() < 0.5) scheduleTwinkle();
    },
    2500 + Math.random() * 3000,
  );
}

export function startAmbientNoise(type: Exclude<AmbientNoise, "none">, volume: number) {
  stopAmbientNoise();

  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const masterGain = ctx.createGain();
    masterGain.gain.value = (Math.max(0, Math.min(100, volume)) / 100) * 0.25;
    masterGain.connect(ctx.destination);

    noiseCtx = ctx;
    noiseGain = masterGain;
    noiseNodes = [];

    switch (type) {
      case "white":
      case "pink":
        startLoopingNoise(ctx, masterGain, type);
        break;
      case "rain":
        setupRain(ctx, masterGain);
        break;
      case "forest":
        setupForest(ctx, masterGain);
        break;
      case "space":
        setupSpace(ctx, masterGain);
        break;
    }
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
  if (noiseIntervalId !== null) {
    clearInterval(noiseIntervalId);
    noiseIntervalId = null;
  }

  for (const node of noiseNodes) {
    try {
      if (typeof (node as Partial<AudioScheduledSourceNode>).stop === "function") {
        (node as AudioScheduledSourceNode).stop();
      }
    } catch {
      // já parado.
    }
    node.disconnect();
  }
  noiseNodes = [];

  if (noiseGain) {
    noiseGain.disconnect();
    noiseGain = null;
  }
  if (noiseCtx) {
    noiseCtx.close().catch(() => {});
    noiseCtx = null;
  }
}
