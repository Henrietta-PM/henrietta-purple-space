import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import heroImage from "@/assets/henrietta-hero.jpg";

const Hero = () => {
  const [currentWord, setCurrentWord] = useState(0);
  const words = ["build", "nurture"];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="min-h-screen flex items-center pt-20 pb-16">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="animate-slide-up space-y-6">
            <div className="inline-block">
              <p className="text-lg md:text-xl text-muted-foreground mb-4">
                Hi👋, I'm <span className="text-foreground font-bold text-glow">Henrietta Onwuneme</span>
              </p>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display leading-tight text-foreground">
              I{" "}
              <span className="relative inline-block">
                {words.map((word, index) => (
                  <span
                    key={word}
                    className={`text-primary transition-opacity duration-500 ${
                      index === currentWord ? "opacity-100" : "opacity-0 absolute inset-0"
                    }`}
                  >
                    {word}
                  </span>
                ))}
              </span>{" "}
              products the digital way.
            </h1>
            
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              Product management, for me, is about people, their needs, and the paths we create to meet them.
            </p>
            
            <div className="flex flex-wrap gap-4 pt-4">
              <Button asChild size="lg" className="rounded-full px-8">
                <Link to="/projects">View Projects</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full px-8">
                <a href="mailto:onwunemehenrietta7@gmail.com?subject=Opportunity">
                  Hire Me
                </a>
              </Button>
            </div>
          </div>
          
          <div className="animate-fade-in lg:order-last">
            <div className="relative">
              <div className="absolute -inset-4 bg-primary/10 rounded-[2rem] blur-3xl"></div>
              <img
                src={heroImage}
                alt="Henrietta Onwuneme portrait"
                className="relative rounded-[2rem] w-full object-cover"
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
