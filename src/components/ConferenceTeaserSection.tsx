import { useState, useEffect, useMemo, memo } from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin, Users, Mic2, ArrowRight, Shield, Gift, Award, Smartphone } from "lucide-react";
import { Link } from "react-router-dom";

/* ── Countdown (isolated to avoid full-section rerenders) ── */
function useCountdown(targetDate: Date) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, targetDate.getTime() - now.getTime());
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    isPast: diff === 0,
  };
}

const CountdownDisplay = memo(function CountdownDisplay() {
  const target = useMemo(() => new Date(2026, 8, 25, 7, 0, 0), []); // 10:00 MSK = 07:00 UTC
  const { days, hours, minutes, isPast } = useCountdown(target);
  if (isPast) return null;
  return (
    <div className="mt-2 font-display text-xs text-neon-cyan/60 tracking-wide">
      {days} дней · {String(hours).padStart(2, "0")} часов · {String(minutes).padStart(2, "0")} минут
    </div>
  );
});

const speakers = [
  { name: "Галкин Владислав", photo: "/speakers/galkin.jpg" },
  { name: "Сизов Дмитрий", photo: "/speakers/sizov.jpg" },
  { name: "Артин Василий", photo: "/speakers/artin.jpg" },
  { name: "Путин Дмитрий", photo: "/speakers/putin.jpg" },
  { name: "Шабалин Егор", photo: "/speakers/shabalin.jpg" },
];

