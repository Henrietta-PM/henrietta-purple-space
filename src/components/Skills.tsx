import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import SkillTag from "./SkillTag";

const skills = [
  "Product Roadmaps",
  "PRDs & User Stories",
  "UX Research",
  "A/B Testing",
  "Team Leadership",
  "Data-driven Decisions",
  "Analytics",
  "User Journey",
  "Product-Led Growth",
];

const Skills = () => {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <section className="py-8" ref={ref}>
      <div className="container mx-auto px-6">
        <div className={`mb-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            <span className="font-handwritten text-primary-visible">Henrietta's</span> Skills
          </h2>
          <p className="text-sm text-muted-foreground max-w-2xl">
            These are my core competencies that have driven product success
          </p>
        </div>
        <div className="flex flex-wrap gap-4 max-w-3xl">
          {skills.map((skill, index) => (
            <SkillTag
              key={index}
              skill={skill}
              index={index}
              isVisible={isVisible}
            />
          ))}
        </div>
        <div className={`mt-12 text-center transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <Button asChild variant="default" size="lg">
            <Link to="/cv">See Full CV</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Skills;
