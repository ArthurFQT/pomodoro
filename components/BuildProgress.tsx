"use client";

import { useEffect, useRef, useState } from "react";

const DURATION_MS = 3200;

function easeInOutQuad(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

export function BuildProgress() {
  const [progress, setProgress] = useState(0);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    let frame: number;

    function tick(now: number) {
      if (startRef.current === null) startRef.current = now;
      const elapsed = (now - startRef.current) % DURATION_MS;
      const t = elapsed / DURATION_MS;
      setProgress(Math.round(easeInOutQuad(t) * 100));
      frame = requestAnimationFrame(tick);
    }

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <div className="flex items-baseline justify-between text-sm">
        <span className="font-medium text-zinc-600 dark:text-zinc-400">
          Progresso da obra
        </span>
        <span className="font-mono font-semibold text-red-600 dark:text-red-400">
          {progress}%
        </span>
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
        <div
          className="h-full rounded-full bg-gradient-to-r from-red-500 to-orange-400 shadow-[0_0_12px_rgba(239,68,68,0.6)]"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
