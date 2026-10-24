import { DEFAULT_STYLE_SIZE, type StyleFaceProps } from "./types";

export function RetroStyle({
  progress,
  pulsing,
  size = DEFAULT_STYLE_SIZE,
  children,
}: StyleFaceProps) {
  const clamped = Math.min(1, Math.max(0, progress));
  const bezelPad = size * (14 / 280);
  const screenPad = size * (28 / 280);
  const barHeight = size * (10 / 280);

  return (
    <div
      className={`relative rounded-2xl border-4 border-zinc-400 bg-zinc-300 p-[14px] shadow-inner dark:border-zinc-700 dark:bg-zinc-800 ${
        pulsing ? "animate-pulse-glow" : ""
      }`}
      style={{ width: size, height: size, padding: bezelPad }}
    >
      <div
        className="relative h-full w-full overflow-hidden rounded-md bg-zinc-900"
        style={{ padding: screenPad - bezelPad }}
      >
        <div
          aria-hidden="true"
          className="animate-scanline pointer-events-none absolute inset-x-0 h-10 bg-gradient-to-b from-transparent via-white/10 to-transparent"
        />

        <div className="flex h-full w-full flex-col items-center justify-center gap-4">
          <div
            className="font-mono tracking-widest text-zinc-50"
            style={{ textShadow: "0 0 10px var(--accent-to)" }}
          >
            {children}
          </div>

          <div
            className="w-4/5 overflow-hidden rounded-full bg-zinc-700"
            style={{ height: barHeight }}
          >
            <div
              className="h-full rounded-full"
              style={{
                width: `${clamped * 100}%`,
                background: "var(--accent-to)",
                boxShadow: "0 0 8px var(--accent-to)",
                transition: "width 1s linear",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
