import { useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin, Users, Mic2, Ticket, ChevronDown } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import conferenceHero from "@/assets/conference-hero.png";
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

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="pt-28 pb-12 relative overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src={conferenceHero}
            alt="Конференция Технологии права"
            className="w-full h-full object-cover opacity-25"
          />
          {/* Vignette — чище по краям, фокус в центре */}
          <div
            className="absolute inset-0"
            style={{ background: "radial-gradient(ellipse at center, transparent 0%, hsl(var(--background) / 0.6) 55%, hsl(var(--background)) 100%)" }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background" />
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-neon-magenta/[0.04] rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-neon-cyan/[0.04] rounded-full blur-3xl" />

        <div className="container relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-neon-magenta/30 bg-neon-magenta/10 mb-6">
              <span className="w-2 h-2 rounded-full bg-neon-magenta animate-pulse" />
              <span className="text-neon-magenta text-xs font-bold uppercase tracking-wider">Флагманское событие</span>
            </div>

            <h1 className="font-display text-4xl md:text-6xl font-black mb-5 uppercase leading-[1.05]">
              Конференция<br />
              <span className="text-neon-cyan">Технолог</span><span className="text-neon-magenta">ИИ</span>{" "}
              <span className="text-neon-cyan">Права</span>
            </h1>

            <p className="text-foreground/70 text-base md:text-lg mb-8 max-w-xl mx-auto leading-relaxed">
              Главная индустриальная площадка о технологиях и ИИ в юридическом бизнесе.<br className="hidden md:block" />
              В фокусе — банкротство физических лиц.
            </p>

            {/* CTA */}
            <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
              <button
                onClick={() => scrollToSection("tickets")}
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-neon-magenta text-primary-foreground font-display font-bold rounded-lg shadow-neon-magenta hover:opacity-90 transition-opacity text-sm uppercase tracking-wider"
              >
                <Ticket size={16} /> Получить билет
              </button>
              <button
                onClick={() => scrollToSection("streams")}
                className="inline-flex items-center gap-2 px-7 py-3.5 border border-neon-cyan/40 text-neon-cyan font-display font-bold rounded-lg hover:bg-neon-cyan/5 hover:border-neon-cyan/70 transition-colors text-sm uppercase tracking-wider"
              >
                Смотреть программу
              </button>
            </div>

            {/* Info cards — с иерархией */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto">
              {/* Date — акцентная */}
              <div className="p-5 rounded-xl border border-neon-cyan/25 bg-card/80 backdrop-blur-sm text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-neon-cyan/[0.06] to-transparent pointer-events-none" />
                <Calendar className="w-5 h-5 text-neon-cyan mx-auto mb-3 relative" />
                <div className="font-display text-base md:text-lg font-black relative leading-none mb-1.5">24–25 июня</div>
                <div className="text-muted-foreground text-[11px] uppercase tracking-wider relative">2026</div>
              </div>
              {/* Location */}
              <div className="p-5 rounded-xl border border-border bg-card/60 backdrop-blur-sm text-center">
                <MapPin className="w-5 h-5 text-neon-magenta/80 mx-auto mb-3" />
                <div className="font-display text-base md:text-lg font-black leading-none mb-1.5">Москва</div>
                <div className="text-muted-foreground text-[11px] uppercase tracking-wider">Техноград</div>
              </div>
              {/* Participants — stat */}
              <div className="p-5 rounded-xl border border-border bg-card/60 backdrop-blur-sm text-center">
                <Users className="w-5 h-5 text-neon-cyan/80 mx-auto mb-3" />
                <div className="font-display text-xl md:text-2xl font-black text-neon-cyan leading-none mb-1.5">1 500+</div>
                <div className="text-muted-foreground text-[11px] uppercase tracking-wider">Участников</div>
              </div>
              {/* Speakers — stat */}
              <div className="p-5 rounded-xl border border-border bg-card/60 backdrop-blur-sm text-center">
                <Mic2 className="w-5 h-5 text-neon-magenta/80 mx-auto mb-3" />
                <div className="font-display text-xl md:text-2xl font-black text-neon-magenta leading-none mb-1.5">80+</div>
                <div className="text-muted-foreground text-[11px] uppercase tracking-wider">Спикеров</div>
              </div>
            </div>

            {/* Scroll cue */}
            <motion.button
              onClick={() => scrollToSection("streams")}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-12 inline-flex flex-col items-center gap-1 text-foreground/30 hover:text-foreground/60 transition-colors group"
              aria-label="К программе"
            >
              <span className="text-[10px] uppercase tracking-[0.25em] font-medium">Программа</span>
              <motion.div
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <ChevronDown size={18} />
              </motion.div>
            </motion.button>
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
