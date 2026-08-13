import { pingTone } from "@/lib/net-measure";

const toneClass = {
  good: "text-good",
  warn: "text-warn",
  bad: "text-bad",
  dead: "text-muted-foreground",
} as const;

const barClass = {
  good: "bg-good",
  warn: "bg-warn",
  bad: "bg-bad",
  dead: "bg-muted",
} as const;

export function PingRow({
  name,
  region,
  ms,
  testing,
  badge,
}: {
  name: string;
  region: string;
  ms: number | null | undefined;
  testing?: boolean | undefined;
  badge?: string | undefined;
}) {
  const tone = pingTone(ms ?? null);
  const width = ms == null ? 0 : Math.min(100, (ms / 300) * 100);

  return (
    <div className="flex items-center gap-3 rounded-lg border border-border/60 bg-secondary/30 px-3 py-2.5">
      <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${barClass[tone]} shadow-[0_0_10px_currentColor]`} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-semibold">{name}</p>
          {badge ? (
            <span className="rounded border border-primary/50 px-1.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider text-primary">
              {badge}
            </span>
          ) : null}
        </div>
        <p className="truncate text-xs text-muted-foreground">{region}</p>
        <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-muted">
          <div
            className={`h-full rounded-full transition-all duration-500 ${barClass[tone]}`}
            style={{ width: `${width}%` }}
          />
        </div>
      </div>
      <div className="w-20 text-right">
        {testing ? (
          <span className="text-xs text-muted-foreground">testing…</span>
        ) : ms == null ? (
          <span className="text-xs text-muted-foreground">—</span>
        ) : (
          <span className={`font-display text-lg font-bold tabular-nums ${toneClass[tone]}`}>
            {ms}
            <span className="ml-0.5 text-xs">ms</span>
          </span>
        )}
      </div>
    </div>
  );
}
