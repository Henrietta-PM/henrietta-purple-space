import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { useState } from "react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

const testimonials = [
  {
    quote: "I had the pleasure of working with Henrietta on Bloomie, where she served as Product Manager. Under her leadership, we successfully launched the MVP, a testament to her organized, user-focused approach and ability to deliver results under pressure. Henrietta is resourceful, calm under pressure, and deeply committed to building products that matter. I highly recommend her.",
    author: "Shile Owoka",
    role: "CEO, Bloomie Inc.",
    gradient: "from-purple-600 to-pink-600",
  },
  {
    quote: "Henrietta has been a very very very very amazing add to the team and amongst many people I've worked with, I enjoy working with her.",
    author: "Adenekan Wonderful",
    role: "Mycro",
    gradient: "from-purple-700 to-purple-900",
  },
  {
    quote: "I had the pleasure to work with Henrietta as the General and marketing Manager of the company. Henrietta stood out from the crowd by her involvement and her dedication to complete the task assigned to her. Her level of expertise in digital marketing and her hard work make of her a good asset for the team.",
    author: "Justin Bakoubolo",
    role: "Founder, Umbaji",
    gradient: "from-gray-900 to-black",
  },
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const current = testimonials[currentIndex];

  return (
    <section className="py-8" ref={ref}>
      <div className="container mx-auto px-6">
        <div className={`mb-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            What <span className="font-handwritten text-primary-visible">People</span> Say
          </h2>
          <p className="text-sm text-muted-foreground max-w-2xl">
            Testimonials from colleagues and leaders I've worked with
          </p>
        </div>

        <div className="max-w-5xl mx-auto relative">
          <Card className={`border-none shadow-2xl bg-gradient-to-br ${current.gradient} text-white overflow-hidden transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <CardContent className="p-12 md:p-16 relative">
              <div className="absolute top-8 right-8 opacity-20">
                <Quote className="w-24 h-24" />
              </div>

              <div className="relative z-10">
                <blockquote className="text-xl md:text-2xl leading-relaxed mb-8 font-light">
                  "{current.quote}"
                </blockquote>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-display font-bold text-2xl mb-1">{current.author}</p>
                    <p className="text-white/80 text-lg">{current.role}</p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={prev}
                      className="text-white hover:bg-white/20 rounded-full"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={next}
                      className="text-white hover:bg-white/20 rounded-full"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </Button>
                  </div>
                </div>

                <div className="flex gap-2 mt-8 justify-center">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`h-2 rounded-full transition-all ${
                        index === currentIndex ? "w-8 bg-white" : "w-2 bg-white/40"
                      }`}
                      aria-label={`Go to testimonial ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
