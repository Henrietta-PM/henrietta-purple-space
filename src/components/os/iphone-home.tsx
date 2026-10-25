import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { allProjects } from "./os-apps";
import { describe, fetchLagosWeather } from "./mac-widgets";
import { useOsTheme } from "./use-os-theme";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { BatteryFull, ChevronLeft, Moon, Navigation, Search, Signal, Sun, Wifi } from "lucide-react";
import portrait from "@/assets/henrietta-portrait.jpg";
import { HIRE_CALENDAR_URL } from "@/lib/booking";
import { AppContent, AppIcon, appTitles, launchers, type AppId, type LauncherId } from "./os-apps";
import { useClock } from "./use-clock";
import { IphoneLock } from "./iphone-lock";

const dockIds: LauncherId[] = ["contact", "love", "letter", "hire"];

export function IphoneHome() {
  const navigate = useNavigate();
  const now = useClock();
  const [open, setOpen] = useState<AppId | null>(null);
  const [locked, setLocked] = useState(true);
  const { theme, toggle: toggleTheme } = useOsTheme();
  const { data: weather } = useQuery({ queryKey: ["lagos-weather"], queryFn: fetchLagosWeather, staleTime: 30 * 60 * 1000, retry: 1 });
  const sky = describe(weather?.code ?? 2);
  const [photoIndex, setPhotoIndex] = useState(0);
  const photo = allProjects[photoIndex % allProjects.length];
  useEffect(() => {
    const timer = window.setInterval(() => setPhotoIndex((i) => i + 1), 5000);
    return () => window.clearInterval(timer);
  }, []);

  const launch = (id: LauncherId) => {
    if (id === "home") return navigate("/");
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
        <div className="ios-widgets">
          <div>
            <motion.button className="ios-w ios-w-weather" whileTap={{ scale: 0.96 }} onClick={() => launch("projects")} aria-label="Weather in Lagos">
              <span className="ios-w-place">Lagos <Navigation aria-hidden="true" /></span>
              <strong>{weather ? `${weather.temp}°` : "--"}</strong>
              <sky.Icon className="ios-w-sky" aria-hidden="true" />
              <span>{sky.label}</span>
              <span>{weather ? `H:${weather.high}° L:${weather.low}°` : "Loading"}</span>
            </motion.button>
            <small>Weather</small>
          </div>
          <div>
            <motion.button className="ios-w ios-w-photo" whileTap={{ scale: 0.96 }} onClick={() => launch("projects")} aria-label={`View ${photo.name}`}>
              <AnimatePresence mode="popLayout">
                <motion.img key={photo.name} src={photo.image} alt="" initial={{ opacity: 0, scale: 1.08 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }} />
              </AnimatePresence>
              <span>{photo.name}</span>
            </motion.button>
            <small>Photos</small>
          </div>
        </div>

        <div className="ios-grid">
          {launchers.filter((l) => !dockIds.includes(l.id)).map((launcher, index) => (
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

      <button className="ios-search" onClick={() => launch("projects")}><Search aria-hidden="true" /> Search</button>

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
              <button className="ios-theme" onClick={toggleTheme} aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}>{theme === "dark" ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}</button>
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
    </div>
  );
}
