import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useVisitorPosts } from "./visitor-guestbook";
import { AppIcon, launchers, type AppId, type LauncherId } from "./os-apps";
import "./exploration-notifications.css";

type Notice = { app: AppId; title: string; body: string; key?: string };
const notices: Notice[] = [
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
  const [notice, setNotice] = useState<Notice | null>(null);
  const [paused, setPaused] = useState(false);
  const nextIndex = useRef(0);
  const currentApp = useRef(activeApp);
  const reduceMotion = useReducedMotion();
  currentApp.current = activeApp;
  const { data: hearts } = useQuery({ queryKey: ["hearts-live"], enabled, refetchInterval: 30000, queryFn: async () => {
    const { data, error } = await supabase.from("hearts").select("id").order("created_at", { ascending: false }).limit(20);
    if (error) throw error;
    return data ?? [];
  } });
  const { data: visits } = useVisitorPosts(enabled);
  const seen = useRef<Set<string> | null>(null);
  const ownLikes = useRef(0);
  useEffect(() => {
    const onLike = () => { ownLikes.current += 1; setNotice({ app: "love", key: `own-${Date.now()}`, title: "Love Portfolio", body: "Your like was sent. Thank you for the love!" }); };
    window.addEventListener("portfolio-like", onLike);
    return () => window.removeEventListener("portfolio-like", onLike);
  }, []);
  useEffect(() => {
    if (!hearts || !visits) return;
    const ids = [...hearts.map((h) => `h-${h.id}`), ...visits.map((v) => `v-${v.id}`)];
    if (!seen.current) { seen.current = new Set(ids); return; }
    const known = seen.current;
    const fresh = ids.filter((id) => !known.has(id));
    fresh.forEach((id) => known.add(id));
    const likes = fresh.filter((id) => id.startsWith("h-")).length;
    const absorbed = Math.min(likes, ownLikes.current);
    ownLikes.current -= absorbed;
    const latest = absorbed ? fresh.find((id) => id.startsWith("v-")) : fresh[0];
    if (!latest || currentApp.current === "love") return;
    if (latest.startsWith("h-")) { setNotice({ app: "love", key: latest, title: "New like", body: "Someone just liked this portfolio." }); return; }
    const visit = visits.find((v) => `v-${v.id}` === latest);
    if (visit) setNotice({ app: "love", key: latest, title: visit.display_name, body: visit.message || "Stopped by and shared a photo." });
  }, [hearts, visits]);

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
            key={notice.key ?? notice.app}
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