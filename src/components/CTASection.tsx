import { Button } from "@/components/ui/button";
import { Calendar, Mail } from "lucide-react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { useScrollFade } from "@/hooks/use-scroll-fade";

const CTASection = () => {
  const { ref: animRef, isVisible } = useScrollAnimation({ threshold: 0.2 });
  const { ref: fadeRef, opacity, translateY } = useScrollFade();

  return (
    <section className="py-8" ref={animRef}>
      <div className="container mx-auto px-6">
        <div 
          ref={fadeRef}
          className={`glass rounded-[2rem] p-12 md:p-16 text-center max-w-4xl mx-auto transition-all duration-700 ${
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
          style={{
            opacity,
            transform: `translateY(${translateY}px) scale(${isVisible ? 1 : 0.95})`
          }}
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            Hire <span className="font-handwritten text-primary-visible">Henrietta?</span>
          </h2>
          <p className="text-sm text-muted-foreground mb-8">
            Hi Henrietta, I am interested in working with you!
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button
              asChild
              size="lg"
              className="rounded-[2rem] px-8 gap-2"
            >
              <a href="https://calendar.app.google/aKsp6pywYzCAS6Nr9" target="_blank" rel="noopener noreferrer">
                <Calendar className="w-5 h-5" />
                Hire Henrietta
              </a>
            </Button>
            <Button
              asChild
              variant="secondary"
              size="lg"
              className="rounded-full sm:rounded-[2rem] gap-2 w-11 sm:w-auto px-0 sm:px-4"
            >
              <a href="mailto:onwunemehenrietta7@gmail.com" className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                <span className="hidden sm:inline">Send Mail</span>
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
