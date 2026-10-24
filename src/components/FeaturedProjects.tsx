import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import ProjectCardDetailed from "./ProjectCardDetailed";
import { projects as allProjects, featuredProjectNames } from "@/data/projects";

const projects = featuredProjectNames
  .map((n) => allProjects.find((p) => p.name === n))
  .filter((p): p is NonNullable<typeof p> => Boolean(p));

const FeaturedProjects = () => {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });
  const [expandedProject, setExpandedProject] = useState<string | null>(null);

  const toggleProject = (name: string) => {
    setExpandedProject(expandedProject === name ? null : name);
  };

  return (
    <section className="py-8" ref={ref}>
      <div className="container mx-auto px-6">
        <div className={`mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div>
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
              <span className="inline-block font-handwritten text-primary-visible -skew-x-6">Featured</span> Work
            </h2>
            <p className="text-sm text-muted-foreground max-w-2xl">
              Recent projects and achievements
            </p>
          </div>
          <Button asChild variant="default" size="lg" className="hidden md:inline-flex">
            <Link to="/projects">View More Projects</Link>
          </Button>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl items-stretch">
          {projects.map((project) => (
            <ProjectCardDetailed
              key={project.name}
              name={project.name}
              tags={project.tags}
              image={project.image}
              link={project.link}
              isLive={project.isLive}
              overview={project.overview}
              responsibilities={project.responsibilities}
              achievements={project.achievements}
              caseStudy={project.caseStudy}
              expandedProject={expandedProject}
              onToggle={toggleProject}
            />
          ))}
        </div>
        <div className={`mt-12 text-center md:hidden transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <Button asChild variant="default" size="lg">
            <Link to="/projects">View More Projects</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProjects;
