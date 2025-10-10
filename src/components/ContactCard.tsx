import { useScrollFade } from "@/hooks/use-scroll-fade";
import { useScrollGlow } from "@/hooks/use-scroll-glow";
import { ReactNode } from "react";

interface ContactCardProps {
  children: ReactNode;
}

const ContactCard = ({ children }: ContactCardProps) => {
  const { ref, opacity, translateY } = useScrollFade();
  const { ref: glowRef, glowIntensity } = useScrollGlow();

  return (
    <div
      ref={(el) => {
        // @ts-ignore
        ref.current = el;
        // @ts-ignore
        glowRef.current = el;
      }}
      className="glass p-8 rounded-[1.5rem]"
      style={{ 
        opacity, 
        transform: `translateY(${translateY}px)`,
        boxShadow: `0 0 ${40 * glowIntensity}px ${8 * glowIntensity}px hsl(var(--primary) / ${0.2 * glowIntensity}), 0 0 ${80 * glowIntensity}px ${16 * glowIntensity}px hsl(var(--primary) / ${0.1 * glowIntensity})`
      }}
    >
      {children}
    </div>
  );
};

export default ContactCard;
