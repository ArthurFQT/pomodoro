import { cookies } from "next/headers";

import { auth } from "@/auth";
import { getCycleStats } from "@/lib/stats";
import { TIMEZONE_COOKIE, resolveTimeZone } from "@/lib/timezone";
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

  const cookieStore = await cookies();
  const timeZone = resolveTimeZone(cookieStore.get(TIMEZONE_COOKIE)?.value);

  const { heatmapWeeks, streak, totalFocusCycles, recent } =
    await getCycleStats(userId, timeZone);

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
        <RecentCyclesList cycles={recent} timeZone={timeZone} />
      </section>
    </div>
  );
}
