import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Panel } from "./Panel";
import { PingRow } from "./PingRow";
import { pingEndpoint, pingTone } from "@/lib/net-measure";
import { DNS_SERVERS } from "@/lib/net-targets";

export function DnsBenchmark({ isp, location }: { isp?: string | null; location?: string | null }) {
  const [results, setResults] = useState<Record<string, number | null>>({});
  const [testing, setTesting] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);

  async function run() {
    setRunning(true);
    setDone(false);
    setResults({});
    for (const s of DNS_SERVERS) {
      setTesting(s.id);
      const ms = await pingEndpoint(s.url, 4, s.mode ?? "cors");
      setResults((prev) => ({ ...prev, [s.id]: ms }));
    }
    setTesting(null);
    setRunning(false);
    setDone(true);
  }

  const ranked = DNS_SERVERS.map((s) => ({ ...s, ms: results[s.id] ?? null })).sort((a, b) => {
    if (a.ms == null) return 1;
    if (b.ms == null) return -1;
    return a.ms - b.ms;
  });
  const winner = ranked.find((r) => r.ms != null);

  return (
    <Panel
      id="dns"
      title="Smart DNS Benchmark"
      subtitle={`Resolver latency from your network${isp ? ` · ${isp}` : ""}${location ? ` · ${location}` : ""}`}
      action={
        <Button variant="secondary" onClick={run} disabled={running} className="font-display">
          {running ? "Benchmarking…" : "Benchmark DNS"}
        </Button>
      }
    >
      {done && winner ? (
        <div className="mb-4 rounded-xl border border-primary/50 bg-primary/10 p-4">
          <p className="label-xs text-primary">Best DNS for your current network</p>
          <p className="font-display text-2xl font-bold text-primary neon-text">
            {winner.name} · {winner.ip}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Fastest resolver at{" "}
            <span className={pingTone(winner.ms) === "good" ? "text-good" : "text-warn"}>
              {winner.ms} ms
            </span>
            . Set it as your primary DNS for quicker matchmaking and faster page loads.
          </p>
        </div>
      ) : null}

      <ol className="grid gap-2 sm:grid-cols-2">
        {ranked.map((s, i) => (
          <li key={s.id} className="flex items-center gap-2">
            <span className="w-5 shrink-0 text-center font-display text-sm text-muted-foreground">
              {done ? i + 1 : "•"}
            </span>
            <div className="min-w-0 flex-1">
              <PingRow
                name={s.name}
                region={s.ip}
                ms={s.ms}
                testing={testing === s.id}
                badge={done && winner?.id === s.id ? "best" : undefined}
              />
            </div>
          </li>
        ))}
      </ol>
    </Panel>
  );
}
