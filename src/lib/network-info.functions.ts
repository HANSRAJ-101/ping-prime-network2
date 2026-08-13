import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";

export type NetworkInfo = {
  ip: string | null;
  isp: string | null;
  city: string | null;
  region: string | null;
  country: string | null;
  timezone: string | null;
  asn: string | null;
};

const EMPTY: NetworkInfo = {
  ip: null,
  isp: null,
  city: null,
  region: null,
  country: null,
  timezone: null,
  asn: null,
};

export const getNetworkInfo = createServerFn({ method: "GET" }).handler(
  async (): Promise<NetworkInfo> => {
    const headers = getRequest().headers;
    const ip =
      headers.get("cf-connecting-ip") ??
      headers.get("x-real-ip") ??
      headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      null;

    try {
      const res = await fetch(`https://ipapi.co/${ip ? `${ip}/` : ""}json/`, {
        headers: { "user-agent": "netpulse-optimizer/1.0" },
      });
      if (!res.ok) return { ...EMPTY, ip };
      const d = (await res.json()) as Record<string, string>;
      return {
        ip: d["ip"] ?? ip,
        isp: d["org"] ?? null,
        city: d["city"] ?? null,
        region: d["region"] ?? null,
        country: d["country_name"] ?? null,
        timezone: d["timezone"] ?? null,
        asn: d["asn"] ?? null,
      };
    } catch {
      return { ...EMPTY, ip };
    }
  },
);
