export function TomatoBuilder() {
  return (
    <svg viewBox="0 0 220 220" className="h-full w-full" aria-hidden="true">
      <defs>
        <linearGradient id="tomato-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f87171" />
          <stop offset="100%" stopColor="#dc2626" />
        </linearGradient>
      </defs>

      <circle cx="40" cy="190" r="4" className="fill-amber-400/60 animate-rise-fade" />
      <circle
        cx="55"
        cy="195"
        r="3"
        className="fill-amber-400/50 animate-rise-fade"
        style={{ animationDelay: "600ms" }}
      />
      <circle
        cx="48"
        cy="198"
        r="2.5"
        className="fill-amber-400/40 animate-rise-fade"
        style={{ animationDelay: "1200ms" }}
      />

      <g className="fill-orange-700/80">
        <rect x="16" y="178" width="24" height="12" rx="1.5" className="animate-brick-pop" />
        <rect
          x="16"
          y="164"
          width="24"
          height="12"
          rx="1.5"
          className="animate-brick-pop"
          style={{ animationDelay: "500ms" }}
        />
        <rect
          x="16"
          y="150"
          width="24"
          height="12"
          rx="1.5"
          className="animate-brick-pop"
          style={{ animationDelay: "1000ms" }}
        />
      </g>

      <ellipse cx="110" cy="128" rx="68" ry="60" fill="url(#tomato-body)" />
      <ellipse cx="88" cy="104" rx="16" ry="10" className="fill-white/25" />

      <path d="M90 74c-9-18-5-30 9-34 2 14-3 26-9 34z" className="fill-green-600" />
      <path d="M130 74c9-18 5-30-9-34-2 14 3 26 9 34z" className="fill-green-600" />
      <path d="M110 72c0-20 8-30 22-28-4 14-12 24-22 28z" className="fill-green-500" />

      <path d="M66 78c0-26 20-42 44-42s44 16 44 42z" className="fill-amber-400" />
      <rect x="58" y="76" width="104" height="12" rx="6" className="fill-amber-500" />
      <rect x="104" y="42" width="12" height="10" rx="2" className="fill-amber-500" />

      <circle cx="90" cy="136" r="6" className="fill-zinc-900" />
      <circle cx="130" cy="136" r="6" className="fill-zinc-900" />
      <path
        d="M92 158c8 8 28 8 36 0"
        stroke="#7f1d1d"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="78" cy="150" r="7" className="fill-red-300/50" />
      <circle cx="142" cy="150" r="7" className="fill-red-300/50" />

      <g transform="translate(168 142) rotate(20)">
        <g className="animate-swing">
          <rect x="-6" y="-26" width="12" height="40" rx="4" className="fill-zinc-400" />
          <circle cx="0" cy="-28" r="10" className="fill-zinc-400" />
          <circle cx="0" cy="-28" r="4" className="fill-zinc-50 dark:fill-zinc-950" />
        </g>
      </g>
    </svg>
  );
}
