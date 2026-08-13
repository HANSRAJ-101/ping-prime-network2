export type PingResult = {
  id: string;
  name: string;
  region?: string;
  ms: number | null;
};

const bust = (url: string) =>
  url + (url.includes("?") ? "&" : "?") + "_=" + Math.random().toString(36).slice(2);

/** Measures round-trip time to an HTTP endpoint. Browsers cannot send ICMP,
 *  so this is HTTP handshake + response latency (a good ping proxy). */
export async function timedRequest(
  url: string,
  opts: { mode?: RequestMode; timeout?: number } = {},
): Promise<number | null> {
  const { mode = "no-cors", timeout = 4000 } = opts;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeout);
  const start = performance.now();
  try {
    await fetch(bust(url), {
      mode,
      cache: "no-store",
      signal: ctrl.signal,
      redirect: "follow",
    });
    return Math.round(performance.now() - start);
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/** Best-of-N sampling to reduce noise. */
export async function pingEndpoint(
  url: string,
  samples = 3,
  mode: RequestMode = "no-cors",
): Promise<number | null> {
  const results: number[] = [];
  for (let i = 0; i < samples; i++) {
    const ms = await timedRequest(url, { mode });
    if (ms != null) results.push(ms);
  }
  if (!results.length) return null;
  return Math.min(...results);
}

const CF_DOWN = "https://speed.cloudflare.com/__down";
const CF_UP = "https://speed.cloudflare.com/__up";

export type LatencyStats = { ping: number; jitter: number; samples: number[] };

export async function measureLatency(count = 12): Promise<LatencyStats> {
  const samples: number[] = [];
  for (let i = 0; i < count; i++) {
    const ms = await timedRequest(`${CF_DOWN}?bytes=0`, { mode: "cors", timeout: 3000 });
    if (ms != null) samples.push(ms);
  }
  if (!samples.length) return { ping: 0, jitter: 0, samples: [] };
  const ping = Math.min(...samples);
  const diffs = samples.slice(1).map((v, i) => Math.abs(v - samples[i]!));
  const jitter = diffs.length ? diffs.reduce((a, b) => a + b, 0) / diffs.length : 0;
  return { ping, jitter: Math.round(jitter * 10) / 10, samples };
}

export type SpeedProgress = { mbps: number; peak: number; progress: number };

/** Streaming download test — reports live Mbps while bytes arrive. */
export async function measureDownload(
  bytes: number,
  durationMs: number,
  onProgress: (p: SpeedProgress) => void,
): Promise<{ mbps: number; peak: number }> {
  const start = performance.now();
  let loaded = 0;
  let peak = 0;
  let last = start;
  let lastLoaded = 0;

  const ctrl = new AbortController();
  const stop = setTimeout(() => ctrl.abort(), durationMs);
  try {
    const res = await fetch(bust(`${CF_DOWN}?bytes=${bytes}`), {
      cache: "no-store",
      signal: ctrl.signal,
    });
    const reader = res.body?.getReader();
    if (!reader) throw new Error("no stream");
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      loaded += value?.length ?? 0;
      const now = performance.now();
      if (now - last > 180) {
        const inst = ((loaded - lastLoaded) * 8) / ((now - last) / 1000) / 1e6;
        peak = Math.max(peak, inst);
        const avg = (loaded * 8) / ((now - start) / 1000) / 1e6;
        onProgress({
          mbps: Math.round(avg * 10) / 10,
          peak: Math.round(peak * 10) / 10,
          progress: Math.min(1, (now - start) / durationMs),
        });
        last = now;
        lastLoaded = loaded;
      }
    }
  } catch {
    /* aborted or blocked — fall through with what we measured */
  } finally {
    clearTimeout(stop);
  }
  const elapsed = (performance.now() - start) / 1000;
  const mbps = elapsed > 0 ? (loaded * 8) / elapsed / 1e6 : 0;
  return { mbps: Math.round(mbps * 10) / 10, peak: Math.round(Math.max(peak, mbps) * 10) / 10 };
}

export async function measureUpload(
  bytes: number,
  onProgress: (p: SpeedProgress) => void,
): Promise<number> {
  const chunk = new Uint8Array(bytes);
  crypto.getRandomValues(chunk.subarray(0, Math.min(bytes, 65536)));
  const start = performance.now();
  onProgress({ mbps: 0, peak: 0, progress: 0.1 });
  try {
    await fetch(bust(CF_UP), { method: "POST", body: chunk, cache: "no-store" });
  } catch {
    return 0;
  }
  const elapsed = (performance.now() - start) / 1000;
  const mbps = elapsed > 0 ? (bytes * 8) / elapsed / 1e6 : 0;
  onProgress({ mbps: Math.round(mbps * 10) / 10, peak: 0, progress: 1 });
  return Math.round(mbps * 10) / 10;
}

export function pingTone(ms: number | null): "good" | "warn" | "bad" | "dead" {
  if (ms == null) return "dead";
  if (ms < 60) return "good";
  if (ms < 130) return "warn";
  return "bad";
}
