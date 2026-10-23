import { prisma } from "@/lib/prisma";
import { buildHeatmapWeeks, calculateStreak, toDateKey } from "@/lib/heatmap";

const HEATMAP_WEEKS = 53;
const RECENT_LIMIT = 20;

export async function getCycleStats(userId: string) {
  const cycles = await prisma.cycle.findMany({
    where: { userId, type: "FOCUS" },
    orderBy: { completedAt: "desc" },
    select: { id: true, completedAt: true, durationMinutes: true },
  });

  const activity = new Map<string, number>();
  for (const cycle of cycles) {
    const key = toDateKey(cycle.completedAt);
    activity.set(key, (activity.get(key) ?? 0) + 1);
  }

  const heatmapWeeks = buildHeatmapWeeks(activity, HEATMAP_WEEKS);
  const streak = calculateStreak(new Set(activity.keys()));

  return {
    heatmapWeeks,
    streak,
    totalFocusCycles: cycles.length,
    recent: cycles.slice(0, RECENT_LIMIT),
  };
}
