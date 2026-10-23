export type PhaseType = "FOCUS" | "SHORT_BREAK" | "LONG_BREAK";

export const PHASE_DURATIONS: Record<PhaseType, number> = {
  FOCUS: 25 * 60,
  SHORT_BREAK: 5 * 60,
  LONG_BREAK: 15 * 60,
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

const FOCUS_SESSIONS_BEFORE_LONG_BREAK = 4;

type AdvanceResult = {
  nextPhase: PhaseType;
  nextFocusCount: number;
};

/**
 * Decide a próxima etapa e o novo contador de focos a partir da etapa que
 * acabou de terminar (ou foi pulada). A cada N focos seguidos a próxima
 * pausa é longa; depois de uma pausa longa o contador reinicia.
 */
export function advancePhase(
  completedPhase: PhaseType,
  focusCount: number,
): AdvanceResult {
  if (completedPhase !== "FOCUS") {
    return {
      nextPhase: "FOCUS",
      nextFocusCount: completedPhase === "LONG_BREAK" ? 0 : focusCount,
    };
  }

  const updatedFocusCount = focusCount + 1;
  const nextPhase =
    updatedFocusCount % FOCUS_SESSIONS_BEFORE_LONG_BREAK === 0
      ? "LONG_BREAK"
      : "SHORT_BREAK";

  return { nextPhase, nextFocusCount: updatedFocusCount };
}
