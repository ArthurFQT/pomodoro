import { DEFAULT_TIMEZONE, dateFromKey, dateKeyInTimeZone } from "./timezone";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

export type HeatmapDay = {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
};

/** Chave estável "YYYY-MM-DD" no fuso horário do usuário, usada para
 * agrupar ciclos por dia. */
export const toDateKey = dateKeyInTimeZone;

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
  timeZone: string = DEFAULT_TIMEZONE,
): HeatmapDay[][] {
  const today = dateFromKey(dateKeyInTimeZone(new Date(), timeZone));
  const endOfWeek = new Date(
    today.getTime() + (6 - today.getUTCDay()) * MS_PER_DAY,
  );
  const totalDays = weeks * 7;
  const start = new Date(endOfWeek.getTime() - (totalDays - 1) * MS_PER_DAY);

  const days: HeatmapDay[] = [];
  for (let i = 0; i < totalDays; i++) {
    const current = new Date(start.getTime() + i * MS_PER_DAY);
    const key = current.toISOString().slice(0, 10);
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
 * Streak atual: caminha para trás a partir de hoje (no fuso horário do
 * usuário). Se hoje ainda não tem ciclo registrado, começa a contagem a
 * partir de ontem — o streak só "quebra" quando o dia passa sem nenhum
 * ciclo.
 */
export function calculateStreak(
  activeDates: Set<string>,
  timeZone: string = DEFAULT_TIMEZONE,
  now: Date = new Date(),
): number {
  let cursor = dateFromKey(dateKeyInTimeZone(now, timeZone));

  if (!activeDates.has(cursor.toISOString().slice(0, 10))) {
    cursor = new Date(cursor.getTime() - MS_PER_DAY);
  }

  let streak = 0;
  while (activeDates.has(cursor.toISOString().slice(0, 10))) {
    streak += 1;
    cursor = new Date(cursor.getTime() - MS_PER_DAY);
  }

  return streak;
}
