import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const Contact = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-32 pb-16">
        <div className="container mx-auto px-6">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-center">
            Let's Build Together
          </h1>
          <p className="text-xl text-muted-foreground text-center mb-16 max-w-2xl mx-auto">
            Ready to collaborate? Reach out and let's create something meaningful.
          </p>

          <div className="max-w-2xl mx-auto space-y-8">
            <Card className="border-none shadow-xl">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-6">Direct Contact</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="text-2xl">📧</div>
                    <div>
                      <p className="font-semibold mb-1">Email</p>
                      <a
                        href="mailto:onwunemehenrietta7@gmail.com"
                        className="text-primary hover:underline"
                      >
                        onwunemehenrietta7@gmail.com
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="text-2xl">📱</div>
                    <div>
                      <p className="font-semibold mb-1">Phone</p>
                      <a
                        href="tel:+2348103173566"
                        className="text-primary hover:underline"
                      >
                        +234 810 317 3566
                      </a>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <Button asChild size="lg" className="w-full">
                    <a href="mailto:onwunemehenrietta7@gmail.com?subject=Opportunity">
                      Hire Me
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-xl">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-6">Connect on Social</h2>
                <div className="grid sm:grid-cols-3 gap-4">
                  <a
                    href="https://linkedin.com/in/henrietta-onwuneme"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 bg-secondary rounded-xl hover:bg-primary hover:text-primary-foreground transition-all duration-350 text-center group"
                  >
                    <div className="text-3xl mb-2">💼</div>
                    <p className="font-semibold">LinkedIn</p>
                  </a>
                  <a
                    href="https://x.com/henrietta_bby"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 bg-secondary rounded-xl hover:bg-primary hover:text-primary-foreground transition-all duration-350 text-center group"
                  >
                    <div className="text-3xl mb-2">🐦</div>
                    <p className="font-semibold">Twitter</p>
                  </a>
                  <a
                    href="https://www.instagram.com/henriettaofpm"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 bg-secondary rounded-xl hover:bg-primary hover:text-primary-foreground transition-all duration-350 text-center group"
                  >
                    <div className="text-3xl mb-2">📸</div>
                    <p className="font-semibold">Instagram</p>
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
