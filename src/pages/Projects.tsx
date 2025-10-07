import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Calendar, Lightbulb, Mail } from "lucide-react";
import bloomieImage from "@/assets/bloomie-logo.png";
import ProjectCardDetailed from "@/components/ProjectCardDetailed";
import { useScrollFade } from "@/hooks/use-scroll-fade";
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
                  expandedProject={expandedProject}
                  onToggle={toggleProject}
                />
              ))}
              
              {/* Empty Card for Hire */}
              <div 
                ref={hireCardRef}
                className="border-2 border-dashed border-border/50 overflow-hidden rounded-[1.5rem] hover:shadow-2xl hover:shadow-primary/20 transition-all duration-350 flex flex-col"
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
                      <a href="https://calendar.app.google/aKsp6pywYzCAS6Nr9" target="_blank" rel="noopener noreferrer">
                        <Calendar className="w-4 h-4" />
                        Hire Henrietta
                      </a>
                    </Button>
                    <Button asChild variant="secondary" size="sm" className="gap-2">
                      <a href="mailto:onwunemehenrietta7@gmail.com">
                        <Mail className="w-4 h-4" />
                        Send Mail
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto items-start">
            {projectsData.filter(p => !p.isLive).map((project, index) => (
              <ProjectCardDetailed
                key={`side-${project.name}-${index}`}
                name={project.name}
                tags={project.tags}
                image={project.image}
                link={project.link}
                overview={project.overview}
                responsibilities={project.responsibilities}
                achievements={project.achievements}
                expandedProject={expandedProject}
                onToggle={toggleProject}
              />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Projects;
