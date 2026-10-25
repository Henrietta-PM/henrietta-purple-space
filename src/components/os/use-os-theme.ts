import { useCallback, useEffect, useState } from "react";

export type OsTheme = "dark" | "light";
const KEY = "os-theme";
const EVENT = "os-theme-change";

export function useOsTheme() {
  const [theme, setTheme] = useState<OsTheme>(() => (localStorage.getItem(KEY) === "light" ? "light" : "dark"));
  useEffect(() => {
    const sync = () => setTheme(localStorage.getItem(KEY) === "light" ? "light" : "dark");
    window.addEventListener(EVENT, sync);
    return () => window.removeEventListener(EVENT, sync);
  }, []);
  const toggle = useCallback(() => {
    localStorage.setItem(KEY, theme === "dark" ? "light" : "dark");
    window.dispatchEvent(new Event(EVENT));
  }, [theme]);
  return { theme, toggle };
}
