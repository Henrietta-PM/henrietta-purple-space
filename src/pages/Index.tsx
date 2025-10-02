import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import JourneySection from "@/components/JourneySection";
import HowIWork from "@/components/HowIWork";
import Skills from "@/components/Skills";
import FeaturedProjects from "@/components/FeaturedProjects";
import Testimonials from "@/components/Testimonials";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <JourneySection />
      <HowIWork />
      <Skills />
      <FeaturedProjects />
      <Testimonials />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
