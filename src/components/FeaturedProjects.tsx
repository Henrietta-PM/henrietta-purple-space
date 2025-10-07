import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import ProjectCard from "./ProjectCard";
import bloomieImage from "@/assets/bloomie-logo.png";
import proxyImage from "@/assets/proxy-preview.jpg";

const projects = [
  {
    name: "ProxyMedicine",
    tags: ["Telehealth", "HealthTech"],
    image: proxyImage,
    link: "https://www.prxy.health",
    isLive: true,
  },
  {
    name: "Bloomie AI",
    tags: ["EdTech"],
    image: bloomieImage,
    link: "https://learn.bloomie.com",
    isLive: true,
  },
];

const FeaturedProjects = () => {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <section className="py-8" ref={ref}>
      <div className="container mx-auto px-6">
        <div className={`mb-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Featured <span className="font-handwritten text-primary-visible">Work</span>
          </h2>
          <p className="text-sm text-muted-foreground max-w-2xl">
            Recent projects and achievements
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl">
          {projects.map((project, index) => (
            <ProjectCard
              key={index}
              name={project.name}
              tags={project.tags}
              image={project.image}
              link={project.link}
              isLive={project.isLive}
              index={index}
              isVisible={isVisible}
            />
          ))}
        </div>
        <div className={`mt-12 text-center transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <Button asChild variant="default" size="lg">
            <Link to="/projects">View More Projects</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProjects;
