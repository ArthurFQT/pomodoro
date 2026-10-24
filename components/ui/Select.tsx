"use client";

import { useId } from "react";

type SelectOption = {
  value: string;
  label: string;
};

type SelectProps = {
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  label?: string;
};

export function Select({ name, value, onChange, options, label }: SelectProps) {
  const id = useId();

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm text-zinc-700 dark:text-zinc-300">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={id}
          name={name}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full appearance-none rounded-xl border border-zinc-200 bg-transparent px-3 py-2 pr-9 text-sm outline-none focus:border-[var(--accent-to)] dark:border-zinc-800 dark:bg-zinc-950"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-zinc-500"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path d="M6 8l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}
