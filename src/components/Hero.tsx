import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Calendar } from "lucide-react";
import heroImage from "@/assets/henrietta-hero.jpg";
import portraitImage from "@/assets/henrietta-portrait.jpg";
import bloomieLogoFeatured from "@/assets/bloomie-logo-featured.png";

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
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-[40px]">
      {/* Full screen background image with blur */}
      <div className="absolute inset-0 w-full h-full">
        <img
          src={heroImage}
          alt="Henrietta Hero"
          className="w-full h-full object-cover"
          style={{
            filter: 'blur(3px)',
            transform: 'scale(1.1)',
          }}
        />
        <div className="absolute inset-0 bg-background/60" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 pt-16 md:pt-32 pb-24 md:pb-40 text-center">
        {/* Featured Work Tab Button */}
        <div className="mb-8 md:mb-12 inline-flex rounded-full glass border border-white/10">
          <Link 
            to="/projects"
            className="px-2 md:px-3 py-1 md:py-1.5 text-xs md:text-sm font-medium hover:bg-primary/10 rounded-full transition-all flex items-center gap-1.5 md:gap-2"
          >
            <img 
              src={bloomieLogoFeatured} 
              alt="Bloomie" 
              className="w-5 h-5 md:w-6 md:h-6 object-contain flex-shrink-0"
            />
            <span className="text-xs md:text-sm font-bold text-white">Bloomie</span>
            <div className="w-px h-3 md:h-4 bg-white/20"></div>
            <span className="text-[8px] md:text-[10px] text-white/60 font-normal">Featured work</span>
          </Link>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl md:text-7xl xl:text-8xl font-display font-bold leading-tight mb-6 md:mb-6 max-w-5xl mx-auto">
          <span className="text-white" style={{ textShadow: '0 4px 30px rgba(0, 0, 0, 0.8)' }}>
            I{" "}
            <span className="relative inline-block font-handwritten">
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
            <br className="hidden md:block" />
            <span className="block md:inline">The Digital Way.</span>
          </span>
        </h1>

        {/* Subtext with blur backdrop */}
        <div className="inline-block mb-8 md:mb-12 px-4 md:px-6 py-2.5 md:py-4 rounded-2xl backdrop-blur-md bg-background/30">
          <p className="text-xs md:text-lg xl:text-xl text-white/95 leading-relaxed font-medium max-w-2xl">
            👋 Hi, I'm Henrietta.
            <br />
            <span className="hidden md:inline">Product management for me, is about people, their needs, <br />and the paths we create to meet them.</span>
            <span className="md:hidden">Product management for me, is about people, their needs, and the paths we create to meet them.</span>
          </p>
        </div>

        {/* Bottom Action Buttons */}
        <div className="flex flex-row gap-2 md:gap-4 justify-center items-center">
          <Button 
            asChild 
            variant="default"
            size="lg" 
            className="gap-2 text-xs md:text-base px-3 md:px-6 h-10 md:h-12 flex-shrink min-w-0"
          >
            <Link to="/cv" className="flex items-center gap-2">
              <img 
                src={portraitImage} 
                alt="Henrietta" 
                className="w-6 h-6 md:w-8 md:h-8 rounded-full object-cover flex-shrink-0 -ml-1"
              />
              <span className="whitespace-nowrap">About - Henrietta O.</span>
            </Link>
          </Button>
          <Button 
            asChild 
            variant="secondary" 
            size="lg"
            className="text-xs md:text-base px-4 md:px-8 h-10 md:h-12 flex-shrink-0 whitespace-nowrap gap-2"
          >
            <a href="https://calendar.app.google/aKsp6pywYzCAS6Nr9" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
              <Calendar className="w-4 h-4 md:w-5 md:h-5" />
              Hire
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
