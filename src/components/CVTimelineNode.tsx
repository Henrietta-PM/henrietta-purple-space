import { useScrollFade } from "@/hooks/use-scroll-fade";
import { useScrollGlow } from "@/hooks/use-scroll-glow";

interface CVTimelineNodeProps {
  title: string;
  role: string;
  dates: string;
  highlights: string[];
  index: number;
  url?: string;
}

const CVTimelineNode = ({ title, role, dates, highlights, index, url }: CVTimelineNodeProps) => {
  const { ref, opacity, translateY } = useScrollFade();
  const { ref: glowRef, glowIntensity } = useScrollGlow();

  return (
    <div
      ref={ref}
      className="relative mb-12 animate-slide-up"
      style={{ 
        animationDelay: `${index * 100}ms`,
        opacity,
        transform: `translateY(${translateY}px)`
      }}
    >
      <div
        className={`flex items-start gap-6 ${
          index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
        }`}
      >
        {/* Timeline dot */}
        <div className="absolute left-8 md:left-1/2 w-4 h-4 rounded-full bg-primary border-4 border-background transform -translate-x-1/2 z-10" />

        {/* Content card */}
        <div
          className={`ml-16 md:ml-0 w-full md:w-[calc(50%-3rem)] ${
            index % 2 === 0 ? "md:text-right md:pr-12" : "md:pl-12"
          }`}
        >
          <div 
            ref={glowRef}
            className="glass p-6 rounded-[1.5rem] transition-all duration-350"
            style={{
              boxShadow: `0 0 ${50 * glowIntensity}px ${10 * glowIntensity}px hsl(var(--primary) / ${0.25 * glowIntensity}), 0 0 ${90 * glowIntensity}px ${18 * glowIntensity}px hsl(var(--primary) / ${0.12 * glowIntensity}), 0 0 ${120 * glowIntensity}px ${24 * glowIntensity}px hsl(var(--primary) / ${0.08 * glowIntensity})`
            }}
          >
            <h3 className="text-2xl font-display font-bold mb-1">
              {url ? (
                <a 
                  href={url.startsWith('http') ? url : `https://${url}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="underline hover:text-primary transition-colors"
                >
                  {title}
                </a>
              ) : (
                title
              )}
            </h3>
            <p className="text-primary font-semibold mb-2 text-sm">{role}</p>
            <p className="text-xs text-muted-foreground mb-4">{dates}</p>
            <ul
              className={`space-y-2 text-xs ${
                index % 2 === 0 ? "md:text-right" : "md:text-left"
              }`}
            >
              {highlights.map((highlight, hIndex) => (
                <li key={hIndex} className="text-muted-foreground">
                  • {highlight}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CVTimelineNode;
