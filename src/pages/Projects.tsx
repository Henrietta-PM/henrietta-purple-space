import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Calendar, Lightbulb } from "lucide-react";
import bloomieImage from "@/assets/bloomie-logo.png";
import proxyImage from "@/assets/proxy-preview.jpg";
import syncuImage from "@/assets/syncu-preview.png";
import careerpassImage from "@/assets/careerpass-preview.png";
import targettImage from "@/assets/targett-preview.png";

const projectsData = [
  {
    name: "Bloomie AI",
    tags: ["EdTech"],
    link: "https://learn.bloomie.com",
    image: bloomieImage,
    isLive: true,
    overview:
      "Bloomie AI is a personalized learning platform for children, using AI to deliver adaptive lessons and engaging progress dashboards.",
    responsibilities: [
      "Defined MVP scope and prioritized features for initial launch.",
      "Wrote PRDs and broke user stories into actionable tasks for development.",
      "Conducted A/B tests on onboarding flows and content delivery methods.",
      "Led UX research sessions to ensure usability for children and parents.",
      "Collaborated with data analysts to design engagement and retention tracking metrics.",
    ],
    achievements: [
      "Achieved 80% daily adoption rates within the first 3 months.",
      "Improved retention by 45% through iterative testing and refinement.",
      "Established scalable frameworks for future content and AI personalization.",
    ],
  },
  {
    name: "ProxyMedicine",
    tags: ["Telehealth", "HealthTech"],
    link: "https://www.prxy.health",
    image: proxyImage,
    isLive: true,
    overview:
      "ProxyMedicine is a telehealth platform that combines asynchronous care with AI-driven tools. It offers AI-powered diagnosis suggestions, prescription refills, weight loss tracking, and personalized diet/meal generation.",
    responsibilities: [
      "Created detailed PRDs and refined user flows for AI diagnosis, weight management, and meal generation features.",
      "Collaborated with design team to ensure usability of patient dashboards and AI chatbot.",
      "Led weekly user interviews to validate new features and prioritize backlog.",
      "Worked closely with engineering to optimize delivery, reducing redundant workflows.",
      "Scoped and coordinated delivery of admin portal modules including billing, upsell prompts, and meeting transcript reviews.",
    ],
    achievements: [
      "Increased patient satisfaction by 60% within the first quarter of launch.",
      "Delivered roadmap 25% faster than initial estimates.",
      "Reduced reported defects by 15% by strengthening PRD clarity and QA processes.",
    ],
  },
  {
    name: "Syncu",
    tags: ["Community", "Collaboration"],
    link: "https://www.linkedin.com/company/sync-u/",
    image: syncuImage,
    overview:
      "Syncu is a community platform that connects tech professionals to collaborate on product ideas. It enables hands-on experience, real-time portfolio building, and project-based team formation.",
    responsibilities: [
      "Designed platform vision and roadmap to support collaborative projects.",
      "Grew the community to 250+ members through outreach and engagement.",
      "Facilitated 10+ collaborations by connecting professionals with aligned goals.",
      "Oversaw waitlist operations, managing 530+ potential users.",
    ],
    achievements: [
      "Built and scaled a community of 250+ members.",
      "Enabled 10+ active product collaborations.",
      "Grew waitlist to 530+ users within launch window.",
    ],
  },
  {
    name: "CareerPASS",
    tags: ["Psychometrics", "Career Guidance"],
    link: "https://career-pass.vercel.app/",
    image: careerpassImage,
    overview:
      "CareerPASS is a psychometric analysis and career recommendation platform. It helps students discover career paths aligned with their strengths through personality and skill assessments.",
    responsibilities: [
      "Scoped and managed end-to-end development of the MVP within 8 weeks.",
      "Created PRDs and coordinated efforts across data analysts, developers, and designers.",
      "Implemented Trello workflows to track deliverables and dependencies.",
      "Oversaw integration of psychometric models into the platform.",
    ],
    achievements: [
      "Delivered MVP on time with full functionality within 8 weeks.",
      "Selected as a Top 5 project at a major career showcase.",
      "Enabled 1,000+ students to access career assessments during pilot.",
    ],
  },
  {
    name: "Targett",
    tags: ["AI Travel"],
    link: "https://www.targett.app",
    image: targettImage,
    overview:
      "Targett is a concept-stage AI-powered trip planner that generates personalized travel itineraries using user preferences, budgets, and real-time data.",
    responsibilities: [
      "Developed concept and initial roadmap for MVP.",
      "Outlined AI integration for itinerary generation and budget optimization.",
      "Created early prototype designs to visualize product flow.",
    ],
    achievements: [
      "Established proof of concept and roadmap for potential MVP.",
      "Produced prototype that demonstrates AI itinerary generation workflow.",
    ],
  },
];

