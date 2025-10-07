import { useEffect, useRef, useState } from "react";

export const useScrollFade = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate opacity based on how much of the section has been scrolled past
      // Fade starts when top of section reaches middle of viewport
      // Fade ends when section is completely off screen
      const fadeStart = windowHeight * 0.5;
      const fadeEnd = -rect.height;
      
      if (rect.top > fadeStart) {
        setOpacity(1);
      } else if (rect.top < fadeEnd) {
        setOpacity(0);
      } else {
        const fadeRange = fadeStart - fadeEnd;
        const currentPosition = rect.top - fadeEnd;
        const newOpacity = currentPosition / fadeRange;
        setOpacity(Math.max(0, Math.min(1, newOpacity)));
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return { ref, opacity };
};
