import Link from "next/link";

import { ProgressRing } from "@/components/timer/ProgressRing";

export function Hero() {
  return (
    <div className="grid items-center gap-12 py-16 md:grid-cols-2 md:py-24">
      <div className="flex flex-col items-center gap-6 text-center md:items-start md:text-left">
        <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 sm:text-5xl dark:text-zinc-50">
          Foco que vira{" "}
          <span className="bg-gradient-to-br from-[var(--accent-from)] to-[var(--accent-to)] bg-clip-text text-transparent">
            hábito
          </span>
        </h1>
        <p className="max-w-md text-lg text-zinc-600 dark:text-zinc-400">
          Ciclos de foco e pausa com a técnica Pomodoro, temas pra deixar a
          rotina mais leve, e um histórico que mostra sua evolução dia a dia.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/register"
            className="rounded-full bg-gradient-to-br from-[var(--accent-from)] to-[var(--accent-to)] px-6 py-3 text-center text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Criar conta grátis
          </Link>
          <Link
            href="/login"
            className="rounded-full border border-zinc-300 px-6 py-3 text-center text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
          >
            Já tenho conta
          </Link>
        </div>
      </div>

      <div className="flex justify-center">
        <ProgressRing progress={0.68} size={240}>
          <div className="flex flex-col items-center">
            <span className="text-xs font-semibold tracking-wide text-zinc-500 uppercase dark:text-zinc-400">
              Foco
            </span>
            <span className="text-4xl font-bold tabular-nums text-zinc-900 dark:text-zinc-50">
              18:42
            </span>
          </div>
        </ProgressRing>
      </div>
    </div>
  );
}
