import { ProgressRing } from "../ProgressRing";
import { DEFAULT_FACE_SIZE, type TimerFaceProps } from "./types";

export function TomatoFace({
  progress,
  pulsing,
  size = DEFAULT_FACE_SIZE,
  children,
}: TimerFaceProps) {
  // O anel "drena" com o tempo (cheio no início, vazio no fim). Ao concluir,
  // força o círculo fechado de volta — lê como "100% completo", não "vazio".
  const ringProgress = pulsing ? 1 : progress;
  const leafWidth = size * 0.34;
  const leafHeight = size * 0.14;

  return (
    <div className="relative">
      <svg
        viewBox="0 0 100 40"
        className={`absolute left-1/2 -translate-x-1/2 ${
          pulsing ? "animate-swing" : ""
        }`}
        style={{
          width: leafWidth,
          height: leafHeight,
          top: -leafHeight * 0.6,
        }}
        aria-hidden="true"
      >
        <path
          d="M50 40c-14-10-22-24-14-34 8 10 12 22 14 34z"
          className="fill-green-600"
        />
        <path
          d="M50 40c14-10 22-24 14-34-8 10-12 22-14 34z"
          className="fill-green-500"
        />
      </svg>

      <ProgressRing
        progress={ringProgress}
        size={size}
        className={pulsing ? "animate-pulse-glow" : undefined}
      >
        {children}
      </ProgressRing>
    </div>
  );
}
