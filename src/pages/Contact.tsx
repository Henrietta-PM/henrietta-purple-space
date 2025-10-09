import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Mail, Linkedin, Twitter, Instagram, Calendar, Heart } from "lucide-react";
import ContactCard from "@/components/ContactCard";
import SocialCard from "@/components/SocialCard";
import { useScrollFade } from "@/hooks/use-scroll-fade";
import FloatingActionButton from "@/components/FloatingActionButton";
import { useHeartModal } from "@/App";

const Contact = () => {
  const { openHeartModal } = useHeartModal();
  const { ref: headerRef, opacity: headerOpacity, translateY: headerTranslateY } = useScrollFade();
  const { ref: buttonRef, opacity: buttonOpacity, translateY: buttonTranslateY } = useScrollFade();

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <Navigation />
      <main className="pt-40 pb-16">
        <div className="container mx-auto px-6">
          <div 
            ref={headerRef as any}
            className="mb-12"
            style={{ opacity: headerOpacity, transform: `translateY(${headerTranslateY}px)` }}
          >
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-4">
              Let's Build <span className="font-handwritten text-primary-visible">Together</span>
            </h1>
            <p className="text-sm text-muted-foreground max-w-2xl">
              Ready to collaborate? Let's grab a cup of coffee.
            </p>
          </div>

          <div className="max-w-2xl mx-auto space-y-8">
            <ContactCard>
              <h2 className="text-2xl font-display font-bold mb-6">Direct Contact</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <Mail className="w-6 h-6 text-primary-visible mt-1" />
                  <div>
                    <p className="font-semibold mb-1">Email</p>
                    <a
                      href="mailto:onwunemehenrietta7@gmail.com"
                      className="text-primary-visible hover:text-white hover:underline text-sm"
                    >
                      onwunemehenrietta7@gmail.com
                    </a>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <Button asChild size="lg" className="w-full rounded-full gap-2">
                  <a href="https://calendar.app.google/aKsp6pywYzCAS6Nr9" target="_blank" rel="noopener noreferrer">
                    <Calendar className="w-5 h-5" />
                    Hire Me
                  </a>
                </Button>
              </div>
            </ContactCard>

            <ContactCard>
              <h2 className="text-2xl font-display font-bold mb-6">Connect on Social</h2>

              <div className="grid sm:grid-cols-3 gap-4 mb-6">
                <SocialCard href="https://linkedin.com/in/henrietta-onwuneme" icon={Linkedin} label="LinkedIn" />
                <SocialCard href="https://x.com/henrietta_bby" icon={Twitter} label="Twitter" />
                <SocialCard href="https://www.instagram.com/henriettaofpm" icon={Instagram} label="Instagram" />
              </div>
              
              <Button 
                ref={buttonRef as any}
                onClick={openHeartModal}
                variant="outline"
                size="lg"
                className="w-full gap-2"
                style={{ opacity: buttonOpacity, transform: `translateY(${buttonTranslateY}px)` }}
              >
                <Heart className="w-5 h-5" />
                Send a Heart
              </Button>
            </ContactCard>
          </div>
        </div>
      </main>
      <Footer />
      <FloatingActionButton />
    </div>
  );
};

export default Contact;
