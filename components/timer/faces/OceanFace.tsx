import { DEFAULT_FACE_SIZE, type TimerFaceProps } from "./types";

export function OceanFace({
  progress,
  pulsing,
  size = DEFAULT_FACE_SIZE,
  children,
}: TimerFaceProps) {
  const clamped = Math.min(1, Math.max(0, progress));
  const waterOffset = (1 - clamped) * size;
  const scale = size / DEFAULT_FACE_SIZE;

  return (
    <div
      className={`relative ${pulsing ? "animate-pulse-glow" : ""}`}
      style={{ width: size, height: size }}
    >
      <svg viewBox={`0 0 ${size} ${size}`} className="h-full w-full">
        <defs>
          <clipPath id="ocean-clip">
            <circle cx={size / 2} cy={size / 2} r={size / 2 - 4} />
          </clipPath>
        </defs>

        <circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - 4}
          className="fill-zinc-100 dark:fill-zinc-900"
        />

        <g clipPath="url(#ocean-clip)">
          <g
            style={{
              transform: `translateY(${waterOffset}px)`,
              transition: "transform 1s linear",
            }}
          >
            <g style={{ transform: `scale(${scale})`, transformOrigin: "0 0" }}>
              <g className="animate-wave-drift">
                <path
                  d="M0 20 Q35 0 70 20 T140 20 T210 20 T280 20 V420 H0 Z"
                  fill="var(--accent-to)"
                />
                <path
                  d="M-140 20 Q-105 0 -70 20 T0 20 T70 20 T140 20 V420 H-140 Z"
                  fill="var(--accent-to)"
                />
              </g>
            </g>
          </g>
        </g>

        <circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - 4}
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
