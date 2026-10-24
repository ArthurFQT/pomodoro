import { DEFAULT_STYLE_SIZE, type StyleFaceProps } from "./types";

export function PastelStyle({
  progress,
  pulsing,
  size = DEFAULT_STYLE_SIZE,
  children,
}: StyleFaceProps) {
  const clamped = Math.min(1, Math.max(0, progress));
  const pad = size * (16 / 280);
  const side = size - pad * 2;
  const radius = side / 2;
  const fillHeight = side * (1 - clamped);
  const fillY = pad + (side - fillHeight);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} className="h-full w-full">
        <defs>
          <clipPath id="pastel-clip">
            <circle cx={size / 2} cy={size / 2} r={radius} />
          </clipPath>
        </defs>

        <g className={pulsing ? "animate-breathe animate-pulse-glow" : "animate-breathe"}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            className="fill-zinc-100 dark:fill-zinc-900"
          />

          <g clipPath="url(#pastel-clip)">
            <rect
              x={pad}
              y={fillY}
              width={side}
              height={fillHeight}
              fill="var(--accent-to)"
              style={{ transition: "y 1s linear, height 1s linear" }}
            />
          </g>

          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            strokeWidth={4}
            className="stroke-zinc-200 dark:stroke-zinc-800"
          />
        </g>
      </svg>

      <div className="absolute inset-0 flex items-center justify-center text-zinc-900 dark:text-zinc-50">
        {children}
      </div>
    </div>
  );
}
