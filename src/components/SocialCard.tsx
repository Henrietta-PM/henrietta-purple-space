import { useScrollFade } from "@/hooks/use-scroll-fade";
import { useScrollGlow } from "@/hooks/use-scroll-glow";
import { LucideIcon } from "lucide-react";

interface SocialCardProps {
  href: string;
  icon: LucideIcon;
  label: string;
}

const SocialCard = ({ href, icon: Icon, label }: SocialCardProps) => {
  const { ref, opacity, translateY } = useScrollFade();
  const { ref: glowRef, glowIntensity } = useScrollGlow();

  return (
    <a
      ref={(el) => {
        // @ts-ignore
        ref.current = el;
        // @ts-ignore
        glowRef.current = el;
      }}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="p-6 glass rounded-xl hover:-translate-y-1 transition-all duration-350 flex flex-col items-center gap-3 group"
      style={{ 
        opacity, 
        transform: `translateY(${translateY}px)`,
        boxShadow: `0 0 ${40 * glowIntensity}px ${8 * glowIntensity}px hsl(var(--primary) / ${0.2 * glowIntensity}), 0 0 ${80 * glowIntensity}px ${16 * glowIntensity}px hsl(var(--primary) / ${0.1 * glowIntensity})`
      }}
    >
      <Icon className="w-8 h-8 text-primary-visible" />
      <p className="font-semibold text-sm">{label}</p>
    </a>
  );
};

export default SocialCard;
