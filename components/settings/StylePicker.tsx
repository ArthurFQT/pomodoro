"use client";

import { useTransition } from "react";

import { setStyle } from "@/app/dashboard/actions";
import { STYLES, getStyleColors, type StyleId } from "@/lib/styles";
import { StyleFace } from "@/components/timer/StyleFace";

type StylePickerProps = {
  currentStyle: StyleId;
};

const PREVIEW_SIZE = 96;

export function StylePicker({ currentStyle }: StylePickerProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">
        Estilo
      </h2>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {STYLES.map((style) => {
          const isActive = currentStyle === style.id;
          const preview = getStyleColors(style.id, "FOCUS");

          return (
            <button
              key={style.id}
              type="button"
              disabled={isPending}
              onClick={() => startTransition(() => setStyle(style.id))}
              style={{ "--accent-from": preview.from, "--accent-to": preview.to } as React.CSSProperties}
              className={`flex flex-col items-center gap-2 rounded-2xl border p-4 transition-colors disabled:opacity-60 ${
                isActive
                  ? "border-[var(--accent-to)] bg-zinc-100 dark:bg-zinc-900"
                  : "border-zinc-200 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
              }`}
            >
              <StyleFace styleId={style.id} progress={0.55} size={PREVIEW_SIZE}>
                <span className="text-[13px] font-bold tabular-nums">25:00</span>
              </StyleFace>

              <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                {style.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
