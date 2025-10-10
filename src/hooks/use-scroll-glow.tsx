import { useEffect, useRef, useState } from "react";

export const useScrollGlow = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [glowIntensity, setGlowIntensity] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const elementCenter = rect.top + rect.height / 2;
      const viewportCenter = windowHeight / 2;
      
      // Calculate distance from viewport center
      const distance = Math.abs(elementCenter - viewportCenter);
      const maxDistance = windowHeight / 2;
      
      // Calculate glow intensity (1 when centered, 0 when far away)
      const intensity = Math.max(0, 1 - (distance / maxDistance));
      
      setGlowIntensity(intensity);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return { ref, glowIntensity };
};
