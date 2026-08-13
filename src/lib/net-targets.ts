export type Target = {
  id: string;
  name: string;
  region: string;
  url: string;
  mode?: RequestMode;
};

/** Game publisher / server-region edges reachable over HTTPS from the browser. */
export const GAME_TARGETS: Target[] = [
  { id: "bloodstrike", name: "Blood Strike", region: "NetEase SEA", url: "https://www.netease.com/favicon.ico" },
  { id: "freefire", name: "Free Fire", region: "Garena SG", url: "https://ff.garena.com/favicon.ico" },
  { id: "palworld", name: "Palworld", region: "Steam / Pocketpair", url: "https://store.steampowered.com/favicon.ico" },
  { id: "valorant", name: "Valorant", region: "Riot APAC", url: "https://playvalorant.com/favicon.ico" },
  { id: "cs2", name: "Counter-Strike 2", region: "Valve", url: "https://steamcommunity.com/favicon.ico" },
  { id: "pubgm", name: "PUBG Mobile", region: "Tencent", url: "https://www.pubgmobile.com/favicon.ico" },
  { id: "cod", name: "COD Mobile", region: "Activision", url: "https://www.callofduty.com/favicon.ico" },
  { id: "fortnite", name: "Fortnite", region: "Epic Games", url: "https://www.epicgames.com/favicon.ico" },
];

export const SERVICE_TARGETS: Target[] = [
  { id: "youtube", name: "YouTube", region: "Google Edge", url: "https://www.youtube.com/favicon.ico" },
  { id: "twitch", name: "Twitch", region: "Amazon IVS", url: "https://www.twitch.tv/favicon.ico" },
  { id: "discord", name: "Discord Voice", region: "Discord Media", url: "https://discord.com/assets/favicon.ico" },
  { id: "cloudflare", name: "Cloudflare", region: "Nearest PoP", url: "https://speed.cloudflare.com/__down?bytes=0", mode: "cors" },
  { id: "aws-ap-south", name: "AWS ap-south-1", region: "Mumbai", url: "https://dynamodb.ap-south-1.amazonaws.com/ping" },
  { id: "aws-ap-se", name: "AWS ap-southeast-1", region: "Singapore", url: "https://dynamodb.ap-southeast-1.amazonaws.com/ping" },
  { id: "aws-eu", name: "AWS eu-central-1", region: "Frankfurt", url: "https://dynamodb.eu-central-1.amazonaws.com/ping" },
  { id: "aws-us-east", name: "AWS us-east-1", region: "N. Virginia", url: "https://dynamodb.us-east-1.amazonaws.com/ping" },
];

export type DnsServer = {
  id: string;
  name: string;
  ip: string;
  url: string;
  mode?: RequestMode;
};

/** DNS-over-HTTPS resolvers — timing a real A-record lookup per provider. */
export const DNS_SERVERS: DnsServer[] = [
  { id: "cloudflare", name: "Cloudflare", ip: "1.1.1.1", url: "https://cloudflare-dns.com/dns-query?type=A&name=example.com", mode: "cors" },
  { id: "google", name: "Google", ip: "8.8.8.8", url: "https://dns.google/resolve?type=A&name=example.com", mode: "cors" },
  { id: "quad9", name: "Quad9", ip: "9.9.9.9", url: "https://dns.quad9.net:5053/dns-query?type=A&name=example.com", mode: "cors" },
  { id: "opendns", name: "OpenDNS", ip: "208.67.222.222", url: "https://doh.opendns.com/dns-query?name=example.com", mode: "no-cors" },
  { id: "adguard", name: "AdGuard DNS", ip: "94.140.14.14", url: "https://dns.adguard-dns.com/resolve?name=example.com", mode: "no-cors" },
  { id: "controld", name: "Control D", ip: "76.76.2.0", url: "https://freedns.controld.com/p0?name=example.com", mode: "no-cors" },
];
