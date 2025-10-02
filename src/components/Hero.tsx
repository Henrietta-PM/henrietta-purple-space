import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroImage from "@/assets/henrietta-portrait.jpg";

const Hero = () => {
  return (
    <section className="min-h-screen flex items-center pt-20 pb-16">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-slide-up">
            <h1 className="text-5xl md:text-6xl lg:text-7xl mb-6 leading-tight">
              I build and nurture products the digital way.
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
              Product management, for me, is about people, their needs, and the paths we create to meet them.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg">
                <Link to="/projects">View Projects</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a href="mailto:onwunemehenrietta7@gmail.com?subject=Opportunity">
                  Hire Me
                </a>
              </Button>
            </div>
          </div>
          
          <div className="animate-fade-in lg:order-first lg:order-last">
            <div className="relative">
              <img
                src={heroImage}
                alt="Henrietta Onwuneme portrait"
                className="rounded-2xl shadow-2xl w-full object-cover"
                style={{ aspectRatio: "4/5" }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
