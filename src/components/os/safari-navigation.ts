export interface SafariPage {
  url: string;
  projectName?: string;
  mode: "tour" | "website" | "search";
  query?: string;
}

export function safeWebsiteUrl(value: string): string | null {
  try {
    const trimmed = value.trim();
    const url = new URL(/^[a-z][a-z0-9+.-]*:/i.test(trimmed) ? trimmed : `https://${trimmed}`);
    if (url.protocol !== "https:" || url.username || url.password || !url.hostname.includes(".")) return null;
    return url.href;
  } catch {
    return null;
  }
}

export function blocksEmbedding(url: string): boolean {
  const safe = safeWebsiteUrl(url);
  if (!safe) return true;
  const hostname = new URL(safe).hostname;
  return ["prxy.health", "linkedin.com"].some((domain) => hostname === domain || hostname.endsWith(`.${domain}`));
}

export function visitPage(history: SafariPage[], index: number, page: SafariPage): SafariPage[] {
  return [...history.slice(0, index + 1), page];
}

/** Turns what a visitor types into a destination, like Safari's smart search field. */
export function resolveAddress(input: string, projectNames: string[], projectLinks: Record<string, string> = {}): SafariPage | null {
  const value = input.trim();
  if (!value) return null;
  const lower = value.toLowerCase();
  const project = projectNames.find((name) => name.toLowerCase() === lower);
  if (project) return { url: "https://henriettaofpm.online", projectName: project, mode: "tour" };
  const looksLikeAddress = !/\s/.test(value) && (value.includes(".") || /^https?:\/\//i.test(value));
  if (looksLikeAddress) {
    const url = safeWebsiteUrl(value.replace(/^http:\/\//i, "https://"));
    if (url) {
      const host = new URL(url).hostname.replace(/^www\./, "");
      const owner = Object.entries(projectLinks).find(([, link]) => { const safe = safeWebsiteUrl(link); return safe ? new URL(safe).hostname.replace(/^www\./, "") === host : false; });
      return { url, mode: "website", projectName: owner?.[0] };
    }
  }
  return { url: "https://henriettaofpm.online", mode: "search", query: value };
}
