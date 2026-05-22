import { useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin, Users, Mic2, Ticket, ChevronDown, Smartphone, Download, QrCode, MessageSquare } from "lucide-react";
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

      {/* App Download Section — premium */}
      <section id="app" className="py-14">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-2xl overflow-hidden"
            style={{
              boxShadow: "0 25px 60px -15px rgba(0,0,0,0.6), 0 0 40px -15px rgba(0,255,255,0.1), inset 0 1px 0 rgba(255,255,255,0.05)",
            }}
          >
            {/* Background layers */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#0a1520] via-[#0c1225] to-[#0a0e18]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(0,255,255,0.1),transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(255,0,255,0.06),transparent_50%)]" />

            {/* Border + top accent */}
            <div className="absolute inset-0 rounded-2xl border border-neon-cyan/20" />
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-neon-cyan/60 via-neon-cyan/30 to-neon-magenta/20" />

            {/* Grid texture */}
            <div className="absolute inset-0 opacity-[0.02]" style={{
              backgroundImage: "linear-gradient(rgba(0,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.3) 1px, transparent 1px)",
              backgroundSize: "50px 50px",
            }} />

            {/* Geometric accents */}
            <div className="absolute top-8 right-8 w-20 h-20 border border-neon-cyan/10 rounded-xl rotate-12 hidden lg:block" />
            <div className="absolute bottom-8 left-8 w-14 h-14 border border-neon-magenta/8 rounded-lg -rotate-[20deg] hidden lg:block" />
            <div className="absolute top-1/2 right-12 w-8 h-8 border border-neon-cyan/6 rounded rotate-45 hidden lg:block" />

            <div className="relative p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-10 items-center">
                <div>
                  {/* Pulsing phone icon orb */}
                  <motion.div
                    animate={{ boxShadow: ["0 0 20px rgba(0,255,255,0.1)", "0 0 35px rgba(0,255,255,0.2)", "0 0 20px rgba(0,255,255,0.1)"] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="w-14 h-14 rounded-2xl bg-gradient-to-br from-neon-cyan/15 to-neon-magenta/10 border border-neon-cyan/25 flex items-center justify-center mb-5"
                  >
                    <Smartphone className="w-6 h-6 text-neon-cyan" />
                  </motion.div>

                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-neon-cyan/60 mb-3">
                    Android-приложение
                  </p>
                  <h2 className="font-display text-3xl md:text-4xl font-black mb-4 uppercase leading-tight">
                    TechForum 2026
                  </h2>

                  <p className="text-foreground/50 text-base md:text-lg mb-8 max-w-lg leading-relaxed">
                    Всё расписание, спикеры, AI-ассистент и электронный билет — в одном приложении.
                    Скачайте APK и установите на Android-устройство.
                  </p>

                  <div className="flex flex-wrap items-center gap-4 mb-8">
                    <a
                      href="/TechForum2026.apk"
                      download="TechForum2026.apk"
                      className="inline-flex items-center gap-2 px-8 py-3.5 bg-neon-cyan text-black font-display font-bold rounded-lg shadow-lg shadow-neon-cyan/30 hover:shadow-neon-cyan/50 hover:scale-[1.02] transition-all text-sm uppercase tracking-wider"
                    >
                      <Download size={18} /> Скачать APK
                    </a>
                    <span className="text-[10px] text-foreground/30 uppercase tracking-wider">
                      Android · 8.3 MB · v1.0.0
                    </span>
                  </div>

                  <div className="text-[10px] text-foreground/25 leading-relaxed max-w-md">
                    Для установки разрешите «Неизвестные источники» в настройках Android.
                    Приложение работает на Android 8.0 и выше.
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4" style={{ perspective: "600px" }}>
                  {[
                    { icon: Calendar, title: "Расписание", desc: "32 сессии, 6 треков, запись в календарь", accent: "cyan" as const, delay: 0.1 },
                    { icon: QrCode, title: "QR-билет", desc: "Электронный билет с HMAC-подписью", accent: "magenta" as const, delay: 0.2 },
                    { icon: MessageSquare, title: "AI-ассистент", desc: "Gemini знает программу и спикеров", accent: "cyan" as const, delay: 0.3 },
                    { icon: Users, title: "Нетворкинг", desc: "Чат, лента новостей, профили участников", accent: "magenta" as const, delay: 0.4 },
                  ].map((f, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 12, rotateX: 6 }}
                      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                      whileHover={{ y: -4, scale: 1.03, transition: { duration: 0.25 } }}
                      viewport={{ once: true }}
                      transition={{ delay: f.delay, duration: 0.4 }}
                      className="group relative p-5 rounded-xl overflow-hidden"
                      style={{
                        boxShadow: "0 12px 35px -10px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-[#0e1520] to-[#0a0e18]" />
                      <div className={`absolute inset-0 rounded-xl border border-white/[0.07] ${f.accent === "cyan" ? "group-hover:border-neon-cyan/25" : "group-hover:border-neon-magenta/25"} transition-colors`} />
                      <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent ${f.accent === "cyan" ? "via-neon-cyan/20" : "via-neon-magenta/20"} to-transparent`} />
                      <div className={`absolute inset-0 bg-[radial-gradient(ellipse_at_top,${
                        f.accent === "cyan" ? "rgba(0,255,255,0.06)" : "rgba(255,0,255,0.05)"
                      },transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity`} />
                      <div className="relative">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
                          f.accent === "cyan"
                            ? "bg-neon-cyan/10 group-hover:shadow-[0_0_20px_rgba(0,255,255,0.15)]"
                            : "bg-neon-magenta/10 group-hover:shadow-[0_0_20px_rgba(255,0,255,0.15)]"
                        } transition-all`}>
                          <f.icon className={`w-5 h-5 ${f.accent === "cyan" ? "text-neon-cyan" : "text-neon-magenta"}`} />
                        </div>
                        <div className="font-display text-sm font-bold mb-1">{f.title}</div>
                        <div className="text-foreground/40 text-xs leading-relaxed">{f.desc}</div>
                      </div>
                    </motion.div>
                  ))}
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
