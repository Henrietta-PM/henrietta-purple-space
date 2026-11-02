import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

// Checks whether a public HTTPS website allows being shown inside the portfolio's Safari frame.
// Only reads response headers; never returns page content.

const MAX_REDIRECTS = 4;
const TIMEOUT_MS = 6000;

function isPublicHttps(raw: string): URL | null {
  try {
    const url = new URL(raw);
    if (url.protocol !== "https:" || url.username || url.password) return null;
    const host = url.hostname.toLowerCase();
    if (!host.includes(".") || host.endsWith(".local") || host.endsWith(".internal") || host.endsWith(".localhost")) return null;
    if (/^[\d.]+$/.test(host) || host.includes(":") || host.startsWith("[")) return null;
    return url;
  } catch {
    return null;
  }
}

function allowsFraming(headers: Headers, origin: string | null): boolean {
  const xfo = headers.get("x-frame-options")?.toLowerCase().trim();
  const csp = headers.get("content-security-policy")?.toLowerCase() ?? "";
  const directive = csp.split(";").map((part) => part.trim()).find((part) => part.startsWith("frame-ancestors"));
  if (directive) {
    const sources = directive.split(/\s+/).slice(1);
    if (sources.includes("*") || sources.includes("https:")) return true;
    if (!origin) return false;
    const host = new URL(origin).hostname;
    return sources.some((source) => {
      const clean = source.replace(/^https:\/\//, "").replace(/\/$/, "");
      if (clean.startsWith("*.")) return host.endsWith(clean.slice(1));
      return clean === host;
    });
  }
  if (xfo === "deny" || xfo === "sameorigin") return false;
  return true;
}

Deno.serve(async (request) => {
  const reply = (status: number, data: unknown) => new Response(JSON.stringify(data), { status, headers: { ...corsHeaders, "Content-Type": "application/json", "Cache-Control": "public, max-age=600" } });
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (request.method !== "POST") return reply(405, { error: "Unsupported request." });
  let body: unknown;
  try { body = await request.json(); } catch { return reply(400, { error: "Please check the address." }); }
  const raw = typeof body === "object" && body !== null && "url" in body && typeof (body as { url: unknown }).url === "string" ? (body as { url: string }).url : "";
  if (raw.length > 2048) return reply(400, { error: "Please check the address." });
  let target = isPublicHttps(raw);
  if (!target) return reply(400, { error: "Please check the address." });
  const origin = request.headers.get("origin");
  try {
    for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
      const response = await fetch(target.href, { method: "GET", redirect: "manual", signal: controller.signal, headers: { "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Safari/605.1.15", Accept: "text/html" } });
      clearTimeout(timer);
      await response.body?.cancel();
      if (response.status >= 300 && response.status < 400 && response.headers.get("location")) {
        const next = isPublicHttps(new URL(response.headers.get("location") as string, target).href);
        if (!next) return reply(200, { embeddable: false, reachable: true });
        target = next;
        continue;
      }
      return reply(200, { embeddable: response.status < 400 && allowsFraming(response.headers, origin), reachable: response.status < 500, finalUrl: target.href });
    }
    return reply(200, { embeddable: false, reachable: true });
  } catch {
    return reply(200, { embeddable: false, reachable: false });
  }
});
