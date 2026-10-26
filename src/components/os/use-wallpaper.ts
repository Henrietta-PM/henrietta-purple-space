import { useEffect, useState } from "react";
import portrait from "@/assets/henrietta-portrait.jpg";
import hero from "@/assets/henrietta-hero.jpg";
import hero1 from "@/assets/henrietta-hero-1.jpg";
import hero2 from "@/assets/henrietta-hero-2.jpg";
import hero3 from "@/assets/henrietta-hero-3.jpg";
import hero4 from "@/assets/henrietta-hero-4.jpg";
import hero5 from "@/assets/henrietta-hero-5.jpg";

export const wallpapers = [portrait, hero, hero1, hero2, hero3, hero4, hero5];
export const lockWallpaper = hero;

const ROTATE_MS = 6000;

export function useWallpaper() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    wallpapers.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
    const timer = window.setInterval(() => setIndex((i) => (i + 1) % wallpapers.length), ROTATE_MS);
    return () => window.clearInterval(timer);
  }, []);
  return wallpapers[index];
}
