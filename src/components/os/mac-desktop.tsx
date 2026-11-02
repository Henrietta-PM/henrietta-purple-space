import { useCallback, useRef, useState } from "react";
import { AnimatePresence, motion, useDragControls, useReducedMotion } from "framer-motion";
import { format } from "date-fns";
import { Moon, Sun } from "lucide-react";
import { AppleLogo, MacBattery, MacWifiArcs } from "./status-icons";
import { useOsTheme } from "./use-os-theme";
import { useWallpaper } from "./use-wallpaper";
import { AppContent, allProjects, appTitles, externalLinks, isLink, type AppId, type LauncherId } from "./os-apps";
import { useClock } from "./use-clock";
import MacWidgets from "./mac-widgets";
import ExplorationNotifications from "./exploration-notifications";
import AppOrganizer, { AppZone } from "./app-organizer";
import { desktopLayout } from "./app-catalog";
import type { NoteId } from "@/data/notes";
import { LoadingLock } from "./loading-lock";
import type { SafariRequest } from "./safari-app";
import { activateOsAudio, playOsSound, useOsInteractionSounds } from "./os-sounds";
import SoundToggle from "./sound-toggle";
import MacLockNotifications from "./mac-lock-notifications";

interface WindowState {
  id: AppId;
  z: number;
  minimized: boolean;
  maximized: boolean;
  initialNote?: NoteId;
  noteEntry?: number;
  projectName?: string;
  safariRequest?: SafariRequest;
}

const windowSizes: Record<AppId, { w: number; h: number }> = {
  projects: { w: 860, h: 560 },
  cv: { w: 640, h: 600 },
  letter: { w: 900, h: 620 },
  contact: { w: 780, h: 600 },
  mail: { w: 860, h: 600 },
  safari: { w: 960, h: 650 },
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

function MacWindow({ win, index, focused, bounds, onFocus, onClose, onMinimize, onMaximize, onLaunch, onOpenSafari }: {
  win: WindowState; index: number; focused: boolean; bounds: React.RefObject<HTMLDivElement>;
  onFocus: () => void; onClose: () => void; onMinimize: () => void; onMaximize: () => void; onLaunch: (id: LauncherId) => void;
  onOpenSafari: (url: string, projectName?: string, mode?: "tour" | "website") => void;
}) {
  const controls = useDragControls();
  const reducedMotion = useReducedMotion();
  const size = windowSizes[win.id];
  return (
    <motion.section
      role="dialog"
      aria-label={appTitles[win.id]}
      className={`mac-window ${win.id === "safari" ? "mac-window-safari" : ""} ${focused ? "focused" : ""} ${win.maximized ? "maximized" : ""}`}
      drag={!win.maximized}
      dragControls={controls}
      dragListener={false}
      dragMomentum={false}
      dragConstraints={bounds}
      dragElastic={0}
      onPointerDown={(event) => {
        onFocus();
        if (win.id === "safari" && event.target instanceof Element && event.target.closest(".safari-toolbar") && !event.target.closest("button,input,form")) controls.start(event);
      }}
      initial={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.94, y: 18 }}
      animate={win.minimized ? { opacity: 0, scale: reducedMotion ? 1 : 0.12, y: reducedMotion ? 0 : 600 } : { opacity: 1, scale: 1, y: 0 }}
      exit={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 8, transition: { duration: 0.18 } }}
      transition={reducedMotion ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 34 }}
      style={{ zIndex: win.z, width: win.maximized ? undefined : size.w, height: win.maximized ? undefined : size.h, left: win.maximized ? undefined : `calc(50% - ${size.w / 2}px + ${index * 28 - 40}px)`, top: win.maximized ? undefined : 60 + index * 26, pointerEvents: win.minimized ? "none" : "auto" }}
    >
      <header className="mac-titlebar" onPointerDown={(event) => controls.start(event)} onDoubleClick={onMaximize}>
        <div className="mac-lights">
          <button aria-label="Close window" className="mac-light close" onClick={onClose} />
          <button aria-label="Minimise window" className="mac-light min" onClick={onMinimize} />
          <button aria-label="Toggle full size" className="mac-light max" onClick={onMaximize} />
        </div>
        {win.id !== "safari" && <span className="mac-title">{appTitles[win.id]}</span>}
      </header>
      <div className="mac-window-body">
        <AppContent key={win.id === "letter" || win.id === "projects" ? `${win.id}-${win.noteEntry}` : win.id} id={win.id} initialNote={win.initialNote} projectName={win.projectName} onLaunch={onLaunch} onOpenSafari={onOpenSafari} safariRequest={win.safariRequest} />
      </div>
    </motion.section>
  );
}

