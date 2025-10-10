import { useScrollFade } from "@/hooks/use-scroll-fade";

interface WorkStepCardProps {
  number: string;
  title: string;
  text: string;
  index: number;
  isVisible: boolean;
}

const WorkStepCard = ({ number, title, text, index, isVisible }: WorkStepCardProps) => {
  const { ref, opacity, translateY } = useScrollFade();

  return (
    <div
      ref={ref}
      className={`relative glass rounded-[1.5rem] hover:shadow-xl hover:-translate-y-2 transition-all duration-700 group ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
      style={{ 
        transitionDelay: `${index * 100}ms`,
        opacity,
        transform: `translateY(${translateY}px)`
      }}
    >
      <div className="absolute inset-0 rounded-[1.5rem] bg-primary/0 group-hover:bg-primary/5 dark:group-hover:bg-primary/10 transition-all duration-300 pointer-events-none"
        style={{
          boxShadow: '0 0 0 0 hsl(var(--primary) / 0)',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = '0 0 40px 8px hsl(var(--primary) / 0.15), 0 0 80px 16px hsl(var(--primary) / 0.08)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = '0 0 0 0 hsl(var(--primary) / 0)';
        }}
      />
      <div className="pt-8 pb-6 px-6 text-center relative z-10">
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
