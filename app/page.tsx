import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { Hero } from "@/components/landing/Hero";
import { FeatureCard } from "@/components/landing/FeatureCard";
import { HowItWorks } from "@/components/landing/HowItWorks";

// A sessão é lida por requisição (cookies) — não pode ser pré-renderizado.
export const instant = false;

const FEATURES = [
  {
    icon: "⏱️",
    title: "Timer com 5 temas",
    description:
      "Foco, pausa curta e pausa longa num visual que você escolhe — do tomate clássico ao oceano.",
  },
  {
    icon: "🔥",
    title: "Streak",
    description:
      "Acompanhe sua sequência de dias seguidos e mantenha o hábito vivo.",
  },
  {
    icon: "📅",
    title: "Heatmap de atividade",
    description:
      "Veja num calendário visual quais dias você mais focou, de relance.",
  },
  {
    icon: "🔐",
    title: "Sua conta, seus dados",
    description:
      "Login com Google, GitHub ou e-mail — seus ciclos ficam salvos com segurança.",
  },
] as const;

export default async function Home() {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div
      data-theme="tomato"
      className="flex flex-1 flex-col bg-[var(--background)]"
    >
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-6">
        <span className="text-lg font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
          🍅 Pomodoro
        </span>
        <nav className="flex items-center gap-4 text-sm font-medium">
          <Link
            href="/login"
            className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            Entrar
          </Link>
          <Link
            href="/register"
            className="rounded-full bg-gradient-to-br from-[var(--accent-from)] to-[var(--accent-to)] px-4 py-2 text-white transition-opacity hover:opacity-90"
          >
            Criar conta
          </Link>
        </nav>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-6">
        <Hero />

        <section className="grid gap-6 py-16 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </section>

        <HowItWorks />

        <section className="flex flex-col items-center gap-6 rounded-3xl bg-gradient-to-br from-[var(--accent-from)] to-[var(--accent-to)] px-6 py-16 text-center">
          <h2 className="text-3xl font-bold text-white">
            Comece seu primeiro ciclo hoje
          </h2>
          <Link
            href="/register"
            className="rounded-full bg-white px-8 py-3 text-sm font-semibold text-zinc-900 transition-opacity hover:opacity-90"
          >
            Comece agora
          </Link>
        </section>
      </main>

      <footer className="mx-auto flex w-full max-w-5xl flex-col items-center gap-2 px-6 py-10 text-center text-sm text-zinc-500 dark:text-zinc-500">
        <span>🍅 Pomodoro</span>
        <a
          href="https://github.com/ArthurFQT/pomodoro"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-zinc-700 dark:hover:text-zinc-300"
        >
          Código aberto no GitHub
        </a>
      </footer>
    </div>
  );
}
