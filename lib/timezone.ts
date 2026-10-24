export const DEFAULT_TIMEZONE = "UTC";
export const TIMEZONE_COOKIE = "tz";

/** Valida um identificador IANA de fuso horário (ex: "America/Sao_Paulo")
 * — usado para sanitizar o valor lido do cookie antes de confiar nele. */
export function isValidTimeZone(timeZone: string): boolean {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone });
    return true;
  } catch {
    return false;
  }
}

/** Lê o fuso horário do cookie, validando-o — cai pra UTC se ausente ou
 * inválido (cookie corrompido ou alterado manualmente). */
export function resolveTimeZone(cookieValue: string | undefined): string {
  if (cookieValue && isValidTimeZone(cookieValue)) {
    return cookieValue;
  }
  return DEFAULT_TIMEZONE;
}

/**
 * Chave "YYYY-MM-DD" do dia civil que `date` representa no fuso horário
 * `timeZone` — não confundir com o dia em UTC, que pode ser diferente perto
 * da virada da meia-noite local.
 */
export function dateKeyInTimeZone(date: Date, timeZone: string): string {
  try {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(date);
  } catch {
    // Fuso horário inválido/desconhecido (cookie corrompido, por exemplo) —
    // cai pra UTC.
    return date.toISOString().slice(0, 10);
  }
}

/**
 * Converte uma chave "YYYY-MM-DD" de volta pra um Date à meia-noite UTC —
 * seguro pra aritmética de calendário (±1 dia em milissegundos), já que a
 * partir da chave estamos manipulando o dia civil, não mais um instante
 * real que precise respeitar fuso/horário de verão.
 */
export function dateFromKey(key: string): Date {
  return new Date(`${key}T00:00:00Z`);
}
