import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Navigation, MapPin, CalendarDays } from "lucide-react";
import { describe } from "./mac-widgets";
import { AppleSections } from "./apple-app-chrome";

interface Forecast {
  temp: number;
  code: number;
  high: number;
  low: number;
  feels: number;
  humidity: number;
  wind: number;
  hours: { time: string; temp: number; code: number }[];
  days: { date: string; code: number; high: number; low: number }[];
}

async function fetchForecast(): Promise<Forecast> {
  const res = await fetch(
    "https://api.open-meteo.com/v1/forecast?latitude=6.45&longitude=3.47&current=temperature_2m,weather_code,apparent_temperature,relative_humidity_2m,wind_speed_10m&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=Africa%2FLagos&forecast_days=7",
  );
  if (!res.ok) throw new Error("weather");
  const d = await res.json();
  const nowIso = d.current.time as string;
  const start = Math.max(0, (d.hourly.time as string[]).findIndex((t) => t >= nowIso.slice(0, 13)));
  return {
    temp: Math.round(d.current.temperature_2m),
    code: d.current.weather_code,
    feels: Math.round(d.current.apparent_temperature),
    humidity: Math.round(d.current.relative_humidity_2m),
    wind: Math.round(d.current.wind_speed_10m),
    high: Math.round(d.daily.temperature_2m_max[0]),
    low: Math.round(d.daily.temperature_2m_min[0]),
    hours: (d.hourly.time as string[]).slice(start, start + 12).map((time, i) => ({
      time,
      temp: Math.round(d.hourly.temperature_2m[start + i]),
      code: d.hourly.weather_code[start + i],
    })),
    days: (d.daily.time as string[]).map((date, i) => ({
      date,
      code: d.daily.weather_code[i],
      high: Math.round(d.daily.temperature_2m_max[i]),
      low: Math.round(d.daily.temperature_2m_min[i]),
    })),
  };
}

export default function WeatherApp({ compact = false }: { compact?: boolean }) {
  const { data, isError } = useQuery({ queryKey: ["lagos-forecast"], queryFn: fetchForecast, staleTime: 30 * 60 * 1000, retry: 1 });
  const sky = describe(data?.code ?? 2);
  const weekLow = data ? Math.min(...data.days.map((d) => d.low)) : 0;
  const weekHigh = data ? Math.max(...data.days.map((d) => d.high)) : 1;
  const span = Math.max(1, weekHigh - weekLow);

  return (
    <AppleSections compact={compact} title="Weather" sections={[{ id: "lagos", label: "Lagos", icon: MapPin }]} selected="lagos" onSelect={() => undefined}>
    <div className={`wx-app ${compact ? "wx-phone" : "wx-mac"}`}>
      <header className="wx-hero">
        <span className="wx-place">Lagos <Navigation aria-hidden="true" /></span>
        <span className="wx-temp">{data ? `${data.temp}°` : "--"}</span>
        <span className="wx-sky">{isError ? "Weather unavailable" : sky.label}</span>
        <span className="wx-hl">{data ? `H:${data.high}°  L:${data.low}°` : "Loading"}</span>
      </header>

      {data && (
        <>
          <section className="wx-card">
            <p className="wx-cap">Hourly forecast</p>
            <div className="wx-hours">
              {data.hours.map((h, i) => {
                const s = describe(h.code);
                return (
                  <div key={h.time} className="wx-hour">
                    <span>{i === 0 ? "Now" : format(new Date(h.time), "HH")}</span>
                    <s.Icon aria-hidden="true" />
                    <strong>{h.temp}°</strong>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="wx-card">
            <p className="wx-cap"><CalendarDays />7-day forecast</p>
            {data.days.map((d, i) => {
              const s = describe(d.code);
              return (
                <div key={d.date} className="wx-day">
                  <span className="wx-day-name">{i === 0 ? "Today" : format(new Date(d.date), "EEE")}</span>
                  <s.Icon aria-hidden="true" />
                  <span className="wx-lo">{d.low}°</span>
                  <span className="wx-bar">
                    <i style={{ left: `${((d.low - weekLow) / span) * 100}%`, right: `${100 - ((d.high - weekLow) / span) * 100}%` }} />
                  </span>
                  <span>{d.high}°</span>
                </div>
              );
            })}
          </section>

          <div className="wx-grid">
            <section className="wx-card wx-tile"><p className="wx-cap">Feels like</p><strong>{data.feels}°</strong></section>
            <section className="wx-card wx-tile"><p className="wx-cap">Humidity</p><strong>{data.humidity}%</strong></section>
            <section className="wx-card wx-tile"><p className="wx-cap">Wind</p><strong>{data.wind} km/h</strong></section>
          </div>
        </>
      )}
    </div>
    </AppleSections>
  );
}
