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
      className={`relative glass hover:shadow-xl hover:-translate-y-2 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
      style={{ 
        transitionDelay: `${index * 100}ms`,
        opacity,
        transform: `translateY(${translateY}px)`,
        clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 1.5rem), calc(100% - 1.5rem) 100%, 0 100%)'
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
