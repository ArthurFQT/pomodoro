"use client";

import { useEffect, useRef, useState } from "react";

import { recordCycle } from "@/app/dashboard/actions";
import {
  NEXT_PHASE_LABELS,
  PHASE_DURATIONS,
  PHASE_LABELS,
  advancePhase,
  type PhaseType,
} from "@/lib/pomodoro";

import { ProgressRing } from "./ProgressRing";

type Status = "idle" | "running" | "paused" | "completed";

type PendingPhase = {
  phase: PhaseType;
  focusCount: number;
};

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = Math.floor(totalSeconds % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function playChime() {
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    const ctx = new AudioContextClass();
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();

    oscillator.type = "sine";
    oscillator.frequency.value = 880;
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.6);

    oscillator.connect(gain);
    gain.connect(ctx.destination);
    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.6);
  } catch {
    // Web Audio indisponível — segue sem som.
  }
}

function ensureNotificationPermission() {
  if (typeof window === "undefined" || !("Notification" in window)) return;
  if (Notification.permission === "default") {
    Notification.requestPermission().catch(() => {});
  }
}

function notifyPhaseComplete(message: string) {
  if (typeof window === "undefined" || !("Notification" in window)) return;
  if (Notification.permission === "granted") {
    new Notification("Pomodoro", { body: message });
  }
}

export function PomodoroTimer() {
  const [phase, setPhase] = useState<PhaseType>("FOCUS");
  const [focusCount, setFocusCount] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(PHASE_DURATIONS.FOCUS);
  const [status, setStatus] = useState<Status>("idle");
  const [phaseEndsAt, setPhaseEndsAt] = useState<number | null>(null);
  const [pending, setPending] = useState<PendingPhase | null>(null);

  const completeRef = useRef<() => void>(() => {});

  // Mantém a closure sempre com o `phase`/`focusCount` mais recentes, sem
  // recriar o efeito de tick abaixo a cada render (e sem escrever no ref
  // durante a renderização, que o React proíbe).
  useEffect(() => {
    completeRef.current = () => {
      const { nextPhase, nextFocusCount } = advancePhase(phase, focusCount);

      setPending({ phase: nextPhase, focusCount: nextFocusCount });
      setStatus("completed");
      setPhaseEndsAt(null);
      setSecondsLeft(0);

      recordCycle(phase, Math.round(PHASE_DURATIONS[phase] / 60)).catch(
        () => {},
      );
      playChime();
      notifyPhaseComplete(
        `${PHASE_LABELS[phase]} concluído. Hora de ${NEXT_PHASE_LABELS[
          nextPhase
        ].toLowerCase()}.`,
      );
    };
  });

  useEffect(() => {
    if (status !== "running" || phaseEndsAt === null) return;

    const tick = () => {
      const remaining = Math.max(
        0,
        Math.round((phaseEndsAt - Date.now()) / 1000),
      );
      setSecondsLeft(remaining);
      if (remaining <= 0) {
        completeRef.current();
      }
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [status, phaseEndsAt]);

  function handleStart() {
    ensureNotificationPermission();
    setPhaseEndsAt(Date.now() + secondsLeft * 1000);
    setStatus("running");
  }

  function handlePause() {
    if (status !== "running" || phaseEndsAt === null) return;
    setSecondsLeft(Math.max(0, Math.round((phaseEndsAt - Date.now()) / 1000)));
    setPhaseEndsAt(null);
    setStatus("paused");
  }

  function handleSkip() {
    const { nextPhase, nextFocusCount } = advancePhase(phase, focusCount);
    setPhase(nextPhase);
    setFocusCount(nextFocusCount);
    setSecondsLeft(PHASE_DURATIONS[nextPhase]);
    setPhaseEndsAt(null);
    setStatus("idle");
  }

  function handleConfirmNext() {
    if (!pending) return;
    const duration = PHASE_DURATIONS[pending.phase];

    setPhase(pending.phase);
    setFocusCount(pending.focusCount);
    setSecondsLeft(duration);
    setPhaseEndsAt(Date.now() + duration * 1000);
    setStatus("running");
    setPending(null);
  }

  const total = PHASE_DURATIONS[phase];
  const progress = status === "completed" ? 1 : secondsLeft / total;

  return (
    <div className="flex flex-col items-center gap-8">
      <p className="text-sm font-semibold tracking-wide text-zinc-500 uppercase dark:text-zinc-400">
        {status === "completed"
          ? `${PHASE_LABELS[phase]} concluído`
          : PHASE_LABELS[phase]}
      </p>

      <ProgressRing
        progress={progress}
        className={status === "completed" ? "animate-pulse-glow" : undefined}
      >
        <span className="text-5xl font-bold tabular-nums text-zinc-900 dark:text-zinc-50">
          {status === "completed" ? "✓" : formatTime(secondsLeft)}
        </span>
      </ProgressRing>

      {status === "completed" && pending ? (
        <button
          type="button"
          onClick={handleConfirmNext}
          className="rounded-full bg-gradient-to-br from-[var(--accent-from)] to-[var(--accent-to)] px-8 py-3 text-base font-semibold text-white transition-opacity hover:opacity-90"
        >
          {NEXT_PHASE_LABELS[pending.phase]}
        </button>
      ) : (
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={status === "running" ? handlePause : handleStart}
            className="rounded-full bg-gradient-to-br from-[var(--accent-from)] to-[var(--accent-to)] px-8 py-3 text-base font-semibold text-white transition-opacity hover:opacity-90"
          >
            {status === "running" ? "Pausar" : "Começar"}
          </button>
          <button
            type="button"
            onClick={handleSkip}
            className="rounded-full border border-zinc-300 px-5 py-3 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-900"
          >
            Pular
          </button>
        </div>
      )}
    </div>
  );
}
