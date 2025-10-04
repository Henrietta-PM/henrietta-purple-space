import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
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
      {/* Full screen background image with blur */}
      <div className="absolute inset-0 w-full h-full">
        <img
          src={heroImage}
          alt="Henrietta Onwuneme - Product Manager"
          className="w-full h-full object-cover object-[center_20%] md:object-center"
          style={{ filter: 'blur(2px)' }}
        />
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background/80" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 pt-32 pb-32 md:pb-40 text-center">
        {/* Featured Work Tab Button */}
        <div className="mb-12 inline-flex rounded-full p-1 glass">
          <Link 
            to="/projects"
            className="px-6 py-2.5 text-sm font-medium text-primary-visible hover:text-white hover:bg-primary/20 rounded-full transition-all"
          >
            Featured work
          </Link>
        </div>

        {/* Main Heading */}
        <h1 className="text-5xl md:text-7xl xl:text-8xl font-display font-bold leading-tight mb-6 max-w-5xl mx-auto">
          <span className="text-white" style={{ textShadow: '0 4px 30px rgba(0, 0, 0, 0.8)' }}>
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
            Products{" "}
            <br />
            The Digital Way.
          </span>
        </h1>

        {/* Subtext with blur backdrop */}
        <div className="inline-block mb-12 px-8 py-4 rounded-2xl backdrop-blur-md bg-background/30">
          <p className="text-lg md:text-xl text-white/95 leading-relaxed font-medium max-w-2xl">
            👋 Hi, I'm Henrietta. Product management for me, is about people, their needs, and the paths we create to meet them.
          </p>
        </div>

        {/* Bottom Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Button 
            asChild 
            variant="default"
            size="lg" 
            className="gap-3 text-base"
          >
            <Link to="/cv" className="flex items-center gap-3">
              <img 
                src={portraitImage} 
                alt="Henrietta" 
                className="w-8 h-8 rounded-full object-cover"
              />
              <span>About - Henrietta O.</span>
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
    </section>
  );
};

export default Hero;
