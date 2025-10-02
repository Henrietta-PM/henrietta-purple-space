import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useState } from "react";
import { cn } from "@/lib/utils";

const Letter = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-32 pb-16">
        <div className="container mx-auto px-6">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-center">
            Letter to My Next Team
          </h1>
          <p className="text-xl text-muted-foreground text-center mb-16 max-w-2xl mx-auto">
            A personal note about my journey and what I bring
          </p>

          <div className="max-w-3xl mx-auto">
            <div className="relative perspective-1000">
              {!isOpen && (
                <div
                  onClick={() => setIsOpen(true)}
                  className="cursor-pointer group"
                >
                  <div className="bg-gradient-to-br from-primary/20 to-primary/5 p-12 rounded-3xl border-2 border-primary/30 hover:border-primary transition-all duration-350 hover:shadow-2xl transform hover:-translate-y-2">
                    <div className="text-center">
                      <div className="text-6xl mb-4">✉️</div>
                      <h2 className="text-3xl font-bold mb-2">Tap to open the letter</h2>
                      <p className="text-muted-foreground">
                        A personal message from Henrietta
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {isOpen && (
                <div className="animate-slide-up">
                  <div className="bg-card p-8 md:p-12 rounded-3xl shadow-2xl border border-border">
                    <div className="mb-8 text-center">
                      <button
                        onClick={() => setIsOpen(false)}
                        className="text-muted-foreground hover:text-primary transition-colors text-sm"
                      >
                        ← Close Letter
                      </button>
                    </div>

                    <div className="prose prose-lg max-w-none">
                      <h2 className="text-3xl font-bold mb-6" style={{ fontFamily: 'cursive' }}>
                        To My Next Team,
                      </h2>
                      
                      <div className="space-y-6 text-foreground leading-relaxed">
                        <p>
                          I see every role as a journey. My path into product management grew from
                          curiosity and steady work. Each role taught me how much can happen when
                          people come together with clear intention to build. I have worked with
                          teams across time zones and helped early ideas reach people who use them.
                          Along the way I learned that steady effort and honest collaboration create
                          lasting results.
                        </p>

                        <p>
                          I know I still have much to learn, and I welcome that knowledge from the
                          projects we tackle together. I bring focus, care, and drive to grow
                          alongside the team. I believe in leaving each project stronger than I
                          found it.
                        </p>

                        <p>
                          I would be honored to bring this energy to your team. Let us begin this
                          work together.
                        </p>

                        <p className="text-right mt-8" style={{ fontFamily: 'cursive' }}>
                          Sincerely,
                          <br />
                          <span className="text-primary font-bold">Henrietta</span>
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
