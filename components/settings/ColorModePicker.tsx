"use client";

import { useTransition } from "react";

import { setColorMode } from "@/app/dashboard/actions";
import { COLOR_MODES, isValidColorMode, type ColorMode } from "@/lib/color-mode";
import { RadioGroup } from "@/components/ui/RadioGroup";

type ColorModePickerProps = {
  currentColorMode: ColorMode;
};

// O script anti-flash em app/layout.tsx aplica a classe "dark" em <html>
// com uma mutação direta no DOM (fora do React), pra evitar flash no modo
// Automático. Isso significa que o React nunca "viu" essa classe — então,
// ao trocar de modo aqui, não dá pra confiar só no server re-renderizar o
// layout raiz (o diff do React compara contra o className que ELE mesmo
// gerou da última vez, não contra o DOM real, e não percebe mudança nenhuma
// quando os dois modos mapeiam pro mesmo className vazio). Por isso a troca
// também mexe direto no classList, igual o script inicial faz.
function applyColorModeClass(mode: ColorMode) {
  const root = document.documentElement;
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const isDark = mode === "dark" || mode === "oled" || (mode === "system" && prefersDark);

  root.classList.toggle("dark", isDark);
  root.classList.toggle("oled", mode === "oled");
  root.setAttribute("data-color-mode", mode);
}

export function ColorModePicker({ currentColorMode }: ColorModePickerProps) {
  const [isPending, startTransition] = useTransition();

  function handleChange(value: string) {
    if (!isValidColorMode(value)) return;
    applyColorModeClass(value);
    startTransition(() => setColorMode(value));
  }

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">
        Modo de cor
      </h2>

      <RadioGroup
        name="colorMode"
        value={currentColorMode}
        disabled={isPending}
        onChange={handleChange}
        options={COLOR_MODES.map((mode) => ({ value: mode.id, label: mode.label }))}
      />
    </div>
  );
}
