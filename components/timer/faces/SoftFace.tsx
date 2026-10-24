import { DEFAULT_FACE_SIZE, type TimerFaceProps } from "./types";

export function SoftFace({
  progress,
  pulsing,
  size = DEFAULT_FACE_SIZE,
  children,
}: TimerFaceProps) {
  const clamped = Math.min(1, Math.max(0, progress));
  const pad = size * (16 / 280);
  const side = size - pad * 2;
  const radius = side * 0.32;
  const fillHeight = side * (1 - clamped);
  const fillY = pad + (side - fillHeight);

  return (
    <div
      className="relative"
      style={{ width: size, height: size }}
    >
      <svg viewBox={`0 0 ${size} ${size}`} className="h-full w-full">
        <defs>
          <clipPath id="soft-clip">
            <rect x={pad} y={pad} width={side} height={side} rx={radius} />
          </clipPath>
        </defs>

        <g className={pulsing ? "animate-breathe animate-pulse-glow" : "animate-breathe"}>
          <rect
            x={pad}
            y={pad}
            width={side}
            height={side}
            rx={radius}
            className="fill-zinc-100 dark:fill-zinc-900"
          />

          <g clipPath="url(#soft-clip)">
            <rect
              x={pad}
              y={fillY}
              width={side}
              height={fillHeight}
              fill="var(--accent-to)"
              style={{ transition: "y 1s linear, height 1s linear" }}
            />
          </g>

          <rect
            x={pad}
            y={pad}
            width={side}
            height={side}
            rx={radius}
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
