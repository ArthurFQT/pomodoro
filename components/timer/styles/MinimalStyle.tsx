import { ProgressRing } from "../ProgressRing";
import { DEFAULT_STYLE_SIZE, type StyleFaceProps } from "./types";

export function MinimalStyle({
  progress,
  pulsing,
  size = DEFAULT_STYLE_SIZE,
  children,
}: StyleFaceProps) {
  return (
    <ProgressRing
      progress={progress}
      size={size}
      strokeWidth={size * (6 / 280)}
      className={pulsing ? "animate-pulse-glow" : ""}
    >
      {children}
    </ProgressRing>
  );
}
