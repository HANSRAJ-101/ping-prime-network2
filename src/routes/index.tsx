import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { SpeedTest } from "@/components/net/SpeedTest";
import { PingBoard } from "@/components/net/PingBoard";
import { DnsBenchmark } from "@/components/net/DnsBenchmark";
import { NetworkInfoCard } from "@/components/net/NetworkInfoCard";
import { GAME_TARGETS, SERVICE_TARGETS } from "@/lib/net-targets";
import { getNetworkInfo, type NetworkInfo } from "@/lib/network-info.functions";

const EMPTY: NetworkInfo = {
  ip: null,
  isp: null,
  city: null,
  region: null,
  country: null,
  timezone: null,
  asn: null,
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PingForge — Network Speed & Gaming Ping Optimizer" },
      {
        name: "description",
        content:
          "Test download, upload, ping and jitter, analyze game server latency for Blood Strike, Free Fire, Palworld, Valorant and CS2, and benchmark the fastest DNS for your network.",
      },
      { property: "og:title", content: "PingForge — Network Speed & Gaming Ping Optimizer" },
      {
        property: "og:description",
        content:
          "Speedometer speed test, game server ping analyzer, service latency checks and smart DNS benchmark in one dark-themed gaming dashboard.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function Home() {
  const fetchInfo = useServerFn(getNetworkInfo);
  const { data: info = EMPTY } = useQuery({
    queryKey: ["network-info"],
    queryFn: () => fetchInfo({}),
    staleTime: 5 * 60 * 1000,
  });

  const location = [info.city, info.country].filter(Boolean).join(", ") || null;

  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-20 pt-10 sm:px-6">
      <header className="mb-10">
        <p className="label-xs text-primary">Network Utility Suite</p>
        <h1 className="font-display text-4xl font-black tracking-tight sm:text-5xl">
          Ping<span className="text-primary neon-text">Forge</span>
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Measure real bandwidth, hunt down latency and jitter, compare game server routes, and
          find the fastest DNS resolver for your connection — built for competitive play.
        </p>
        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          {[
            ["#speed", "Speed Test"],
            ["#games", "Game Ping"],
            ["#services", "Service Ping"],
            ["#dns", "DNS Benchmark"],
            ["#network", "My Network"],
          ].map(([href, label]) => (
            <a
              key={href}
              href={href}
              className="rounded-full border border-border bg-secondary/40 px-3 py-1.5 font-semibold uppercase tracking-wider text-muted-foreground transition-colors hover:border-primary/60 hover:text-primary"
            >
              {label}
            </a>
          ))}
        </div>
      </header>

      <div className="space-y-6">
        <SpeedTest />
        <PingBoard
          id="games"
          title="Game Server Ping Analyzer"
          subtitle="Expected latency to publisher edges and matchmaking regions"
          targets={GAME_TARGETS}
        />
        <div className="grid gap-6 xl:grid-cols-2">
          <PingBoard
            id="services"
            title="Website & Service Ping"
            subtitle="Streaming, voice and cloud region latency"
            targets={SERVICE_TARGETS}
          />
          <NetworkInfoCard info={info} />
        </div>
        <DnsBenchmark isp={info.isp} location={location} />
      </div>

      <footer className="mt-12 space-y-3 text-center text-xs text-muted-foreground">
        <p className="flex flex-wrap items-center justify-center gap-4">
          <a
            href="mailto:hnsrjsih4@gmail.com"
            className="inline-flex items-center gap-1.5 transition-colors hover:text-primary"
          >
            <span aria-hidden="true">✉</span>
            hnsrjsih4@gmail.com
          </a>
          <a
            href="upi://pay?pa=hindianimeworld@upi&pn=Hansraj%20YT%20Gamer&cu=INR"
            className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-3 py-1.5 font-semibold text-primary transition-colors hover:bg-primary/20"
          >
            <span aria-hidden="true">❤</span>
            Donate hindianimeworld@upi
          </a>
        </p>
        <p>
          Latency is measured over HTTPS round-trips from your browser, so values include TLS and
          server processing time — treat them as comparative, not raw ICMP ping.
        </p>
        <p className="text-muted-foreground/70">
          Copyright © 2026 | Developed by HANSRAJ SINH VAGHELA and PROFESSOR AYAN BHAI
        </p>
      </footer>
    </main>
  );
}
