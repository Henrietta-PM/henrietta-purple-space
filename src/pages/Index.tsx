import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import HowIWork from "@/components/HowIWork";
import Skills from "@/components/Skills";
import FeaturedProjects from "@/components/FeaturedProjects";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <HowIWork />
      <Skills />
      <FeaturedProjects />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
