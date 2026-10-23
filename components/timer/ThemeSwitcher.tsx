"use client";

import { useTransition } from "react";

import { setTheme } from "@/app/dashboard/actions";
import { THEMES, type ThemeId } from "@/lib/themes";

type ThemeSwitcherProps = {
  current: ThemeId;
};

export function ThemeSwitcher({ current }: ThemeSwitcherProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-2">
      {THEMES.map((theme) => (
        <button
          key={theme.id}
          type="button"
          aria-label={`Tema ${theme.label}`}
          title={theme.label}
          disabled={isPending}
          onClick={() => startTransition(() => setTheme(theme.id))}
          className={`h-6 w-6 rounded-full bg-gradient-to-br transition-transform hover:scale-110 disabled:opacity-60 ${
            current === theme.id
              ? "ring-2 ring-zinc-900 ring-offset-2 ring-offset-zinc-50 dark:ring-zinc-100 dark:ring-offset-zinc-950"
              : ""
          }`}
          style={{
            backgroundImage: `linear-gradient(to bottom right, ${theme.from}, ${theme.to})`,
          }}
        />
      ))}
    </div>
  );
}
