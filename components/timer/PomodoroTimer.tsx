"use client";

import { useEffect, useRef, useState } from "react";

import { recordCycle } from "@/app/dashboard/actions";
import {
  NEXT_PHASE_LABELS,
  PHASE_LABELS,
  advancePhase,
  getPhaseDurations,
  type PhaseType,
  type PomodoroSettings,
} from "@/lib/pomodoro";
import {
  loadTimerState,
  saveTimerState,
  type PendingPhase,
  type TimerStatus,
} from "@/lib/timer-storage";
import { getStyleColors, type StyleId } from "@/lib/styles";
import { playAlarm, startAmbientNoise, setAmbientNoiseVolume, stopAmbientNoise } from "@/lib/audio-engine";

import { FullscreenToggle } from "./FullscreenToggle";
import { StyleFace } from "./StyleFace";

type TimerState = {
  phase: PhaseType;
  focusCount: number;
  secondsLeft: number;
  status: TimerStatus;
  phaseEndsAt: number | null;
  pending: PendingPhase | null;
  hydrated: boolean;
};

function buildInitialState(settings: PomodoroSettings): TimerState {
  return {
    phase: "FOCUS",
    focusCount: 0,
    secondsLeft: getPhaseDurations(settings).FOCUS,
    status: "idle",
    phaseEndsAt: null,
    pending: null,
    hydrated: false,
  };
}

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = Math.floor(totalSeconds % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${seconds}`;
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

type PomodoroTimerProps = {
  userId: string;
  settings: PomodoroSettings;
  styleId: StyleId;
};

export function PomodoroTimer({ userId, settings, styleId }: PomodoroTimerProps) {
  const [state, setState] = useState<TimerState>(() =>
    buildInitialState(settings),
  );
  const { phase, focusCount, secondsLeft, status, phaseEndsAt, pending, hydrated } =
    state;

  const phaseDurations = getPhaseDurations(settings);

  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    function handleFullscreenChange() {
      setIsFullscreen(document.fullscreenElement === containerRef.current);
    }
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  function toggleFullscreen() {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      containerRef.current?.requestFullscreen().catch(() => {});
    }
  }

  const completeRef = useRef<() => void>(() => {});

  // Mantém a closure sempre com o estado mais recente, sem recriar o efeito
  // de tick abaixo a cada render (e sem escrever no ref durante a
  // renderização, que o React proíbe).
  useEffect(() => {
    completeRef.current = () => {
      const { nextPhase, nextFocusCount } = advancePhase(
        phase,
        focusCount,
        settings.longBreakInterval,
      );

      // Auto-start de pausas: só pula a confirmação quando um FOCO termina —
      // voltar ao foco a partir de uma pausa continua exigindo o clique.
      if (phase === "FOCUS" && settings.autoStartBreaks) {
        const duration = phaseDurations[nextPhase];
        setState((prev) => ({
          ...prev,
          phase: nextPhase,
          focusCount: nextFocusCount,
          secondsLeft: duration,
          phaseEndsAt: Date.now() + duration * 1000,
          status: "running",
          pending: null,
        }));
      } else {
        setState((prev) => ({
          ...prev,
          status: "completed",
          phaseEndsAt: null,
          secondsLeft: 0,
          pending: { phase: nextPhase, focusCount: nextFocusCount },
        }));
      }

      recordCycle(phase, Math.round(phaseDurations[phase] / 60)).catch(
        () => {},
      );
      if (settings.soundEnabled) playAlarm(settings.alarmSound, settings.soundVolume);
      if (settings.notificationsEnabled) {
        notifyPhaseComplete(
          `${PHASE_LABELS[phase]} concluído. Hora de ${NEXT_PHASE_LABELS[
            nextPhase
          ].toLowerCase()}.`,
        );
      }
    };
  });

  // Restaura o estado salvo (se houver) ao montar — refresh ou troca de
  // página não deveriam perder o timer em andamento. Hidratação única,
  // client-only, a partir do localStorage: não há valor vindo do servidor
  // pra divergir, então o anti-padrão que essa regra normalmente evita
  // (derivar estado que poderia vir do render) não se aplica aqui.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const saved = loadTimerState(userId);

    if (!saved) {
      setState((prev) => ({ ...prev, hydrated: true }));
      return;
    }

    if (saved.status === "running" && saved.phaseEndsAt !== null) {
      const remaining = Math.round((saved.phaseEndsAt - Date.now()) / 1000);

      if (remaining > 0) {
        setState({
          phase: saved.phase,
          focusCount: saved.focusCount,
          secondsLeft: remaining,
          status: "running",
          phaseEndsAt: saved.phaseEndsAt,
          pending: null,
          hydrated: true,
        });
      } else {
        // A fase terminou enquanto a aba estava fechada ou em outra página.
        const { nextPhase, nextFocusCount } = advancePhase(
          saved.phase,
          saved.focusCount,
          settings.longBreakInterval,
        );

        if (saved.phase === "FOCUS" && settings.autoStartBreaks) {
          const duration = phaseDurations[nextPhase];
          setState({
            phase: nextPhase,
            focusCount: nextFocusCount,
            secondsLeft: duration,
            status: "running",
            phaseEndsAt: Date.now() + duration * 1000,
            pending: null,
            hydrated: true,
          });
        } else {
          setState({
            phase: saved.phase,
            focusCount: nextFocusCount,
            secondsLeft: 0,
            status: "completed",
            phaseEndsAt: null,
            pending: { phase: nextPhase, focusCount: nextFocusCount },
            hydrated: true,
          });
        }

        recordCycle(
          saved.phase,
          Math.round(phaseDurations[saved.phase] / 60),
        ).catch(() => {});
      }
    } else {
      // "idle" não tem contagem parcial a preservar — usa sempre a duração
      // atual das configurações (senão uma mudança de configuração não
      // apareceria até a próxima fase, já que o valor salvo ficaria preso
      // no antigo). "paused"/"completed" preservam o valor exato salvo.
      const secondsLeft =
        saved.status === "idle"
          ? phaseDurations[saved.phase]
          : saved.secondsLeft;

      setState({
        phase: saved.phase,
        focusCount: saved.focusCount,
        secondsLeft,
        status: saved.status,
        phaseEndsAt: saved.phaseEndsAt,
        pending: saved.pending,
        hydrated: true,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Persiste a cada mudança relevante — só depois de já ter restaurado o
  // estado salvo, senão sobrescreveria com os valores iniciais antes da
  // leitura do localStorage completar.
  useEffect(() => {
    if (!hydrated) return;
    saveTimerState(userId, {
      phase,
      focusCount,
      status,
      phaseEndsAt,
      secondsLeft,
      pending,
    });
  }, [userId, hydrated, phase, focusCount, status, phaseEndsAt, secondsLeft, pending]);

  useEffect(() => {
    if (status !== "running" || phaseEndsAt === null) return;

    const tick = () => {
      const remaining = Math.max(
        0,
        Math.round((phaseEndsAt - Date.now()) / 1000),
      );
      setState((prev) => ({ ...prev, secondsLeft: remaining }));
      if (remaining <= 0) {
        completeRef.current();
      }
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [status, phaseEndsAt]);

  // Ruído ambiente: toca continuamente enquanto o timer está rodando, em
  // qualquer fase. Ajuste de volume não reinicia o som (evita um corte
  // audível a cada mudança no slider).
  useEffect(() => {
    if (status === "running" && settings.ambientNoise !== "none") {
      startAmbientNoise(settings.ambientNoise, settings.soundVolume);
    } else {
      stopAmbientNoise();
    }
    return () => stopAmbientNoise();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, settings.ambientNoise]);

  useEffect(() => {
    setAmbientNoiseVolume(settings.soundVolume);
  }, [settings.soundVolume]);

  function handleStart() {
    if (settings.notificationsEnabled) ensureNotificationPermission();
    setState((prev) => ({
      ...prev,
      status: "running",
      phaseEndsAt: Date.now() + prev.secondsLeft * 1000,
    }));
  }

  function handlePause() {
    setState((prev) => {
      if (prev.status !== "running" || prev.phaseEndsAt === null) return prev;
      const remaining = Math.max(
        0,
        Math.round((prev.phaseEndsAt - Date.now()) / 1000),
      );
      return { ...prev, status: "paused", secondsLeft: remaining, phaseEndsAt: null };
    });
  }

  function handleSkip() {
    setState((prev) => {
      const { nextPhase, nextFocusCount } = advancePhase(
        prev.phase,
        prev.focusCount,
        settings.longBreakInterval,
      );
      return {
        ...prev,
        phase: nextPhase,
        focusCount: nextFocusCount,
        secondsLeft: phaseDurations[nextPhase],
        phaseEndsAt: null,
        status: "idle",
      };
    });
  }

  function handleConfirmNext() {
    setState((prev) => {
      if (!prev.pending) return prev;
      const duration = phaseDurations[prev.pending.phase];
      return {
        ...prev,
        phase: prev.pending.phase,
        focusCount: prev.pending.focusCount,
        secondsLeft: duration,
        phaseEndsAt: Date.now() + duration * 1000,
        status: "running",
        pending: null,
      };
    });
  }

  const total = phaseDurations[phase];
  // secondsLeft já é 0 quando status === "completed" (ver efeitos acima) —
  // cada estilo decide por conta própria como representar "concluído" no seu
  // próprio formato (ver MinimalStyle, por exemplo).
  const progress = secondsLeft / total;

  // A cor muda com a fase (foco/pausa), dentro do mesmo estilo/formato —
  // aplicada aqui via custom property inline pra sobrescrever a cor
  // "ambiente" (fase de foco) herdada do layout do dashboard.
  const colors = getStyleColors(styleId, phase);
  const colorVars = {
    "--accent-from": colors.from,
    "--accent-to": colors.to,
  } as React.CSSProperties;

  return (
    <div
      ref={containerRef}
      style={colorVars}
      className={`relative flex flex-col items-center gap-8 ${
        isFullscreen
          ? "timer-ambient-bg h-screen w-screen justify-center"
          : ""
      }`}
    >
      <FullscreenToggle isFullscreen={isFullscreen} onToggle={toggleFullscreen} />

      <p className="text-sm font-semibold tracking-wide text-zinc-500 uppercase dark:text-zinc-400">
        {status === "completed"
          ? `${PHASE_LABELS[phase]} concluído`
          : PHASE_LABELS[phase]}
      </p>

      <StyleFace styleId={styleId} progress={progress} pulsing={status === "completed"}>
        <span className="text-5xl font-bold tabular-nums">
          {status === "completed" ? "✓" : formatTime(secondsLeft)}
        </span>
      </StyleFace>

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
