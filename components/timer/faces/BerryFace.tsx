import type { TimerFaceProps } from "./types";

// Coordenadas relativas (0-100) desenhadas à mão formando um cacho.
const DOTS = [
  { x: 50, y: 10 },
  { x: 38, y: 24 },
  { x: 62, y: 24 },
  { x: 28, y: 38 },
  { x: 50, y: 38 },
  { x: 72, y: 38 },
  { x: 20, y: 54 },
  { x: 40, y: 54 },
  { x: 60, y: 54 },
  { x: 80, y: 54 },
  { x: 32, y: 70 },
  { x: 50, y: 70 },
  { x: 68, y: 70 },
  { x: 50, y: 86 },
];

export function BerryFace({ progress, pulsing, children }: TimerFaceProps) {
  const clamped = Math.min(1, Math.max(0, progress));
  const elapsed = 1 - clamped;
  const litCount = Math.round(elapsed * DOTS.length);

  return (
    <div className="flex flex-col items-center gap-4">
      <svg
        viewBox="0 0 100 100"
        className={`h-64 w-64 ${pulsing ? "animate-pulse-glow" : ""}`}
        aria-hidden="true"
      >
        <path
          d="M50 2c0 4-2 6-2 6"
          stroke="currentColor"
          className="text-green-600"
          strokeWidth={2}
          strokeLinecap="round"
          fill="none"
        />
        {DOTS.map((dot, index) => (
          <circle
            key={index}
            cx={dot.x}
            cy={dot.y}
            r={7}
            fill={
              index < litCount ? "var(--accent-to)" : "var(--heatmap-cell-0)"
            }
            style={{ transition: "fill 0.4s ease" }}
          />
        ))}
      </svg>

      <div className="flex flex-col items-center">{children}</div>
    </div>
  );
}
