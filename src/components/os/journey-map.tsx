import { useEffect, useMemo, useState, type FormEvent } from "react";
import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { ChevronRight, LocateFixed, Map as MapIcon, Navigation, Plane, Clock, Route, Ruler, Search, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { featuredProjects } from "@/data/projects";
import { journeySteps } from "@/components/JourneySection";
import { friendlyDistance, haversineKm, flightHours } from "./journey-math";

type Stop = { id: string; title: string; subtitle: string; text: string; lat: number; lng: number; tone: "red" | "blue" | "green"; glyph: string };

const LAGOS = { lat: 6.4549, lng: 3.4246 };

const stops: Stop[] = [
  { id: "uniuyo", title: "University of Uyo", subtitle: "Uyo, Akwa Ibom", text: `${journeySteps[0].title}. I studied architecture here. ${journeySteps[0].text}`, lat: 5.0406, lng: 7.9757, tone: "red", glyph: "1" },
  { id: "lagos", title: "Lagos Island", subtitle: "Lagos, Nigeria", text: `${journeySteps[1].title}, from Lagos. ${journeySteps[1].text}`, lat: LAGOS.lat, lng: LAGOS.lng, tone: "blue", glyph: "2" },
];

const fade = { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -6 }, transition: { duration: 0.18 } };

type Visitor = { name: string; lat: number; lng: number; timezone: string; country?: string };

const pin = (tone: string, glyph: string, on: boolean) => L.divIcon({
  className: "",
  html: `<span class="jm-pin jm-pin-${tone}${on ? " on" : ""}"><b>${glyph}</b></span>`,
  iconSize: [34, 34],
  iconAnchor: [17, 34],
});

function FlyTo({ target, bounds, compact }: { target: [number, number] | null; bounds: [number, number][] | null; compact: boolean }) {
  const map = useMap();
  useEffect(() => {
    if (bounds) map.flyToBounds(bounds, { paddingTopLeft: compact ? [40, 70] : [340, 60], paddingBottomRight: compact ? [40, 380] : [60, 60], duration: 1.2 });
    else if (target) map.flyTo(target, 13, { duration: 1.2 });
  }, [map, target, bounds, compact]);
  return null;
}

const timeIn = (tz: string) => new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: tz }).format(new Date());
const offsetHours = (tz: string) => {
  const now = new Date();
  const at = (zone: string) => new Date(now.toLocaleString("en-US", { timeZone: zone })).getTime();
  return Math.round(((at(tz) - at("Africa/Lagos")) / 36e5) * 2) / 2;
};

