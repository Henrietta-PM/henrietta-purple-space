import { useScrollFade } from "@/hooks/use-scroll-fade";
import { useScrollGlow } from "@/hooks/use-scroll-glow";

interface SkillTagProps {
  skill: string;
  index: number;
  isVisible: boolean;
}

const SkillTag = ({ skill, index, isVisible }: SkillTagProps) => {
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
      className={`glass text-base px-6 py-3 rounded-full hover-scale transition-all duration-700 cursor-default ${
        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
      }`}
      style={{ 
        transitionDelay: `${index * 50}ms`,
        opacity,
        transform: `translateY(${translateY}px) scale(${isVisible ? 1 : 0.9})`,
        boxShadow: `0 0 ${30 * glowIntensity}px ${6 * glowIntensity}px hsl(var(--primary) / ${0.2 * glowIntensity}), 0 0 ${60 * glowIntensity}px ${12 * glowIntensity}px hsl(var(--primary) / ${0.1 * glowIntensity})`
      }}
    >
      {skill}
    </span>
  );
};

export default SkillTag;
