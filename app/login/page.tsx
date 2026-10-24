import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { LoginForm } from "@/components/auth/LoginForm";
import { loginWithCredentials, loginWithGitHub, loginWithGoogle } from "./actions";

// A sessão é lida por requisição (cookies) — não pode ser pré-renderizado.
export const instant = false;

export default async function LoginPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  const hasGoogle = Boolean(
    process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET,
  );
  const hasGitHub = Boolean(
    process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET,
  );

  return (
    <section
      data-theme="tomato"
      className="flex flex-1 flex-col items-center justify-center gap-12 bg-zinc-50 px-6 py-24 dark:bg-zinc-950"
    >
      <div className="flex flex-col items-center gap-3 text-center">
        <span className="text-xs font-semibold tracking-widest text-[var(--accent-to)] uppercase">
          Pomodoro
        </span>
        <h1 className="text-3xl font-semibold text-zinc-900 dark:text-zinc-50">
          Entrar
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Continue de onde parou nos seus ciclos.
        </p>
      </div>

      <LoginForm
        action={loginWithCredentials}
        onGoogle={hasGoogle ? loginWithGoogle : undefined}
        onGitHub={hasGitHub ? loginWithGitHub : undefined}
      />

      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        Não tem conta?{" "}
        <Link href="/register" className="font-medium text-[var(--accent-to)]">
          Cadastre-se
        </Link>
      </p>
    </section>
  );
}
