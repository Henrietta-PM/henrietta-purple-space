import { useScrollFade } from "@/hooks/use-scroll-fade";

interface CVTimelineNodeProps {
  title: string;
  role: string;
  dates: string;
  highlights: string[];
  index: number;
}

const CVTimelineNode = ({ title, role, dates, highlights, index }: CVTimelineNodeProps) => {
  const { ref, opacity, translateY } = useScrollFade();

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
          <div className="glass p-6 rounded-[1.5rem] hover:shadow-xl transition-all duration-350 relative group">
            <div className="absolute inset-0 rounded-[1.5rem] bg-primary/0 dark:group-hover:bg-primary/8 transition-all duration-350 pointer-events-none"
              style={{
                boxShadow: '0 0 0 0 hsl(var(--primary) / 0)',
                transition: 'all 0.35s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 0 60px 12px hsl(var(--primary) / 0.25), 0 0 100px 20px hsl(var(--primary) / 0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 0 0 0 hsl(var(--primary) / 0)';
              }}
            />
            <div className="relative z-10">
              <h3 className="text-2xl font-display font-bold mb-1">{title}</h3>
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
    </div>
  );
};

export default CVTimelineNode;
