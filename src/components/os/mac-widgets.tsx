import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { addDays, format } from "date-fns";
import { Cloud, CloudRain, CloudSun, Navigation, Sun } from "lucide-react";
import type { LauncherId } from "./os-apps";

interface MacWidgetsProps {
  now: Date;
  onLaunch: (id: LauncherId) => void;
}

interface Weather {
  temp: number;
  high: number;
  low: number;
  code: number;
}

export async function fetchLagosWeather(): Promise<Weather> {
  const res = await fetch(
    "https://api.open-meteo.com/v1/forecast?latitude=6.45&longitude=3.47&current=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min&timezone=Africa%2FLagos&forecast_days=1",
  );
  if (!res.ok) throw new Error("weather");
  const data = await res.json();
  return {
    temp: Math.round(data.current.temperature_2m),
    code: data.current.weather_code,
    high: Math.round(data.daily.temperature_2m_max[0]),
    low: Math.round(data.daily.temperature_2m_min[0]),
  };
}

export function describe(code: number) {
  if (code === 0) return { label: "Clear", Icon: Sun };
  if (code <= 2) return { label: "Partly Cloudy", Icon: CloudSun };
  if (code <= 48) return { label: "Cloudy", Icon: Cloud };
  return { label: "Rain", Icon: CloudRain };
}

const reminders: { label: string; id: LauncherId }[] = [
  { label: "Read Henrietta's letter", id: "letter" },
  { label: "Explore Sally", id: "projects" },
  { label: "Book a call", id: "hire" },
];

const enter = (delay: number) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.4 },
});

export default function MacWidgets({ now, onLaunch }: MacWidgetsProps) {
  const { data: weather } = useQuery({ queryKey: ["lagos-weather"], queryFn: fetchLagosWeather, staleTime: 30 * 60 * 1000, retry: 1 });
  const sky = describe(weather?.code ?? 2);
  const tomorrow = addDays(now, 1);

  return (
    <div className="mac-widgets">
      <motion.div className="mw mw-sq mw-clock" {...enter(0.1)} aria-label="Clock">
        <span className="mw-cap">{format(now, "EEE d MMM")}</span>
        <span className="mw-clock-time">{format(now, "HH:mm")}</span>
      </motion.div>

      <motion.button className="mw mw-sq mw-cal" {...enter(0.18)} onClick={() => onLaunch("hire")}>
        <span className="mw-cap">{format(now, "EEEE")}</span>
        <span className="mw-big">{format(now, "d")}</span>
        <span className="mw-cap mw-gap">Tomorrow</span>
        <span className="mw-event">
          <strong>Chat with Henrietta</strong>
          <small>{format(tomorrow, "EEE")} 10:00 to 10:30</small>
        </span>
      </motion.button>

      <motion.div className="mw mw-sq mw-rem" {...enter(0.26)}>
        <div className="mw-rem-head"><span>Reminders</span><strong>{reminders.length}</strong></div>
        {reminders.map((r) => (
          <button key={r.label} className="mw-rem-item" onClick={() => onLaunch(r.id)}>
            <span className="mw-ring" aria-hidden="true" />
            <span className="mw-ellipsis">{r.label}</span>
          </button>
        ))}
      </motion.div>

      <motion.div className="mw mw-wide mw-intro" {...enter(0.34)}>
        <span className="mw-cap mw-accent">MyPvrpleSpace</span>
        <h1>Hi, I'm&nbsp;<span className="font-handwritten">Henrietta.</span></h1>
        <p>Product management for me is about people, their needs, and the paths we create to meet them. I've shipped 5+ MVPs with up to 85% faster time to market.</p>
      </motion.div>

      <motion.div className="mw mw-sq mw-weather" {...enter(0.42)} aria-label="Weather in Lagos">
        <span className="mw-place">Lagos <Navigation aria-hidden="true" /></span>
        <span className="mw-temp">{weather ? `${weather.temp}°` : "--"}</span>
        <sky.Icon className="mw-sky" aria-hidden="true" />
        <span className="mw-sky-label">{sky.label}</span>
        <span className="mw-hl">{weather ? `H:${weather.high}° L:${weather.low}°` : "Loading"}</span>
      </motion.div>
    </div>
  );
}
