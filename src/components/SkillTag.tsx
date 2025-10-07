import { useScrollFade } from "@/hooks/use-scroll-fade";

interface SkillTagProps {
  skill: string;
  index: number;
  isVisible: boolean;
}

const SkillTag = ({ skill, index, isVisible }: SkillTagProps) => {
  const { ref, opacity, translateY } = useScrollFade();

  return (
    <span
      ref={ref}
      className={`glass text-base px-6 py-3 rounded-full hover:shadow-lg transition-all duration-700 cursor-default hover-scale ${
        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
      }`}
      style={{ 
        transitionDelay: `${index * 50}ms`,
        opacity,
        transform: `translateY(${translateY}px) scale(${isVisible ? 1 : 0.9})`
      }}
    >
      {skill}
    </span>
  );
};

export default SkillTag;
