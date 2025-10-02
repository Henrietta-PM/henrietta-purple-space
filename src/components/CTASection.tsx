import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-6">
        <div className="bg-primary text-primary-foreground rounded-3xl p-12 md:p-16 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-8 max-w-4xl mx-auto leading-tight">
            I build and nurture products the digital way. Let's shape the next one together.
          </h2>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button
              asChild
              size="lg"
              variant="outline"
              className="bg-background text-primary hover:bg-background/90 border-background"
            >
              <Link to="/projects">View Projects</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="bg-background text-primary hover:bg-background/90 border-background"
            >
              <a href="mailto:onwunemehenrietta7@gmail.com">Hire Me</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
