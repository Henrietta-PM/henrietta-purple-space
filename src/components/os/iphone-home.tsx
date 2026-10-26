import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { describe, fetchLagosWeather } from "./mac-widgets";
import { AnimatePresence, motion } from "framer-motion";
import { format } from "date-fns";
import { Navigation } from "lucide-react";
import { IosBattery, IosNetwork, IosSignal } from "./status-icons";
import { useWallpaper } from "./use-wallpaper";
import { AppContent, AppLibrary, appTitles, externalLinks, isLink, type AppId, type LauncherId } from "./os-apps";
import { useClock } from "./use-clock";
import { IphoneLock } from "./iphone-lock";
import ExplorationNotifications from "./exploration-notifications";
import AppOrganizer, { AppZone } from "./app-organizer";
import { phoneLayout } from "./app-catalog";
import { aboutMeNote, type NoteId } from "@/data/notes";
import SettingsApp from "./settings-app";

export function IphoneHome() {
  const now = useClock();
  const [open, setOpen] = useState<AppId | "settings" | null>(null);
  const [locked, setLocked] = useState(true);
  const wallpaper = useWallpaper();
  const [page, setPage] = useState(0);
  const [projectName, setProjectName] = useState<string | undefined>();
  const [initialNote, setInitialNote] = useState<NoteId | undefined>();
  const pagesRef = useRef<HTMLDivElement>(null);
  const settleTimer = useRef<number>();
  const handlePagesScroll = (element: HTMLDivElement) => {
    setPage(Math.round(element.scrollLeft / element.clientWidth));
    window.clearTimeout(settleTimer.current);
    settleTimer.current = window.setTimeout(() => {
      const target = Math.round(element.scrollLeft / element.clientWidth) * element.clientWidth;
      if (Math.abs(element.scrollLeft - target) > 1) element.scrollTo({ left: target, behavior: "smooth" });
    }, 120);
  };
  const [showHint, setShowHint] = useState(false);
  const goHome = () => { setOpen(null); setProjectName(undefined); };
  useEffect(() => {
    if (!open || sessionStorage.getItem("os-home-hint")) return;
    sessionStorage.setItem("os-home-hint", "1");
    setShowHint(true);
    const timer = window.setTimeout(() => setShowHint(false), 3500);
    return () => window.clearTimeout(timer);
  }, [open]);
  const { data: weather } = useQuery({ queryKey: ["lagos-weather"], queryFn: fetchLagosWeather, staleTime: 30 * 60 * 1000, retry: 1 });
  const sky = describe(weather?.code ?? 2);

  const launch = (id: LauncherId) => {
    setInitialNote(undefined);
    if (isLink(id)) {
      window.open(externalLinks[id], "_blank", "noopener,noreferrer");
      return;
    }
    setOpen(id);
  };

  const StatusBar = ({ light }: { light: boolean }) => (
    <div className={`ios-status ${light ? "light" : ""}`}>
      <span>{format(now, "HH:mm")}</span>
      <span className="ios-status-icons"><IosSignal /><IosNetwork /><IosBattery /></span>
    </div>
  );

  return (
    <div className={`ios-shell ${page > 1 ? "ios-on-library" : ""}`} style={{ backgroundImage: `url(${wallpaper})` }}>
      <div className="mac-wallpaper-tint" />
      <StatusBar light />
      <ExplorationNotifications mobile enabled={!locked} activeApp={open ?? undefined} onLaunch={(id) => { setProjectName(undefined); launch(id); if (id === "letter") setInitialNote("letter"); }} />
      <AppOrganizer storageKey="portfolio-phone-apps-v1" hideControls={locked} defaults={phoneLayout} mobile onPageEdge={(direction) => {
        const element = pagesRef.current;
        if (element) element.scrollTo({ left: Math.max(0, Math.min(1, Math.round(element.scrollLeft / element.clientWidth) + direction)) * element.clientWidth, behavior: "smooth" });
      }} onLaunch={(app) => {
        setProjectName(app.projectName);
        if (app.projectName) setOpen("projects");
        else if (app.id === "settings") setOpen("settings");
        else if (app.launcher) launch(app.launcher);
      }}>
      <div className="ios-pages" ref={pagesRef} onScroll={(e) => handlePagesScroll(e.currentTarget)}>
      <div className="ios-home ios-page">
        <div className="ios-widgets">
          <div>
            <button className="ios-w ios-w-weather" onClick={() => launch("weather")} aria-label="Weather in Lagos">
              <span className="ios-w-place">Lagos <Navigation aria-hidden="true" /></span>
              <strong>{weather ? `${weather.temp}°` : "--"}</strong>
              <sky.Icon className="ios-w-sky" aria-hidden="true" />
              <span>{sky.label}</span>
              <span>{weather ? `H:${weather.high}° L:${weather.low}°` : "Loading"}</span>
            </button>
            <small>Weather</small>
          </div>
          <div>
            <button className="ios-w ios-w-notes" onClick={() => { launch("letter"); setInitialNote("about-me"); }} aria-label="Read About Me note">
              <span className="ios-w-notes-head">Notes</span>
              <div className="ios-w-notes-body">
                <strong>Hi, I'm <span className="font-handwritten">Henrietta.</span></strong>
                <p>{aboutMeNote.preview} {aboutMeNote.intro.replace(/\.$/, "")}...</p>
              </div>
            </button>
            <small>Notes</small>
          </div>
        </div>

        <AppZone zone="home0" className="ios-grid" />
      </div>
      <div className="ios-home ios-page">
        <AppZone zone="home1" className="ios-grid" />
      </div>
      <div className="ios-page ios-lib-page ios-app-glass">
        <AppLibrary onOpenProject={(name) => { setProjectName(name); setOpen("projects"); }} onLaunch={launch} />
      </div>
      </div>

      <div className={`ios-dots ${page > 1 ? "hidden" : ""}`} aria-hidden="true">{[0, 1].map((i) => <span key={i} className={page === i ? "on" : ""} />)}</div>

      <nav className="ios-dock" aria-label="Dock">
        <AppZone zone="dock" className="os-phone-dock-apps" />
      </nav>
      </AppOrganizer>

      <AnimatePresence>
        {open && (
          <motion.section
            key={open}
            role="dialog"
            aria-label={open === "settings" ? "Settings" : appTitles[open]}
            className="ios-app-screen"
            initial={{ opacity: 0, scale: 0.3, borderRadius: 60 }}
            animate={{ opacity: 1, scale: 1, borderRadius: 0 }}
            exit={{ opacity: 0, scale: 0.3, borderRadius: 60, transition: { duration: 0.22 } }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.4 }}
            onDragEnd={(_, info) => { if (info.offset.y > 140) { setOpen(null); setProjectName(undefined); } }}
          >
            <StatusBar light={false} />
            <div className="ios-app-body">
              {open === "settings" ? <SettingsApp compact /> : <AppContent id={open} compact initialNote={open === "letter" ? initialNote : undefined} projectName={open === "projects" ? projectName : undefined} onLaunch={(id) => { setProjectName(undefined); launch(id); }} />}
            </div>
            {showHint && <motion.span className="ios-home-hint" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>Swipe up or tap the bar to go home</motion.span>}
            <motion.button
              className="ios-home-zone"
              aria-label="Go to home screen"
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0.6, bottom: 0 }}
              onDragEnd={(_, info) => { if (info.offset.y < -30) goHome(); }}
              onClick={goHome}
            >
              <span className="ios-home-indicator" />
            </motion.button>
          </motion.section>
        )}
      </AnimatePresence>
      <AnimatePresence>{locked && <IphoneLock key="lock" now={now} onUnlock={(app) => { setLocked(false); if (app) window.setTimeout(() => { launch(app); if (app === "letter") setInitialNote("letter"); }, 350); }} />}</AnimatePresence>
    </div>
  );
}

