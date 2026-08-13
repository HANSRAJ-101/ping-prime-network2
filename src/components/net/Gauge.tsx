type Props = {
  value: number;
  max?: number;
  label: string;
  unit: string;
  active?: boolean;
};

/** Radial speedometer drawn with SVG arcs. */
export function Gauge({ value, max = 200, label, unit, active }: Props) {
  const clamped = Math.max(0, Math.min(value, max));
  const pct = Math.pow(clamped / max, 0.6);
  const radius = 120;
  const circumference = Math.PI * radius * 1.5;
  const dash = circumference * pct;

  return (
    <div className="relative flex flex-col items-center">
      <svg viewBox="0 0 300 240" className="w-full max-w-[320px]">
        <defs>
          <linearGradient id="gaugeGrad" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--accent)" />
            <stop offset="100%" stopColor="var(--primary)" />
          </linearGradient>
        </defs>
        <path
          d="M 30 205 A 120 120 0 1 1 270 205"
          fill="none"
          stroke="var(--secondary)"
          strokeWidth="16"
          strokeLinecap="round"
        />
        <path
          d="M 30 205 A 120 120 0 1 1 270 205"
          fill="none"
          stroke="url(#gaugeGrad)"
          strokeWidth="16"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference}`}
          className="transition-[stroke-dasharray] duration-200 ease-out"
          style={{ filter: "drop-shadow(0 0 10px var(--primary))" }}
        />
        {Array.from({ length: 25 }).map((_, i) => {
          const angle = Math.PI - (i / 24) * Math.PI * 1.5;
          const inner = 96;
          const outer = i % 4 === 0 ? 82 : 90;
          const cx = 150;
          const cy = 205;
          const r = (n: number) => Math.round(n * 1000) / 1000;
          return (
            <line
              key={i}
              x1={r(cx + Math.cos(angle) * inner)}
              y1={r(cy - Math.sin(angle) * inner)}
              x2={r(cx + Math.cos(angle) * outer)}
              y2={r(cy - Math.sin(angle) * outer)}
              stroke="var(--border)"
              strokeWidth={i % 4 === 0 ? 3 : 1.5}
            />
          );
        })}
      </svg>
      <div className="absolute inset-x-0 bottom-8 flex flex-col items-center">
        <span
          className={`font-display text-5xl font-bold tabular-nums text-primary ${active ? "neon-text" : ""}`}
        >
          {value.toFixed(value >= 100 ? 0 : 1)}
        </span>
        <span className="label-xs mt-1">
          {unit} · {label}
        </span>
      </div>
    </div>
  );
}
