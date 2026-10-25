import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { BatteryFull, ChevronLeft, Signal, Wifi } from "lucide-react";
import portrait from "@/assets/henrietta-portrait.jpg";
import { HIRE_CALENDAR_URL } from "@/lib/booking";
import { AppContent, AppIcon, appTitles, launchers, type AppId, type LauncherId } from "./os-apps";
import { useClock } from "./use-clock";
import HeartModal from "@/components/HeartModal";
import { IphoneLock } from "./iphone-lock";

const dockIds: LauncherId[] = ["projects", "love", "letter", "hire"];

export function IphoneHome() {
  const navigate = useNavigate();
  const now = useClock();
  const [loveOpen, setLoveOpen] = useState(false);
  const [open, setOpen] = useState<AppId | null>(null);
  const [locked, setLocked] = useState(true);

  const launch = (id: LauncherId) => {
    if (id === "home") return navigate("/");
    if (id === "love") return setLoveOpen(true);
    if (id === "hire") {
      window.open(HIRE_CALENDAR_URL, "_blank", "noopener,noreferrer");
      return;
    }
    setOpen(id);
  };

  const StatusBar = ({ light }: { light: boolean }) => (
    <div className={`ios-status ${light ? "light" : ""}`}>
      <span>{format(now, "HH:mm")}</span>
      <span className="ios-status-icons"><Signal /><Wifi /><BatteryFull /></span>
    </div>
  );

  return (
    <div className="ios-shell" style={{ backgroundImage: `url(${portrait})` }}>
      <div className="mac-wallpaper-tint" />
      <StatusBar light />

      <div className="ios-home">
        <div className="ios-widget">
          <span>{format(now, "EEEE d MMMM")}</span>
          <strong>{format(now, "HH:mm")}</strong>
          <p>Henrietta <span className="font-handwritten">Onwuneme</span>, Product Manager</p>
        </div>

        <div className="ios-grid">
          {launchers.map((launcher, index) => (
            <motion.button
              key={launcher.id}
              className="ios-app"
              onClick={() => launch(launcher.id)}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              whileTap={{ scale: 0.88 }}
              transition={{ delay: 0.05 * index, type: "spring", stiffness: 400, damping: 22 }}
            >
              <AppIcon launcher={launcher} size="lg" />
              <span>{launcher.name}</span>
            </motion.button>
          ))}
        </div>
      </div>

      <nav className="ios-dock" aria-label="Dock">
        {dockIds.map((id) => {
          const launcher = launchers.find((l) => l.id === id)!;
          return (
            <motion.button key={id} whileTap={{ scale: 0.88 }} onClick={() => launch(id)} aria-label={launcher.name}>
              <AppIcon launcher={launcher} size="lg" />
            </motion.button>
          );
        })}
      </nav>

      <AnimatePresence>
        {open && (
          <motion.section
            key={open}
            role="dialog"
            aria-label={appTitles[open]}
            className="ios-app-screen"
            initial={{ opacity: 0, scale: 0.3, borderRadius: 60 }}
            animate={{ opacity: 1, scale: 1, borderRadius: 0 }}
            exit={{ opacity: 0, scale: 0.3, borderRadius: 60, transition: { duration: 0.22 } }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.4 }}
            onDragEnd={(_, info) => { if (info.offset.y > 140) setOpen(null); }}
          >
            <StatusBar light={false} />
            <header className="ios-app-header">
              <button className="os-back" onClick={() => setOpen(null)}><ChevronLeft aria-hidden="true" /> Home</button>
              <h1>{open === "cv" ? "CV" : appTitles[open]}</h1>
            </header>
            <div className="ios-app-body">
              <AppContent id={open} compact />
            </div>
            <button className="ios-home-indicator" aria-label="Go to home screen" onClick={() => setOpen(null)} />
          </motion.section>
        )}
      </AnimatePresence>
      <AnimatePresence>{locked && <IphoneLock key="lock" now={now} onUnlock={(app) => { setLocked(false); if (app) window.setTimeout(() => launch(app), 350); }} />}</AnimatePresence>
      <HeartModal isOpen={loveOpen} onClose={() => setLoveOpen(false)} />
    </div>
  );
}