export const ConferenceTeaserSection = () => {
  return (
    <section id="conference" className="py-24 relative">
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-neon-magenta/[0.03] rounded-full blur-[120px] pointer-events-none" />
      <div className="container relative">
        <div className="rounded-2xl border border-neon-magenta/20 bg-card/50 overflow-hidden relative">
          {/* Top urgency strip */}
          <div className="bg-gradient-to-r from-neon-magenta/15 via-neon-magenta/10 to-transparent border-b border-neon-magenta/15 px-8 md:px-12 py-3 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-neon-magenta animate-pulse" />
              <span className="text-neon-magenta text-xs font-bold uppercase tracking-wider">Ранние цены — скидка до 70%</span>
            </div>
            <span className="text-foreground/30 text-[10px] uppercase tracking-wider">Количество мест ограничено</span>
          </div>

          <div className="p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                {/* Giant date */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 rounded-xl bg-neon-cyan/10 border border-neon-cyan/20 flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-neon-cyan" />
                  </div>
                  <div>
                    <div className="font-display text-2xl md:text-3xl font-black leading-none">25–26 сентября · 10:00 МСК</div>
                    <div className="flex items-center gap-1.5 mt-1">
                      <MapPin className="w-3 h-3 text-neon-magenta/50" />
                      <span className="text-sm text-foreground/50">{new Date().getFullYear()} · Москва, Технополис «Инновация»</span>
                    </div>
                    <CountdownDisplay />
                  </div>
                </div>

                <h2 className="font-display text-3xl md:text-4xl font-black mb-4 uppercase leading-tight">
                  Конференция<br />
                  <span className="text-neon-cyan">Технолог</span><span className="text-neon-magenta">ИИ</span>{" "}
                  <span className="text-neon-cyan">Права</span>
                </h2>

                <p className="text-muted-foreground text-base md:text-lg mb-6 max-w-lg">
                  Крупнейшая конференция и выставка, посвященная технологиям в юриспруденции.
                  Банкротство физлиц, AI-инструменты, масштабирование практики.
                </p>

                {/* Trust triggers */}
                <div className="flex flex-wrap gap-4 mb-8">
                  {[
                    { icon: Shield, text: "Защита финансовых прав" },
                    { icon: Gift, text: "Бонусы для участников" },
                    { icon: Award, text: "Сертификат участника" },
                  ].map((t, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <t.icon className="w-3.5 h-3.5 text-neon-magenta/50" />
                      <span className="text-xs text-foreground/50">{t.text}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3">
                  <Link
                    to="/conference"
                    className="group inline-flex items-center gap-2 px-7 py-3.5 bg-neon-magenta text-primary-foreground font-display font-bold rounded-lg shadow-lg shadow-neon-magenta/20 hover:shadow-neon-magenta/40 transition-shadow text-sm uppercase tracking-wider"
                  >
                    Подробнее
                    <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                  <Link
                    to="/conference#tickets"
                    className="px-7 py-3.5 border border-foreground/15 text-foreground/60 font-display font-bold rounded-lg hover:border-neon-cyan/40 hover:text-neon-cyan transition-colors text-sm uppercase tracking-wider"
                  >
                    от 15 500 ₽ · Получить билет
                  </Link>
                </div>

                <a
                  href="/TechForum2026.apk"
                  download
                  className="inline-flex items-center gap-1.5 mt-4 text-xs text-foreground/40 hover:text-neon-cyan transition-colors"
                >
                  <Smartphone size={13} />
                  <span>Скачать приложение TechForum · Будьте в центре событий</span>
                </a>
              </motion.div>

              <div>
              <div className="grid grid-cols-2 gap-4" style={{ perspective: "800px" }}>
                {[
                  { icon: Users, value: "1 500+", label: "участников", accent: "cyan" as const },
                  { icon: Mic2, value: "80+", label: "спикеров", accent: "magenta" as const },
                  { icon: Calendar, value: "6", label: "потоков", accent: "cyan" as const },
                  { icon: Gift, value: "32", label: "сессии и воркшопы", accent: "magenta" as const },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 15, rotateX: 8 }}
                    whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                    whileHover={{ y: -5, scale: 1.03, transition: { duration: 0.25 } }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08, duration: 0.5 }}
                    className="group relative p-5 rounded-xl overflow-hidden"
                    style={{
                      boxShadow: item.accent === "cyan"
                        ? "0 12px 35px -10px rgba(0,0,0,0.5), 0 0 20px -8px rgba(0,255,255,0.08), inset 0 1px 0 rgba(255,255,255,0.05)"
                        : "0 12px 35px -10px rgba(0,0,0,0.5), 0 0 20px -8px rgba(255,0,255,0.06), inset 0 1px 0 rgba(255,255,255,0.05)",
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-[#0e1520] to-[#0a0e18]" />
                    <div className={`absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,${
                      item.accent === "cyan" ? "rgba(0,255,255,0.08)" : "rgba(255,0,255,0.06)"
                    },transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                    <div className={`absolute inset-0 rounded-xl border transition-colors duration-300 ${
                      item.accent === "cyan"
                        ? "border-white/[0.07] group-hover:border-neon-cyan/30"
                        : "border-white/[0.07] group-hover:border-neon-magenta/30"
                    }`} />
                    <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent ${
                      item.accent === "cyan" ? "via-neon-cyan/30" : "via-neon-magenta/30"
                    } to-transparent`} />

                    <div className="relative">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-all ${
                        item.accent === "cyan"
                          ? "bg-neon-cyan/[0.08] group-hover:bg-neon-cyan/15 group-hover:shadow-[0_0_20px_rgba(0,255,255,0.15)]"
                          : "bg-neon-magenta/[0.08] group-hover:bg-neon-magenta/15 group-hover:shadow-[0_0_20px_rgba(255,0,255,0.15)]"
                      }`}>
                        <item.icon className={`w-5 h-5 ${item.accent === "cyan" ? "text-neon-cyan" : "text-neon-magenta"}`} />
                      </div>
                      <div className={`font-display text-2xl font-black leading-none ${item.accent === "cyan" ? "text-neon-cyan" : "text-neon-magenta"}`}>{item.value}</div>
                      <div className="text-foreground/30 text-sm mt-0.5">{item.label}</div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Спикеры — социальное доказательство */}
              <div className="mt-8 pt-6 border-t border-white/[0.06]">
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-foreground/40 mb-4">Спикеры и эксперты</p>
                <div className="flex flex-wrap gap-3">
                  {speakers.map((s, i) => (
                    <div key={i} className="flex items-center gap-2.5 px-3 py-2 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-neon-cyan/20 transition-colors">
                      <img
                        src={s.photo}
                        alt={s.name}
                        className="w-9 h-9 rounded-full flex-shrink-0 bg-gradient-to-br from-neon-cyan/20 to-neon-magenta/20"
                      />
                      <span className="text-[12px] font-display font-bold leading-tight text-foreground/80">{s.name}</span>
                    </div>
                  ))}
                </div>
              </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
