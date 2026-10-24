import { DEFAULT_STYLE_SIZE, type StyleFaceProps } from "./types";

const GROOVE_COUNT = 5;

export function LofiStyle({
  progress,
  pulsing,
  size = DEFAULT_STYLE_SIZE,
  children,
}: StyleFaceProps) {
  const clamped = Math.min(1, Math.max(0, progress));
  const center = size / 2;
  const discRadius = size * 0.46;
  const strokeWidth = size * (10 / 280);
  const arcRadius = size / 2 - strokeWidth / 2;
  const circumference = 2 * Math.PI * arcRadius;
  const offset = circumference * (1 - clamped);

  const grooveRadii = Array.from({ length: GROOVE_COUNT }, (_, i) =>
    discRadius * (0.35 + (i / (GROOVE_COUNT - 1)) * 0.55),
  );

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} className="h-full w-full">
        {/* Braço decorativo, fixo — o disco é que indica o progresso. */}
        <line
          x1={size * 0.92}
          y1={size * 0.1}
          x2={size * 0.68}
          y2={size * 0.32}
          strokeWidth={size * (4 / 280)}
          strokeLinecap="round"
          className="stroke-zinc-400 dark:stroke-zinc-600"
        />
        <circle
          cx={size * 0.92}
          cy={size * 0.1}
          r={size * (5 / 280)}
          className="fill-zinc-400 dark:fill-zinc-600"
        />

        <g
          className={pulsing ? "animate-spin-slow animate-pulse-glow" : "animate-spin-slow"}
          style={{ transformOrigin: "center", transformBox: "fill-box" }}
        >
          <circle
            cx={center}
            cy={center}
            r={discRadius}
            className="fill-zinc-800 dark:fill-black"
          />
          {grooveRadii.map((radius) => (
            <circle
              key={radius}
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              strokeWidth={1}
              className="stroke-zinc-600 dark:stroke-zinc-800"
            />
          ))}
          <circle cx={center} cy={center} r={discRadius * 0.14} fill="var(--accent-to)" />
        </g>

        <circle
          cx={center}
          cy={center}
          r={arcRadius}
          fill="none"
          strokeWidth={strokeWidth}
          className="stroke-zinc-200 dark:stroke-zinc-800"
        />
        <circle
          cx={center}
          cy={center}
          r={arcRadius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          stroke="var(--accent-to)"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${center} ${center})`}
          style={{ transition: "stroke-dashoffset 1s linear" }}
        />
      </svg>

      <div className="absolute inset-0 flex items-center justify-center text-zinc-50">
        {children}
      </div>
    </div>
  );
}
