import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { useScrollFade } from "@/hooks/use-scroll-fade";
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
  const { ref: animRef, isVisible } = useScrollAnimation({ threshold: 0.2 });
  const { ref: fadeRef, opacity } = useScrollFade();

  return (
    <section 
      className="py-8" 
      ref={(node: HTMLDivElement | null) => {
        if (animRef) animRef.current = node;
        if (fadeRef) fadeRef.current = node;
      }}
      style={{ opacity }}
    >
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
            <div
              key={index}
              className={`glass overflow-hidden rounded-[1.5rem] hover:shadow-2xl transition-all duration-700 hover:-translate-y-2 relative ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              {project.isLive && (
                <div className="absolute top-4 right-4 z-10 flex items-center gap-2 glass px-3 py-1.5 rounded-full">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs font-medium text-foreground">Live</span>
                </div>
              )}
              <div className="aspect-video overflow-hidden bg-muted">
                <img
                  src={project.image}
                  alt={project.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex flex-wrap gap-2 mb-3">
                  {project.tags.map((tag, tagIndex) => (
                    <span key={tagIndex} className="text-xs px-3 py-1 rounded-full glass text-white border border-white/20">
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="text-2xl font-display font-bold mb-4">{project.name}</h3>
                <div className="flex gap-3">
                  <Button asChild variant="default" size="sm">
                    <Link to="/projects">View Details</Link>
                  </Button>
                  <Button asChild variant="ghost" size="sm">
                    <a href={project.link} target="_blank" rel="noopener noreferrer">
                      Visit Site →
                    </a>
                  </Button>
                </div>
              </div>
            </div>
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
