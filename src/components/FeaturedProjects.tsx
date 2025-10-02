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
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">
          Featured Products
        </h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {projects.map((project, index) => (
            <Card
              key={index}
              className="overflow-hidden hover:shadow-2xl transition-all duration-350 hover:-translate-y-2 border-none"
            >
              <div className="aspect-video overflow-hidden bg-muted">
                <img
                  src={project.image}
                  alt={project.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-6">
                <div className="flex flex-wrap gap-2 mb-3">
                  {project.tags.map((tag, tagIndex) => (
                    <Badge key={tagIndex} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <h3 className="text-2xl font-bold mb-4">{project.name}</h3>
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
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProjects;
