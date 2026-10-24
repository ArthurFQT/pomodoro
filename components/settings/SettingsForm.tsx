"use client";

import { useActionState } from "react";

import { updateSettings, type SettingsFormState } from "@/app/dashboard/actions";
import type { PomodoroSettings } from "@/lib/pomodoro";

type SettingsFormProps = {
  initialSettings: PomodoroSettings;
};

const inputClassName =
  "w-24 rounded-xl border border-zinc-200 bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--accent-to)] dark:border-zinc-800";

export function SettingsForm({ initialSettings }: SettingsFormProps) {
  const [state, formAction, isPending] = useActionState<
    SettingsFormState,
    FormData
  >(updateSettings, undefined);

  return (
    <form action={formAction} className="flex max-w-sm flex-col gap-6">
      <div className="flex flex-col gap-4">
        <label className="flex items-center justify-between gap-4">
          <span className="text-sm text-zinc-700 dark:text-zinc-300">
            Duração do foco (minutos)
          </span>
          <input
            name="focusMinutes"
            type="number"
            min={1}
            max={180}
            defaultValue={initialSettings.focusMinutes}
            required
            className={inputClassName}
          />
        </label>

        <label className="flex items-center justify-between gap-4">
          <span className="text-sm text-zinc-700 dark:text-zinc-300">
            Duração da pausa curta (minutos)
          </span>
          <input
            name="shortBreakMinutes"
            type="number"
            min={1}
            max={180}
            defaultValue={initialSettings.shortBreakMinutes}
            required
            className={inputClassName}
          />
        </label>

        <label className="flex items-center justify-between gap-4">
          <span className="text-sm text-zinc-700 dark:text-zinc-300">
            Duração da pausa longa (minutos)
          </span>
          <input
            name="longBreakMinutes"
            type="number"
            min={1}
            max={180}
            defaultValue={initialSettings.longBreakMinutes}
            required
            className={inputClassName}
          />
        </label>

        <label className="flex items-center justify-between gap-4">
          <span className="text-sm text-zinc-700 dark:text-zinc-300">
            Pausa longa a cada quantos focos
          </span>
          <input
            name="longBreakInterval"
            type="number"
            min={1}
            max={12}
            defaultValue={initialSettings.longBreakInterval}
            required
            className={inputClassName}
          />
        </label>
      </div>

      <div className="flex flex-col gap-3 border-t border-zinc-200 pt-4 dark:border-zinc-800">
        <label className="flex items-center justify-between gap-4">
          <span className="text-sm text-zinc-700 dark:text-zinc-300">
            Som ao concluir uma etapa
          </span>
          <input
            name="soundEnabled"
            type="checkbox"
            defaultChecked={initialSettings.soundEnabled}
            className="h-5 w-5 accent-[var(--accent-to)]"
          />
        </label>

        <label className="flex items-center justify-between gap-4">
          <span className="text-sm text-zinc-700 dark:text-zinc-300">
            Notificação do navegador
          </span>
          <input
            name="notificationsEnabled"
            type="checkbox"
            defaultChecked={initialSettings.notificationsEnabled}
            className="h-5 w-5 accent-[var(--accent-to)]"
          />
        </label>
      </div>

      {state && (
        <p
          className={`text-sm ${
            state.ok
              ? "text-green-600 dark:text-green-400"
              : "text-red-600 dark:text-red-400"
          }`}
        >
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="rounded-full bg-[var(--accent-to)] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--accent-from)] disabled:opacity-60"
      >
        {isPending ? "Salvando..." : "Salvar configurações"}
      </button>
    </form>
  );
}
