"use client";

import { useActionState } from "react";

import { updateSettings, type SettingsFormState } from "@/app/dashboard/actions";
import { Slider } from "@/components/ui/Slider";
import { Switch } from "@/components/ui/Switch";
import type { PomodoroSettings } from "@/lib/pomodoro";

type GeneralTabProps = {
  initialSettings: PomodoroSettings;
};

export function GeneralTab({ initialSettings }: GeneralTabProps) {
  const [state, formAction, isPending] = useActionState<
    SettingsFormState,
    FormData
  >(updateSettings, undefined);

  return (
    <form action={formAction} className="flex max-w-sm flex-col gap-6">
      <div className="flex flex-col gap-5">
        <Slider
          name="focusMinutes"
          label="Duração do foco"
          min={1}
          max={180}
          defaultValue={initialSettings.focusMinutes}
        />
        <Slider
          name="shortBreakMinutes"
          label="Duração da pausa curta"
          min={1}
          max={180}
          defaultValue={initialSettings.shortBreakMinutes}
        />
        <Slider
          name="longBreakMinutes"
          label="Duração da pausa longa"
          min={1}
          max={180}
          defaultValue={initialSettings.longBreakMinutes}
        />
        <Slider
          name="longBreakInterval"
          label="Pausa longa a cada quantos focos"
          min={1}
          max={12}
          unit="focos"
          defaultValue={initialSettings.longBreakInterval}
        />
      </div>

      <div className="flex flex-col gap-4 border-t border-zinc-200 pt-5 dark:border-zinc-800">
        <Switch
          name="soundEnabled"
          label="Som ao concluir uma etapa"
          defaultChecked={initialSettings.soundEnabled}
        />
        <Switch
          name="notificationsEnabled"
          label="Notificação do navegador"
          defaultChecked={initialSettings.notificationsEnabled}
        />
        <Switch
          name="autoStartBreaks"
          label="Auto-iniciar pausas"
          description="A pausa começa sozinha quando um foco termina"
          defaultChecked={initialSettings.autoStartBreaks}
        />
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
