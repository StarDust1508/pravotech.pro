import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { TickerBar } from "@/components/TickerBar";
import { AboutProjectSection } from "@/components/AboutProjectSection";
import { ResearchSection } from "@/components/ResearchSection";
import { ChecklistsSection } from "@/components/ChecklistsSection";
import { ArbitrationAdSection } from "@/components/ArbitrationAdSection";
import { PlatformPromoSection } from "@/components/PlatformPromoSection";
import { BookPromoSection } from "@/components/BookPromoSection";
import { TelegramSubscribeSection } from "@/components/TelegramSubscribeSection";
import { AcademySection } from "@/components/AcademySection";
import { ConferenceTeaserSection } from "@/components/ConferenceTeaserSection";
import { Footer } from "@/components/Footer";
import { FloatingCubes } from "@/components/FloatingCubes";

const Index = () => {
  const { hash } = useLocation();

  // Прокрутка к якорю (#book, #platform, ...) при заходе на главную по ссылке
  // с другой страницы. Несколько попыток — секции с данными рендерятся асинхронно.
  useEffect(() => {
    if (!hash) return;
    const id = hash.slice(1);
    let tries = 0;
    const timer = setInterval(() => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        clearInterval(timer);
      } else if (++tries > 20) {
        clearInterval(timer);
      }
    }, 100);
    return () => clearInterval(timer);
  }, [hash]);

  return (
    <div className="min-h-screen bg-background relative">
      <FloatingCubes />
      <Navbar />
      <HeroSection />
      <TickerBar />
      <AboutProjectSection />
      <ResearchSection />
      <ChecklistsSection />
      <div className="h-px bg-gradient-to-r from-transparent via-neon-cyan/15 to-transparent" />
      <ArbitrationAdSection />
      <PlatformPromoSection />
      <BookPromoSection />
      <div className="h-px bg-gradient-to-r from-transparent via-neon-magenta/15 to-transparent" />
      <AcademySection />
      <TelegramSubscribeSection />
      <ConferenceTeaserSection />
      <Footer />
    </div>
  );
};

export default Index;
