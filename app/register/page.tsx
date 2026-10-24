import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { BRAND_ACCENT } from "@/lib/styles";
import { RegisterForm } from "@/components/auth/RegisterForm";

// A sessão é lida por requisição (cookies) — não pode ser pré-renderizado.
export const instant = false;

export default async function RegisterPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <section
      style={
        {
          "--accent-from": BRAND_ACCENT.from,
          "--accent-to": BRAND_ACCENT.to,
        } as React.CSSProperties
      }
      className="flex flex-1 flex-col items-center justify-center gap-12 bg-[var(--background)] px-6 py-24"
    >
      <div className="flex flex-col items-center gap-3 text-center">
        <span className="text-xs font-semibold tracking-widest text-[var(--accent-to)] uppercase">
          Pomodoro
        </span>
        <h1 className="text-3xl font-semibold text-zinc-900 dark:text-zinc-50">
          Criar conta
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Comece a acompanhar seus ciclos Pomodoro.
        </p>
      </div>

      <RegisterForm />

      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        Já tem conta?{" "}
        <Link href="/login" className="font-medium text-[var(--accent-to)]">
          Entrar
        </Link>
      </p>
    </section>
  );
}
