import { useCallback, useEffect, useState } from "react";

export type OsTheme = "dark" | "light";
export type OsThemePref = OsTheme | "system";
const KEY = "os-theme";
const EVENT = "os-theme-change";
const QUERY = "(prefers-color-scheme: light)";

const readPref = (): OsThemePref => {
  const value = localStorage.getItem(KEY);
  return value === "light" || value === "dark" ? value : "system";
};
const systemTheme = (): OsTheme => (window.matchMedia?.(QUERY).matches ? "light" : "dark");

export function useOsTheme() {
  const [pref, setPrefState] = useState<OsThemePref>(readPref);
  const [system, setSystem] = useState<OsTheme>(systemTheme);
  useEffect(() => {
    const sync = () => setPrefState(readPref());
    const media = window.matchMedia?.(QUERY);
    const onMedia = () => setSystem(systemTheme());
    window.addEventListener(EVENT, sync);
    media?.addEventListener("change", onMedia);
    return () => {
      window.removeEventListener(EVENT, sync);
      media?.removeEventListener("change", onMedia);
    };
  }, []);
  const theme: OsTheme = pref === "system" ? system : pref;
  const setPref = useCallback((next: OsThemePref) => {
    if (next === "system") localStorage.removeItem(KEY);
    else localStorage.setItem(KEY, next);
    window.dispatchEvent(new Event(EVENT));
  }, []);
  const toggle = useCallback(() => setPref(theme === "dark" ? "light" : "dark"), [setPref, theme]);
  return { theme, pref, setPref, toggle };
}
