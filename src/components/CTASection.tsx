import { Button } from "@/components/ui/button";
import { Calendar, Heart } from "lucide-react";
import { useState } from "react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { useScrollFade } from "@/hooks/use-scroll-fade";
import HeartModal from "./HeartModal";

const CTASection = () => {
  const [showHeartModal, setShowHeartModal] = useState(false);
  const { ref: animRef, isVisible } = useScrollAnimation({ threshold: 0.2 });
  const { ref: fadeRef, opacity } = useScrollFade();

  return (
    <>
      <section 
        className="py-8" 
        ref={(node: HTMLDivElement | null) => {
          if (animRef) animRef.current = node;
          if (fadeRef) fadeRef.current = node;
        }}
        style={{ opacity }}
      >
        <div className="container mx-auto px-6">
          <div className={`glass rounded-[2rem] p-12 md:p-16 text-center max-w-4xl mx-auto transition-all duration-700 ${
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}>
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
              Hire <span className="font-handwritten text-primary-visible">Henrietta?</span>
            </h2>
            <p className="text-sm text-muted-foreground mb-8">
              Hi Henrietta, I am interested in working with you!
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
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
                onClick={() => setShowHeartModal(true)}
                variant="outline"
                size="lg"
                className="rounded-[2rem] px-8 gap-2"
              >
                <Heart className="w-5 h-5" />
                Send Heart
              </Button>
            </div>
          </div>
        </div>
      </section>
      <HeartModal isOpen={showHeartModal} onClose={() => setShowHeartModal(false)} />
    </>
  );
};

export default CTASection;
