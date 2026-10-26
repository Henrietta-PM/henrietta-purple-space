import { useCallback, useRef, useState } from "react";
import { AnimatePresence, motion, useDragControls } from "framer-motion";
import { format } from "date-fns";
import { Moon, Sun } from "lucide-react";
import { AppleLogo, MacBattery, MacWifiArcs } from "./status-icons";
import { useOsTheme } from "./use-os-theme";
import { useWallpaper } from "./use-wallpaper";
import { AppContent, appTitles, externalLinks, isLink, type AppId, type LauncherId } from "./os-apps";
import { useClock } from "./use-clock";
import MacWidgets from "./mac-widgets";
import ExplorationNotifications from "./exploration-notifications";
import AppOrganizer, { AppZone } from "./app-organizer";
import { desktopLayout } from "./app-catalog";
import type { NoteId } from "@/data/notes";
import { LoadingLock } from "./loading-lock";

interface WindowState {
  id: AppId;
  z: number;
  minimized: boolean;
  maximized: boolean;
  initialNote?: NoteId;
  noteEntry?: number;
}

const windowSizes: Record<AppId, { w: number; h: number }> = {
  projects: { w: 860, h: 560 },
  cv: { w: 640, h: 600 },
  letter: { w: 900, h: 620 },
  contact: { w: 780, h: 600 },
  shop: { w: 640, h: 460 },
  love: { w: 420, h: 560 },
  messages: { w: 860, h: 600 },
  health: { w: 780, h: 600 },
  reminders: { w: 720, h: 560 },
  maps: { w: 860, h: 620 },
  weather: { w: 940, h: 680 },
  camera: { w: 460, h: 650 },
  photos: { w: 860, h: 600 },
};

function MacWindow({ win, index, focused, bounds, onFocus, onClose, onMinimize, onMaximize, onLaunch }: {
  win: WindowState; index: number; focused: boolean; bounds: React.RefObject<HTMLDivElement>;
  onFocus: () => void; onClose: () => void; onMinimize: () => void; onMaximize: () => void; onLaunch: (id: LauncherId) => void;
}) {
  const controls = useDragControls();
  const size = windowSizes[win.id];
  return (
    <motion.section
      role="dialog"
      aria-label={appTitles[win.id]}
      className={`mac-window ${focused ? "focused" : ""} ${win.maximized ? "maximized" : ""}`}
      style={{ zIndex: win.z, width: win.maximized ? undefined : size.w, height: win.maximized ? undefined : size.h, left: win.maximized ? undefined : `calc(50% - ${size.w / 2}px + ${index * 28 - 40}px)`, top: win.maximized ? undefined : 60 + index * 26 }}
      drag={!win.maximized}
      dragControls={controls}
      dragListener={false}
      dragMomentum={false}
      dragConstraints={bounds}
      dragElastic={0}
      onPointerDown={onFocus}
      initial={{ opacity: 0, scale: 0.85, y: 40 }}
      animate={win.minimized ? { opacity: 0, scale: 0.2, y: 600 } : { opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.16 } }}
      transition={{ type: "spring", stiffness: 320, damping: 30 }}
    >
      <header className="mac-titlebar" onPointerDown={(event) => controls.start(event)} onDoubleClick={onMaximize}>
        <div className="mac-lights">
          <button aria-label="Close window" className="mac-light close" onClick={onClose} />
          <button aria-label="Minimise window" className="mac-light min" onClick={onMinimize} />
          <button aria-label="Toggle full size" className="mac-light max" onClick={onMaximize} />
        </div>
        <span className="mac-title">{appTitles[win.id]}</span>
      </header>
      <div className="mac-window-body">
        <AppContent key={win.id === "letter" ? win.noteEntry : win.id} id={win.id} initialNote={win.initialNote} onLaunch={onLaunch} />
      </div>
    </motion.section>
  );
}

export function MacDesktop() {
  const [locked, setLocked] = useState(true);
  const now = useClock();
  const { theme, toggle: toggleTheme } = useOsTheme();
  const bounds = useRef<HTMLDivElement>(null);
  const wallpaper = useWallpaper();
  const [windows, setWindows] = useState<WindowState[]>([]);
  const topZ = windows.reduce((max, win) => Math.max(max, win.z), 0);
  const focused = windows.filter((win) => !win.minimized).sort((a, b) => b.z - a.z)[0];

  const focus = useCallback((id: AppId) => {
    setWindows((list) => {
      const max = list.reduce((m, w) => Math.max(m, w.z), 0);
      return list.map((w) => (w.id === id ? { ...w, z: max + 1, minimized: false } : w));
    });
  }, []);

  const launch = (id: LauncherId, initialNote?: NoteId) => {
    if (isLink(id)) {
      window.open(externalLinks[id], "_blank", "noopener,noreferrer");
      return;
    }
    setWindows((list) => (list.some((w) => w.id === id)
      ? list.map((win) => win.id === id && id === "letter" ? { ...win, initialNote, noteEntry: (win.noteEntry ?? 0) + 1 } : win)
      : [...list, { id, z: topZ + 1, minimized: false, maximized: false, initialNote, noteEntry: 0 }]));
    focus(id);
  };

  const update = (id: AppId, patch: Partial<WindowState>) => setWindows((list) => list.map((w) => (w.id === id ? { ...w, ...patch } : w)));
  const close = (id: AppId) => setWindows((list) => list.filter((w) => w.id !== id));

  return (
    <div className="mac-shell" style={{ backgroundImage: `url(${wallpaper})` }}>
      <div className="mac-wallpaper-tint" />
      <ExplorationNotifications enabled={!locked} activeApp={focused?.id} onLaunch={(id) => launch(id, id === "letter" ? "letter" : undefined)} />
      <nav className="mac-menubar" aria-label="Menu bar">
        <div className="mac-menubar-left">
          <AppleLogo />
          <strong>{focused ? appTitles[focused.id].replace("Henrietta-Onwuneme-CV.pdf", "Preview") : "Finder"}</strong>
          <button onClick={() => launch("projects")}>Projects</button>
          <button onClick={() => launch("cv")}>CV</button>
          <button onClick={() => launch("contact")}>Contact</button>
        </div>
        <div className="mac-menubar-right">
          <button onClick={toggleTheme} aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}>{theme === "dark" ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}</button>
          <MacWifiArcs />
          <MacBattery />
          <span>{format(now, "EEE d MMM HH:mm")}</span>
        </div>
      </nav>

      <AppOrganizer storageKey="portfolio-desktop-apps-v1" defaults={desktopLayout} openIds={windows.map((win) => win.id)} onLaunch={(app) => { if (app.launcher) launch(app.launcher, app.id === "shortcut:letter" ? "letter" : undefined); }}>
      <div ref={bounds} className="mac-desktop">
        <MacWidgets now={now} onLaunch={launch} />

        <AppZone zone="desktop" desktop />

        <AnimatePresence>
          {windows.map((win, index) => (
            <MacWindow
              key={win.id}
              win={win}
              index={index}
              focused={focused?.id === win.id}
              bounds={bounds}
              onFocus={() => focus(win.id)}
              onClose={() => close(win.id)}
              onMinimize={() => update(win.id, { minimized: true })}
              onMaximize={() => update(win.id, { maximized: !win.maximized })}
              onLaunch={launch}
            />
          ))}
        </AnimatePresence>
      </div>

      <nav className="mac-dock" aria-label="Dock">
        <AppZone zone="dock" className="os-mac-dock-apps" />
      </nav>
      </AppOrganizer>
      {locked && <LoadingLock desktop onUnlock={() => setLocked(false)} />}
    </div>
  );
}
