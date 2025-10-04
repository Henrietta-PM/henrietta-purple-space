import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

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
  return (
    <section className="py-12">
      <div className="container mx-auto px-6">
        <div className="mb-8">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            My <span className="font-handwritten text-primary-visible">Skills</span>
          </h2>
          <p className="text-sm text-muted-foreground max-w-2xl">
            These are my core competencies that have driven product success
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
        <div className="mt-12 text-center">
          <Button asChild variant="default" size="lg">
            <Link to="/cv">See Full CV</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Skills;
