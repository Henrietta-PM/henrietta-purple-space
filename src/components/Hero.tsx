import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Briefcase } from "lucide-react";
import heroImage from "@/assets/henrietta-hero.jpg";
import portraitImage from "@/assets/henrietta-portrait.jpg";

const Hero = () => {
  const [currentWord, setCurrentWord] = useState(0);
  const words = ["Build", "Nurture"];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Full screen background image */}
      <div className="absolute inset-0 w-full h-full">
        <img
          src={heroImage}
          alt="Henrietta Onwuneme"
          className="w-full h-full object-cover object-[center_20%] md:object-center"
        />
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background/80" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 pt-32 pb-32 md:pb-40">
        <div className="max-w-3xl">
          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl xl:text-8xl font-display font-bold leading-tight mb-6">
            I{" "}
            <span className="relative inline-block">
              {words.map((word, index) => (
                <span
                  key={word}
                  className={`transition-opacity duration-500 ${
                    index === currentWord ? "opacity-100" : "opacity-0 absolute inset-0"
                  }`}
                  style={{ 
                    color: 'hsl(var(--primary-visible))',
                    textShadow: '0 0 40px hsl(var(--primary) / 0.6), 0 0 80px hsl(var(--primary) / 0.3)'
                  }}
                >
                  {word}
                </span>
              ))}
            </span>{" "}
            <br className="hidden md:block" />
            Products <br className="md:hidden" />
            The Digital Way.
          </h1>

          {/* Subtext */}
          <p className="text-lg md:text-xl text-white/95 leading-relaxed mb-10 font-medium max-w-2xl" 
             style={{ textShadow: '0 2px 20px rgba(0, 0, 0, 0.9), 0 4px 40px rgba(0, 0, 0, 0.7)' }}>
            Hi, I'm Henrietta, product management for me, is about people, their needs, and the paths we create to meet them.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 mb-12">
            <Button asChild size="lg" className="text-base px-8">
              <Link to="/projects">Featured Work</Link>
            </Button>
            <Button asChild variant="secondary" size="lg" className="text-base px-8">
              <a href="https://calendar.app.google/aKsp6pywYzCAS6Nr9" target="_blank" rel="noopener noreferrer">
                Hire
              </a>
            </Button>
          </div>

          {/* Bottom Action Buttons */}
          <div className="flex flex-wrap gap-4">
            <Button 
              asChild 
              variant="outline" 
              size="lg" 
              className="gap-3 text-base"
            >
              <Link to="/cv" className="flex items-center gap-3">
                <img 
                  src={portraitImage} 
                  alt="Henrietta" 
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span>About - Henrietta O</span>
              </Link>
            </Button>
            <Button 
              asChild 
              variant="secondary" 
              size="lg"
              className="text-base"
            >
              <a href="https://calendar.app.google/aKsp6pywYzCAS6Nr9" target="_blank" rel="noopener noreferrer">
                Hire
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
