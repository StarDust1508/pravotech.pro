import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { TickerBar } from "@/components/TickerBar";
import { StreamsSection } from "@/components/StreamsSection";
import { ExhibitionForm } from "@/components/ExhibitionForm";
import { SponsorForm } from "@/components/SponsorForm";
import { SpeakerForm } from "@/components/SpeakerForm";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <TickerBar />
      <StreamsSection />
      <ExhibitionForm />
      <SponsorForm />
      <SpeakerForm />
      <Footer />
    </div>
  );
};

export default Index;
