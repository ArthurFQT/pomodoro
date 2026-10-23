export const THEMES = [
  { id: "tomato", label: "Tomate", from: "#dc2626", to: "#f97316" },
  { id: "citrus", label: "Cítrico", from: "#ca8a04", to: "#65a30d" },
  { id: "berry", label: "Berry", from: "#be185d", to: "#9333ea" },
  { id: "ocean", label: "Oceano", from: "#0369a1", to: "#06b6d4" },
  { id: "forest", label: "Floresta", from: "#15803d", to: "#84cc16" },
] as const;

export type ThemeId = (typeof THEMES)[number]["id"];

export const DEFAULT_THEME: ThemeId = "tomato";

export function isValidTheme(value: string): value is ThemeId {
  return THEMES.some((theme) => theme.id === value);
}
