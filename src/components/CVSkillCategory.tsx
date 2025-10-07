import { useScrollFade } from "@/hooks/use-scroll-fade";

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
          <span
            key={index}
            className="glass text-sm px-4 py-2 rounded-full hover:shadow-lg transition-all duration-350 cursor-default"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
};

export default CVSkillCategory;
