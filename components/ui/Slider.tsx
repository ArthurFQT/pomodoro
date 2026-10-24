"use client";

import { useId, useState } from "react";

type SliderProps = {
  name: string;
  label: string;
  min: number;
  max: number;
  defaultValue: number;
  unit?: string;
};

export function Slider({ name, label, min, max, defaultValue, unit = "min" }: SliderProps) {
  const [value, setValue] = useState(defaultValue);
  const id = useId();
  const fillPercent = ((value - min) / (max - min)) * 100;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-4">
        <label htmlFor={id} className="text-sm text-zinc-700 dark:text-zinc-300">
          {label}
        </label>
        <span className="text-sm font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">
          {value} {unit}
        </span>
      </div>
      <input
        id={id}
        name={name}
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(event) => setValue(Number(event.target.value))}
        className="slider-input"
        style={{ "--slider-fill": `${fillPercent}%` } as React.CSSProperties}
      />
    </div>
  );
}
