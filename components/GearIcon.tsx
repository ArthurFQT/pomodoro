export function GearIcon({ className }: { className?: string }) {
  const teeth = Array.from({ length: 10 });

  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <g fill="currentColor">
        {teeth.map((_, i) => (
          <rect
            key={i}
            x="46"
            y="2"
            width="8"
            height="18"
            rx="2"
            transform={`rotate(${(360 / teeth.length) * i} 50 50)`}
          />
        ))}
        <circle cx="50" cy="50" r="32" />
      </g>
      <circle cx="50" cy="50" r="13" className="fill-zinc-50 dark:fill-zinc-950" />
    </svg>
  );
}
