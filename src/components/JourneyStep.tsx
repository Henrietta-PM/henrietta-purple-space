import { useScrollFade } from "@/hooks/use-scroll-fade";
import { useScrollGlow } from "@/hooks/use-scroll-glow";
import { Separator } from "@/components/ui/separator";

interface JourneyStepProps {
  title: string;
  text: string;
  index: number;
  isVisible: boolean;
}

const JourneyStep = ({ title, text, index, isVisible }: JourneyStepProps) => {
  const { ref, opacity, translateY } = useScrollFade();
  const { ref: glowRef, glowIntensity } = useScrollGlow();

  return (
    <div
      ref={ref}
      className={`relative flex gap-8 items-start transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
      }`}
      style={{ 
        transitionDelay: `${index * 150}ms`,
        opacity,
        transform: `translateY(${translateY}px)`
      }}
    >
      {/* Timeline dot */}
      <div className="hidden md:flex items-center justify-center w-16 h-16 rounded-full glass border-2 border-primary/30 flex-shrink-0 relative z-10">
        <div className="w-3 h-3 rounded-full bg-primary" />
      </div>
      
      {/* Content card */}
      <div 
        ref={glowRef}
        className="flex-1 glass p-6 md:p-8 rounded-[2rem] transition-all duration-300 relative"
        style={{
          boxShadow: `0 0 ${40 * glowIntensity}px ${8 * glowIntensity}px hsl(var(--primary) / ${0.2 * glowIntensity}), 0 0 ${80 * glowIntensity}px ${16 * glowIntensity}px hsl(var(--primary) / ${0.1 * glowIntensity})`
        }}
      >
        <h3 className="text-xl md:text-2xl font-display font-bold mb-3">{title}</h3>
        <Separator className="my-4 bg-foreground/20 dark:bg-foreground/30" />
        <p className="text-muted-foreground leading-relaxed text-sm">{text}</p>
      </div>
    </div>
  );
};

export default JourneyStep;
