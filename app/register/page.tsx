import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { RegisterForm } from "@/components/auth/RegisterForm";

// A sessão é lida por requisição (cookies) — não pode ser pré-renderizado.
export const instant = false;

export default async function RegisterPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <section className="flex flex-1 flex-col items-center justify-center gap-8 bg-zinc-50 px-6 py-20 dark:bg-zinc-950">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="bg-gradient-to-br from-red-600 to-orange-500 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent">
          Criar conta
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Comece a acompanhar seus ciclos Pomodoro.
        </p>
      </div>

      <RegisterForm />

      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Já tem conta?{" "}
        <Link href="/login" className="font-medium text-red-600 dark:text-red-400">
          Entrar
        </Link>
      </p>
    </section>
  );
}