const Projects = () => {
  const [expandedProject, setExpandedProject] = useState<string | null>(null);

  const toggleProject = (projectName: string) => {
    setExpandedProject(expandedProject === projectName ? null : projectName);
  };

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <Navigation />
      <main className="pt-40 pb-16">
        <div className="container mx-auto px-6">
          <div className="mb-12">
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-4">
              <span className="font-handwritten text-primary-visible">Projects</span>
            </h1>
            <p className="text-sm text-muted-foreground max-w-2xl">
              A collection of products I've built and nurtured across EdTech, HealthTech, and beyond
            </p>
          </div>

          {/* Live Projects Grid */}
          <div className="mb-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto items-start">
              {projectsData.filter(p => p.isLive).map((project, index) => (
                <div
                  key={`live-${project.name}-${index}`}
                  className="glass overflow-hidden rounded-[1.5rem] hover:shadow-2xl hover:shadow-primary/20 transition-all duration-350 relative flex flex-col"
                >
                {project.isLive && (
                  <div className="absolute top-4 right-4 z-10 flex items-center gap-2 glass px-3 py-1.5 rounded-full">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xs font-medium text-foreground">Live</span>
                  </div>
                )}
                {project.image && (
                  <div className="aspect-video overflow-hidden bg-muted">
                    <img
                      src={project.image}
                      alt={project.name}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                )}
                <div className="p-6 md:p-8 flex flex-col flex-1">
                <div className="flex flex-wrap gap-2 mb-3">
                  {project.tags.map((tag, tagIndex) => (
                    <span key={tagIndex} className="text-xs px-3 py-1 rounded-full glass text-white border border-white/20">
                      {tag}
                    </span>
                  ))}
                </div>
                  <h3 className="text-3xl font-display font-bold mb-4">{project.name}</h3>
                  <p className={`text-muted-foreground mb-6 leading-relaxed text-sm ${expandedProject !== project.name ? 'line-clamp-3' : ''}`}>
                    {project.overview}
                  </p>

                  {expandedProject === project.name && (
                    <div className="animate-slide-up space-y-6 mb-6">
                      <div>
                        <h4 className="text-xl font-display font-bold mb-3">Responsibilities</h4>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground text-sm">
                          {project.responsibilities.map((resp, respIndex) => (
                            <li key={respIndex}>{resp}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-xl font-display font-bold mb-3">Achievements</h4>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground text-sm">
                          {project.achievements.map((ach, achIndex) => (
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
                        toggleProject(project.name);
                      }}
                      variant="default"
                      size="sm"
                      className="rounded-full"
                    >
                      {expandedProject === project.name ? "See Less" : "View Details"}
                    </Button>
                    {project.link && (
                      <Button asChild variant="ghost" size="sm" className="rounded-full">
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Visit Site →
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
                </div>
              ))}
              
              {/* Empty Card for Hire */}
              <div className="glass overflow-hidden rounded-[1.5rem] hover:shadow-2xl hover:shadow-primary/20 transition-all duration-350 flex flex-col items-center justify-center p-12 min-h-[400px]">
                <div className="flex flex-col items-center gap-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse" />
                    <Lightbulb className="w-20 h-20 text-primary-visible relative" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-display font-bold text-center">
                    Your Amazing Idea Goes here.
                  </h3>
                  <Button asChild size="lg" className="gap-2">
                    <a href="https://calendar.app.google/aKsp6pywYzCAS6Nr9" target="_blank" rel="noopener noreferrer">
                      <Calendar className="w-5 h-5" />
                      Hire Henrietta
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Side Projects Section */}
          <div className="my-12">
            <div className="border-t border-border/30 mb-8"></div>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-8">
              Side <span className="font-handwritten text-primary-visible">Projects</span>
            </h2>
          </div>

          {/* Side Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto items-start">
            {projectsData.filter(p => !p.isLive).map((project, index) => (
              <div
                key={`side-${project.name}-${index}`}
                className="glass overflow-hidden rounded-[1.5rem] hover:shadow-2xl hover:shadow-primary/20 transition-all duration-350 relative"
              >
                {project.image && (
                  <div className="aspect-video overflow-hidden bg-muted">
                    <img
                      src={project.image}
                      alt={project.name}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {project.tags.map((tag, tagIndex) => (
                      <span key={tagIndex} className="text-xs px-3 py-1 rounded-full glass text-white border border-white/20">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-2xl font-display font-bold mb-4">{project.name}</h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed text-sm line-clamp-3">
                    {project.overview}
                  </p>

                  <div className="flex flex-wrap gap-3">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleProject(project.name);
                      }}
                      variant="default"
                      size="sm"
                      className="rounded-full"
                    >
                      {expandedProject === project.name ? "See Less" : "View Details"}
                    </Button>
                    {project.link && (
                      <Button asChild variant="ghost" size="sm" className="rounded-full">
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Visit Site →
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Projects;
