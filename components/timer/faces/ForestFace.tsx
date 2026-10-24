import type { TimerFaceProps } from "./types";

const STEM_TOP_Y = 60;
const STEM_BASE_Y = 260;
const STEM_LENGTH = STEM_BASE_Y - STEM_TOP_Y;
const STEM_X = 80;

const LEAVES = [
  { y: 210, side: 1 as const },
  { y: 160, side: -1 as const },
  { y: 110, side: 1 as const },
];

function leafOpacity(elapsed: number, leafY: number) {
  const grown = STEM_BASE_Y - elapsed * STEM_LENGTH;
  return grown <= leafY ? 1 : 0;
}

export function ForestFace({ progress, pulsing, children }: TimerFaceProps) {
  const clamped = Math.min(1, Math.max(0, progress));
  const elapsed = 1 - clamped;
  const dashoffset = STEM_LENGTH * clamped;

  return (
    <div className="flex flex-col items-center gap-4">
      <svg
        viewBox="0 0 160 280"
        className={`h-64 w-36 ${pulsing ? "animate-pulse-glow" : ""}`}
        aria-hidden="true"
      >
        <line
          x1={20}
          y1={STEM_BASE_Y}
          x2={140}
          y2={STEM_BASE_Y}
          className="stroke-zinc-200 dark:stroke-zinc-800"
          strokeWidth={3}
          strokeLinecap="round"
        />

        <path
          d={`M${STEM_X} ${STEM_BASE_Y} V ${STEM_TOP_Y}`}
          stroke="var(--accent-to)"
          strokeWidth={5}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={STEM_LENGTH}
          strokeDashoffset={dashoffset}
          style={{ transition: "stroke-dashoffset 1s linear" }}
        />

        {LEAVES.map((leaf, index) => (
          <path
            key={index}
            d={`M${STEM_X} ${leaf.y} q ${leaf.side * 28} -4 ${leaf.side * 32} -18 q ${leaf.side * -6} 22 ${leaf.side * -32} 18z`}
            fill="var(--accent-to)"
            className="animate-leaf-sway"
            style={{
              opacity: leafOpacity(elapsed, leaf.y),
              transition: "opacity 0.5s ease",
            }}
          />
        ))}

        <g
          style={{
            opacity: elapsed >= 1 ? 1 : 0,
            transition: "opacity 0.6s ease",
          }}
        >
          <circle cx={STEM_X} cy={STEM_TOP_Y - 6} r={22} fill="var(--accent-to)" />
          <circle cx={STEM_X - 16} cy={STEM_TOP_Y + 4} r={16} fill="var(--accent-to)" />
          <circle cx={STEM_X + 16} cy={STEM_TOP_Y + 4} r={16} fill="var(--accent-to)" />
        </g>
      </svg>

      <div className="flex flex-col items-center">{children}</div>
    </div>
  );
}
