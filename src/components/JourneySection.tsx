import { Card, CardContent } from "@/components/ui/card";
import { Compass, Rocket, TrendingUp } from "lucide-react";

const journeySteps = [
  {
    icon: Compass,
    title: "Where I Started",
    text: "I began with an architecture background, balancing design, structure, and the human experience. It taught me to see products as systems that serve people.",
  },
  {
    icon: Rocket,
    title: "What I've Built",
    text: "I've led cross‑functional teams across telehealth, AI, SaaS, and learning platforms — from idea to launch and iteration.",
  },
  {
    icon: TrendingUp,
    title: "Where I'm Headed",
    text: "I want to keep building products that matter, growing with every challenge, and leaving each team and project stronger than I found it.",
  },
];

const JourneySection = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            My Journey
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            From architecture to product management — a path driven by curiosity and purpose
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {journeySteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <Card
                key={index}
                className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 bg-card/50 backdrop-blur"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <CardContent className="pt-8 pb-8 px-6">
                  <div className="mb-6 inline-flex p-4 rounded-2xl bg-primary/10">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-display font-bold mb-4">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{step.text}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default JourneySection;
