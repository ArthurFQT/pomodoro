import { prisma } from "@/lib/prisma";
import { buildHeatmapWeeks, calculateStreak, toDateKey } from "@/lib/heatmap";
import { DEFAULT_TIMEZONE } from "@/lib/timezone";

const HEATMAP_WEEKS = 53;
const RECENT_LIMIT = 20;

export async function getCycleStats(userId: string, timeZone: string = DEFAULT_TIMEZONE) {
  const cycles = await prisma.cycle.findMany({
    where: { userId, type: "FOCUS" },
    orderBy: { completedAt: "desc" },
    select: { id: true, completedAt: true, durationMinutes: true },
  });

  const activity = new Map<string, number>();
  for (const cycle of cycles) {
    const key = toDateKey(cycle.completedAt, timeZone);
    activity.set(key, (activity.get(key) ?? 0) + 1);
  }

  const heatmapWeeks = buildHeatmapWeeks(activity, HEATMAP_WEEKS, timeZone);
  const streak = calculateStreak(new Set(activity.keys()), timeZone);

  return {
    heatmapWeeks,
    streak,
    totalFocusCycles: cycles.length,
    recent: cycles.slice(0, RECENT_LIMIT),
  };
}
