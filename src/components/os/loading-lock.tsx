import { format } from "date-fns";
import { ArrowRight, ChevronUp, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useClock } from "./use-clock";
import { lockWallpaper } from "./lock-wallpaper";
import portrait from "@/assets/henrietta-portrait.jpg";
import "./loading-lock.css";

export function LoadingLock({ desktop = false, onUnlock }: { desktop?: boolean; onUnlock?: () => void }) {
  const now = useClock();
  return <section className={`entry-lock ${desktop ? "entry-lock-mac" : "entry-lock-phone"}`} aria-label={desktop ? "Mac lock screen" : "Lock screen"}>
    <img className="entry-lock-wallpaper" src={lockWallpaper} alt="" fetchPriority="high" decoding="sync" />
    <div className="entry-lock-clock"><Lock aria-hidden="true" /><span>{format(now, "EEEE d MMMM")}</span><strong>{format(now, "HH:mm")}</strong></div>
    {desktop ? <div className="entry-lock-account"><img src={portrait} alt="Henrietta Onwuneme" /><strong>Henrietta Onwuneme</strong><Button variant="ghost" className="entry-lock-open" disabled={!onUnlock} onClick={onUnlock}>Enter portfolio <ArrowRight /></Button></div> : <div className="entry-lock-bottom"><ChevronUp aria-hidden="true" /><span>Swipe up to open</span><i /></div>}
  </section>;
}

export function LoadingLockScreen() {
  const mobile = useIsMobile();
  return <main className="entry-lock-root"><LoadingLock desktop={!mobile} /></main>;
}