import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { allProjects, ProjectIcon } from "./os-apps";
import { describe, fetchLagosWeather } from "./mac-widgets";
import { useOsTheme, type OsThemePref } from "./use-os-theme";
import { AnimatePresence, motion } from "framer-motion";
import { format } from "date-fns";
import { Check, Navigation, Settings } from "lucide-react";
import { IosBattery, IosNetwork, IosSignal } from "./status-icons";
import { useWallpaper } from "./use-wallpaper";
import { AppContent, AppIcon, AppLibrary, appTitles, externalLinks, isLink, launchers, type AppId, type LauncherId } from "./os-apps";
import { useClock } from "./use-clock";
import { IphoneLock } from "./iphone-lock";
import ExplorationNotifications from "./exploration-notifications";

const dockIds: LauncherId[] = ["contact", "love", "letter", "hire"];
const homeIds: LauncherId[] = ["projects", "cv", "messages", "health", "reminders", "maps", "shop", "camera", "photos"];
const socialIds: LauncherId[] = ["instagram", "linkedin", "x"];
const byId = (id: LauncherId) => launchers.find((l) => l.id === id)!;

export function IphoneHome() {
  const now = useClock();
  const [open, setOpen] = useState<AppId | "settings" | null>(null);
  const [locked, setLocked] = useState(true);
  const wallpaper = useWallpaper();
  const [page, setPage] = useState(0);
  const [projectName, setProjectName] = useState<string | undefined>();
  const pagesRef = useRef<HTMLDivElement>(null);
  const [showHint, setShowHint] = useState(false);
  const goHome = () => { setOpen(null); setProjectName(undefined); };
  useEffect(() => {
    if (!open || sessionStorage.getItem("os-home-hint")) return;
    sessionStorage.setItem("os-home-hint", "1");
    setShowHint(true);
    const timer = window.setTimeout(() => setShowHint(false), 3500);
    return () => window.clearTimeout(timer);
  }, [open]);
  const { pref, setPref } = useOsTheme();
  const { data: weather } = useQuery({ queryKey: ["lagos-weather"], queryFn: fetchLagosWeather, staleTime: 30 * 60 * 1000, retry: 1 });
  const sky = describe(weather?.code ?? 2);

  const launch = (id: LauncherId) => {
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
      <ExplorationNotifications mobile enabled={!locked} activeApp={open ?? undefined} onLaunch={(id) => { setProjectName(undefined); launch(id); }} />

      <div className="ios-pages" ref={pagesRef} onScroll={(e) => setPage(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))}>
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
            <button className="ios-w ios-w-notes" onClick={() => launch("letter")} aria-label="Intro note from Henrietta">
              <span className="ios-w-notes-head">Notes</span>
              <div className="ios-w-notes-body">
                <strong>Hi, I'm <span className="font-handwritten">Henrietta.</span></strong>
                <p>Product management for me is about people, their needs, and the paths we create to meet them. I've shipped 5+ MVPs with up to 85% faster time to market.</p>
              </div>
            </button>
            <small>Notes</small>
          </div>
        </div>

        <div className="ios-grid">
          {homeIds.map(byId).map((launcher, index) => (
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
          <motion.button className="ios-app" whileTap={{ scale: 0.88 }} onClick={() => setOpen("settings")}>
            <span className="os-icon os-icon-lg os-icon-settings" aria-hidden="true"><Settings /></span>
            <span>Settings</span>
          </motion.button>
        </div>
      </div>
      <div className="ios-home ios-page">
        <div className="ios-grid">
          {allProjects.map((project) => (
            <motion.button key={project.name} className="ios-app" whileTap={{ scale: 0.88 }} onClick={() => { setProjectName(project.name); setOpen("projects"); }}>
              <ProjectIcon project={project} size="lg" />
              <span className="ios-app-name">{project.name.replace(" Attendance System", "")}</span>
            </motion.button>
          ))}
          {socialIds.map(byId).map((launcher) => (
            <motion.button key={launcher.id} className="ios-app" whileTap={{ scale: 0.88 }} onClick={() => launch(launcher.id)}>
              <AppIcon launcher={launcher} size="lg" />
              <span>{launcher.name}</span>
            </motion.button>
          ))}
        </div>
      </div>
      <div className="ios-page ios-lib-page ios-app-glass">
        <AppLibrary onOpenProject={(name) => { setProjectName(name); setOpen("projects"); }} onLaunch={launch} />
      </div>
      </div>

      <div className={`ios-dots ${page > 1 ? "hidden" : ""}`} aria-hidden="true">{[0, 1].map((i) => <span key={i} className={page === i ? "on" : ""} />)}</div>

      <nav className="ios-dock" aria-label="Dock">
        {dockIds.map((id) => {
          const launcher = byId(id);
          return (
            <button key={id} onClick={() => launch(id)} aria-label={launcher.name}>
              <AppIcon launcher={launcher} size="lg" />
            </button>
          );
        })}
      </nav>

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
              {open === "settings" ? <SettingsApp pref={pref} onChange={setPref} /> : <AppContent id={open} compact projectName={open === "projects" ? projectName : undefined} onLaunch={(id) => { setProjectName(undefined); launch(id); }} />}
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
      <AnimatePresence>{locked && <IphoneLock key="lock" now={now} onUnlock={(app) => { setLocked(false); if (app) window.setTimeout(() => launch(app), 350); }} />}</AnimatePresence>
    </div>
  );
}

const themeOptions: { value: OsThemePref; label: string; note: string }[] = [
  { value: "system", label: "Automatic", note: "Match this phone's setting" },
  { value: "light", label: "Light", note: "Always light" },
  { value: "dark", label: "Dark", note: "Always dark" },
];

function SettingsApp({ pref, onChange }: { pref: OsThemePref; onChange: (value: OsThemePref) => void }) {
  return (
    <div className="ios-settings">
      <h1>Display &amp; Brightness</h1>
      <p className="ios-settings-label">Appearance</p>
      <div className="ios-settings-group" role="radiogroup" aria-label="Appearance">
        {themeOptions.map((option) => (
          <button key={option.value} role="radio" aria-checked={pref === option.value} onClick={() => onChange(option.value)}>
            <span><strong>{option.label}</strong><small>{option.note}</small></span>
            {pref === option.value && <Check aria-hidden="true" />}
          </button>
        ))}
      </div>
    </div>
  );
}