export function MacDesktop() {
  const [locked, setLocked] = useState(true);
  useOsInteractionSounds(true);
  const now = useClock();
  const { theme, toggle: toggleTheme } = useOsTheme();
  const bounds = useRef<HTMLDivElement>(null);
  const wallpaper = useWallpaper();
  const [windows, setWindows] = useState<WindowState[]>([]);
  const safariEntry = useRef(0);
  const topZ = windows.reduce((max, win) => Math.max(max, win.z), 0);
  const focused = windows.filter((win) => !win.minimized).sort((a, b) => b.z - a.z)[0];

  const focus = useCallback((id: AppId) => {
    setWindows((list) => {
      const max = list.reduce((m, w) => Math.max(m, w.z), 0);
      return list.map((w) => (w.id === id ? { ...w, z: max + 1, minimized: false } : w));
    });
  }, []);

  const launch = (id: LauncherId, initialNote?: NoteId, projectName?: string) => {
    if (isLink(id)) {
      window.open(externalLinks[id], "_blank", "noopener,noreferrer");
      return;
    }
    playOsSound(windows.some((win) => win.id === id && !win.minimized) ? "tap" : "open");
    setWindows((list) => (list.some((w) => w.id === id)
      ? list.map((win) => win.id === id && ((id === "letter" && initialNote !== undefined) || (id === "projects" && projectName !== undefined)) ? { ...win, initialNote, projectName, noteEntry: (win.noteEntry ?? 0) + 1 } : win)
      : [...list, { id, z: topZ + 1, minimized: false, maximized: false, initialNote, projectName, noteEntry: 0 }]));
    focus(id);
  };

  const update = (id: AppId, patch: Partial<WindowState>) => setWindows((list) => list.map((w) => (w.id === id ? { ...w, ...patch } : w)));
  const openSafari = (url: string, projectName?: string, mode: "tour" | "website" = "website") => {
    playOsSound(windows.some((win) => win.id === "safari" && !win.minimized) ? "tap" : "open");
    const safariRequest = { url, projectName, mode, entry: ++safariEntry.current };
    setWindows((list) => list.some((win) => win.id === "safari") ? list.map((win) => win.id === "safari" ? { ...win, safariRequest } : win) : [...list, { id:"safari", z:topZ + 1, minimized:false, maximized:false, safariRequest }]);
    focus("safari");
  };
  const close = (id: AppId) => { playOsSound("close"); setWindows((list) => list.filter((w) => w.id !== id)); };

  return (
    <div className="mac-shell" style={{ backgroundImage: `url(${wallpaper})` }}>
      <div className="mac-wallpaper-tint" />
      <ExplorationNotifications enabled={!locked} activeApp={focused?.id} onLaunch={(id) => launch(id, id === "letter" ? "letter" : undefined)} />
      {!locked && <nav className="mac-menubar" aria-label="Menu bar">
        <div className="mac-menubar-left">
          <AppleLogo />
          <strong>{focused ? appTitles[focused.id].replace("Henrietta-Onwuneme-CV.pdf", "Preview") : "Finder"}</strong>
          <button onClick={() => launch("projects")}>Projects</button>
          <button onClick={() => launch("cv")}>CV</button>
          <button onClick={() => launch("contact")}>Contact</button>
        </div>
        <div className="mac-menubar-right">
          <SoundToggle />
          <button onClick={toggleTheme} aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}>{theme === "dark" ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}</button>
          <MacWifiArcs />
          <MacBattery />
          <span>{format(now, "EEE d MMM HH:mm")}</span>
        </div>
      </nav>}

      <AppOrganizer storageKey="portfolio-desktop-apps-v1" hideControls={locked} defaults={desktopLayout} openIds={windows.map((win) => win.id)} onLaunch={(app) => { if (app.id.startsWith("web:")) { const project = allProjects.find((item) => item.name === app.projectName); if (project) openSafari(project.link, project.name, "website"); return; } if (app.launcher) launch(app.launcher, app.id === "shortcut:letter" ? "letter" : undefined); }}>
      <div ref={bounds} className="mac-desktop">
        <MacWidgets now={now} onLaunch={(id, note, project) => launch(id, note, project)} />

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
              onMinimize={() => { playOsSound("close"); update(win.id, { minimized: true }); }}
              onMaximize={() => { playOsSound("open"); update(win.id, { maximized: !win.maximized }); }}
              onLaunch={launch}
              onOpenSafari={openSafari}
            />
          ))}
        </AnimatePresence>
      </div>

      {!locked && <nav className="mac-dock" aria-label="Dock">
        <AppZone zone="dock" className="os-mac-dock-apps" />
      </nav>}
      </AppOrganizer>
      {locked && <LoadingLock desktop onUnlock={() => { activateOsAudio(); playOsSound("unlock"); setLocked(false); }}><MacLockNotifications onNotice={(app, title) => {
        activateOsAudio();
        setLocked(false);
        launch(app, app === "letter" ? "letter" : undefined, app === "projects" ? title : undefined);
      }} /></LoadingLock>}
    </div>
  );
}
