type RecentCycle = {
  id: string;
  completedAt: Date;
  durationMinutes: number;
};

type RecentCyclesListProps = {
  cycles: RecentCycle[];
};

const dateTimeFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "UTC",
});

export function RecentCyclesList({ cycles }: RecentCyclesListProps) {
  if (cycles.length === 0) {
    return (
      <p className="text-sm text-zinc-500 dark:text-zinc-500">
        Nenhum ciclo de foco concluído ainda. Comece um no timer.
      </p>
    );
  }

  return (
    <ul className="flex flex-col divide-y divide-zinc-200 dark:divide-zinc-800">
      {cycles.map((cycle) => (
        <li
          key={cycle.id}
          className="flex items-center justify-between py-2.5 text-sm"
        >
          <span className="text-zinc-700 dark:text-zinc-300">
            {dateTimeFormatter.format(cycle.completedAt)}
          </span>
          <span className="text-zinc-500 dark:text-zinc-500">
            {cycle.durationMinutes} min de foco
          </span>
        </li>
      ))}
    </ul>
  );
}
