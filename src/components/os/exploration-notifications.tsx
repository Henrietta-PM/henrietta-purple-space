import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppIcon, launchers, type AppId, type LauncherId } from "./os-apps";
import "./exploration-notifications.css";

const notices: { app: AppId; title: string; body: string }[] = [
  { app: "love", title: "Enjoying your visit?", body: "Leave a heart for my portfolio." },
  { app: "projects", title: "A look at my work", body: "The products I've worked on, and the stories behind them." },
  { app: "messages", title: "From people I've worked with", body: "A few words from my teammates and collaborators." },
  { app: "letter", title: "A note from Henrietta", body: "A letter to my potential team." },
];

export default function ExplorationNotifications({ enabled = true, mobile = false, activeApp, onLaunch }: {
  enabled?: boolean;
  mobile?: boolean;
  activeApp?: string;
  onLaunch: (id: LauncherId) => void;
}) {
  const [notice, setNotice] = useState<(typeof notices)[number] | null>(null);
  const [paused, setPaused] = useState(false);
  const nextIndex = useRef(0);
  const currentApp = useRef(activeApp);
  const reduceMotion = useReducedMotion();
  currentApp.current = activeApp;

  useEffect(() => {
    if (!enabled) return;
    const showNext = () => {
      if (document.visibilityState !== "visible") return;
      while (nextIndex.current < notices.length) {
        const next = notices[nextIndex.current];
        nextIndex.current += 1;
        if (next.app !== currentApp.current) {
          setNotice(next);
          break;
        }
      }
    };
    const first = window.setTimeout(showNext, 18000);
    const subsequent = window.setInterval(showNext, 45000);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(subsequent);
    };
  }, [enabled]);

  useEffect(() => {
    if (!notice || paused) return;
    const timer = window.setTimeout(() => setNotice(null), 10000);
    return () => window.clearTimeout(timer);
  }, [notice, paused]);

  const launcher = launchers.find((item) => item.id === notice?.app);
  const dismiss = () => { setNotice(null); setPaused(false); };

  return (
    <div className={`os-exploration-notifications ${mobile ? "is-phone" : "is-mac"}`} aria-live="polite" aria-atomic="true">
      <AnimatePresence>
        {enabled && notice && launcher && (
          <motion.aside
            key={notice.app}
            className="os-exploration-notice"
            aria-label={`${launcher.name} notification`}
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: mobile ? 0 : 35, y: mobile ? -70 : 0 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: mobile ? 0 : 35, y: mobile ? -70 : 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.3 }}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocusCapture={() => setPaused(true)}
            onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false); }}
          >
            <Button variant="ghost" className="os-exploration-open" aria-label={`Open ${launcher.name} from notification`} onClick={() => { onLaunch(notice.app); dismiss(); }}>
              <AppIcon launcher={launcher} size="sm" />
              <span className="os-exploration-copy">
                <span className="os-exploration-app"><span>{launcher.name}</span><small>now</small></span>
                <strong>{notice.title}</strong>
                <span>{notice.body}</span>
              </span>
            </Button>
            <Button variant="ghost" size="icon" className="os-exploration-dismiss" aria-label="Dismiss notification" title="Dismiss notification" onClick={dismiss}><X aria-hidden="true" /></Button>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
}