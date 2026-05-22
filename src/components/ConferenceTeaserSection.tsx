import { motion } from "framer-motion";
import { Calendar, MapPin, Users, Mic2 } from "lucide-react";
import { Link } from "react-router-dom";

export const ConferenceTeaserSection = () => {
  return (
    <section id="conference" className="py-24 relative">
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-neon-magenta/[0.03] rounded-full blur-[120px] pointer-events-none" />
      <div className="container relative">
        <div className="rounded-2xl border border-border bg-card/50 p-8 md:p-12">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.35em] text-neon-magenta/50 mb-5">
              20–21 мая {new Date().getFullYear()} · Саратов
            </p>

            <h2 className="font-display text-3xl md:text-4xl font-black mb-5 uppercase leading-tight">
              Конференция<br />
              <span className="text-neon-cyan">Технолог</span><span className="text-neon-magenta">ИИ</span>{" "}
              <span className="text-neon-cyan">Права</span>
            </h2>

            <p className="text-muted-foreground text-base md:text-lg mb-8 max-w-lg">
              Крупнейшая конференция и выставка, посвященная технологиям в юриспруденции.
              Банкротство физлиц, AI-инструменты, масштабирование практики.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/conference"
                className="group inline-flex items-center gap-2 px-7 py-3 bg-neon-magenta text-primary-foreground font-display font-bold rounded-lg shadow-lg shadow-neon-magenta/20 hover:shadow-neon-magenta/40 transition-shadow text-sm uppercase tracking-wider"
              >
                Подробнее
              </Link>
              <Link
                to="/conference#tickets"
                className="px-7 py-3 border border-foreground/15 text-foreground/60 font-display font-bold rounded-lg hover:border-neon-cyan/40 hover:text-neon-cyan transition-colors text-sm uppercase tracking-wider"
              >
                Получить билет
              </Link>
            </div>
          </motion.div>

          <div className="grid grid-cols-2 gap-4" style={{ perspective: "800px" }}>
            {[
              { icon: Calendar, value: "20–21 мая", label: String(new Date().getFullYear()), accent: "cyan" as const },
              { icon: MapPin, value: "Саратов", label: "Технополис «Инновация»", accent: "magenta" as const },
              { icon: Users, value: "1 500+", label: "участников", accent: "cyan" as const },
              { icon: Mic2, value: "80+", label: "спикеров", accent: "magenta" as const },
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
                {/* Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#0e1520] to-[#0a0e18]" />
                <div className={`absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,${
                  item.accent === "cyan" ? "rgba(0,255,255,0.08)" : "rgba(255,0,255,0.06)"
                },transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                {/* Border */}
                <div className={`absolute inset-0 rounded-xl border transition-colors duration-300 ${
                  item.accent === "cyan"
                    ? "border-white/[0.07] group-hover:border-neon-cyan/30"
                    : "border-white/[0.07] group-hover:border-neon-magenta/30"
                }`} />

                {/* Top accent */}
                <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent ${
                  item.accent === "cyan" ? "via-neon-cyan/30" : "via-neon-magenta/30"
                } to-transparent`} />

                <div className="relative">
                  {/* Icon with glow */}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-all ${
                    item.accent === "cyan"
                      ? "bg-neon-cyan/[0.08] group-hover:bg-neon-cyan/15 group-hover:shadow-[0_0_20px_rgba(0,255,255,0.15)]"
                      : "bg-neon-magenta/[0.08] group-hover:bg-neon-magenta/15 group-hover:shadow-[0_0_20px_rgba(255,0,255,0.15)]"
                  }`}>
                    <item.icon className={`w-5 h-5 ${item.accent === "cyan" ? "text-neon-cyan" : "text-neon-magenta"}`} />
                  </div>
                  <div className="font-display text-lg font-black leading-tight">{item.value}</div>
                  <div className="text-foreground/30 text-sm mt-0.5">{item.label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        </div>
      </div>
    </section>
  );
};
