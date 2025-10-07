import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import JourneyStep from "./JourneyStep";

const journeySteps = [
  {
    title: "Where I Started",
    text: "I began with an architecture background, balancing design, structure, and the human experience. It taught me to see products as systems that serve people.",
  },
  {
    title: "What I've Built",
    text: "I've led cross-functional teams across telehealth, AI, SaaS, and learning platforms from idea to launch and iteration.",
  },
  {
    title: "Where I'm Headed",
    text: "I want to keep building products that matter, growing with every challenge, and leaving each team and product stronger than I found it.",
  },
];

const JourneySection = () => {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <section className="py-8" ref={ref}>
      <div className="container mx-auto px-6">
        <div className={`mb-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
          <span className="font-handwritten text-primary-visible">Henrietta's</span> Journey
        </h2>
          <p className="text-sm text-muted-foreground max-w-2xl">
            From Architecture to Product Management
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Vertical connecting line */}
            <div className="absolute left-8 top-8 bottom-8 w-0.5 bg-gradient-to-b from-primary/20 via-primary/40 to-primary/20 hidden md:block" />
            
            <div className="space-y-8">
              {journeySteps.map((step, index) => (
                <JourneyStep
                  key={index}
                  title={step.title}
                  text={step.text}
                  index={index}
                  isVisible={isVisible}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JourneySection;
