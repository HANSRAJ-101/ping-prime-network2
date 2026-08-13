import { Panel } from "./Panel";
import type { NetworkInfo } from "@/lib/network-info.functions";

export function NetworkInfoCard({ info }: { info: NetworkInfo }) {
  const rows: Array<[string, string]> = [
    ["IP Address", info.ip ?? "Hidden"],
    ["ISP / Network", info.isp ?? "Unknown"],
    ["ASN", info.asn ?? "—"],
    [
      "Location",
      [info.city, info.region, info.country].filter(Boolean).join(", ") || "Unknown",
    ],
    ["Timezone", info.timezone ?? "—"],
  ];

  return (
    <Panel id="network" title="Network Info Dashboard" subtitle="Auto-detected connection identity">
      <dl className="grid gap-2 sm:grid-cols-2">
        {rows.map(([k, v]) => (
          <div key={k} className="rounded-lg border border-border/60 bg-secondary/30 px-3 py-2">
            <dt className="label-xs">{k}</dt>
            <dd className="truncate font-display text-base font-semibold">{v}</dd>
          </div>
        ))}
      </dl>
    </Panel>
  );
}
