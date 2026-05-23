import { useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin, Users, Mic2, Ticket, ChevronDown, Smartphone, Download, QrCode, MessageSquare, Zap, Star, Shield, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import conferenceHero from "@/assets/conference-hero.png";
import { StreamsSection } from "@/components/StreamsSection";
import { SpeakersSection } from "@/components/SpeakersSection";
import { SponsorsSection } from "@/components/SponsorsSection";
import { ParticipantsSection } from "@/components/ParticipantsSection";
import { PastEventSection } from "@/components/PastEventSection";
import { TicketsSection } from "@/components/TicketsSection";
import { ExhibitionForm } from "@/components/ExhibitionForm";
import { SponsorForm } from "@/components/SponsorForm";
import { Footer } from "@/components/Footer";
import { FloatingCubes } from "@/components/FloatingCubes";

export default function ConferencePage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-background relative">
      <FloatingCubes />
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
                <div className="font-display text-base md:text-lg font-black relative leading-none mb-1.5">20–21 мая</div>
                <div className="text-muted-foreground text-[11px] uppercase tracking-wider relative">{new Date().getFullYear()}</div>
              </div>
              {/* Location */}
              <div className="p-5 rounded-xl border border-border bg-card/60 backdrop-blur-sm text-center">
                <MapPin className="w-5 h-5 text-neon-magenta/80 mx-auto mb-3" />
                <div className="font-display text-base md:text-lg font-black leading-none mb-1.5">Саратов</div>
                <div className="text-muted-foreground text-[11px] uppercase tracking-wider">Технополис «Инновация»</div>
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

      {/* App Download Section — immersive marketing hero */}
      <section id="app" className="py-20 relative overflow-hidden">
        {/* Full-width ambient glow */}
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-neon-cyan/[0.07] rounded-full blur-[120px]" />
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-neon-magenta/[0.05] rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-neon-cyan/[0.04] rounded-full blur-[80px]" />
        </div>

        <div className="container relative z-10">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full border border-neon-cyan/30 bg-neon-cyan/[0.08] mb-6"
            >
              <Zap className="w-4 h-4 text-neon-cyan" />
              <span className="text-neon-cyan text-xs font-bold uppercase tracking-[0.2em]">Безоплатно для участников</span>
            </motion.div>

            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-black uppercase leading-[1.05] mb-5">
              <span className="text-white">Конференция</span><br />
              <span className="text-neon-cyan">в кармане</span>
            </h2>
            <p className="text-foreground/50 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              Расписание, спикеры, AI-ассистент, чат с участниками и электронный билет — всё в одном приложении
            </p>
          </motion.div>

          {/* Feature showcase grid */}
          <div className="grid md:grid-cols-4 gap-4 mb-12">
            {[
              { icon: Calendar, title: "Живое расписание", desc: "32 сессии, 6 треков. Добавь доклад в свой календарь одним нажатием", accent: "cyan" as const, delay: 0 },
              { icon: MessageSquare, title: "AI-ассистент", desc: "Спроси что угодно о программе — ИИ знает каждого спикера и каждый доклад", accent: "magenta" as const, delay: 0.1 },
              { icon: QrCode, title: "Электронный билет", desc: "Покажи QR на входе — без бумажных талонов и очередей", accent: "cyan" as const, delay: 0.2 },
              { icon: Users, title: "Нетворкинг", desc: "Общий чат конференции, профили участников, обмен контактами прямо в приложении", accent: "magenta" as const, delay: 0.3 },
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
                viewport={{ once: true }}
                transition={{ delay: f.delay, duration: 0.5, ease: "easeOut" }}
                className="group relative rounded-2xl overflow-hidden"
                style={{ boxShadow: "0 20px 50px -15px rgba(0,0,0,0.6)" }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-[#0d1520] to-[#080c14]" />
                <div className={`absolute inset-0 rounded-2xl border border-white/[0.06] ${
                  f.accent === "cyan" ? "group-hover:border-neon-cyan/30" : "group-hover:border-neon-magenta/30"
                } transition-colors duration-300`} />
                <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent ${
                  f.accent === "cyan" ? "via-neon-cyan/40" : "via-neon-magenta/40"
                } to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                <div className={`absolute inset-0 bg-[radial-gradient(ellipse_at_top,${
                  f.accent === "cyan" ? "rgba(0,255,255,0.08)" : "rgba(255,0,255,0.06)"
                },transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                <div className="relative p-6 md:p-7">
                  <motion.div
                    animate={f.accent === "cyan"
                      ? { boxShadow: ["0 0 0 rgba(0,255,255,0)", "0 0 25px rgba(0,255,255,0.2)", "0 0 0 rgba(0,255,255,0)"] }
                      : { boxShadow: ["0 0 0 rgba(255,0,255,0)", "0 0 25px rgba(255,0,255,0.15)", "0 0 0 rgba(255,0,255,0)"] }
                    }
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: f.delay * 2 }}
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${
                      f.accent === "cyan"
                        ? "bg-neon-cyan/10 border border-neon-cyan/20"
                        : "bg-neon-magenta/10 border border-neon-magenta/20"
                    }`}
                  >
                    <f.icon className={`w-6 h-6 ${f.accent === "cyan" ? "text-neon-cyan" : "text-neon-magenta"}`} />
                  </motion.div>
                  <h3 className="font-display text-lg font-bold mb-2 uppercase tracking-wide">{f.title}</h3>
                  <p className="text-foreground/40 text-sm leading-relaxed">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA Download Block — premium 3D phone mockup (book-page quality) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-2xl overflow-hidden"
            style={{ boxShadow: "0 30px 80px -20px rgba(0,255,255,0.15), 0 0 0 1px rgba(0,255,255,0.12)" }}
          >
            {/* Multi-layer background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#060e18] via-[#0a1228] to-[#0e0a20]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_30%,rgba(0,255,255,0.12),transparent_55%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_70%,rgba(255,51,153,0.08),transparent_55%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,255,0.03),transparent_70%)]" />

            {/* Top accent bar */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-neon-cyan/60 via-neon-cyan/20 to-neon-magenta/40" />
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-neon-magenta/30 via-transparent to-neon-cyan/20" />

            {/* Circuit pattern texture (as in book cover) */}
            <div className="absolute inset-0 opacity-[0.025]" style={{
              backgroundImage: "linear-gradient(rgba(0,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.3) 1px, transparent 1px)",
              backgroundSize: "50px 50px",
            }} />

            {/* Geometric accents (book-style) */}
            <div className="absolute top-12 right-12 w-24 h-24 border border-neon-cyan/[0.06] rounded-2xl rotate-[15deg] hidden md:block" />
            <div className="absolute top-20 right-20 w-14 h-14 border border-neon-magenta/[0.05] rounded-xl rotate-[30deg] hidden md:block" />
            <div className="absolute bottom-16 left-10 w-8 h-8 border border-neon-cyan/[0.06] rounded-lg rotate-45 hidden md:block" />

            {/* Diagonal accent lines (book-style) */}
            <div className="absolute top-0 right-0 w-[300px] h-[300px] overflow-hidden pointer-events-none hidden md:block">
              <div className="absolute top-[40px] right-[-80px] w-[350px] h-px bg-gradient-to-r from-transparent via-neon-cyan/15 to-transparent rotate-[-35deg]" />
              <div className="absolute top-[70px] right-[-80px] w-[350px] h-px bg-gradient-to-r from-transparent via-neon-cyan/8 to-transparent rotate-[-35deg]" />
            </div>

            <div className="relative px-8 py-12 md:px-14 md:py-16">
              <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">

                {/* Left: Ultra-premium 3D phone mockup */}
                <div className="relative flex-shrink-0" style={{ perspective: "1600px" }}>
                  {/* Multi-layer ambient glow */}
                  <motion.div
                    animate={{ opacity: [0.5, 0.8, 0.5], scale: [0.92, 1.08, 0.92] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -inset-14 pointer-events-none"
                    style={{ background: "radial-gradient(ellipse at 50% 40%, rgba(0,255,255,0.20), transparent 60%)", filter: "blur(30px)" }}
                  />
                  <motion.div
                    animate={{ opacity: [0.15, 0.35, 0.15] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                    className="absolute -inset-20 pointer-events-none"
                    style={{ background: "radial-gradient(ellipse at 60% 75%, rgba(255,51,153,0.12), transparent 55%)", filter: "blur(35px)" }}
                  />
                  {/* Floor reflection */}
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[70%] h-[40px] pointer-events-none"
                    style={{ background: "radial-gradient(ellipse at center, rgba(0,255,255,0.08), transparent 70%)", filter: "blur(12px)" }}
                  />

                  <motion.div
                    initial={{ rotateY: -10, rotateX: 3 }}
                    animate={{ rotateY: [-4, -2, -4], rotateX: [1, 0, 1] }}
                    whileHover={{ rotateY: 0, rotateX: 0, scale: 1.03 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className="relative w-[220px] h-[440px] md:w-[250px] md:h-[500px]"
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    {/* ── Phone body ── */}
                    <div className="relative w-full h-full rounded-[2.8rem]"
                      style={{
                        boxShadow: `
                          0 50px 120px -30px rgba(0,0,0,0.95),
                          0 25px 60px -15px rgba(0,0,0,0.6),
                          0 15px 50px -10px rgba(0,255,255,0.08),
                          0 -3px 30px -8px rgba(255,51,153,0.04),
                          inset 0 1px 0 rgba(255,255,255,0.08),
                          inset 0 -1px 0 rgba(0,0,0,0.3)
                        `,
                        background: "linear-gradient(165deg, #333846 0%, #1e232e 8%, #141820 20%, #0c1018 50%, #080c14 100%)",
                      }}
                    >
                      {/* Frame — quad border (titanium illusion) */}
                      <div className="absolute inset-0 rounded-[2.8rem] border border-white/[0.12]" />
                      <div className="absolute inset-[1px] rounded-[2.75rem] border border-white/[0.06]" />
                      <div className="absolute inset-[2px] rounded-[2.7rem] border border-white/[0.02]" />
                      <div className="absolute inset-[3px] rounded-[2.65rem] border border-black/50" />

                      {/* Frame specular highlights */}
                      <div className="absolute top-0 left-14 right-14 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                      <div className="absolute bottom-0 left-20 right-20 h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />
                      <div className="absolute top-14 bottom-14 left-0 w-px bg-gradient-to-b from-transparent via-white/[0.08] to-transparent" />
                      <div className="absolute top-14 bottom-14 right-0 w-px bg-gradient-to-b from-transparent via-white/[0.05] to-transparent" />

                      {/* Side buttons — power (right) */}
                      <div className="absolute -right-[3px] top-[28%] w-[4px] h-[38px] rounded-r-[2px]"
                        style={{
                          background: "linear-gradient(180deg, #3a3f4e, #22272f, #1a1e28)",
                          boxShadow: "2px 0 4px rgba(0,0,0,0.6), inset -1px 0 0 rgba(255,255,255,0.08), inset 0 1px 0 rgba(255,255,255,0.06)",
                        }} />
                      {/* Volume up */}
                      <div className="absolute -left-[3px] top-[22%] w-[4px] h-[26px] rounded-l-[2px]"
                        style={{
                          background: "linear-gradient(180deg, #3a3f4e, #22272f, #1a1e28)",
                          boxShadow: "-2px 0 4px rgba(0,0,0,0.6), inset 1px 0 0 rgba(255,255,255,0.08), inset 0 1px 0 rgba(255,255,255,0.06)",
                        }} />
                      {/* Volume down */}
                      <div className="absolute -left-[3px] top-[32%] w-[4px] h-[26px] rounded-l-[2px]"
                        style={{
                          background: "linear-gradient(180deg, #3a3f4e, #22272f, #1a1e28)",
                          boxShadow: "-2px 0 4px rgba(0,0,0,0.6), inset 1px 0 0 rgba(255,255,255,0.08), inset 0 1px 0 rgba(255,255,255,0.06)",
                        }} />
                      {/* Action button (mute) */}
                      <div className="absolute -left-[3px] top-[16%] w-[4px] h-[14px] rounded-l-[2px]"
                        style={{
                          background: "linear-gradient(180deg, #3a3f4e, #1a1e28)",
                          boxShadow: "-2px 0 3px rgba(0,0,0,0.5), inset 1px 0 0 rgba(255,255,255,0.06)",
                        }} />

                      {/* Dynamic Island — high fidelity */}
                      <div className="absolute top-[10px] left-1/2 -translate-x-1/2 z-30">
                        <div className="w-[105px] h-[32px] bg-black rounded-[16px] flex items-center justify-center gap-[14px]"
                          style={{
                            boxShadow: "0 0 0 0.5px rgba(255,255,255,0.04), inset 0 1px 3px rgba(0,0,0,0.8), inset 0 -0.5px 0 rgba(255,255,255,0.03)",
                          }}>
                          {/* Front camera lens */}
                          <div className="w-[11px] h-[11px] rounded-full relative"
                            style={{
                              background: "radial-gradient(circle at 35% 35%, #2a3040, #0d1118, #060810)",
                              boxShadow: "0 0 0 0.5px rgba(255,255,255,0.08), inset 0 0 2px rgba(0,0,0,0.8)",
                            }}>
                            {/* Lens highlight */}
                            <div className="absolute top-[1.5px] left-[2px] w-[3px] h-[2px] rounded-full bg-white/[0.12] rotate-[-20deg]" />
                            {/* IR dot */}
                            <div className="absolute bottom-[1px] right-[1px] w-[1.5px] h-[1.5px] rounded-full bg-neon-cyan/20" />
                          </div>
                          {/* Face ID sensor */}
                          <div className="w-[5px] h-[5px] rounded-full"
                            style={{
                              background: "radial-gradient(circle at 40% 40%, #161a24, #080c14)",
                              boxShadow: "0 0 0 0.5px rgba(255,255,255,0.03)",
                            }} />
                        </div>
                      </div>

                      {/* ── Screen ── */}
                      <div className="absolute inset-[4px] rounded-[2.4rem] overflow-hidden"
                        style={{ boxShadow: "inset 0 0 12px rgba(0,0,0,0.6), inset 0 1px 0 rgba(0,0,0,0.3)" }}>
                        <div className="absolute inset-0 bg-[#020406]" />

                        {/* Screen light bloom from UI */}
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_12%,rgba(0,255,255,0.07),transparent_45%)]" />
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_40%_90%,rgba(0,255,255,0.03),transparent_35%)]" />

                        {/* Status bar — pixel perfect iOS */}
                        <div className="relative z-10 pt-[44px] px-5 pb-1 flex items-center justify-between">
                          <span className="text-[9px] text-white/55 font-semibold" style={{ fontFeatureSettings: "'tnum'" }}>9:41</span>
                          <div className="flex items-center gap-[5px]">
                            {/* Signal bars */}
                            <div className="flex items-end gap-[1.5px] h-[10px]">
                              {[4, 6, 8, 10].map((h, idx) => (
                                <div key={idx} className={`w-[2.5px] rounded-[0.5px] ${idx < 3 ? "bg-white/50" : "bg-white/20"}`} style={{ height: `${h}px` }} />
                              ))}
                            </div>
                            <span className="text-[8px] text-white/35 font-medium">5G</span>
                            {/* WiFi icon approximation */}
                            <svg className="w-[11px] h-[9px] text-white/45" viewBox="0 0 16 12" fill="currentColor">
                              <path d="M8 10.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM8 7c1.7 0 3.2.7 4.2 1.8l-1.4 1.4C10 9.4 9.1 9 8 9s-2 .4-2.8 1.2L3.8 8.8C4.8 7.7 6.3 7 8 7zm0-3.5c2.7 0 5.1 1.1 6.9 2.9l-1.4 1.4C12 6.3 10.1 5.5 8 5.5S4 6.3 2.5 7.8L1.1 6.4C2.9 4.6 5.3 3.5 8 3.5z" />
                            </svg>
                            {/* Battery */}
                            <div className="relative ml-[2px]">
                              <div className="w-[20px] h-[9px] rounded-[2px] border border-white/35 relative">
                                <div className="absolute inset-[1.5px] right-[4px] bg-neon-cyan/60 rounded-[0.5px]" />
                              </div>
                              <div className="absolute right-[-3px] top-[2.5px] w-[2px] h-[4px] rounded-r-[1px] bg-white/30" />
                            </div>
                          </div>
                        </div>

                        {/* App header — glassmorphic */}
                        <div className="relative mx-3 mt-1.5">
                          <div className="h-[50px] rounded-2xl overflow-hidden relative"
                            style={{
                              background: "linear-gradient(135deg, rgba(0,255,255,0.06) 0%, rgba(8,14,24,0.8) 50%, rgba(255,51,153,0.04) 100%)",
                              boxShadow: "0 2px 12px rgba(0,0,0,0.3), inset 0 0.5px 0 rgba(255,255,255,0.06)",
                              border: "0.5px solid rgba(255,255,255,0.06)",
                            }}>
                            <div className="relative h-full flex items-center px-3.5 gap-3">
                              {/* App icon — gradient with inner glow */}
                              <div className="w-9 h-9 rounded-[12px] relative overflow-hidden flex-shrink-0"
                                style={{
                                  background: "linear-gradient(135deg, rgba(0,255,255,0.25) 0%, rgba(255,51,153,0.18) 100%)",
                                  boxShadow: "0 2px 10px rgba(0,255,255,0.15), inset 0 0.5px 0 rgba(255,255,255,0.15)",
                                }}>
                                <div className="absolute inset-0 border border-white/[0.12] rounded-[12px]" />
                                <div className="flex items-center justify-center h-full">
                                  <span className="text-[10px] font-display font-black bg-gradient-to-br from-white via-neon-cyan to-neon-magenta bg-clip-text text-transparent drop-shadow-sm">TF</span>
                                </div>
                              </div>
                              <div className="flex-1">
                                <span className="text-[11px] font-display font-bold text-white/95 tracking-wide uppercase block leading-none">TechForum</span>
                                <div className="flex items-center gap-1.5 mt-1">
                                  <div className="w-[5px] h-[5px] rounded-full bg-emerald-400/70 animate-pulse" />
                                  <span className="text-[8px] text-emerald-400/60 leading-none">Онлайн</span>
                                </div>
                              </div>
                              {/* Bell icon */}
                              <div className="w-7 h-7 rounded-full bg-white/[0.04] border border-white/[0.07] flex items-center justify-center relative">
                                <svg className="w-3.5 h-3.5 text-white/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
                                </svg>
                                <div className="absolute -top-0.5 -right-0.5 w-[6px] h-[6px] rounded-full bg-neon-magenta border border-[#020406]" />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Content cards — staggered reveal */}
                        <div className="px-3 mt-2.5 space-y-[5px]">
                          {[
                            { emoji: "🎙", label: "Программа", sub: "18 докладов · 3 потока", accent: "cyan" as const, badge: "Live" },
                            { emoji: "🤖", label: "AI Ассистент", sub: "Задай любой вопрос", accent: "magenta" as const, badge: "" },
                            { emoji: "👥", label: "Нетворкинг", sub: "246 участников", accent: "cyan" as const, badge: "New" },
                            { emoji: "📍", label: "Навигация", sub: "Интерактивная карта", accent: "magenta" as const, badge: "" },
                          ].map((card, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, y: 8, scale: 0.96 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              transition={{ duration: 0.5, delay: 0.5 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                              className="relative flex items-center gap-2.5 px-2.5 py-[8px] rounded-[14px] overflow-hidden"
                              style={{
                                background: "linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.008))",
                                border: "0.5px solid rgba(255,255,255,0.05)",
                                boxShadow: "0 1px 3px rgba(0,0,0,0.2), inset 0 0.5px 0 rgba(255,255,255,0.03)",
                              }}
                            >
                              {/* Active card highlight pulse */}
                              {i === 0 && (
                                <motion.div
                                  animate={{ opacity: [0, 0.12, 0] }}
                                  transition={{ duration: 3, repeat: Infinity, delay: 2 }}
                                  className="absolute inset-0 bg-gradient-to-r from-neon-cyan/10 via-transparent to-transparent rounded-[14px]"
                                />
                              )}
                              <div className={`w-[32px] h-[32px] rounded-[10px] flex items-center justify-center text-[13px] flex-shrink-0 relative`}
                                style={{
                                  background: card.accent === "cyan"
                                    ? "linear-gradient(135deg, rgba(0,255,255,0.12), rgba(0,255,255,0.04))"
                                    : "linear-gradient(135deg, rgba(255,51,153,0.12), rgba(255,51,153,0.04))",
                                  boxShadow: card.accent === "cyan"
                                    ? "0 0 10px rgba(0,255,255,0.06), inset 0 0.5px 0 rgba(255,255,255,0.06)"
                                    : "0 0 10px rgba(255,51,153,0.06), inset 0 0.5px 0 rgba(255,255,255,0.04)",
                                  border: `0.5px solid ${card.accent === "cyan" ? "rgba(0,255,255,0.15)" : "rgba(255,51,153,0.15)"}`,
                                }}>
                                {card.emoji}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-[10px] font-semibold text-white/90 leading-none tracking-tight">{card.label}</div>
                                <div className="text-[8px] text-white/30 leading-none mt-[3px] tracking-tight">{card.sub}</div>
                              </div>
                              {card.badge && (
                                <div className={`px-[5px] py-[2px] rounded-full text-[6.5px] font-bold uppercase tracking-wider ${
                                  card.badge === "Live"
                                    ? "bg-emerald-500/15 text-emerald-400/80 border border-emerald-500/20"
                                    : "bg-neon-magenta/12 text-neon-magenta/70 border border-neon-magenta/18"
                                }`}>
                                  {card.badge === "Live" && <span className="inline-block w-[4px] h-[4px] rounded-full bg-emerald-400/80 mr-[3px] align-middle animate-pulse" />}
                                  {card.badge}
                                </div>
                              )}
                              <svg className="w-[10px] h-[10px] text-white/12 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                <path d="M9 18l6-6-6-6" />
                              </svg>
                            </motion.div>
                          ))}
                        </div>

                        {/* Tab bar — frosted glass iOS */}
                        <div className="absolute bottom-0 left-0 right-0 px-2 pb-1">
                          <div className="h-[46px] rounded-2xl overflow-hidden relative"
                            style={{
                              background: "linear-gradient(180deg, rgba(12,16,24,0.75), rgba(6,10,16,0.92))",
                              backdropFilter: "blur(24px) saturate(1.4)",
                              border: "0.5px solid rgba(255,255,255,0.06)",
                              boxShadow: "0 -2px 12px rgba(0,0,0,0.3), inset 0 0.5px 0 rgba(255,255,255,0.04)",
                            }}>
                            {/* Separator line */}
                            <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />
                            <div className="h-full flex items-center justify-around px-2">
                              {[
                                { active: true, label: "Главная", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4" },
                                { active: false, label: "Чат", icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" },
                                { active: false, label: "Профиль", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
                                { active: false, label: "Ещё", icon: "M4 6h16M4 12h16M4 18h16" },
                              ].map((tab, i) => (
                                <div key={i} className="flex flex-col items-center gap-[3px] relative w-[44px]">
                                  <svg className={`w-[16px] h-[16px] ${tab.active ? "text-neon-cyan/80" : "text-white/20"}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                    <path d={tab.icon} />
                                  </svg>
                                  <span className={`text-[7px] leading-none ${
                                    tab.active ? "text-neon-cyan/80 font-semibold" : "text-white/20"
                                  }`}>{tab.label}</span>
                                  {tab.active && (
                                    <div className="absolute -top-[3px] left-1/2 -translate-x-1/2 w-5 h-[2px] rounded-full bg-neon-cyan/30" />
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                          {/* Home indicator */}
                          <div className="mt-[5px] mx-auto w-[90px] h-[4px] rounded-full bg-white/15" />
                        </div>
                      </div>

                      {/* Glass reflection — diagonal specular + moving light */}
                      <div className="absolute inset-[4px] rounded-[2.4rem] overflow-hidden pointer-events-none z-20">
                        {/* Static diagonal reflection */}
                        <div className="absolute inset-0"
                          style={{
                            background: "linear-gradient(130deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 25%, transparent 45%, transparent 65%, rgba(255,255,255,0.015) 100%)",
                          }} />
                        {/* Slow moving specular highlight */}
                        <motion.div
                          animate={{ x: ["-120%", "220%"] }}
                          transition={{ duration: 5, repeat: Infinity, repeatDelay: 8, ease: "easeInOut" }}
                          className="absolute top-0 bottom-0 w-[25%]"
                          style={{
                            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.04), rgba(255,255,255,0.02), transparent)",
                          }}
                        />
                        {/* Edge light leak — top left */}
                        <div className="absolute top-0 left-0 w-[60%] h-[30%]"
                          style={{ background: "radial-gradient(ellipse at 10% 10%, rgba(255,255,255,0.04), transparent 60%)" }} />
                      </div>
                    </div>

                    {/* 3D depth edges */}
                    <div className="absolute top-6 bottom-6 -right-[4px] w-[5px] rounded-r-md"
                      style={{
                        background: "linear-gradient(180deg, #252a36 0%, #161a22 30%, #0e1218 70%, #0a0e16 100%)",
                        boxShadow: "3px 0 8px rgba(0,0,0,0.5), inset -1px 0 0 rgba(255,255,255,0.04)",
                      }} />
                    <div className="absolute -bottom-[3px] left-10 right-10 h-[4px] rounded-b-lg"
                      style={{
                        background: "linear-gradient(90deg, #0e1218, #1a1f2a, #0e1218)",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.6)",
                      }} />
                  </motion.div>
                </div>

                {/* Right: Content + CTA */}
                <div className="text-center md:text-left flex-1">
                  <div className="flex items-center gap-2 justify-center md:justify-start mb-4">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-white/40 text-xs ml-1">от участников прошлого года</span>
                  </div>

                  <h3 className="font-display text-2xl md:text-3xl lg:text-4xl font-black uppercase leading-tight mb-4 text-white">
                    Скачай приложение —<br />
                    <span className="text-neon-cyan">будь в центре событий</span>
                  </h3>

                  <p className="text-white/50 text-base md:text-lg mb-8 max-w-lg leading-relaxed">
                    Программа обновляется в реальном времени. AI-ассистент ответит на любой вопрос
                    о докладах и спикерах. Не пропусти ни одного важного момента.
                  </p>

                  <div className="flex flex-wrap items-center gap-4 justify-center md:justify-start mb-8">
                    <motion.a
                      href="/TechForum2026.apk"
                      download="TechForum2026.apk"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      className="group inline-flex items-center gap-3 px-8 py-4 bg-neon-cyan text-black font-display font-bold rounded-xl text-sm uppercase tracking-wider relative overflow-hidden"
                      style={{ boxShadow: "0 8px 30px rgba(0,255,255,0.3), 0 0 60px rgba(0,255,255,0.1)" }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                      <Download size={20} className="relative" />
                      <span className="relative">Скачать безоплатно</span>
                      <ArrowRight size={16} className="relative group-hover:translate-x-1 transition-transform" />
                    </motion.a>
                  </div>

                  {/* Meta badges — book-page style */}
                  <div className="flex flex-wrap items-center gap-6 justify-center md:justify-start">
                    {[
                      { icon: Shield, label: "Безопасная установка" },
                      { icon: Zap, label: "Лёгкое приложение" },
                      { icon: Smartphone, label: "Android" },
                    ].map((meta, i) => (
                      <div key={i} className="flex items-center gap-1.5">
                        <meta.icon className="w-3.5 h-3.5 text-neon-cyan/50" />
                        <span className="text-white/30 text-xs">{meta.label}</span>
                      </div>
                    ))}
                  </div>

                  {/* Decorative bars (book-style) */}
                  <div className="flex gap-1 mt-6 justify-center md:justify-start">
                    <div className="w-12 h-[2px] rounded-full bg-neon-cyan/50" />
                    <div className="w-6 h-[2px] rounded-full bg-neon-magenta/40" />
                    <div className="w-3 h-[2px] rounded-full bg-neon-cyan/25" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Conference Content */}
      <StreamsSection />
      <SpeakersSection />
      <SponsorsSection />
      <ParticipantsSection />
      <PastEventSection />
      <TicketsSection />
      <ExhibitionForm />
      <SponsorForm />

      <Footer />
    </div>
  );
}
