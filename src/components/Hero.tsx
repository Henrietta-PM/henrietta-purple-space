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
    <section className="min-h-screen flex items-center justify-center pt-20 pb-16">
      <div className="container mx-auto px-6 h-full">
        <div className="relative h-[calc(100vh-8rem)] min-h-[600px]">
          <div className="absolute -inset-4 bg-primary/10 rounded-[3rem] blur-3xl"></div>
          <img
            src={heroImage}
            alt="Henrietta Onwuneme portrait"
            className="relative rounded-[3rem] lg:rounded-[3rem] w-full h-full object-cover object-[center_70%] sm:object-[center_60%] lg:object-[center_45%]"
          />
          
          {/* Overlay Card - Always visible, positioned on image */}
          <div className="absolute bottom-8 lg:bottom-16 left-4 right-4 lg:left-1/2 lg:-translate-x-1/2 lg:max-w-xl">
            <div className="glass rounded-[2rem] p-6 lg:p-8 space-y-4 lg:space-y-6 animate-slide-up">
              <div>
                <p className="text-base lg:text-lg text-muted-foreground mb-2">
                  Hi👋, I'm <span className="text-foreground font-bold text-glow">Henrietta Onwuneme</span>
                </p>
              </div>
              
              <h1 className="text-3xl lg:text-5xl xl:text-6xl font-display leading-tight text-foreground">
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
              
              <p className="text-sm lg:text-base text-foreground leading-relaxed max-w-[280px] lg:max-w-md font-medium">
                Product management, for me, is about people, their needs, and the paths we create to meet them.
              </p>
              
              <div className="flex gap-3 lg:gap-4 pt-2">
                <Button asChild size="default" className="rounded-[2rem] px-6 lg:px-8">
                  <Link to="/projects">View Projects</Link>
                </Button>
                <Button asChild variant="outline" size="default" className="rounded-[2rem] px-6 lg:px-8">
                  <a href="mailto:onwunemehenrietta7@gmail.com?subject=Opportunity">
                    Hire Me
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
