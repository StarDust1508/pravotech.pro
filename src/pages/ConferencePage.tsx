import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, MapPin, Users, Mic2 } from "lucide-react";
import { StreamsSection } from "@/components/StreamsSection";
import { SpeakersSection } from "@/components/SpeakersSection";
import { ParticipantsSection } from "@/components/ParticipantsSection";
import { TicketsSection } from "@/components/TicketsSection";
import { ExhibitionForm } from "@/components/ExhibitionForm";
import { SponsorForm } from "@/components/SponsorForm";
import WhyPartnerSection from "@/components/WhyPartnerSection";
import { SpeakerForm } from "@/components/SpeakerForm";
import { Footer } from "@/components/Footer";

export default function ConferencePage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <Link to="/" className="font-display text-lg font-bold">
            <span className="text-neon-cyan">ТЕХНОЛОГ</span><span className="text-neon-magenta">ИИ</span>{" "}
            <span className="text-neon-cyan">ПРАВА</span>
          </Link>
          <Link to="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-neon-cyan transition-colors">
            <ArrowLeft size={16} /> На главную
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-28 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-neon-magenta/5 to-transparent" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-neon-magenta/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-neon-cyan/5 rounded-full blur-3xl" />

        <div className="container relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-neon-magenta/30 bg-neon-magenta/10 mb-6">
              <span className="w-2 h-2 rounded-full bg-neon-magenta animate-pulse" />
              <span className="text-neon-magenta text-xs font-bold uppercase tracking-wider">Флагманское событие</span>
            </div>

            <h1 className="font-display text-4xl md:text-6xl font-black mb-4 uppercase leading-tight">
              Конференция<br />
              <span className="text-neon-cyan">Технолог</span><span className="text-neon-magenta">ИИ</span>{" "}
              <span className="text-neon-cyan">Права</span>
            </h1>

            <p className="text-muted-foreground text-base md:text-lg mb-8 max-w-2xl mx-auto">
              Крупнейшая конференция и выставка, посвященная технологиям в юриспруденции.
              Особый фокус — банкротство физических лиц, AI-инструменты и масштабирование практики.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              <div className="p-4 rounded-xl border border-border bg-card text-center">
                <Calendar className="w-6 h-6 text-neon-cyan mx-auto mb-2" />
                <div className="font-display text-sm font-bold">24–25 июня</div>
                <div className="text-muted-foreground text-xs">2026 год</div>
              </div>
              <div className="p-4 rounded-xl border border-border bg-card text-center">
                <MapPin className="w-6 h-6 text-neon-magenta mx-auto mb-2" />
                <div className="font-display text-sm font-bold">Москва</div>
                <div className="text-muted-foreground text-xs">Техноград</div>
              </div>
              <div className="p-4 rounded-xl border border-border bg-card text-center">
                <Users className="w-6 h-6 text-neon-cyan mx-auto mb-2" />
                <div className="font-display text-sm font-bold">1 500+</div>
                <div className="text-muted-foreground text-xs">участников</div>
              </div>
              <div className="p-4 rounded-xl border border-border bg-card text-center">
                <Mic2 className="w-6 h-6 text-neon-magenta mx-auto mb-2" />
                <div className="font-display text-sm font-bold">80+</div>
                <div className="text-muted-foreground text-xs">спикеров</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Conference Content */}
      <StreamsSection />
      <SpeakersSection />
      <ParticipantsSection />
      <TicketsSection />
      <ExhibitionForm />
      <WhyPartnerSection />
      <SponsorForm />
      <SpeakerForm />
      <Footer />
    </div>
  );
}
