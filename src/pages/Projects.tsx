import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Calendar, Lightbulb, Mail } from "lucide-react";
import ProjectCardDetailed from "@/components/ProjectCardDetailed";
import { useScrollFade } from "@/hooks/use-scroll-fade";
import { projects } from "@/data/projects";
import FloatingActionButton from "@/components/FloatingActionButton";
import { HIRE_CALENDAR_URL, openHireCalendar } from "@/lib/booking";

const projectsData = projects;

const Projects = () => {
  const [expandedProject, setExpandedProject] = useState<string | null>(null);
  const { ref: headerRef, opacity: headerOpacity, translateY: headerTranslateY } = useScrollFade();
  const { ref: hireCardRef, opacity: hireOpacity, translateY: hireTranslateY } = useScrollFade();
  const { ref: sideHeaderRef, opacity: sideHeaderOpacity, translateY: sideHeaderTranslateY } = useScrollFade();

  const toggleProject = (projectName: string) => {
    setExpandedProject(expandedProject === projectName ? null : projectName);
  };

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <Navigation />
      <main className="pt-40 pb-16">
        <div className="container mx-auto px-6">
          <div
            ref={headerRef as any}
            className="mb-12"
            style={{ opacity: headerOpacity, transform: `translateY(${headerTranslateY}px)` }}
          >
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-4">
              Product <span className="font-handwritten text-primary-visible">Projects</span>
            </h1>
            <p className="text-sm text-muted-foreground max-w-2xl">
              A collection of products I've built and nurtured across EdTech, HealthTech, and beyond
            </p>
          </div>

          {/* Live Projects Grid */}
          <div className="mb-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto items-stretch">
              {projectsData
                .filter((p) => p.isLive)
                .map((project, index) => (
                  <ProjectCardDetailed
                    key={`live-${project.name}-${index}`}
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

              {/* Empty Card for Hire */}
              <div
                ref={hireCardRef}
                className="border-2 border-dashed border-border overflow-hidden rounded-[1.5rem] hover:shadow-2xl hover:shadow-primary/20 transition-all duration-350 flex flex-col h-full"
                style={{ opacity: hireOpacity, transform: `translateY(${hireTranslateY}px)` }}
              >
                <div className="aspect-video overflow-hidden flex items-center justify-center">
                  <div className="relative flex items-center justify-center">
                    {/* Concentric circles */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="absolute w-24 h-24 rounded-full border-2 border-primary/30"></div>
                      <div className="absolute w-32 h-32 rounded-full border-2 border-primary/20"></div>
                      <div className="absolute w-40 h-40 rounded-full border-2 border-primary/10"></div>
                    </div>
                    {/* Lightbulb icon */}
                    <div className="relative z-10 w-16 h-16 rounded-full bg-primary flex items-center justify-center">
                      <Lightbulb className="w-9 h-9 text-primary-foreground fill-current" />
                    </div>
                  </div>
                </div>
                <div className="p-6 md:p-8 flex flex-col flex-1 items-center text-center">
                  <h3 className="text-3xl font-display font-bold mb-4">
                    Your <span className="font-handwritten text-primary-visible">Product</span> Goes Here
                  </h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed text-sm line-clamp-3 opacity-0">
                    Placeholder text to match card height
                  </p>
                  <div className="flex flex-wrap gap-3 mt-auto justify-center">
                    <Button asChild size="sm" className="gap-2 rounded-full">
                      <a href={HIRE_CALENDAR_URL} target="_blank" rel="noopener noreferrer" onClick={openHireCalendar}>
                        <Calendar className="w-4 h-4" />
                        Hire Henrietta
                      </a>
                    </Button>
                    <Button
                      asChild
                      variant="secondary"
                      size="sm"
                      className="rounded-full gap-2 w-9 sm:w-auto px-0 sm:px-3"
                    >
                      <a href="mailto:mypvrplespace@gmail.com" className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <span className="hidden sm:inline">Send Mail</span>
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Side Projects Section */}
          <div
            ref={sideHeaderRef as any}
            className="my-12"
            style={{ opacity: sideHeaderOpacity, transform: `translateY(${sideHeaderTranslateY}px)` }}
          >
            <div className="border-t border-border/30 mb-8"></div>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-8">
              Side <span className="font-handwritten text-primary-visible">Projects</span>
            </h2>
          </div>

          {/* Side Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto items-stretch">
            {projectsData
              .filter((p) => !p.isLive)
              .map((project, index) => (
                <ProjectCardDetailed
                  key={`side-${project.name}-${index}`}
                  name={project.name}
                  tags={project.tags}
                  image={project.image}
                  link={project.link}
                  overview={project.overview}
                  responsibilities={project.responsibilities}
                  achievements={project.achievements}
                    caseStudy={project.caseStudy}
                  expandedProject={expandedProject}
                  onToggle={toggleProject}
                />
              ))}
          </div>
        </div>
      </main>
      <Footer />
      <FloatingActionButton />
    </div>
  );
};

export default Projects;
