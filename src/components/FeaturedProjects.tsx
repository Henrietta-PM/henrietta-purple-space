import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import bloomieImage from "@/assets/bloomie-logo.png";
import proxyImage from "@/assets/proxy-preview.jpg";

const projects = [
  {
    name: "Bloomie AI",
    tags: ["EdTech"],
    image: bloomieImage,
    link: "https://www.bloomie.com",
  },
  {
    name: "ProxyMedicine",
    tags: ["Telehealth", "HealthTech"],
    image: proxyImage,
    link: "https://www.prxy.health",
  },
];

const FeaturedProjects = () => {
  return (
    <section className="py-12">
      <div className="container mx-auto px-6">
        <div className="mb-8">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Featured Work
          </h2>
          <p className="text-sm text-muted-foreground max-w-2xl">
            Recent projects and achievements
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl">
          {projects.map((project, index) => (
            <div
              key={index}
              className="glass overflow-hidden rounded-[1.5rem] hover:shadow-2xl transition-all duration-350 hover:-translate-y-2"
            >
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
                    <span key={tagIndex} className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary">
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="text-2xl font-display font-bold mb-4">{project.name}</h3>
                <div className="flex gap-3">
                  <Button asChild variant="outline" size="sm">
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
      </div>
    </section>
  );
};

export default FeaturedProjects;
