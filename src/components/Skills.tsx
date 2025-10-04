import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const skillCategories = {
  softSkills: [
    "Team Leadership",
    "Data-driven Decisions",
    "Strategic Thinking",
    "Communication",
    "Problem Solving",
  ],
  technicalSkills: [
    "Product Roadmaps",
    "PRDs & User Stories",
    "UX Research",
    "A/B Testing",
    "Analytics",
    "User Journey",
    "Product-Led Growth",
    "Feature Prioritization",
    "MVP Development",
  ],
  tools: [
    "Figma",
    "Google Analytics",
    "Jira",
    "Trello",
    "Notion",
    "Miro",
  ],
};

const Skills = () => {
  return (
    <section className="py-8">
      <div className="container mx-auto px-6">
        <div className="mb-8">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            My <span className="font-handwritten text-primary-visible">Skills</span>
          </h2>
          <p className="text-sm text-muted-foreground max-w-2xl">
            These are my core competencies that have driven product success
          </p>
        </div>
        <div className="space-y-8 max-w-4xl">
          {/* Soft Skills */}
          <div>
            <h3 className="text-xl font-display font-semibold mb-4 text-primary-visible">Soft Skills</h3>
            <div className="flex flex-wrap gap-4">
              {skillCategories.softSkills.map((skill, index) => (
                <span
                  key={index}
                  className="glass text-base px-6 py-3 rounded-full hover:shadow-lg transition-all duration-350 cursor-default"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Technical Skills */}
          <div>
            <h3 className="text-xl font-display font-semibold mb-4 text-primary-visible">Technical Skills</h3>
            <div className="flex flex-wrap gap-4">
              {skillCategories.technicalSkills.map((skill, index) => (
                <span
                  key={index}
                  className="glass text-base px-6 py-3 rounded-full hover:shadow-lg transition-all duration-350 cursor-default"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Tools */}
          <div>
            <h3 className="text-xl font-display font-semibold mb-4 text-primary-visible">Tools</h3>
            <div className="flex flex-wrap gap-4">
              {skillCategories.tools.map((skill, index) => (
                <span
                  key={index}
                  className="glass text-base px-6 py-3 rounded-full hover:shadow-lg transition-all duration-350 cursor-default"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
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
