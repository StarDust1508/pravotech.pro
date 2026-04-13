import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { TickerBar } from "@/components/TickerBar";
import { AboutProjectSection } from "@/components/AboutProjectSection";
import { ResearchSection } from "@/components/ResearchSection";
import { AcademySection } from "@/components/AcademySection";
import { ConferenceTeaserSection } from "@/components/ConferenceTeaserSection";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <TickerBar />
      <AboutProjectSection />
      <ResearchSection />
      <AcademySection />
      <ConferenceTeaserSection />
      <Footer />
    </div>
  );
};

export default Index;
