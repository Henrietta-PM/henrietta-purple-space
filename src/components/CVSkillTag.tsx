import { useScrollFade } from "@/hooks/use-scroll-fade";
import { useScrollGlow } from "@/hooks/use-scroll-glow";

interface CVSkillTagProps {
  skill: string;
}

const CVSkillTag = ({ skill }: CVSkillTagProps) => {
  const { ref, opacity, translateY } = useScrollFade();
  const { ref: glowRef, glowIntensity } = useScrollGlow();

  return (
    <span
      ref={(el) => {
        // @ts-ignore
        ref.current = el;
        // @ts-ignore
        glowRef.current = el;
      }}
      className="glass text-sm px-4 py-2 rounded-full transition-all duration-350 cursor-default"
      style={{ 
        opacity: Math.max(0.3, opacity),
        transform: `translateY(${translateY * 0.5}px)`,
        boxShadow: `0 0 ${30 * glowIntensity}px ${6 * glowIntensity}px hsl(var(--primary) / ${0.2 * glowIntensity}), 0 0 ${60 * glowIntensity}px ${12 * glowIntensity}px hsl(var(--primary) / ${0.1 * glowIntensity})`
      }}
    >
      {skill}
    </span>
  );
};

export default CVSkillTag;
