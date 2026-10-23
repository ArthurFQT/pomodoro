import type { HeatmapDay } from "@/lib/heatmap";

type HeatmapProps = {
  weeks: HeatmapDay[][];
};

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

function formatCycles(count: number) {
  return count === 1 ? "1 ciclo" : `${count} ciclos`;
}

export function Heatmap({ weeks }: HeatmapProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="overflow-x-auto pb-1">
        <div
          className="grid w-max gap-[2px]"
          style={{
            gridTemplateRows: "repeat(7, 11px)",
            gridAutoFlow: "column",
            gridAutoColumns: "11px",
          }}
        >
          {weeks.flatMap((week) =>
            week.map((day) => (
              <div
                key={day.date}
                data-level={day.level}
                title={`${formatCycles(day.count)} em ${dateFormatter.format(new Date(day.date))}`}
                className="heatmap-cell rounded-[2px]"
              />
            )),
          )}
        </div>
      </div>

      <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-500">
        <span>Menos</span>
        {[0, 1, 2, 3, 4].map((level) => (
          <div
            key={level}
            data-level={level}
            className="heatmap-cell rounded-[2px]"
          />
        ))}
        <span>Mais</span>
      </div>
    </div>
  );
}
