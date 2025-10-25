import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import ImpactMetrics from "@/components/ImpactMetrics";
import Testimonials from "@/components/Testimonials";
import JourneySection from "@/components/JourneySection";
import HowIWork from "@/components/HowIWork";
import Skills from "@/components/Skills";
import FeaturedProjects from "@/components/FeaturedProjects";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import FloatingActionButton from "@/components/FloatingActionButton";

const Index = () => {
  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <Navigation />
      <Hero />
      <ImpactMetrics />
      <Testimonials />
      <HowIWork />
      <FeaturedProjects />
      <JourneySection />
      <Skills />
      <CTASection />
      <Footer />
      <FloatingActionButton />
    </div>
  );
};

export default Index;
