import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useState } from "react";

const Letter = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <Navigation />
      <main className="pt-32 pb-16">
        <div className="container mx-auto px-6">
          <div className="mb-12 space-y-3">
            <h1 className="text-4xl md:text-5xl font-display text-foreground max-w-xs md:max-w-none">
              <span className="font-handwritten text-primary-visible">Letter</span>
            </h1>
            <p className="text-sm text-muted-foreground font-handwritten text-lg">
              To my next team/employer
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="relative perspective-1000">
              {!isOpen && (
                <div
                  onClick={() => setIsOpen(true)}
                  className="cursor-pointer group"
                >
                  <div className="glass p-12 rounded-[2rem] hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-350">
                    <div className="text-center">
                      <div className="text-6xl mb-4">✉️</div>
                      <h2 className="text-3xl font-bold mb-2">Tap to open the letter</h2>
                      <p className="text-sm text-muted-foreground">
                        A personal message from Henrietta
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {isOpen && (
                <div className="animate-slide-up">
                  <div className="glass p-8 md:p-12 rounded-[2rem] shadow-2xl">
                    <div className="mb-8 text-center">
                      <button
                        onClick={() => setIsOpen(false)}
                        className="text-muted-foreground hover:text-primary transition-colors text-sm"
                      >
                        ← Close Letter
                      </button>
                    </div>

                    <div className="prose prose-lg max-w-none">
                      <h2 className="text-2xl md:text-3xl font-handwritten text-primary-visible mb-6">
                        To My Next Team,
                      </h2>
                      
                      <div className="space-y-6 text-foreground leading-relaxed">
                        <p>
                          I see every role as a journey. My path into product management started with 
                          curiosity and grew through resilience. Each step has shown me how much can 
                          happen when people come together with the will to build. I have worked with 
                          teams across time zones and turned early ideas into real products. Along the 
                          way I learned that progress comes from steady effort and honest collaboration.
                        </p>

                        <p>
                          I know I still have much to learn, and I look forward to gaining that knowledge 
                          from the work we do together. Every new challenge is a chance to grow, and I 
                          embrace that growth with confidence in what I already bring. My belief is simple: 
                          leave every project stronger than I found it and help those around me reach further.
                        </p>

                        <p>
                          If we work together, I will bring focus and commitment. I will carry the skills 
                          I have grown, the hunger to keep learning, and the energy to move both the work 
                          and the team forward.
                        </p>

                        <p>
                          I would be honored to bring this drive to your team. Let us begin the journey together.
                        </p>

                        <p className="text-left mt-8 font-handwritten text-xl md:text-2xl text-primary-visible">
                          Sincerely,
                          <br />
                          <span className="font-handwritten text-2xl md:text-3xl">Henrietta</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Letter;
