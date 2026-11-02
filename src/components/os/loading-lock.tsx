import { format } from "date-fns";
import { ArrowRight, ChevronUp, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useClock } from "./use-clock";
import { lockWallpaper } from "./lock-wallpaper";
import portrait from "@/assets/henrietta-portrait.jpg";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { lockNotices } from "./lock-notices";
import { CalendarIcon, ImageIcon, NotesIcon, type LauncherId } from "./os-apps";
import sallyLogo from "@/assets/sally-logo.png";
import proxyIcon from "@/assets/proxymedicine-icon.png.asset.json";
import "./loading-lock.css";

export function LoadingLock({ desktop = false, onUnlock, onNotice }: { desktop?: boolean; onUnlock?: () => void; onNotice?: (app: LauncherId, title: string) => void }) {
  const now = useClock();
  const [arrived, setArrived] = useState(0);
  const reducedMotion = useReducedMotion();
  useEffect(() => {
    if (!desktop || !onUnlock) return;
    const timers = lockNotices.map((_, index) => window.setTimeout(() => setArrived(index + 1), 1000 + index * 3000));
    return () => timers.forEach(window.clearTimeout);
  }, [desktop, Boolean(onUnlock)]);
  return <section className={`entry-lock ${desktop ? "entry-lock-mac" : "entry-lock-phone"}`} aria-label={desktop ? "Mac lock screen" : "Lock screen"}>
    <img className="entry-lock-wallpaper" src={lockWallpaper} alt="" fetchPriority="high" decoding="sync" />
    <div className="entry-lock-clock"><Lock aria-hidden="true" /><span>{format(now, "EEEE d MMMM")}</span><strong>{format(now, "HH:mm")}</strong></div>
    {desktop && onUnlock && <aside className="entry-lock-notices" aria-label="Lock-screen notifications" aria-live="polite">
      {lockNotices.slice(0, arrived).map((notice) => <motion.div key={notice.title} initial={reducedMotion ? false : { opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ type: "spring", stiffness: 320, damping: 30 }}>
        <Button variant="ghost" className="entry-lock-notice" onClick={() => onNotice ? onNotice(notice.app, notice.title) : onUnlock()}>
          {notice.title === "Sally" ? <ImageIcon src={sallyLogo} size="sm" /> : notice.title === "ProxyMedicine" ? <ImageIcon src={proxyIcon.url} size="sm" /> : notice.app === "hire" ? <CalendarIcon size="sm" /> : <NotesIcon size="sm" />}
          <span className="entry-lock-notice-copy"><span className="entry-lock-notice-head"><strong>{notice.title}</strong><small>{notice.time}</small></span><span>{notice.body}</span></span>
        </Button>
      </motion.div>)}
    </aside>}
    {desktop ? <div className="entry-lock-account"><img src={portrait} alt="Henrietta Onwuneme" /><strong>Henrietta Onwuneme</strong><Button variant="ghost" className="entry-lock-open" disabled={!onUnlock} onClick={onUnlock}>Enter portfolio <ArrowRight /></Button></div> : <div className="entry-lock-bottom"><ChevronUp aria-hidden="true" /><span>Swipe up to open</span><i /></div>}
  </section>;
}

export function LoadingLockScreen() {
  const mobile = useIsMobile();
  return <main className="entry-lock-root"><LoadingLock desktop={!mobile} /></main>;
}