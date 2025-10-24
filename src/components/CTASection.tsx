import { Button } from "@/components/ui/button";
import { Calendar, Mail } from "lucide-react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { useScrollFade } from "@/hooks/use-scroll-fade";
import { useScrollGlow } from "@/hooks/use-scroll-glow";

const CTASection = () => {
  const { ref: animRef, isVisible } = useScrollAnimation({ threshold: 0.2 });
  const { ref: fadeRef, opacity, translateY } = useScrollFade();
  const { ref: glowRef, glowIntensity } = useScrollGlow();

  return (
    <section className="py-8" ref={animRef}>
      <div className="container mx-auto px-6">
        <div 
          ref={(el) => {
            // @ts-ignore
            fadeRef.current = el;
            // @ts-ignore
            glowRef.current = el;
          }}
          className={`glass rounded-[2rem] p-12 md:p-16 text-center max-w-4xl mx-auto transition-all duration-700 ${
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
          style={{
            opacity,
            transform: `translateY(${translateY}px) scale(${isVisible ? 1 : 0.95})`,
            boxShadow: `0 0 ${50 * glowIntensity}px ${10 * glowIntensity}px hsl(var(--primary) / ${0.25 * glowIntensity}), 0 0 ${90 * glowIntensity}px ${18 * glowIntensity}px hsl(var(--primary) / ${0.12 * glowIntensity})`
          }}
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            Hire <span className="font-handwritten text-primary-visible">Henrietta?</span>
          </h2>
          <p className="text-sm text-muted-foreground mb-8">
            Hi Henrietta, I am interested in working with you!
          </p>
          <div className="flex gap-3 justify-center">
            <Button
              asChild
              size="lg"
              className="rounded-[2rem] px-4 sm:px-8 gap-2 text-sm sm:text-base"
            >
              <a href="https://calendar.app.google/aKsp6pywYzCAS6Nr9" target="_blank" rel="noopener noreferrer">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="whitespace-nowrap">Hire Henrietta</span>
              </a>
            </Button>
            <Button
              asChild
              variant="secondary"
              size="lg"
              className="rounded-full sm:rounded-[2rem] gap-2 w-11 sm:w-auto px-0 sm:px-4 flex-shrink-0"
            >
              <a href="mailto:mypvrplespace@gmail.com" className="flex items-center gap-2">
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
