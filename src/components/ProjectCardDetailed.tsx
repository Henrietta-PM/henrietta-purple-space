import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useScrollFade } from "@/hooks/use-scroll-fade";
import { useScrollGlow } from "@/hooks/use-scroll-glow";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerClose,
} from "@/components/ui/drawer";
import type { Project } from "@/data/projects";

interface ProjectCardDetailedProps {
  project: Project;
}

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section>
    <h4 className="text-xl font-display font-bold mb-3">{title}</h4>
    {children}
  </section>
);

const BulletList = ({ items }: { items: string[] }) => (
  <ul className="list-disc list-inside space-y-2 text-muted-foreground text-sm">
    {items.map((item, i) => (
      <li key={i}>{item}</li>
    ))}
  </ul>
);

const ProjectCardDetailed = ({ project }: ProjectCardDetailedProps) => {
  const { name, tags, image, link, isLive, overview, problem, whatIDid, strategy, outcome, stack, responsibilities, achievements } =
    project;
  const { ref, opacity, translateY } = useScrollFade();
  const { ref: glowRef, glowIntensity } = useScrollGlow();
  const hasLink = link && link !== "#";

  return (
    <div
      ref={(el) => {
        // @ts-ignore
        ref.current = el;
        // @ts-ignore
        glowRef.current = el;
      }}
      className="glass overflow-hidden rounded-[1.5rem] transition-all duration-350 relative flex flex-col h-full"
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        boxShadow: `0 0 ${50 * glowIntensity}px ${10 * glowIntensity}px hsl(var(--primary) / ${0.25 * glowIntensity}), 0 0 ${90 * glowIntensity}px ${18 * glowIntensity}px hsl(var(--primary) / ${0.12 * glowIntensity})`,
      }}
    >
      {isLive && (
        <div className="thumbnail-badge absolute top-4 right-4 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-xs font-semibold">Live</span>
        </div>
      )}
      {image && (
        <div className="aspect-video overflow-hidden bg-muted">
          <img src={image} alt={`${name} preview`} className="w-full h-full object-cover object-top" />
        </div>
      )}
      <div className="p-6 md:p-8 flex flex-col flex-1 min-w-0">
        <div className="flex flex-nowrap gap-2 mb-3 overflow-hidden">
          {tags.map((tag, tagIndex) => (
            <span
              key={tagIndex}
              className="text-xs px-3 py-1 rounded-full glass text-foreground border border-border whitespace-nowrap"
            >
              {tag}
            </span>
          ))}
        </div>
        <h3 className="text-3xl font-display font-bold mb-4 truncate" title={name}>
          {name}
        </h3>
        <p className="text-muted-foreground mb-6 leading-relaxed text-sm line-clamp-3">{overview}</p>

        <div className="flex flex-wrap gap-3 mt-auto">
          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="default" size="sm" className="rounded-full">
                View Details
              </Button>
            </DrawerTrigger>
            <DrawerContent className="max-h-[90vh]">
              <DrawerClose asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Close"
                  className="hidden md:inline-flex absolute top-4 right-4 z-20 rounded-full"
                >
                  <X className="w-5 h-5" />
                </Button>
              </DrawerClose>
              <div className="mx-auto w-full max-w-3xl overflow-y-auto px-6 pb-10 flow-root">
                {image && (
                  <div className="hidden md:block float-right ml-8 mb-4 mt-14 w-72 lg:w-80 aspect-video overflow-hidden bg-muted rounded-2xl">
                    <img src={image} alt={`${name} preview`} className="w-full h-full object-cover object-top" />
                  </div>
                )}
                <DrawerHeader className="px-0">
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
                  <DrawerTitle className="text-3xl md:text-4xl font-display font-bold text-left">{name}</DrawerTitle>
                </DrawerHeader>

                {image && (
                  <div className="md:hidden aspect-video overflow-hidden bg-muted rounded-2xl mb-6">
                    <img src={image} alt={`${name} preview`} className="w-full h-full object-cover object-top" />
                  </div>
                )}

                <div className="space-y-8">
                  <Section title="What it is">
                    <p className="text-muted-foreground leading-relaxed text-sm">{overview}</p>
                  </Section>
                  {problem && (
                    <Section title="The problem">
                      <p className="text-muted-foreground leading-relaxed text-sm">{problem}</p>
                    </Section>
                  )}
                  {whatIDid && (
                    <Section title="What I did">
                      <p className="text-muted-foreground leading-relaxed text-sm">{whatIDid}</p>
                    </Section>
                  )}
                  {responsibilities && responsibilities.length > 0 && (
                    <Section title="What I did">
                      <BulletList items={responsibilities} />
                    </Section>
                  )}
                  {strategy && strategy.length > 0 && (
                    <Section title="The strategy">
                      <div className="space-y-4">
                        {strategy.map((para, i) => (
                          <p key={i} className="text-muted-foreground leading-relaxed text-sm">
                            {para}
                          </p>
                        ))}
                      </div>
                    </Section>
                  )}
                  {outcome && outcome.length > 0 && (
                    <Section title="Outcome">
                      <BulletList items={outcome} />
                    </Section>
                  )}
                  {achievements && achievements.length > 0 && (
                    <Section title="Outcome">
                      <BulletList items={achievements} />
                    </Section>
                  )}
                  {stack && (
                    <Section title="Stack and tools">
                      <p className="text-muted-foreground leading-relaxed text-sm">{stack}</p>
                    </Section>
                  )}
                </div>

                {hasLink && (
                  <div className="mt-8">
                    <Button asChild variant="default" size="sm" className="rounded-full">
                      <a href={link} target="_blank" rel="noopener noreferrer">
                        Visit Site →
                      </a>
                    </Button>
                  </div>
                )}
              </div>
            </DrawerContent>
          </Drawer>
          {hasLink && (
            <Button asChild variant="ghost" size="sm" className="rounded-full hover:bg-primary/20 hover:text-foreground">
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
