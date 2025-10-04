import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Linkedin, Twitter, Instagram } from "lucide-react";

const Contact = () => {
  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <Navigation />
      <main className="pt-32 pb-16">
        <div className="container mx-auto px-6">
          <div className="mb-12">
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-4">
              Let's Build <span className="font-handwritten text-primary-visible">Together</span>
            </h1>
            <p className="text-sm text-muted-foreground max-w-2xl">
              Ready to collaborate? Reach out and let's create something meaningful
            </p>
          </div>

          <div className="max-w-2xl mx-auto space-y-8">
            <div className="glass p-8 rounded-[1.5rem]">
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
                <div className="flex items-start gap-4">
                  <Phone className="w-6 h-6 text-primary-visible mt-1" />
                  <div>
                    <p className="font-semibold mb-1">Phone</p>
                    <a
                      href="tel:+2348103173566"
                      className="text-primary-visible hover:text-white hover:underline text-sm"
                    >
                      +234 810 317 3566
                    </a>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <Button asChild size="lg" className="w-full rounded-full">
                  <a href="https://calendar.app.google/aKsp6pywYzCAS6Nr9" target="_blank" rel="noopener noreferrer">
                    Hire Me
                  </a>
                </Button>
              </div>
            </div>

            <div className="glass p-8 rounded-[1.5rem]">
              <h2 className="text-2xl font-display font-bold mb-6">Connect on Social</h2>
              <div className="grid sm:grid-cols-3 gap-4">
                <a
                  href="https://linkedin.com/in/henrietta-onwuneme"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-6 glass rounded-xl hover:shadow-lg hover:-translate-y-1 transition-all duration-350 flex flex-col items-center gap-3 group"
                >
                  <Linkedin className="w-8 h-8 text-primary-visible" />
                  <p className="font-semibold text-sm">LinkedIn</p>
                </a>
                <a
                  href="https://x.com/henrietta_bby"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-6 glass rounded-xl hover:shadow-lg hover:-translate-y-1 transition-all duration-350 flex flex-col items-center gap-3 group"
                >
                  <Twitter className="w-8 h-8 text-primary-visible" />
                  <p className="font-semibold text-sm">Twitter</p>
                </a>
                <a
                  href="https://www.instagram.com/henriettaofpm"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-6 glass rounded-xl hover:shadow-lg hover:-translate-y-1 transition-all duration-350 flex flex-col items-center gap-3 group"
                >
                  <Instagram className="w-8 h-8 text-primary-visible" />
                  <p className="font-semibold text-sm">Instagram</p>
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
