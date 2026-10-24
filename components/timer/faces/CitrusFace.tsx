import { DEFAULT_FACE_SIZE, type TimerFaceProps } from "./types";

const SEGMENT_COUNT = 8;

export function CitrusFace({
  progress,
  pulsing,
  size = DEFAULT_FACE_SIZE,
  children,
}: TimerFaceProps) {
  const clamped = Math.min(1, Math.max(0, progress));
  const elapsedDeg = (1 - clamped) * 360;
  const inset = size * (40 / 280); // mesma proporção do "inset-10" original

  return (
    <div
      className={`relative rounded-full ${pulsing ? "animate-pulse-glow" : ""}`}
      style={{
        width: size,
        height: size,
        background: `conic-gradient(var(--accent-to) ${elapsedDeg}deg, var(--heatmap-cell-0) 0deg)`,
        transition: "background 1s linear",
      }}
    >
      {Array.from({ length: SEGMENT_COUNT }).map((_, index) => (
        <div
          key={index}
          className="absolute top-1/2 left-1/2 h-px w-1/2 origin-left bg-zinc-50 dark:bg-zinc-950"
          style={{
            transform: `rotate(${(360 / SEGMENT_COUNT) * index}deg)`,
          }}
        />
      ))}

      <div
        className="absolute flex items-center justify-center rounded-full bg-zinc-50/90 dark:bg-zinc-950/90"
        style={{ inset }}
      >
        {children}
      </div>
    </div>
  );
}
