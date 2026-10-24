export type ColorMode = "system" | "light" | "dark" | "oled";

export const COLOR_MODES: { id: ColorMode; label: string }[] = [
  { id: "system", label: "Automático" },
  { id: "light", label: "Claro" },
  { id: "dark", label: "Escuro" },
  { id: "oled", label: "OLED" },
];

export const DEFAULT_COLOR_MODE: ColorMode = "system";

export function isValidColorMode(value: string): value is ColorMode {
  return COLOR_MODES.some((mode) => mode.id === value);
}

/** Classes aplicadas em <html> para cada modo — ver app/globals.css. */
export const COLOR_MODE_CLASS: Record<ColorMode, string> = {
  system: "",
  light: "",
  dark: "dark",
  oled: "dark oled",
};
