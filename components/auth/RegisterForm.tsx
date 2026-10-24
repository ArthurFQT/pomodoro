"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition, type FormEvent } from "react";

export function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          password: formData.get("password"),
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        setError(
          typeof data?.error === "string"
            ? data.error
            : "Verifique os dados informados.",
        );
        return;
      }

      router.push("/login?registered=1");
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-sm flex-col gap-5">
      <input
        name="name"
        type="text"
        required
        placeholder="Nome"
        className="rounded-xl border border-zinc-200 bg-transparent px-4 py-2.5 text-sm outline-none transition-colors focus:border-[var(--accent-to)] dark:border-zinc-800"
      />
      <input
        name="email"
        type="email"
        required
        placeholder="E-mail"
        className="rounded-xl border border-zinc-200 bg-transparent px-4 py-2.5 text-sm outline-none transition-colors focus:border-[var(--accent-to)] dark:border-zinc-800"
      />
      <input
        name="password"
        type="password"
        required
        minLength={8}
        placeholder="Senha (mínimo 8 caracteres)"
        className="rounded-xl border border-zinc-200 bg-transparent px-4 py-2.5 text-sm outline-none transition-colors focus:border-[var(--accent-to)] dark:border-zinc-800"
      />

      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="rounded-full bg-[var(--accent-to)] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--accent-from)] disabled:opacity-60"
      >
        {isPending ? "Criando conta..." : "Criar conta"}
      </button>
    </form>
  );
}
