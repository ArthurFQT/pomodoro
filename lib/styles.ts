import type { PhaseType } from "./pomodoro";

export type StyleId = "minimal" | "pastel" | "lofi" | "retro";

export type PhaseColors = { from: string; to: string };

export type StyleDefinition = {
  id: StyleId;
  label: string;
  description: string;
  colors: Record<PhaseType, PhaseColors>;
};

// Cada estilo define um formato visual próprio (ver components/timer/styles/)
// e uma cor por fase — a cor muda com o foco/pausa dentro do mesmo estilo,
// o formato não.
export const STYLES: StyleDefinition[] = [
  {
    id: "minimal",
    label: "Minimalista",
    description: "Um anel fino, sem decoração — só o essencial.",
    colors: {
      FOCUS: { from: "#52525b", to: "#a1a1aa" },
      SHORT_BREAK: { from: "#047857", to: "#34d399" },
      LONG_BREAK: { from: "#1d4ed8", to: "#60a5fa" },
    },
  },
  {
    id: "pastel",
    label: "Pastel",
    description: "Um blob suave respirando, em tons delicados.",
    colors: {
      FOCUS: { from: "#fb7185", to: "#fda4af" },
      SHORT_BREAK: { from: "#2dd4bf", to: "#99f6e4" },
      LONG_BREAK: { from: "#a78bfa", to: "#ddd6fe" },
    },
  },
  {
    id: "lofi",
    label: "Lofi",
    description: "Um disco de vinil girando devagar, tons quentes e analógicos.",
    colors: {
      FOCUS: { from: "#b45309", to: "#f59e0b" },
      SHORT_BREAK: { from: "#0f766e", to: "#2dd4bf" },
      LONG_BREAK: { from: "#9d174d", to: "#f472b6" },
    },
  },
  {
    id: "retro",
    label: "Retro",
    description: "Um visor LCD digital, como num relógio antigo.",
    colors: {
      FOCUS: { from: "#15803d", to: "#4ade80" },
      SHORT_BREAK: { from: "#b45309", to: "#fbbf24" },
      LONG_BREAK: { from: "#b91c1c", to: "#f87171" },
    },
  },
];

export const DEFAULT_STYLE: StyleId = "minimal";

// Cor de marca fixa (fora da área logada — landing, login, cadastro — onde
// não existe um estilo de usuário ainda para resolver).
export const BRAND_ACCENT: PhaseColors = { from: "#dc2626", to: "#f97316" };

export function isValidStyle(value: string): value is StyleId {
  return STYLES.some((style) => style.id === value);
}

export function getStyle(styleId: StyleId): StyleDefinition {
  return STYLES.find((style) => style.id === styleId) ?? STYLES[0];
}

export function getStyleColors(styleId: StyleId, phase: PhaseType): PhaseColors {
  return getStyle(styleId).colors[phase];
}
