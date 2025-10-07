import { useScrollFade } from "@/hooks/use-scroll-fade";
import CVSkillTag from "./CVSkillTag";

interface CVSkillCategoryProps {
  title: string;
  skills: string[];
}

const CVSkillCategory = ({ title, skills }: CVSkillCategoryProps) => {
  const { ref, opacity, translateY } = useScrollFade();

  return (
    <div ref={ref} style={{ opacity, transform: `translateY(${translateY}px)` }}>
      <h3 className="text-xl font-display font-semibold mb-4 text-primary-visible">{title}</h3>
      <div className="flex flex-wrap gap-3">
        {skills.map((skill, index) => (
          <CVSkillTag key={index} skill={skill} />
        ))}
      </div>
    </div>
  );
};

export default CVSkillCategory;
