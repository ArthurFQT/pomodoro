export type BrainDumpEntry = {
  id: string;
  text: string;
  createdAt: number;
};

function storageKey(userId: string) {
  return `pomodoro:brain-dump:${userId}`;
}

/** Lê as anotações do "brain dump" deste usuário (escopado por userId).
 * Só funciona no client — pensado pra anotar distrações rápidas durante um
 * foco sem sair do timer, sem a cerimônia de ir até o banco de dados. */
export function loadBrainDumpEntries(userId: string): BrainDumpEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(storageKey(userId));
    if (!raw) return [];
    return JSON.parse(raw) as BrainDumpEntry[];
  } catch {
    return [];
  }
}

function saveBrainDumpEntries(userId: string, entries: BrainDumpEntry[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(storageKey(userId), JSON.stringify(entries));
  } catch {
    // localStorage indisponível (modo privado, quota cheia) — segue sem persistir.
  }
}

export function addBrainDumpEntry(userId: string, text: string): BrainDumpEntry[] {
  const trimmed = text.trim();
  if (!trimmed) return loadBrainDumpEntries(userId);

  const entry: BrainDumpEntry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    text: trimmed,
    createdAt: Date.now(),
  };

  const entries = [entry, ...loadBrainDumpEntries(userId)];
  saveBrainDumpEntries(userId, entries);
  return entries;
}

export function removeBrainDumpEntry(userId: string, id: string): BrainDumpEntry[] {
  const entries = loadBrainDumpEntries(userId).filter((entry) => entry.id !== id);
  saveBrainDumpEntries(userId, entries);
  return entries;
}

export function clearBrainDumpEntries(userId: string) {
  saveBrainDumpEntries(userId, []);
}
