export type PhaseType = "FOCUS" | "SHORT_BREAK" | "LONG_BREAK";

export type PomodoroSettings = {
  focusMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  longBreakInterval: number;
  soundEnabled: boolean;
  notificationsEnabled: boolean;
};

export const DEFAULT_SETTINGS: PomodoroSettings = {
  focusMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  longBreakInterval: 4,
  soundEnabled: true,
  notificationsEnabled: true,
};

export const PHASE_LABELS: Record<PhaseType, string> = {
  FOCUS: "Foco",
  SHORT_BREAK: "Pausa curta",
  LONG_BREAK: "Pausa longa",
};

export const NEXT_PHASE_LABELS: Record<PhaseType, string> = {
  FOCUS: "Iniciar próximo foco",
  SHORT_BREAK: "Iniciar pausa curta",
  LONG_BREAK: "Iniciar pausa longa",
};

/** Duração (em segundos) de cada fase, a partir das configurações do usuário. */
export function getPhaseDurations(
  settings: PomodoroSettings,
): Record<PhaseType, number> {
  return {
    FOCUS: settings.focusMinutes * 60,
    SHORT_BREAK: settings.shortBreakMinutes * 60,
    LONG_BREAK: settings.longBreakMinutes * 60,
  };
}

type AdvanceResult = {
  nextPhase: PhaseType;
  nextFocusCount: number;
};

/**
 * Decide a próxima etapa e o novo contador de focos a partir da etapa que
 * acabou de terminar (ou foi pulada). A cada `longBreakInterval` focos
 * seguidos a próxima pausa é longa; depois de uma pausa longa o contador
 * reinicia.
 */
export function advancePhase(
  completedPhase: PhaseType,
  focusCount: number,
  longBreakInterval: number,
): AdvanceResult {
  if (completedPhase !== "FOCUS") {
    return {
      nextPhase: "FOCUS",
      nextFocusCount: completedPhase === "LONG_BREAK" ? 0 : focusCount,
    };
  }

  const updatedFocusCount = focusCount + 1;
  const nextPhase =
    updatedFocusCount % longBreakInterval === 0 ? "LONG_BREAK" : "SHORT_BREAK";

  return { nextPhase, nextFocusCount: updatedFocusCount };
}
