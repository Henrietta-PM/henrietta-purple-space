import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { cancelLockAlert, playOsSound } from "./os-sounds";
import { lockWallpaper } from "./lock-wallpaper";
import { format } from "date-fns";
import { ChevronUp, Lock } from "lucide-react";
import { CalendarIcon, ImageIcon, NotesIcon, type LauncherId } from "./os-apps";
import sallyLogo from "@/assets/sally-logo.png";
import proxyIcon from "@/assets/proxymedicine-icon.png.asset.json";
import { lockNotices as notices } from "./lock-notices";

export function IphoneLock({ now, onUnlock }: { now: Date; onUnlock: (app?: LauncherId) => void }) {
  const [arrived, setArrived] = useState(0);
  const unlock = (app?: LauncherId) => {
    cancelLockAlert();
    onUnlock(app);
  };
  useEffect(() => {
    const timers = notices.map((_, index) => window.setTimeout(() => {
      setArrived(index + 1);
      playOsSound("lock-notification");
    }, 1000 + index * 3000));
    return () => {
      timers.forEach(window.clearTimeout);
      cancelLockAlert();
    };
  }, []);
  return (
    <motion.section
      className="ios-lock"
      style={{ backgroundImage: `url(${lockWallpaper})`, backgroundColor: "hsl(var(--camera-paper))" }}
      aria-label="Lock screen"
      initial={{ opacity: 1 }}
      exit={{ y: "-100%", transition: { duration: 0.45, ease: [0.32, 0.72, 0, 1] } }}
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={{ top: 0.6, bottom: 0 }}
      onDragEnd={(_, info) => { if (info.offset.y < -90 || info.velocity.y < -500) unlock(); }}
    >
      <div className="ios-lock-top">
        <Lock aria-hidden="true" />
        <span>{format(now, "EEEE d MMMM")}</span>
        <strong>{format(now, "HH:mm")}</strong>
      </div>

      <div className="ios-notices">
        {notices.slice(0, arrived).map((notice) => {
          return (
            <motion.button
              key={notice.title}
              className="ios-notice"
              onClick={() => unlock(notice.app)}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              whileTap={{ scale: 0.97 }}
            >
              {notice.title === "Sally" ? <ImageIcon src={sallyLogo} size="sm" /> : notice.title === "ProxyMedicine" ? <ImageIcon src={proxyIcon.url} size="sm" /> : notice.app === "hire" ? <CalendarIcon size="sm" /> : <NotesIcon size="sm" />}
              <span className="ios-notice-text">
                <span className="ios-notice-head"><strong>{notice.title}</strong><small>{notice.time}</small></span>
                <span>{notice.body}</span>
              </span>
            </motion.button>
          );
        })}
      </div>

      <button className="ios-unlock" onClick={() => unlock()}>
        <motion.span animate={{ y: [0, -6, 0], opacity: [0.6, 1, 0.6] }} transition={{ duration: 2, repeat: Infinity }}>
          <ChevronUp aria-hidden="true" />
          Swipe up to open
        </motion.span>
        <span className="ios-home-indicator light" aria-hidden="true" />
      </button>
    </motion.section>
  );
}
