export interface SafariPage {
  url: string;
  projectName?: string;
  mode: "tour" | "website";
}

export function safeWebsiteUrl(value: string): string | null {
  try {
    const url = new URL(value.includes(":") ? value.trim() : `https://${value.trim()}`);
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