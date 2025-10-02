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
        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            My Journey
          </h2>
          <p className="text-base text-muted-foreground max-w-2xl">
            From architecture to product management — a path driven by curiosity and purpose
          </p>
        </div>
        
        <div className="max-w-5xl mx-auto relative">
          {/* Snake path line */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none hidden md:block" style={{ zIndex: 0 }}>
            <path
              d="M 50 100 Q 250 50, 450 100 T 850 100 Q 1050 150, 1250 100"
              stroke="hsl(var(--primary))"
              strokeWidth="2"
              fill="none"
              strokeDasharray="5,5"
              opacity="0.3"
            />
          </svg>
          
          <div className="grid md:grid-cols-3 gap-8 relative" style={{ zIndex: 1 }}>
            {journeySteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={index}
                  className="relative"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="glass p-8 rounded-[1.5rem] hover:shadow-xl transition-all duration-300 hover:-translate-y-2 animate-slide-up">
                    <div className="mb-6 inline-flex p-4 rounded-2xl bg-primary/10">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-2xl font-display font-bold mb-4">{step.title}</h3>
                    <p className="text-muted-foreground leading-relaxed text-sm">{step.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default JourneySection;
