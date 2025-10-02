import { Card, CardContent } from "@/components/ui/card";
import { Users, FileText, GitBranch, BarChart3 } from "lucide-react";

const workSteps = [
  {
    icon: Users,
    number: "01",
    title: "Listen with context",
    text: "I spend time with users before shaping work.",
  },
  {
    icon: FileText,
    number: "02",
    title: "Create clarity",
    text: "Clear PRDs and flows that teams can execute.",
  },
  {
    icon: GitBranch,
    number: "03",
    title: "Lead collaboration",
    text: "Align design and engineering around outcomes.",
  },
  {
    icon: BarChart3,
    number: "04",
    title: "Measure outcomes",
    text: "Define metrics and learn from data.",
  },
];

const HowIWork = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-primary-light/20 to-background">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-display font-bold text-center mb-4">
          How I Work
        </h2>
        <p className="text-xl text-muted-foreground text-center mb-16 max-w-2xl mx-auto">
          A proven process from discovery to delivery
        </p>
        
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {/* Connection line - hidden on mobile */}
            <div className="hidden lg:block absolute top-20 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/20 via-primary/50 to-primary/20" 
                 style={{ width: 'calc(100% - 8rem)', left: '4rem' }} />
            
            {workSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <Card
                  key={index}
                  className="relative border-2 hover:border-primary transition-all duration-300 hover:shadow-xl hover:-translate-y-2 bg-background animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="pt-8 pb-6 px-6 text-center">
                    <div className="relative inline-flex mb-6">
                      <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl" />
                      <div className="relative p-5 rounded-2xl bg-gradient-to-br from-primary to-primary-hover">
                        <Icon className="w-7 h-7 text-primary-foreground" />
                      </div>
                    </div>
                    
                    <div className="mb-3 text-5xl font-display font-bold text-primary/20">
                      {step.number}
                    </div>
                    
                    <h3 className="text-xl font-display font-bold mb-3">{step.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{step.text}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowIWork;
