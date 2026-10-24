import { ProgressRing } from "../ProgressRing";
import type { TimerFaceProps } from "./types";

export function TomatoFace({ progress, pulsing, children }: TimerFaceProps) {
  // O anel "drena" com o tempo (cheio no início, vazio no fim). Ao concluir,
  // força o círculo fechado de volta — lê como "100% completo", não "vazio".
  const ringProgress = pulsing ? 1 : progress;

  return (
    <div className="relative">
      <svg
        viewBox="0 0 100 40"
        className={`absolute -top-6 left-1/2 h-10 w-24 -translate-x-1/2 ${
          pulsing ? "animate-swing" : ""
        }`}
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
        className={pulsing ? "animate-pulse-glow" : undefined}
      >
        {children}
      </ProgressRing>
    </div>
  );
}
