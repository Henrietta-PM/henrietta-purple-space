import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Calendar } from "lucide-react";
import heroImage1 from "@/assets/henrietta-hero-1.jpg";
import heroImage3 from "@/assets/henrietta-hero-3.jpg";
import portraitImage from "@/assets/henrietta-portrait.jpg";
import bloomieLogoFeatured from "@/assets/bloomie-logo-featured.png";

const Hero = () => {
  const [currentWord, setCurrentWord] = useState(0);
  const [currentImage, setCurrentImage] = useState(0);
  const [scrollOpacity, setScrollOpacity] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);
  const words = ["Build", "Manage"];
  const heroImages = [heroImage1, heroImage3];

  useEffect(() => {
    // Trigger entrance animation
    setIsLoaded(true);

    const wordInterval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length);
    }, 3000);
    
    const imageInterval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 5000);

    // Handle scroll for fade out effect
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const fadeStart = 0;
      const fadeEnd = windowHeight * 0.6;
      
      if (scrollPosition <= fadeStart) {
        setScrollOpacity(1);
      } else if (scrollPosition >= fadeEnd) {
        setScrollOpacity(0);
      } else {
        const opacity = 1 - (scrollPosition - fadeStart) / (fadeEnd - fadeStart);
        setScrollOpacity(opacity);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      clearInterval(wordInterval);
      clearInterval(imageInterval);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-[40px]">
      {/* Full screen background image with blur */}
      <div className="absolute inset-0 w-full h-full">
        {heroImages.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Henrietta Hero ${index + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              index === currentImage ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              filter: 'blur(3px)',
              transform: 'scale(1.1)',
            }}
          />
        ))}
        <div className="absolute inset-0 bg-background/55 dark:bg-background/60" />
      </div>

      {/* Content Container */}
      <div 
        className={`relative z-10 w-full max-w-6xl mx-auto px-6 pt-0 md:pt-32 pb-32 md:pb-40 text-center transition-all duration-1000 ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
        style={{ 
          opacity: scrollOpacity,
          transform: `translateY(${(1 - scrollOpacity) * -50}px)`
        }}
      >
        {/* Featured Work Tab Button */}
        <div className="mb-8 md:mb-12 inline-flex rounded-full glass border border-white/10 dark:border-white/10 border-primary/20">
          <Link 
            to="/projects"
            className="px-2 md:px-3 py-1 md:py-1.5 text-xs md:text-sm font-medium hover:bg-primary/10 rounded-full transition-all flex items-center gap-1.5 md:gap-2"
          >
            <img 
              src={bloomieLogoFeatured} 
              alt="Bloomie" 
              className="w-5 h-5 md:w-6 md:h-6 object-contain flex-shrink-0"
            />
            <span className="text-xs md:text-sm font-bold text-foreground dark:text-white">Bloomie</span>
            <div className="w-px h-3 md:h-4 bg-foreground/20 dark:bg-white/20"></div>
            <span className="text-[8px] md:text-[10px] text-foreground/70 dark:text-white/60 font-normal">Featured work</span>
          </Link>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl md:text-7xl xl:text-8xl font-display font-bold leading-tight mb-6 md:mb-6 max-w-5xl mx-auto">
          <span className="text-foreground dark:text-white" style={{ textShadow: '0 4px 30px rgba(0, 0, 0, 0.3)' }}>
            I{" "}
            <span className="relative inline-block font-handwritten text-glow">
              {words.map((word, index) => (
                <span
                  key={word}
                  className={`transition-opacity duration-500 ${
                    index === currentWord ? "opacity-100" : "opacity-0 absolute inset-0"
                  }`}
                  style={{ 
                    color: 'hsl(var(--primary-visible))',
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

        {/* Subtext */}
        <p className="text-xs md:text-lg xl:text-xl text-foreground/90 dark:text-white/95 mb-8 md:mb-12 leading-relaxed font-medium max-w-2xl mx-auto px-4">
          👋 Hi, I'm Henrietta.
          <br />
          <span className="hidden md:inline">Product management for me, is about people, their needs, <br />and the paths we create to meet them.</span>
          <span className="md:hidden">Product management for me, is about people, their needs, and the paths we create to meet them.</span>
        </p>

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
