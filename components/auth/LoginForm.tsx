"use client";

import { useActionState } from "react";

type LoginFormProps = {
  action: (
    state: string | undefined,
    formData: FormData,
  ) => Promise<string | undefined>;
  onGoogle?: () => Promise<void>;
  onGitHub?: () => Promise<void>;
};

export function LoginForm({ action, onGoogle, onGitHub }: LoginFormProps) {
  const [error, formAction, isPending] = useActionState(action, undefined);

  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      {(onGoogle || onGitHub) && (
        <div className="flex flex-col gap-3">
          {onGoogle && (
            <form action={onGoogle}>
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-full border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-800 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-900"
              >
                Continuar com Google
              </button>
            </form>
          )}
          {onGitHub && (
            <form action={onGitHub}>
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-full border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-800 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-900"
              >
                Continuar com GitHub
              </button>
            </form>
          )}

          <div className="flex items-center gap-3 text-xs text-zinc-400">
            <span className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
            ou
            <span className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
          </div>
        </div>
      )}

      <form action={formAction} className="flex flex-col gap-4">
        <input
          name="email"
          type="email"
          required
          placeholder="E-mail"
          className="rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-red-500 dark:border-zinc-700 dark:bg-zinc-900"
        />
        <input
          name="password"
          type="password"
          required
          placeholder="Senha"
          className="rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-red-500 dark:border-zinc-700 dark:bg-zinc-900"
        />

        {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={isPending}
          className="rounded-full bg-gradient-to-br from-red-600 to-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {isPending ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}
