import { useEffect, useRef, useState } from "react";

export const useScrollFade = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [opacity, setOpacity] = useState(1);
  const [translateY, setTranslateY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Element fades as it scrolls up past the middle of the viewport
      const fadeStart = windowHeight * 0.6; // Start fading when element is 60% up the viewport
      const fadeEnd = windowHeight * 0.2; // Fully faded when element is 20% up the viewport
      
      if (rect.bottom > fadeStart) {
        setOpacity(1);
        setTranslateY(0);
      } else if (rect.bottom < fadeEnd) {
        setOpacity(0);
        setTranslateY(-30);
      } else {
        const fadeRange = fadeStart - fadeEnd;
        const currentPosition = rect.bottom - fadeEnd;
        const newOpacity = currentPosition / fadeRange;
        const newTranslateY = -30 * (1 - newOpacity);
        setOpacity(Math.max(0, Math.min(1, newOpacity)));
        setTranslateY(newTranslateY);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return { ref, opacity, translateY };
};
