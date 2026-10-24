"use client";

import { useId, useState } from "react";

type SwitchProps = {
  name: string;
  defaultChecked?: boolean;
  label: string;
  description?: string;
};

export function Switch({ name, defaultChecked = false, label, description }: SwitchProps) {
  const [checked, setChecked] = useState(defaultChecked);
  const id = useId();

  return (
    <label htmlFor={id} className="flex items-center justify-between gap-4 cursor-pointer">
      <span className="flex flex-col gap-0.5">
        <span className="text-sm text-zinc-700 dark:text-zinc-300">{label}</span>
        {description && (
          <span className="text-xs text-zinc-500 dark:text-zinc-500">{description}</span>
        )}
      </span>

      <span
        className="relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors"
        style={{
          backgroundColor: checked ? "var(--accent-to)" : "var(--switch-off)",
        }}
      >
        <input
          id={id}
          name={name}
          type="checkbox"
          checked={checked}
          onChange={(event) => setChecked(event.target.checked)}
          className="peer sr-only"
        />
        <span
          aria-hidden="true"
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </span>
    </label>
  );
}
