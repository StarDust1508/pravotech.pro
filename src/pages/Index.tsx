import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { TickerBar } from "@/components/TickerBar";
import { StreamsSection } from "@/components/StreamsSection";
import { SpeakersSection } from "@/components/SpeakersSection";
import { ParticipantsSection } from "@/components/ParticipantsSection";
import { TicketsSection } from "@/components/TicketsSection";
import { ExhibitionForm } from "@/components/ExhibitionForm";
import { SponsorForm } from "@/components/SponsorForm";
import WhyPartnerSection from "@/components/WhyPartnerSection";
import { SpeakerForm } from "@/components/SpeakerForm";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <TickerBar />
      <StreamsSection />
      <SpeakersSection />
      <ParticipantsSection />
      <TicketsSection />
      <ExhibitionForm />
      <SponsorForm />
      <WhyPartnerSection />
      <SpeakerForm />
      <Footer />
    </div>
  );
};

export default Index;
