import { motion } from "framer-motion";
import { Users, Mic2, Calendar, MapPin } from "lucide-react";
import conferenceHero from "@/assets/conference-hero.png";

const stats = [
  { icon: Users, value: "1 200+", label: "Участников", color: "cyan" as const },
  { icon: Mic2, value: "60+", label: "Спикеров", color: "magenta" as const },
  { value: "3", label: "Потока", color: "neutral" as const },
  { value: "20+", label: "Партнёров", color: "neutral" as const },
];

const highlights = [
  "Дискуссия с представителями ФНС о законодательных изменениях в БФЛ",
  "Первые промышленные внедрения ИИ-ассистентов в юридическую практику",
  "Награждение лучших БФЛ-практик года по итогам голосования рынка",
];

export const PastEventSection = () => {
  return (
    <section className="py-14 border-t border-border">
      <div className="container max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mb-10"
        >
          <div className="text-neon-magenta text-[10px] font-bold uppercase tracking-[0.3em] mb-4">
            Прошлая конференция
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-black mb-5 uppercase leading-[1.05]">
            Как это было в 2025
          </h2>
          <p className="text-foreground/65 text-base md:text-lg leading-relaxed">
            19–20 июня 2025 года в Москве прошла первая конференция "ТехнологИИ права". Два дня, три потока, 60+ спикеров и более 1 200 участников. Обсуждали Legal Tech, ИИ в юрбизнесе и практику БФЛ — без воды и маркетинговых обещаний.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 items-stretch">
          {/* Photo + event meta */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative rounded-2xl overflow-hidden border border-border group"
          >
            <div className="aspect-[4/3] md:aspect-auto md:h-full relative">
              <img
                src={conferenceHero}
                alt="Конференция ТехнологИИ права 2025"
                className="w-full h-full object-cover grayscale-[25%] opacity-85 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-br from-transparent to-background/40" />

              {/* Top-left badge */}
              <div className="absolute top-4 left-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/80 backdrop-blur-sm border border-neon-magenta/30">
                <span className="w-1.5 h-1.5 rounded-full bg-neon-magenta animate-pulse" />
                <span className="text-[10px] font-bold text-neon-magenta uppercase tracking-[0.2em]">
                  Июнь 2025
                </span>
              </div>

              {/* Bottom event meta */}
              <div className="absolute bottom-4 left-4 right-4 space-y-1.5">
                <div className="flex items-center gap-2 text-foreground/80 text-[11px] uppercase tracking-[0.2em]">
                  <Calendar size={12} className="text-neon-cyan" />
                  <span>19–20 июня 2025</span>
                </div>
                <div className="flex items-center gap-2 text-foreground/80 text-[11px] uppercase tracking-[0.2em]">
                  <MapPin size={12} className="text-neon-magenta" />
                  <span>Москва · Техноград</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats + highlights */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-3 flex flex-col"
          >
            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-3">
              {stats.map((s, i) => {
                const Icon = s.icon;
                const valueColor =
                  s.color === "cyan" ? "text-neon-cyan" :
                  s.color === "magenta" ? "text-neon-magenta" :
                  "text-foreground";
                const iconColor =
                  s.color === "cyan" ? "text-neon-cyan/80" :
                  s.color === "magenta" ? "text-neon-magenta/80" :
                  "text-foreground/40";
                return (
                  <div key={i} className="p-5 rounded-xl border border-border bg-card/60 backdrop-blur-sm">
                    {Icon && <Icon className={`w-4 h-4 mb-3 ${iconColor}`} strokeWidth={1.75} />}
                    <div className={`font-display text-2xl md:text-3xl font-black leading-none mb-1.5 ${valueColor}`}>
                      {s.value}
                    </div>
                    <div className="text-[10px] uppercase tracking-wider text-foreground/50">
                      {s.label}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Highlights block */}
            <div className="p-5 rounded-xl border border-border bg-card/60 backdrop-blur-sm flex-1">
              <div className="text-[10px] font-bold text-foreground/40 uppercase tracking-[0.25em] mb-3">
                Что было в центре
              </div>
              <ul className="space-y-2.5">
                {highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-foreground/75 leading-relaxed">
                    <span className="w-1 h-1 rounded-full bg-neon-cyan mt-[9px] flex-shrink-0" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
