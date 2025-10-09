import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import WorkStepCard from "./WorkStepCard";

const workSteps = [
  {
    number: "01",
    title: "Listen with context",
    text: "I spend time with users before shaping work.",
  },
  {
    number: "02",
    title: "Create clarity",
    text: "I create clear PRDs and flows, using AI to spin up quick prototypes for clarity.",
  },
  {
    number: "03",
    title: "Lead collaboration",
    text: "I keep design and engineering aligned so we can ship with clarity",
  },
  {
    number: "04",
    title: "Measure outcomes",
    text: "I track what matters, learn from the data, and use it to make smarter decisions.",
  },
];

const HowIWork = () => {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <section className="py-8" ref={ref}>
      <div className="container mx-auto px-6">
        <div className={`mb-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            <span className="inline-block font-handwritten text-primary-visible -skew-x-6">How</span> I Work
          </h2>
          <p className="text-sm text-muted-foreground max-w-2xl">
            My approach to building successful products
          </p>
        </div>
        
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {/* Connection line - hidden on mobile */}
            <div className="hidden lg:block absolute top-20 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/20 via-primary/50 to-primary/20" 
                 style={{ width: 'calc(100% - 8rem)', left: '4rem' }} />
            
            {workSteps.map((step, index) => (
              <WorkStepCard
                key={index}
                number={step.number}
                title={step.title}
                text={step.text}
                index={index}
                isVisible={isVisible}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowIWork;
