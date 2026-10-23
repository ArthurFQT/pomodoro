const MS_PER_DAY = 24 * 60 * 60 * 1000;

export type HeatmapDay = {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
};

function startOfUTCDate(date: Date): Date {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  );
}

/** Chave estável "YYYY-MM-DD" em UTC, usada para agrupar ciclos por dia. */
export function toDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** Nível de intensidade (0-4) a partir da contagem de ciclos do dia. */
export function activityLevel(count: number): HeatmapDay["level"] {
  if (count <= 0) return 0;
  if (count <= 2) return 1;
  if (count <= 4) return 2;
  if (count <= 6) return 3;
  return 4;
}

/**
 * Últimas `weeks` semanas (domingo-sábado) terminando na semana atual, já
 * preenchidas com 0 nos dias sem ciclo. Cada array interno tem 7 dias.
 */
export function buildHeatmapWeeks(
  activity: Map<string, number>,
  weeks: number,
): HeatmapDay[][] {
  const today = startOfUTCDate(new Date());
  const endOfWeek = new Date(
    today.getTime() + (6 - today.getUTCDay()) * MS_PER_DAY,
  );
  const totalDays = weeks * 7;
  const start = new Date(endOfWeek.getTime() - (totalDays - 1) * MS_PER_DAY);

  const days: HeatmapDay[] = [];
  for (let i = 0; i < totalDays; i++) {
    const current = new Date(start.getTime() + i * MS_PER_DAY);
    const key = toDateKey(current);
    const count = activity.get(key) ?? 0;
    days.push({ date: key, count, level: activityLevel(count) });
  }

  const weeksOut: HeatmapDay[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeksOut.push(days.slice(i, i + 7));
  }
  return weeksOut;
}

/**
 * Streak atual: caminha para trás a partir de hoje. Se hoje ainda não tem
 * ciclo registrado, começa a contagem a partir de ontem — o streak só
 * "quebra" quando o dia passa sem nenhum ciclo.
 */
export function calculateStreak(
  activeDates: Set<string>,
  today: Date = new Date(),
): number {
  let cursor = startOfUTCDate(today);

  if (!activeDates.has(toDateKey(cursor))) {
    cursor = new Date(cursor.getTime() - MS_PER_DAY);
  }

  let streak = 0;
  while (activeDates.has(toDateKey(cursor))) {
    streak += 1;
    cursor = new Date(cursor.getTime() - MS_PER_DAY);
  }

  return streak;
}
