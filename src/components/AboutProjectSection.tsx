import { motion } from "framer-motion";
import { BarChart3, BookOpen, GraduationCap, Mic2, Users } from "lucide-react";

const features: { icon: typeof BookOpen; title: string; desc: string; accent: "cyan" | "magenta" }[] = [
  {
    icon: BookOpen,
    title: "Исследования рынка",
    desc: "Глубокая аналитика рынка БФЛ, трендов автоматизации и внедрения ИИ в юридическую практику",
    accent: "cyan",
  },
  {
    icon: GraduationCap,
    title: "Академия",
    desc: "Онлайн-курсы по банкротству физлиц, управлению командой, продажам и маркетингу для юристов",
    accent: "magenta",
  },
  {
    icon: Mic2,
    title: "Отраслевая конференция",
    desc: "Флагманское мероприятие с ведущими экспертами индустрии, 6 тематических потоков и выставка",
    accent: "magenta",
  },
  {
    icon: BarChart3,
    title: "Аналитика и AI",
    desc: "Обзоры технологий, кейсы внедрения и прогнозы развития цифровых инструментов в праве",
    accent: "cyan",
  },
  {
    icon: Users,
    title: "Экспертное сообщество",
    desc: "Площадка для нетворкинга, обмена опытом и партнерства лидеров юридического рынка",
    accent: "cyan",
  },
];

export const AboutProjectSection = () => {
  return (
    <section id="about" className="py-24 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-neon-cyan/[0.03] rounded-full blur-[120px] pointer-events-none" />
      <div className="container relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <p className="text-[11px] font-bold uppercase tracking-[0.35em] text-neon-cyan/50 mb-5">
            Экосистема
          </p>
          <h2 className="font-display text-3xl md:text-5xl font-black mb-6 uppercase">
            О проекте
          </h2>
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
            <span className="font-semibold">
              <span className="text-neon-cyan">Технолог</span><span className="text-neon-magenta font-bold">ии</span>{" "}
              <span className="text-neon-cyan">права</span>
            </span> — платформа
            об искусственном интеллекте, цифровых технологиях и масштабировании юридического
            бизнеса в сфере банкротства физических лиц.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-5">
          {features.map((f, i) => {
            const isCyan = f.accent === "cyan";
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className={`relative p-6 rounded-xl border bg-card transition-all group overflow-hidden hover:shadow-lg ${
                  isCyan
                    ? "border-border hover:border-neon-cyan/40 hover:shadow-neon-cyan/5"
                    : "border-border hover:border-neon-magenta/40 hover:shadow-neon-magenta/5"
                }`}
              >
                <div className={`absolute top-0 left-0 right-0 h-0.5 ${
                  isCyan ? "bg-gradient-to-r from-neon-cyan/20 via-neon-cyan/40 to-neon-cyan/20 group-hover:from-neon-cyan/40 group-hover:via-neon-cyan/70 group-hover:to-neon-cyan/40" : "bg-gradient-to-r from-neon-magenta/20 via-neon-magenta/40 to-neon-magenta/20 group-hover:from-neon-magenta/40 group-hover:via-neon-magenta/70 group-hover:to-neon-magenta/40"
                } transition-all`} />
                <f.icon className={`w-8 h-8 mb-4 ${isCyan ? "text-neon-cyan/70" : "text-neon-magenta/70"}`} />
                <h3 className="font-display text-sm font-bold mb-2 uppercase tracking-wide">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
