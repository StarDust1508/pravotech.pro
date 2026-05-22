import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";
import { BrandTitle } from "@/components/BrandTitle";

const stats = [
  { value: "8", label: "исследований" },
  { value: "80+", label: "спикеров" },
  { value: "1500+", label: "участников" },
];

export const HeroSection = () => {
  const prefersReduced = useReducedMotion();

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
      {/* Background */}
      <div className="absolute inset-0">
        <motion.div
          className="w-full h-full relative origin-center"
          animate={prefersReduced ? {} : {
            scale: [1, 1.08, 1],
            x: ["0%", "-1%", "0%"],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        >
          <img
            src={heroImage}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover brightness-[1.1] saturate-[0.7]"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/15" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-background/40" />
      </div>

      {/* Ambient glow */}
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-neon-cyan/[0.03] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] bg-neon-magenta/[0.03] rounded-full blur-[100px] pointer-events-none" />

      {/* Декоративная вертикальная линия */}
      <div className="absolute left-[7%] top-[15%] bottom-[15%] w-px bg-gradient-to-b from-transparent via-neon-cyan/20 to-transparent hidden lg:block" />

      <div className="container relative z-10">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            {/* Микро-текст вместо бейджа */}
            <p className="text-[11px] font-bold uppercase tracking-[0.35em] text-neon-cyan/60 mb-8">
              Аналитика · Обучение · Конференция
            </p>

            <h1 className="font-display text-5xl md:text-7xl lg:text-[5.5rem] font-black leading-[0.88] mb-8">
              <BrandTitle className="leading-[0.88]" lineBreakBeforeLaw />
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <p className="text-foreground/45 text-lg md:text-xl mb-12 max-w-lg leading-relaxed">
              Платформа для лидеров юридического бизнеса
              в сфере <span className="text-neon-magenta/70 font-medium">банкротства физических лиц</span>
            </p>
          </motion.div>

          {/* CTA — в одну линию */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-wrap items-center gap-4 mb-16"
          >
            <Link
              to="/research"
              className="group inline-flex items-center gap-2 px-8 py-3.5 bg-neon-magenta text-primary-foreground font-display font-bold rounded-lg shadow-lg shadow-neon-magenta/25 hover:shadow-neon-magenta/50 transition-shadow text-sm uppercase tracking-wider"
            >
              Исследования
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/conference"
              className="px-8 py-3.5 border border-foreground/15 text-foreground/70 font-display font-bold rounded-lg hover:border-neon-cyan/40 hover:text-neon-cyan transition-colors text-sm uppercase tracking-wider"
            >
              Конференция
            </Link>
            <Link
              to="/academy"
              className="px-8 py-3.5 text-neon-cyan/80 font-display font-bold text-sm uppercase tracking-wider hover:text-neon-cyan transition-colors"
            >
              Академия →
            </Link>
          </motion.div>

          {/* Stats — glass cards */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="flex items-stretch gap-4"
          >
            {stats.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                whileHover={{ y: -3, transition: { duration: 0.25 } }}
                className="group relative px-5 py-4 rounded-xl overflow-hidden"
                style={{
                  boxShadow: "0 8px 30px -10px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)",
                }}
              >
                <div className="absolute inset-0 bg-white/[0.03] backdrop-blur-md" />
                <div className="absolute inset-0 rounded-xl border border-white/[0.08] group-hover:border-neon-cyan/25 transition-colors" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,255,255,0.06),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <div className="font-display text-2xl md:text-3xl font-black text-neon-cyan leading-none mb-1">
                    {s.value}
                  </div>
                  <div className="text-[10px] text-foreground/50 uppercase tracking-[0.2em] font-medium">{s.label}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Нижняя граница — тонкий градиент */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-cyan/15 to-transparent" />
    </section>
  );
};
