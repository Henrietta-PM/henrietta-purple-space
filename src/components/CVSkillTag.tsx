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
      style={{ opacity, transform: `translateY(${translateY}px)` }}
    >
      {skill}
    </span>
  );
};

export default CVSkillTag;
