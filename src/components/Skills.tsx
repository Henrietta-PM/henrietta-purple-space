import { Badge } from "@/components/ui/badge";

const skills = [
  "Product Roadmaps",
  "PRDs & User Stories",
  "UX Research",
  "A/B Testing",
  "Team Leadership",
  "Data-driven Decisions",
];

const Skills = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-6">
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            My Skills
          </h2>
          <p className="text-base text-muted-foreground max-w-2xl">
            Core competencies that drive product success
          </p>
        </div>
        <div className="flex flex-wrap gap-4 max-w-3xl">
          {skills.map((skill, index) => (
            <span
              key={index}
              className="glass text-base px-6 py-3 rounded-full hover:shadow-lg transition-all duration-350 cursor-default"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
