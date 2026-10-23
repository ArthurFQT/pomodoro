import type { PhaseType } from "./pomodoro";

export type TimerStatus = "idle" | "running" | "paused" | "completed";

export type PendingPhase = {
  phase: PhaseType;
  focusCount: number;
};

export type PersistedTimerState = {
  phase: PhaseType;
  focusCount: number;
  status: TimerStatus;
  phaseEndsAt: number | null;
  secondsLeft: number;
  pending: PendingPhase | null;
};

function storageKey(userId: string) {
  return `pomodoro:timer:${userId}`;
}

/** Lê o estado salvo do timer deste usuário (escopado por userId, para não
 *  vazar entre contas em um navegador compartilhado). Só funciona no client. */
export function loadTimerState(userId: string): PersistedTimerState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(storageKey(userId));
    if (!raw) return null;
    return JSON.parse(raw) as PersistedTimerState;
  } catch {
    return null;
  }
}

export function saveTimerState(userId: string, state: PersistedTimerState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(storageKey(userId), JSON.stringify(state));
  } catch {
    // localStorage indisponível (modo privado, quota cheia) — segue sem persistir.
  }
}
