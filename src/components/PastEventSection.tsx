import { motion } from "framer-motion";
import { Users, Mic2, Sparkles, Building2, Brain, Scale, Handshake, Trophy } from "lucide-react";

const expectations = [
  { icon: Mic2, value: "60+", label: "Спикеров", color: "cyan" as const },
  { icon: Users, value: "1 200+", label: "Участников", color: "magenta" as const },
  { value: "3", label: "Потока", color: "neutral" as const },
  { value: "2", label: "Дня", color: "neutral" as const },
];

const tracks = [
  {
    icon: Brain,
    title: "AI & Legal Tech",
    desc: "Промышленные внедрения ИИ в юридическую практику: от ассистентов до автоматизации документооборота",
    accent: "cyan" as const,
  },
  {
    icon: Scale,
    title: "Практика БФЛ",
    desc: "Законодательные изменения, судебная практика, стратегии работы с должниками",
    accent: "magenta" as const,
  },
  {
    icon: Handshake,
    title: "Нетворкинг & Бизнес",
    desc: "Встречи с регуляторами, обмен кейсами, партнёрские сессии и выставка решений",
    accent: "cyan" as const,
  },
];

const programHighlights = [
  "Дискуссия с представителями ФНС о законодательных изменениях в БФЛ",
  "Демо промышленных ИИ-ассистентов для юридической практики",
  "Награждение лучших БФЛ-практик года по итогам голосования рынка",
  "AI-хакатон: создание Legal Tech решений за 4 часа",
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
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-neon-cyan/25 bg-neon-cyan/[0.06] mb-5">
            <Sparkles className="w-3.5 h-3.5 text-neon-cyan" />
            <span className="text-neon-cyan text-[10px] font-bold uppercase tracking-[0.2em]">
              Программа 2026
            </span>
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-black mb-5 uppercase leading-[1.05]">
            Что ожидает <span className="text-neon-cyan">участников</span>
          </h2>
          <p className="text-foreground/60 text-base md:text-lg leading-relaxed">
            Два дня погружения в Legal Tech, искусственный интеллект и практику банкротства.
            Без воды и маркетинговых обещаний — только реальные кейсы и рабочие инструменты.
          </p>
        </motion.div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {expectations.map((s, i) => {
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
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="p-5 rounded-xl border border-border bg-card/60 backdrop-blur-sm"
              >
                {Icon && <Icon className={`w-4 h-4 mb-3 ${iconColor}`} strokeWidth={1.75} />}
                <div className={`font-display text-2xl md:text-3xl font-black leading-none mb-1.5 ${valueColor}`}>
                  {s.value}
                </div>
                <div className="text-[10px] uppercase tracking-wider text-foreground/50">
                  {s.label}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Tracks */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {tracks.map((track, i) => {
            const Icon = track.icon;
            const borderColor = track.accent === "cyan" ? "border-neon-cyan/20" : "border-neon-magenta/20";
            const iconBg = track.accent === "cyan" ? "bg-neon-cyan/[0.08]" : "bg-neon-magenta/[0.08]";
            const iconColor = track.accent === "cyan" ? "text-neon-cyan" : "text-neon-magenta";
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className={`p-5 rounded-xl border ${borderColor} bg-card/40 backdrop-blur-sm`}
              >
                <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center mb-4`}>
                  <Icon className={`w-5 h-5 ${iconColor}`} />
                </div>
                <h3 className="font-display text-base font-bold mb-2 uppercase tracking-wide">
                  {track.title}
                </h3>
                <p className="text-foreground/50 text-sm leading-relaxed">
                  {track.desc}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Program highlights */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-6 rounded-xl border border-border bg-card/60 backdrop-blur-sm"
        >
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-4 h-4 text-neon-magenta" />
            <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-[0.25em]">
              Ключевые моменты программы
            </span>
          </div>
          <ul className="grid md:grid-cols-2 gap-3">
            {programHighlights.map((h, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-foreground/75 leading-relaxed">
                <span className={`w-1.5 h-1.5 rounded-full mt-[7px] flex-shrink-0 ${
                  i % 2 === 0 ? "bg-neon-cyan" : "bg-neon-magenta"
                }`} />
                <span>{h}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
};
