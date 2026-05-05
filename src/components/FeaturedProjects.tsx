import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import ProjectCardDetailed from "./ProjectCardDetailed";
import targettImage from "@/assets/targett-preview-new.png";
import proxyImage from "@/assets/proxy-preview.jpg";
import vibestackImage from "@/assets/vibestack-preview.jpg";

const projects = [
  {
    name: "VibeStack",
    tags: ["AI Design", "DevTools"],
    image: vibestackImage,
    link: "https://vibestacks.pro",
    isLive: true,
    overview:
      "VibeStack is a design-system generator for vibe coders. In one prompt, it mixes 200k+ icons, curated palettes, font pairings, atmospheres, and layout styles into a cohesive theme you can drop into any AI-built app, so prototypes stop looking generic.",
    responsibilities: [
      "Planned and shipped the product end-to-end on Lovable: scoping, design, build, and launch.",
      "Connected the full stack: authentication, Stripe payments, Resend transactional emails, and product analytics.",
      "Designed the prompt-to-theme engine covering icon packs (Lucide, Phosphor, Tabler), palettes, fonts, and atmospheres.",
      "Built live theme previews so users can see styles applied to a real UI before exporting.",
      "Owned the GTM motion: landing page, pricing, and onboarding flows.",
    ],
    achievements: [
      "Took the product from idea to live, paying-ready launch solo using Lovable.",
      "Integrated payments, emails, and analytics without a separate engineering team.",
      "Curated 6 palettes, 6 font pairings, 5 atmospheres, and 200k+ icons into a single picker.",
    ],
  },
  {
    name: "Targett",
    tags: ["AI Search", "SEO"],
    image: targettImage,
    link: "https://www.targett.app",
    isLive: true,
    overview:
      "Targett is an AI-powered search optimization platform that helps businesses improve their visibility across AI search engines like ChatGPT, Perplexity, and Google AI Overviews. Planned and built end-to-end on Lovable with Stripe payments, Resend emails, and analytics fully integrated.",
    responsibilities: [
      "Defined product vision and roadmap for AI search optimization tooling.",
      "Led end-to-end product development on Lovable, from concept to launch.",
      "Designed the PRD framework covering brand tracking, competitor analysis, and AI-optimized content generation.",
      "Connected Stripe payments, Resend transactional emails, and product analytics into the platform.",
      "Coordinated cross-functional efforts across engineering, design, and marketing.",
    ],
    achievements: [
      "Launched MVP with full AI search tracking and optimization features.",
      "Built a platform covering 6+ major AI search engines.",
      "Delivered actionable insights for businesses to improve AI search visibility.",
    ],
  },
  {
    name: "ProxyMedicine",
    tags: ["Telehealth", "HealthTech"],
    image: proxyImage,
    link: "https://www.prxy.health",
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

