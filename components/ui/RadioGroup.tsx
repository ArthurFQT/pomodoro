"use client";

type RadioOption = {
  value: string;
  label: string;
};

type RadioGroupProps = {
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: RadioOption[];
  disabled?: boolean;
};

export function RadioGroup({ name, value, onChange, options, disabled = false }: RadioGroupProps) {
  return (
    <div role="radiogroup" className="flex flex-wrap gap-2">
      {options.map((option) => {
        const isActive = option.value === value;

        return (
          <label
            key={option.value}
            className={`cursor-pointer rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              isActive
                ? "border-[var(--accent-to)] bg-zinc-100 text-zinc-900 dark:bg-zinc-900 dark:text-zinc-50"
                : "border-zinc-200 text-zinc-600 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-900"
            } ${disabled ? "opacity-60" : ""}`}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={isActive}
              disabled={disabled}
              onChange={() => onChange(option.value)}
              className="sr-only"
            />
            {option.label}
          </label>
        );
      })}
    </div>
  );
}
