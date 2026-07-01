import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import ProjectCardDetailed from "./ProjectCardDetailed";
import bloomieImage from "@/assets/bloomie-logo.png";
import proxyImage from "@/assets/proxy-preview.jpg";
import syncuImage from "@/assets/syncu-preview.png";
import careerpassImage from "@/assets/careerpass-preview.png";

const projects = [
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
    isLive: true,
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
    isLive: true,
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
];

const FeaturedProjects = () => {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });
  const [expandedProject, setExpandedProject] = useState<string | null>(null);

  const toggleProject = (name: string) => {
    setExpandedProject(expandedProject === name ? null : name);
  };

  return (
    <section className="py-8" ref={ref}>
      <div className="container mx-auto px-6">
        <div className={`mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div>
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
              <span className="inline-block font-handwritten text-primary-visible -skew-x-6">Featured</span> Work
            </h2>
            <p className="text-sm text-muted-foreground max-w-2xl">
              Recent projects and achievements
            </p>
          </div>
          <Button asChild variant="default" size="lg" className="hidden md:inline-flex">
            <Link to="/projects">View More Projects</Link>
          </Button>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl items-start">
          {projects.map((project) => (
            <ProjectCardDetailed
              key={project.name}
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
        </div>
        <div className={`mt-12 text-center md:hidden transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <Button asChild variant="default" size="lg">
            <Link to="/projects">View More Projects</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProjects;
