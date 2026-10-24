"use client";

import { useTransition } from "react";

import { setTheme } from "@/app/dashboard/actions";
import { THEMES, type ThemeId } from "@/lib/themes";
import { TimerFace } from "@/components/timer/TimerFace";

type ThemePickerProps = {
  currentTheme: ThemeId;
};

const PREVIEW_SIZE = 96;

export function ThemePicker({ currentTheme }: ThemePickerProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">
        Tema
      </h2>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {THEMES.map((theme) => {
          const isActive = currentTheme === theme.id;

          return (
            <button
              key={theme.id}
              type="button"
              disabled={isPending}
              onClick={() => startTransition(() => setTheme(theme.id))}
              data-theme={theme.id}
              className={`flex flex-col items-center gap-2 rounded-2xl border p-4 transition-colors disabled:opacity-60 ${
                isActive
                  ? "border-[var(--accent-to)] bg-zinc-100 dark:bg-zinc-900"
                  : "border-zinc-200 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
              }`}
            >
              <TimerFace themeId={theme.id} progress={0.55} size={PREVIEW_SIZE}>
                <span className="text-[13px] font-bold tabular-nums text-zinc-900 dark:text-zinc-50">
                  25:00
                </span>
              </TimerFace>

              <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                {theme.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
