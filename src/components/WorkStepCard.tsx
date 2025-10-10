import { useScrollFade } from "@/hooks/use-scroll-fade";
import { useScrollGlow } from "@/hooks/use-scroll-glow";

interface WorkStepCardProps {
  number: string;
  title: string;
  text: string;
  index: number;
  isVisible: boolean;
}

const WorkStepCard = ({ number, title, text, index, isVisible }: WorkStepCardProps) => {
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
      className={`relative glass rounded-[1.5rem] hover:-translate-y-2 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
      style={{ 
        transitionDelay: `${index * 100}ms`,
        opacity,
        transform: `translateY(${translateY}px)`,
        boxShadow: `0 0 ${40 * glowIntensity}px ${8 * glowIntensity}px hsl(var(--primary) / ${0.2 * glowIntensity}), 0 0 ${80 * glowIntensity}px ${16 * glowIntensity}px hsl(var(--primary) / ${0.1 * glowIntensity})`
      }}
    >
      <div className="pt-8 pb-6 px-6 text-center">
        <div className="mb-6 text-6xl font-display font-bold text-primary-visible opacity-70">
          {number}
        </div>
        
        <h3 className="text-xl font-display font-bold mb-3">{title}</h3>
        <p className="text-muted-foreground leading-relaxed text-sm">{text}</p>
      </div>
    </div>
  );
};

export default WorkStepCard;
