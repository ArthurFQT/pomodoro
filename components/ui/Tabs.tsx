"use client";

import { useState, type ReactNode } from "react";

type TabItem = {
  id: string;
  label: string;
  content: ReactNode;
};

type TabsProps = {
  items: TabItem[];
};

export function Tabs({ items }: TabsProps) {
  const [active, setActive] = useState(items[0]?.id);

  return (
    <div className="flex flex-col gap-6">
      <div role="tablist" className="flex gap-1 border-b border-zinc-200 dark:border-zinc-800">
        {items.map((item) => {
          const isActive = item.id === active;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActive(item.id)}
              className={`-mb-px border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "border-[var(--accent-to)] text-zinc-900 dark:text-zinc-50"
                  : "border-transparent text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {items.map((item) => (
        <div key={item.id} role="tabpanel" hidden={item.id !== active}>
          {item.content}
        </div>
      ))}
    </div>
  );
}
