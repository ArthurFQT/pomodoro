import { auth } from "@/auth";
import { getCycleStats } from "@/lib/stats";
import { Heatmap } from "@/components/history/Heatmap";
import { StreakTile } from "@/components/history/StreakTile";
import { RecentCyclesList } from "@/components/history/RecentCyclesList";

// A sessão e as estatísticas são lidas a cada requisição — não pode ser
// pré-renderizado estaticamente.
export const instant = false;

export default async function HistoricoPage() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return null;
  }

  const { heatmapWeeks, streak, totalFocusCycles, recent } =
    await getCycleStats(userId);

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-10">
      <h1 className="bg-gradient-to-br from-[var(--accent-from)] to-[var(--accent-to)] bg-clip-text text-3xl font-extrabold tracking-tight text-transparent">
        Histórico
      </h1>

      <StreakTile streak={streak} totalFocusCycles={totalFocusCycles} />

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">
          Ciclos por dia
        </h2>
        <Heatmap weeks={heatmapWeeks} />
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">
          Ciclos recentes
        </h2>
        <RecentCyclesList cycles={recent} />
      </section>
    </div>
  );
}
