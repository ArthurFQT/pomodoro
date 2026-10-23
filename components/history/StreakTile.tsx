type StreakTileProps = {
  streak: number;
  totalFocusCycles: number;
};

export function StreakTile({ streak, totalFocusCycles }: StreakTileProps) {
  return (
    <div className="flex items-center gap-8">
      <div className="flex flex-col">
        <div className="flex items-baseline gap-2">
          <span className="bg-gradient-to-br from-[var(--accent-from)] to-[var(--accent-to)] bg-clip-text text-5xl font-bold text-transparent">
            {streak}
          </span>
          <span className="text-2xl">🔥</span>
        </div>
        <span className="text-sm text-zinc-600 dark:text-zinc-400">
          {streak === 1 ? "dia seguido" : "dias seguidos"}
        </span>
      </div>

      <div className="flex flex-col">
        <span className="text-5xl font-bold text-zinc-900 dark:text-zinc-50">
          {totalFocusCycles}
        </span>
        <span className="text-sm text-zinc-600 dark:text-zinc-400">
          {totalFocusCycles === 1 ? "ciclo de foco" : "ciclos de foco"}
        </span>
      </div>
    </div>
  );
}
