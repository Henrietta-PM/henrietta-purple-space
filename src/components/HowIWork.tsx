import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const workCards = [
  {
    title: "Listen with context",
    text: "I spend time with users before shaping work.",
  },
  {
    title: "Create clarity",
    text: "Clear PRDs and flows that teams can execute.",
  },
  {
    title: "Lead collaboration",
    text: "Align design and engineering around outcomes.",
  },
  {
    title: "Measure outcomes",
    text: "Define metrics and learn from data.",
  },
];

const HowIWork = () => {
  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">
          How I Work
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {workCards.map((card, index) => (
            <Card
              key={index}
              className="animate-slide-up border-none shadow-lg hover:shadow-xl transition-all duration-350 hover:-translate-y-1"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader>
                <CardTitle className="text-xl">{card.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{card.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowIWork;
