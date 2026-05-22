import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { MessagesSquare, GraduationCap, BarChart3, ArrowRight } from "lucide-react";

const highlights = [
  { icon: MessagesSquare, text: "Диалоговые тренировки с ИИ-клиентами" },
  { icon: GraduationCap, text: "Тесты и аттестация сотрудников" },
  { icon: BarChart3, text: "Аналитика прогресса и слабых тем" },
];

export const PlatformPromoSection = () => {
  return (
    <section id="platform" className="py-24 relative">
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[400px] bg-neon-cyan/[0.03] rounded-full blur-[120px] pointer-events-none" />
      <div className="container relative">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.35em] text-neon-cyan/50 mb-5">
              Платформа тренировок
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-black mb-5 uppercase leading-tight">
              Команда учится на симуляторе, не на клиентах
            </h2>
            <p className="text-muted-foreground text-base md:text-lg mb-8 max-w-lg">
              Диалоговый тренажёр, экзамены, разбор слабых тем и аналитика прогресса — системная подготовка юристов и менеджеров по банкротству.
            </p>
            <Link
              to="/platform"
              className="group inline-flex items-center gap-2 px-8 py-3.5 bg-neon-cyan text-background font-display font-bold rounded-lg shadow-lg shadow-neon-cyan/20 hover:shadow-neon-cyan/40 transition-shadow text-sm uppercase tracking-wider"
            >
              Подробнее
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </motion.div>
          <div className="space-y-4">
            {highlights.map((h, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="flex items-center gap-4 p-5 rounded-xl border border-border bg-card hover:border-neon-cyan/30 hover:shadow-lg hover:shadow-neon-cyan/5 transition-all"
              >
                <h.icon className="w-6 h-6 text-neon-cyan/60 flex-shrink-0" />
                <span className="font-display font-bold text-sm">{h.text}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
