import { motion } from "framer-motion";
import { BarChart3, BookOpen, GraduationCap, Mic2, Users, Bot, FileCheck } from "lucide-react";
import { Link } from "react-router-dom";

const features: { icon: typeof BookOpen; title: string; desc: string; accent: "cyan" | "magenta"; link?: string }[] = [
  {
    icon: Mic2,
    title: "Конференция",
    desc: "Флагманское мероприятие: 80+ спикеров, 6 потоков, выставка и нетворкинг лидеров рынка БФЛ",
    accent: "magenta",
    link: "/conference",
  },
  {
    icon: GraduationCap,
    title: "Академия и курсы",
    desc: "Системное обучение от старта до экспертного уровня с аттестацией и сертификатом",
    accent: "magenta",
    link: "/academy",
  },
  {
    icon: BarChart3,
    title: "Исследования и аналитика",
    desc: "Глубокие отчёты по рынку БФЛ, экономика практики, ИИ-инструменты и технологии лидеров",
    accent: "cyan",
    link: "/research",
  },
  {
    icon: FileCheck,
    title: "Инструменты юриста",
    desc: "Чек-листы, тренажёры, шаблоны — всё для ускорения и масштабирования практики",
    accent: "cyan",
    link: "/products",
  },
  {
    icon: Users,
    title: "Сообщество и нетворкинг",
    desc: "Площадка для обмена опытом, партнёрства и роста вместе с лидерами юридического рынка",
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
            Маркетплейс возможностей
          </p>
          <h2 className="font-display text-3xl md:text-5xl font-black mb-6 uppercase">
            Всё для роста вашей практики
          </h2>
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
            <span className="font-semibold">
              <span className="text-neon-cyan">Технолог</span><span className="text-neon-magenta font-bold">ИИ</span>{" "}
              <span className="text-neon-cyan">Права</span>
            </span> — экосистема
            для юристов и руководителей практик в&nbsp;сфере БФЛ. Конференция, обучение,
            аналитика и инструменты — зарабатывайте больше, работая эффективнее.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-5">
          {features.map((f, i) => {
            const isCyan = f.accent === "cyan";
            const card = (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className={`relative p-6 rounded-xl border bg-card transition-all group overflow-hidden hover:shadow-lg h-full ${
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
            return f.link ? (
              <Link key={i} to={f.link} className="block h-full">{card}</Link>
            ) : (
              <div key={i}>{card}</div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
