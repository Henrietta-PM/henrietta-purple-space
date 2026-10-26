import { useEffect, useState } from "react";
import hero from "@/assets/henrietta-hero.jpg";
import hero1 from "@/assets/henrietta-hero-1.jpg";
import hero2 from "@/assets/henrietta-hero-2.jpg";
import hero3 from "@/assets/henrietta-hero-3.jpg";
import hero4 from "@/assets/henrietta-hero-4.jpg";

export const wallpapers = [hero, hero1, hero2, hero3, hero4];
export { lockWallpaper } from "./lock-wallpaper";

const ROTATE_MS = 6000;

if (typeof window !== "undefined") {
  wallpapers.forEach((src) => {
    const img = new Image();
    img.decoding = "async";
    img.src = src;
  });
}

export function useWallpaper() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const timer = window.setInterval(() => setIndex((i) => (i + 1) % wallpapers.length), ROTATE_MS);
    return () => window.clearInterval(timer);
  }, []);
  return wallpapers[index];
}
