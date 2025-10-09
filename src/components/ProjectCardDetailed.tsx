import { Button } from "@/components/ui/button";
import { useScrollFade } from "@/hooks/use-scroll-fade";

interface ProjectCardDetailedProps {
  name: string;
  tags: string[];
  image?: string;
  link?: string;
  isLive?: boolean;
  overview: string;
  responsibilities: string[];
  achievements: string[];
  expandedProject: string | null;
  onToggle: (name: string) => void;
}

const ProjectCardDetailed = ({
  name,
  tags,
  image,
  link,
  isLive,
  overview,
  responsibilities,
  achievements,
  expandedProject,
  onToggle,
}: ProjectCardDetailedProps) => {
  const { ref, opacity, translateY } = useScrollFade();

  return (
    <div
      ref={ref}
      className="glass overflow-hidden rounded-[1.5rem] hover:shadow-2xl hover:shadow-primary/20 transition-all duration-350 relative flex flex-col"
      style={{ opacity, transform: `translateY(${translateY}px)` }}
    >
      {isLive && (
        <div className="absolute top-4 right-4 z-10 flex items-center gap-2 glass px-3 py-1.5 rounded-full">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs font-medium text-foreground">Live</span>
        </div>
      )}
      {image && (
        <div className="aspect-video overflow-hidden bg-muted">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover object-top"
          />
        </div>
      )}
      <div className="p-6 md:p-8 flex flex-col flex-1">
        <div className="flex flex-wrap gap-2 mb-3">
          {tags.map((tag, tagIndex) => (
            <span
              key={tagIndex}
              className="text-xs px-3 py-1 rounded-full glass text-foreground border border-border"
            >
              {tag}
            </span>
          ))}
        </div>
        <h3 className="text-3xl font-display font-bold mb-4">{name}</h3>
        <p
          className={`text-muted-foreground mb-6 leading-relaxed text-sm ${
            expandedProject !== name ? "line-clamp-3" : ""
          }`}
        >
          {overview}
        </p>

        {expandedProject === name && (
          <div className="animate-slide-up space-y-6 mb-6">
            <div>
              <h4 className="text-xl font-display font-bold mb-3">
                Responsibilities
              </h4>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground text-sm">
                {responsibilities.map((resp, respIndex) => (
                  <li key={respIndex}>{resp}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-display font-bold mb-3">
                Achievements
              </h4>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground text-sm">
                {achievements.map((ach, achIndex) => (
                  <li key={achIndex}>{ach}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-3 mt-auto">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onToggle(name);
            }}
            variant="default"
            size="sm"
            className="rounded-full"
          >
            {expandedProject === name ? "See Less" : "View Details"}
          </Button>
          {link && (
            <Button asChild variant="ghost" size="sm" className="rounded-full hover:bg-primary/20">
              <a href={link} target="_blank" rel="noopener noreferrer">
                Visit Site →
              </a>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCardDetailed;
