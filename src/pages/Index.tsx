import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import JourneySection from "@/components/JourneySection";
import HowIWork from "@/components/HowIWork";
import Skills from "@/components/Skills";
import FeaturedProjects from "@/components/FeaturedProjects";
import Testimonials from "@/components/Testimonials";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import FloatingActionButton from "@/components/FloatingActionButton";

const Index = () => {
  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <Navigation />
      <Hero />
      <JourneySection />
      <HowIWork />
      <Skills />
      <FeaturedProjects />
      <Testimonials />
      <CTASection />
      <Footer />
      <FloatingActionButton />
    </div>
  );
};

export default Index;
