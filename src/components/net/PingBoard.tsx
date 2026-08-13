import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Panel } from "./Panel";
import { PingRow } from "./PingRow";
import { pingEndpoint } from "@/lib/net-measure";
import type { Target } from "@/lib/net-targets";

export function PingBoard({
  id,
  title,
  subtitle,
  targets,
}: {
  id: string;
  title: string;
  subtitle: string;
  targets: Target[];
}) {
  const [results, setResults] = useState<Record<string, number | null>>({});
  const [testing, setTesting] = useState<string | null>(null);
  const [running, setRunning] = useState(false);

  async function run() {
    setRunning(true);
    setResults({});
    for (const t of targets) {
      setTesting(t.id);
      const ms = await pingEndpoint(t.url, 3, t.mode ?? "no-cors");
      setResults((prev) => ({ ...prev, [t.id]: ms }));
    }
    setTesting(null);
    setRunning(false);
  }

  const best = Object.entries(results)
    .filter(([, v]) => v != null)
    .sort((a, b) => (a[1] as number) - (b[1] as number))[0]?.[0];

  return (
    <Panel
      id={id}
      title={title}
      subtitle={subtitle}
      action={
        <Button variant="secondary" onClick={run} disabled={running} className="font-display">
          {running ? "Pinging…" : "Run Ping Test"}
        </Button>
      }
    >
      <div className="grid gap-2 sm:grid-cols-2">
        {targets.map((t) => (
          <PingRow
            key={t.id}
            name={t.name}
            region={t.region}
            ms={results[t.id]}
            testing={testing === t.id}
            badge={best === t.id ? "fastest" : undefined}
          />
        ))}
      </div>
    </Panel>
  );
}
