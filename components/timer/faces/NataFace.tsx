import { DEFAULT_FACE_SIZE, type TimerFaceProps } from "./types";

const CUP_TOP_Y = 70;
const CUP_BOTTOM_Y = 170;
const CUP_HEIGHT = CUP_BOTTOM_Y - CUP_TOP_Y;
const CUP_PATH = "M50 70 H150 L130 170 H70 Z";

export function NataFace({
  progress,
  pulsing,
  size = DEFAULT_FACE_SIZE,
  children,
}: TimerFaceProps) {
  const clamped = Math.min(1, Math.max(0, progress));
  const elapsed = 1 - clamped;
  const fillTopY = CUP_BOTTOM_Y - elapsed * CUP_HEIGHT;
  const fillHeight = CUP_BOTTOM_Y - fillTopY + 10;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        viewBox="0 0 200 200"
        className={`h-full w-full ${pulsing ? "animate-pulse-glow" : ""}`}
      >
        <defs>
          <clipPath id="nata-cup-clip">
            <path d={CUP_PATH} />
          </clipPath>
        </defs>

        <g className="text-[var(--accent-to)]">
          {[80, 100, 120].map((x, index) => (
            <path
              key={x}
              d={`M${x} 50 q6 -10 0 -20`}
              stroke="currentColor"
              strokeWidth={3}
              strokeLinecap="round"
              fill="none"
              className="animate-steam"
              style={{ animationDelay: `${index * 0.9}s` }}
            />
          ))}
        </g>

        <path d={CUP_PATH} className="fill-zinc-100 dark:fill-zinc-900" />

        <g clipPath="url(#nata-cup-clip)">
          <rect
            x={40}
            y={fillTopY}
            width={120}
            height={fillHeight}
            fill="var(--accent-to)"
            style={{ transition: "y 1s linear, height 1s linear" }}
          />
        </g>

        <path
          d="M150 95 q28 5 28 35 t-28 35"
          stroke="var(--heatmap-cell-0)"
          strokeWidth={10}
          fill="none"
          strokeLinecap="round"
        />

        <path
          d={CUP_PATH}
          fill="none"
          strokeWidth={4}
          className="stroke-zinc-200 dark:stroke-zinc-800"
        />
      </svg>

      <div className="absolute inset-0 flex items-center justify-center text-zinc-900 dark:text-zinc-50">
        {children}
      </div>
    </div>
  );
}
