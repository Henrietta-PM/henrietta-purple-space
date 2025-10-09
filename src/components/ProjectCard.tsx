import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useScrollFade } from "@/hooks/use-scroll-fade";

interface ProjectCardProps {
  name: string;
  tags: string[];
  image: string;
  link: string;
  isLive: boolean;
  index: number;
  isVisible: boolean;
}

const ProjectCard = ({ name, tags, image, link, isLive, index, isVisible }: ProjectCardProps) => {
  const { ref, opacity, translateY } = useScrollFade();

  return (
    <div
      ref={ref}
      className={`glass overflow-hidden hover:shadow-2xl transition-all duration-700 hover:-translate-y-2 relative ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
      style={{ 
        transitionDelay: `${index * 200}ms`,
        opacity,
        transform: `translateY(${translateY}px)`,
        clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 1.5rem), calc(100% - 1.5rem) 100%, 0 100%)'
      }}
    >
      {isLive && (
        <div className="absolute top-4 right-4 z-10 flex items-center gap-2 glass px-3 py-1.5 rounded-full">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs font-medium text-foreground">Live</span>
        </div>
      )}
      <div className="aspect-video overflow-hidden bg-muted">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-6">
        <div className="flex flex-wrap gap-2 mb-3">
          {tags.map((tag, tagIndex) => (
            <span key={tagIndex} className="text-xs px-3 py-1 rounded-full glass text-foreground dark:text-white border border-border">
              {tag}
            </span>
          ))}
        </div>
        <h3 className="text-2xl font-display font-bold mb-4">{name}</h3>
        <div className="flex gap-3">
          <Button asChild variant="default" size="sm">
            <Link to="/projects">View Details</Link>
          </Button>
          <Button asChild variant="ghost" size="sm" className="hover:bg-primary/20 hover:text-black dark:hover:text-white">
            <a href={link} target="_blank" rel="noopener noreferrer">
              Visit Site →
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
