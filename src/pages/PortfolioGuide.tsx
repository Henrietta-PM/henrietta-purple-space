import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import FloatingActionButton from "@/components/FloatingActionButton";
import { Button } from "@/components/ui/button";

interface Principle {
  title: string;
  body: string;
  example: string;
}

const principles: Principle[] = [
  {
    title: "Lead with outcomes, not tasks",
    body: "Hiring managers scan for impact first. Open every case study with the result, then explain how you got there.",
    example:
      "ProxyMedicine: redesigning the mobile onboarding journey grew monthly consultations from about 25 to 112 and daily paying users from 0-1 to 5-9.",
  },
  {
    title: "Show the problem you found",
    body: "Great PM work starts with a sharp insight. Name the signal in the data or research that changed your direction.",
    example:
      "At Demz Analytics, noticing that about 80% of traffic came from mobile led to a full rework of acquisition and onboarding.",
  },
  {
    title: "Make your role unmistakable",
    body: "Say exactly what you owned: discovery, PRDs, roadmap, launch, or go-to-market. Vague team credit weakens the story.",
    example:
      "Sally and VibeStack: planned and shipped end-to-end on Lovable, including payments, transactional emails, and analytics.",
  },
  {
    title: "Include side projects with real users",
    body: "Side projects prove initiative, especially when they have traction you can measure.",
    example:
      "A public-sector attendance platform built as community service: 45,000+ check-ins, 5,600+ registered users, and about 2,800 daily active users.",
  },
  {
    title: "Quantify before and after",
    body: "A before and after number is the fastest way to prove your decisions worked.",
    example: "Targett: raised an AI discoverability score from 44 to 98 in two weeks, with 50+ users running audits.",
  },
  {
    title: "Keep it skimmable",
    body: "Use short sections for overview, responsibilities, and achievements, with one clear visual per project.",
    example: "Every project on this site follows the same overview, responsibilities, and achievements structure.",
  },
];

export const PortfolioGuide = () => {
  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <Navigation />
      <main className="pt-40 pb-16">
        <article className="container mx-auto px-6 max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-4">
            Product Manager <span className="font-handwritten text-primary-visible">Portfolio</span> Examples
          </h1>
          <p className="text-muted-foreground mb-12 leading-relaxed">
            What makes a product manager portfolio stand out, explained with real case studies from my own work in
            healthcare, SaaS, and AI products.
          </p>

          <div className="space-y-8">
            {principles.map((p, i) => (
              <section key={p.title} className="glass p-6 md:p-8 rounded-[1.5rem]">
                <h2 className="text-2xl font-display font-bold mb-3">
                  <span className="font-handwritten text-primary-visible mr-2">{i + 1}.</span>
                  {p.title}
                </h2>
                <p className="text-muted-foreground mb-4 leading-relaxed">{p.body}</p>
                <p className="text-sm border-l-2 border-primary pl-4 text-foreground/90">
                  <span className="font-semibold">Example: </span>
                  {p.example}
                </p>
              </section>
            ))}
          </div>

          <div className="mt-12 flex flex-wrap gap-3">
            <Button asChild className="rounded-full">
              <Link to="/projects">See the full case studies</Link>
            </Button>
            <Button asChild variant="secondary" className="rounded-full">
              <Link to="/cv">View my CV</Link>
            </Button>
          </div>
        </article>
      </main>
      <Footer />
      <FloatingActionButton />
    </div>
  );
};

export default PortfolioGuide;
