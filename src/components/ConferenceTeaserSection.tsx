import { motion } from "framer-motion";
import { Calendar, MapPin, Users, Mic2 } from "lucide-react";
import { Link } from "react-router-dom";

export const ConferenceTeaserSection = () => {
  return (
    <section id="conference" className="py-20">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-neon-magenta/30 bg-gradient-to-br from-muted/50 to-background p-8 md:p-12 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-neon-magenta/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-neon-cyan/5 rounded-full blur-3xl" />

          <div className="relative grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-neon-magenta/30 bg-neon-magenta/10 mb-6">
                <span className="w-2 h-2 rounded-full bg-neon-magenta animate-pulse" />
                <span className="text-neon-magenta text-xs font-bold uppercase tracking-wider">Флагманское событие</span>
              </div>

              <h2 className="font-display text-3xl md:text-4xl font-black mb-4 uppercase leading-tight">
                Конференция<br />
                <span><span className="text-neon-cyan">Технолог</span><span className="text-neon-magenta">ИИ</span></span>{" "}
                <span className="text-neon-cyan">Права</span>
              </h2>

              <p className="text-muted-foreground text-base md:text-lg mb-6 max-w-lg">
                Крупнейшая конференция и выставка, посвященная технологиям в юриспруденции.
                Особый фокус — банкротство физических лиц, AI-инструменты и масштабирование практики.
              </p>

              <div className="flex flex-wrap gap-3">
                <Link
                  to="/conference"
                  className="px-7 py-3 bg-neon-magenta text-primary-foreground font-display font-bold rounded-lg shadow-neon-magenta hover:opacity-90 transition-opacity text-sm uppercase tracking-wider"
                >
                  Подробнее о конференции
                </Link>
                <Link
                  to="/conference#tickets"
                  className="px-7 py-3 border border-neon-cyan text-neon-cyan font-display font-bold rounded-lg hover:bg-accent/10 transition-colors text-sm uppercase tracking-wider"
                >
                  Получить билет
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="p-5 rounded-xl border border-border bg-card">
                <Calendar className="w-7 h-7 text-neon-cyan mb-3" />
                <div className="font-display text-lg font-bold">24–25 июня</div>
                <div className="text-muted-foreground text-sm">2026 год</div>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="p-5 rounded-xl border border-border bg-card">
                <MapPin className="w-7 h-7 text-neon-magenta mb-3" />
                <div className="font-display text-lg font-bold">Москва</div>
                <div className="text-muted-foreground text-sm">Техноград</div>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="p-5 rounded-xl border border-border bg-card">
                <Users className="w-7 h-7 text-neon-cyan mb-3" />
                <div className="font-display text-lg font-bold">1 500+</div>
                <div className="text-muted-foreground text-sm">участников</div>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }} className="p-5 rounded-xl border border-border bg-card">
                <Mic2 className="w-7 h-7 text-neon-magenta mb-3" />
                <div className="font-display text-lg font-bold">80+</div>
                <div className="text-muted-foreground text-sm">спикеров</div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
