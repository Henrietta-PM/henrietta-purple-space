import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { lockNotices } from "./lock-notices";
import { CalendarIcon, ImageIcon, NotesIcon, type LauncherId } from "./os-apps";
import sallyLogo from "@/assets/sally-logo.png";
import proxyIcon from "@/assets/proxymedicine-icon.png.asset.json";

export default function MacLockNotifications({ onNotice }: { onNotice: (app: LauncherId, title: string) => void }) {
  const [arrived, setArrived] = useState(0);
  const reducedMotion = useReducedMotion();
  useEffect(() => {
    const timers = lockNotices.map((_, index) => window.setTimeout(() => setArrived(index + 1), 1000 + index * 3000));
    return () => timers.forEach(window.clearTimeout);
  }, []);
  return <aside className="entry-lock-notices" aria-label="Lock-screen notifications" aria-live="polite">
    {lockNotices.slice(0, arrived).map((notice) => <motion.div key={notice.title} initial={reducedMotion ? false : { opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ type: "spring", stiffness: 320, damping: 30 }}>
      <Button variant="ghost" className="entry-lock-notice" onClick={() => onNotice(notice.app, notice.title)}>
        {notice.title === "Sally" ? <ImageIcon src={sallyLogo} size="sm" /> : notice.title === "ProxyMedicine" ? <ImageIcon src={proxyIcon.url} size="sm" /> : notice.app === "hire" ? <CalendarIcon size="sm" /> : <NotesIcon size="sm" />}
        <span className="entry-lock-notice-copy"><span className="entry-lock-notice-head"><strong>{notice.title}</strong><small>{notice.time}</small></span><span>{notice.body}</span></span>
      </Button>
    </motion.div>)}
  </aside>;
}