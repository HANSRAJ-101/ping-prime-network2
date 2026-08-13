import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Gauge } from "./Gauge";
import { Panel } from "./Panel";
import { measureDownload, measureLatency, measureUpload, pingTone } from "@/lib/net-measure";

type Phase = "idle" | "latency" | "download" | "upload" | "done";

const toneClass = { good: "text-good", warn: "text-warn", bad: "text-bad", dead: "text-muted-foreground" } as const;

export function SpeedTest() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [live, setLive] = useState(0);
  const [progress, setProgress] = useState(0);
  const [down, setDown] = useState<number | null>(null);
  const [up, setUp] = useState<number | null>(null);
  const [peak, setPeak] = useState<number | null>(null);
  const [ping, setPing] = useState<number | null>(null);
  const [jitter, setJitter] = useState<number | null>(null);

  const running = phase !== "idle" && phase !== "done";

  async function run() {
    setPhase("latency");
    setDown(null);
    setUp(null);
    setPeak(null);
    setLive(0);
    setProgress(0);

    const lat = await measureLatency(12);
    setPing(lat.ping);
    setJitter(lat.jitter);

    setPhase("download");
    const dl = await measureDownload(50_000_000, 9000, (p) => {
      setLive(p.mbps);
      setPeak(p.peak);
      setProgress(p.progress * 0.7);
    });
    setDown(dl.mbps);
    setPeak(dl.peak);

    setPhase("upload");
    setLive(0);
    const ul = await measureUpload(10_000_000, (p) => {
      setLive(p.mbps);
      setProgress(0.7 + p.progress * 0.3);
    });
    setUp(ul);
    setProgress(1);
    setPhase("done");
  }

  const gaugeValue = phase === "download" || phase === "upload" ? live : (down ?? 0);
  const gaugeMax = Math.max(100, Math.ceil(((peak ?? down ?? 100) * 1.4) / 50) * 50);

  return (
    <Panel
      id="speed"
      title="Advanced Speed Test"
      subtitle="Streaming measurement against the nearest Cloudflare edge"
      action={
        <Button onClick={run} disabled={running} size="lg" className="font-display tracking-wide">
          {running ? "Testing…" : phase === "done" ? "Retest" : "Start Test"}
        </Button>
      }
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center">
        <Gauge
          value={gaugeValue}
          max={gaugeMax}
          unit="Mbps"
          active={running}
          label={
            phase === "latency"
              ? "measuring ping"
              : phase === "upload"
                ? "upload"
                : phase === "download"
                  ? "download"
                  : "download"
          }
        />

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <Metric label="Download" value={down} unit="Mbps" />
            <Metric label="Upload" value={up} unit="Mbps" />
            <Metric label="Peak Speed" value={peak} unit="Mbps" />
            <Metric
              label="Ping"
              value={ping}
              unit="ms"
              className={ping == null ? "" : toneClass[pingTone(ping)]}
            />
            <Metric
              label="Jitter"
              value={jitter}
              unit="ms"
              className={jitter == null ? "" : toneClass[pingTone(jitter * 6)]}
            />
            <Metric
              label="Gaming Grade"
              text={
                ping == null
                  ? "—"
                  : ping < 40 && (jitter ?? 0) < 8
                    ? "ELITE"
                    : ping < 80
                      ? "GOOD"
                      : ping < 140
                        ? "PLAYABLE"
                        : "LAGGY"
              }
            />
          </div>

          <div>
            <div className="mb-1.5 flex justify-between label-xs">
              <span>{running ? phase : phase === "done" ? "complete" : "ready"}</span>
              <span>{Math.round(progress * 100)}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-gradient-to-r from-accent to-primary transition-all duration-300"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </Panel>
  );
}

function Metric({
  label,
  value,
  unit,
  text,
  className = "",
}: {
  label: string;
  value?: number | null;
  unit?: string;
  text?: string;
  className?: string;
}) {
  return (
    <div className="rounded-lg border border-border/60 bg-secondary/30 px-3 py-2">
      <p className="label-xs">{label}</p>
      <p className={`font-display text-xl font-bold tabular-nums ${className || "text-foreground"}`}>
        {text ?? (value == null ? "—" : value)}
        {unit && value != null ? <span className="ml-1 text-xs font-normal">{unit}</span> : null}
      </p>
    </div>
  );
}
