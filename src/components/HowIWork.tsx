const workSteps = [
  {
    number: "01",
    title: "Listen with context",
    text: "I spend time with users before shaping work.",
  },
  {
    number: "02",
    title: "Create clarity",
    text: "Clear PRDs and flows that teams can execute.",
  },
  {
    number: "03",
    title: "Lead collaboration",
    text: "Align design and engineering around outcomes.",
  },
  {
    number: "04",
    title: "Measure outcomes",
    text: "Define metrics and learn from data.",
  },
];

const HowIWork = () => {
  return (
    <section className="py-8">
      <div className="container mx-auto px-6">
        <div className="mb-8">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            How I <span className="font-handwritten text-primary-visible">Work</span>
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
            
            {workSteps.map((step, index) => {
              return (
                <div
                  key={index}
                  className="relative glass rounded-[1.5rem] hover:shadow-xl hover:-translate-y-2 transition-all duration-300 animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="pt-8 pb-6 px-6 text-center">
                    <div className="mb-6 text-6xl font-display font-bold text-primary-visible">
                      {step.number}
                    </div>
                    
                    <h3 className="text-xl font-display font-bold mb-3">{step.title}</h3>
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

export default HowIWork;