export default function JourneyMap({ compact }: { compact: boolean }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [visitor, setVisitor] = useState<Visitor | null>(null);
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");
  const [focus, setFocus] = useState<{ target: [number, number] | null; bounds: [number, number][] | null }>({ target: null, bounds: stops.map((s) => [s.lat, s.lng]) });

  const stop = stops.find((s) => s.id === selected) ?? null;
  const km = visitor ? haversineKm(LAGOS, visitor) : 0;

  const open = (s: Stop) => { setSelected(s.id); setFocus({ target: [s.lat, s.lng], bounds: null }); };
  const back = () => { setSelected(null); setFocus({ target: null, bounds: [...stops.map((s): [number, number] => [s.lat, s.lng]), ...(visitor ? [[visitor.lat, visitor.lng] as [number, number]] : [])] }); };

  const findCity = async (e: FormEvent) => {
    e.preventDefault();
    const name = query.trim().slice(0, 80);
    if (!name) return;
    setSearching(true); setError("");
    try {
      const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(name)}&count=1&language=en&format=json`);
      const data = await res.json();
      const hit = data?.results?.[0];
      if (!hit) { setError("We couldn't find that city. Try another spelling."); return; }
      const v: Visitor = { name: hit.name, country: hit.country, lat: hit.latitude, lng: hit.longitude, timezone: hit.timezone || "UTC" };
      setVisitor(v); setSelected("you");
      setFocus({ target: null, bounds: [[LAGOS.lat, LAGOS.lng], [v.lat, v.lng]] });
    } catch {
      setError("Search isn't available right now. Please try again.");
    } finally { setSearching(false); }
  };

  const icons = useMemo(() => Object.fromEntries(stops.map((s) => [s.id, pin(s.tone, s.glyph, selected === s.id)])), [selected]);
  const youIcon = useMemo(() => pin("green", "You", selected === "you"), [selected]);
  const diff = visitor ? offsetHours(visitor.timezone) : 0;

  return (
    <div className={`os-maps apple-maps ${compact ? "apple-maps-phone" : "apple-maps-mac"}`}>
      <MapContainer className="apple-map-frame jm-map" center={[6, 5.5]} zoom={6} zoomControl={false} attributionControl>
        <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
        <FlyTo target={focus.target} bounds={focus.bounds} compact={compact} />
        <Polyline positions={stops.map((s): [number, number] => [s.lat, s.lng])} pathOptions={{ className: "jm-route" }} />
        {visitor && <Polyline positions={[[LAGOS.lat, LAGOS.lng], [visitor.lat, visitor.lng]]} pathOptions={{ className: "jm-route jm-route-you", dashArray: "2 8" }} />}
        {stops.map((s) => <Marker key={s.id} position={[s.lat, s.lng]} icon={icons[s.id]} eventHandlers={{ click: () => open(s) }} />)}
        {visitor && <Marker position={[visitor.lat, visitor.lng]} icon={youIcon} eventHandlers={{ click: () => setSelected("you") }} />}
      </MapContainer>
      <button type="button" className="apple-map-location" aria-label="Show my whole journey" title="Show my whole journey" onClick={back}><Navigation /></button>

      <div className="os-maps-sheet">
        <span className="os-maps-grabber" aria-hidden="true" />
        <AnimatePresence mode="wait" initial={false}>
        {stop ? (
          <motion.div key={stop.id} className="jm-card" {...fade}>
            <div className="jm-card-head">
              <div>
                <h2>{stop.title}</h2>
                <small className="os-maps-sub">{stop.subtitle} · Stop {stop.glyph} of 3</small>
              </div>
              <Button variant="ghost" size="icon" className="jm-round" aria-label="Close" onClick={back}><X /></Button>
            </div>
            <div className="jm-actions">
              <a className="jm-action jm-action-primary" href={`https://maps.apple.com/?ll=${stop.lat},${stop.lng}&q=${encodeURIComponent(stop.title)}`} target="_blank" rel="noopener noreferrer"><MapIcon /><span>Apple Maps</span></a>
              <button type="button" className="jm-action" onClick={() => open(stop)}><LocateFixed /><span>Zoom in</span></button>
              <button type="button" className="jm-action" onClick={back}><Route /><span>Journey</span></button>
            </div>
            <h3 className="jm-section">About</h3>
            <div className="jm-group"><p className="jm-text">{stop.text}</p></div>
            {stop.id === "lagos" && (
              <>
                <h3 className="jm-section">Built from here</h3>
                <div className="jm-group">
                  {featuredProjects.map((p) => <div key={p.name} className="jm-row"><span className="jm-row-dot" aria-hidden="true" /><strong>{p.name}</strong></div>)}
                </div>
              </>
            )}
            <div className="jm-nav">
              {stops.map((s) => <button key={s.id} type="button" className={s.id === stop.id ? "on" : ""} onClick={() => open(s)} aria-label={s.title}><span className={`os-maps-dot jm-dot-${s.tone}`}>{s.glyph}</span></button>)}
            </div>
          </motion.div>
        ) : selected === "you" && visitor ? (
          <motion.div key="you" className="jm-card" {...fade}>
            <div className="jm-card-head">
              <div>
                <h2>Lagos to {visitor.name}</h2>
                <small className="os-maps-sub">Where I'm headed{visitor.country ? ` · ${visitor.country}` : ""}</small>
              </div>
              <Button variant="ghost" size="icon" className="jm-round" aria-label="Close" onClick={back}><X /></Button>
            </div>
            <div className="jm-stats">
              <div><Ruler /><small>Distance</small><strong>{friendlyDistance(km)}</strong></div>
              <div><Plane /><small>Flight time</small><strong>about {flightHours(km)}</strong></div>
              <div><Clock /><small>Your time</small><strong>{timeIn(visitor.timezone)}</strong></div>
              <div><Clock /><small>Lagos time</small><strong>{timeIn("Africa/Lagos")}</strong></div>
            </div>
            <h3 className="jm-section">About</h3>
            <div className="jm-group">
              <p className="jm-text">{journeySteps[2].text}</p>
              <p className="jm-text jm-muted">{diff === 0 ? "We share the same time zone, so working hours line up." : `You are ${Math.abs(diff)} hour${Math.abs(diff) === 1 ? "" : "s"} ${diff > 0 ? "ahead of" : "behind"} Lagos.`} Distance is a straight line, flight time is an estimate.</p>
            </div>
            <button type="button" className="jm-link" onClick={() => { setVisitor(null); setQuery(""); back(); }}>Try another city</button>
          </motion.div>
        ) : (
          <motion.div key="home" {...fade}>
            <form className="jm-search" onSubmit={findCity}>
              <Search aria-hidden="true" />
              <input id="jm-city" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Where are you? Enter your city" aria-label="Your city" maxLength={80} />
              {query.trim() && <Button type="submit" size="sm" disabled={searching}>{searching ? "Finding" : "Go"}</Button>}
            </form>
            {error && <p className="jm-error" role="alert">{error}</p>}
            <div className="jm-guide">
              <span className="jm-guide-badge">Guide</span>
              <h2>My Journey</h2>
              <small className="os-maps-sub">Architecture to Product Management · 3 stops</small>
            </div>
            <ol className="jm-group jm-steps">
              {stops.map((s) => (
                <li key={s.id}>
                  <Button variant="ghost" onClick={() => open(s)}>
                    <span className={`os-maps-dot jm-dot-${s.tone}`}>{s.glyph}</span>
                    <span><strong>{s.title}</strong><small>{s.id === "uniuyo" ? "Where I started · Studied architecture" : "What I've built · Where I build from"}</small></span>
                    <ChevronRight />
                  </Button>
                </li>
              ))}
              <li>
                <Button variant="ghost" onClick={() => document.getElementById("jm-city")?.focus()}>
                  <span className="os-maps-dot jm-dot-green">3</span>
                  <span><strong>Where I'm headed</strong><small>{journeySteps[2].text}</small></span>
                  <ChevronRight />
                </Button>
              </li>
            </ol>
          </motion.div>
        )}
        </AnimatePresence>
      </div>
    </div>
  );
}
