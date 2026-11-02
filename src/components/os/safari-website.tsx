import { useEffect, useState } from "react";
import { ArrowUpRight, BookOpen, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { blocksEmbedding } from "./safari-navigation";

type FrameStatus = "checking" | "loading" | "ready" | "blocked" | "unreachable" | "slow";
const checks = new Map<string, Promise<{ embeddable: boolean; reachable: boolean }>>();

function checkFrame(url: string) {
  if (blocksEmbedding(url)) return Promise.resolve({ embeddable: false, reachable: true });
  const cached = checks.get(url);
  if (cached) return cached;
  const pending = supabase.functions.invoke("safari-frame-check", { body: { url } }).then(({ data, error }) => {
    // If the check itself fails, try the frame anyway rather than blocking the visitor.
    if (error || typeof data?.embeddable !== "boolean") return { embeddable: true, reachable: true };
    return { embeddable: data.embeddable as boolean, reachable: data.reachable !== false };
  }).catch(() => ({ embeddable: true, reachable: true }));
  checks.set(url, pending);
  return pending;
}

export function SafariWebsite({ url, reload, projectName, onTour, onProgress }: { url: string; reload: number; projectName?: string; onTour?: () => void; onProgress: (value: number | null) => void }) {
  const [status, setStatus] = useState<FrameStatus>("checking");
  const host = new URL(url).hostname.replace(/^www\./, "");

  useEffect(() => {
    let live = true;
    setStatus("checking");
    checkFrame(url).then((result) => { if (live) setStatus(!result.reachable ? "unreachable" : result.embeddable ? "loading" : "blocked"); });
    return () => { live = false; };
  }, [url, reload]);

  useEffect(() => {
    if (status !== "loading") return;
    const timer = window.setTimeout(() => setStatus("slow"), 12000);
    return () => window.clearTimeout(timer);
  }, [status]);

  useEffect(() => {
    onProgress(status === "checking" ? 0.3 : status === "loading" ? 0.7 : status === "slow" ? 0.85 : null);
  }, [status, onProgress]);
  useEffect(() => () => onProgress(null), [onProgress]);

  const showFrame = status === "loading" || status === "ready" || status === "slow";
  return <div className="safari-website">
    {showFrame && <iframe key={`${url}-${reload}`} className={status === "ready" ? "is-ready" : ""} src={url} title={`${projectName ?? host} live website`} onLoad={() => setStatus("ready")} sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox" referrerPolicy="strict-origin-when-cross-origin" />}
    {(status === "checking" || status === "loading") && <div className="safari-loading" aria-live="polite"><Globe /><span>Loading {host}</span></div>}
    {status === "slow" && <div className="safari-slow"><span>{host} is taking a while.</span><Button asChild variant="ghost"><a href={url} target="_blank" rel="noopener noreferrer">Open in browser <ArrowUpRight /></a></Button></div>}
    {(status === "blocked" || status === "unreachable") && <div className="safari-blocked">
      <Globe />
      <h2>{status === "blocked" ? `${host} can't open inside this Safari.` : "Safari can't open the page."}</h2>
      <p>{status === "blocked" ? "This website only allows being opened in its own browser tab." : `Safari can't find the server for ${host}. Check the address and try again.`}{projectName && onTour ? " Its project tour is still available here." : ""}</p>
      {projectName && onTour && <Button variant="ghost" onClick={onTour}><BookOpen />View project tour</Button>}
      {status === "blocked" && <Button asChild><a href={url} target="_blank" rel="noopener noreferrer">Open website <ArrowUpRight /></a></Button>}
    </div>}
  </div>;
}
