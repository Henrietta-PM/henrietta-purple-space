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
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">
          My Skills
        </h2>
        <div className="flex flex-wrap justify-center gap-4 max-w-3xl mx-auto">
          {skills.map((skill, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="text-lg px-6 py-3 hover:bg-primary hover:text-primary-foreground transition-all duration-350 cursor-default"
            >
              {skill}
            </Badge>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
