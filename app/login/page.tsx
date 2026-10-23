import Link from "next/link";

import { LoginForm } from "@/components/auth/LoginForm";
import { loginWithCredentials, loginWithGitHub, loginWithGoogle } from "./actions";

export default function LoginPage() {
  const hasGoogle = Boolean(
    process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET,
  );
  const hasGitHub = Boolean(
    process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET,
  );

  return (
    <section className="flex flex-1 flex-col items-center justify-center gap-8 bg-zinc-50 px-6 py-20 dark:bg-zinc-950">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="bg-gradient-to-br from-red-600 to-orange-500 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent">
          Entrar
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Continue de onde parou nos seus ciclos.
        </p>
      </div>

      <LoginForm
        action={loginWithCredentials}
        onGoogle={hasGoogle ? loginWithGoogle : undefined}
        onGitHub={hasGitHub ? loginWithGitHub : undefined}
      />

      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Não tem conta?{" "}
        <Link href="/register" className="font-medium text-red-600 dark:text-red-400">
          Cadastre-se
        </Link>
      </p>
    </section>
  );
}
