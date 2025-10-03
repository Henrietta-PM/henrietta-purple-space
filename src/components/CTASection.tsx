import { Button } from "@/components/ui/button";

const CTASection = () => {
  return (
    <section className="py-12">
      <div className="container mx-auto px-6">
        <div className="glass rounded-[2rem] p-12 md:p-16 text-center max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            Hire <span className="font-normal italic">Henrietta?</span>
          </h2>
          <p className="text-sm text-muted-foreground mb-8">
            Hi Henrietta, I am interested in working with you!
          </p>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="rounded-[2rem] px-8"
          >
            <a href="mailto:onwunemehenrietta7@gmail.com?subject=Opportunity">
              Hire Henrietta
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
