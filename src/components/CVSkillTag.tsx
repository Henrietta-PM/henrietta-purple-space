import { useScrollFade } from "@/hooks/use-scroll-fade";

interface CVSkillTagProps {
  skill: string;
}

const CVSkillTag = ({ skill }: CVSkillTagProps) => {
  const { ref, opacity, translateY } = useScrollFade();

  return (
    <span
      ref={ref}
      className="glass text-sm px-4 py-2 rounded-full hover:shadow-lg transition-all duration-350 cursor-default"
      style={{ 
        opacity: Math.max(0.3, opacity), // Keep minimum 30% opacity
        transform: `translateY(${translateY * 0.5}px)` // Reduce movement
      }}
    >
      {skill}
    </span>
  );
};

export default CVSkillTag;
