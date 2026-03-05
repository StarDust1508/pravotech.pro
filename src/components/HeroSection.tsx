import { motion } from "framer-motion";
import heroImage from "@/assets/hero-image.jpg";

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
      <div className="absolute inset-0">
        <img src={heroImage} alt="Технологии в праве" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50" />
      </div>

      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl"
        >
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-neon-cyan/30 bg-muted/50 backdrop-blur mb-6">
            <span className="text-neon-cyan font-display text-sm font-bold">15–16 ОКТЯБРЯ 2026</span>
            <span className="text-muted-foreground text-sm">Москва, Технограм</span>
          </div>

          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-black leading-tight mb-2">
            <span className="text-neon-cyan">LEGAL</span>
            <br />
            <span className="text-neon-magenta">TECH</span>
          </h1>

          <p className="font-display text-lg md:text-xl font-bold text-foreground/90 mb-4 uppercase tracking-wide">
            Технологии в сфере права
          </p>
          <p className="text-muted-foreground text-base md:text-lg mb-8 max-w-lg">
            Крупнейшая конференция и выставка, посвящённая технологиям в юриспруденции. 
            Особый фокус — <span className="text-neon-magenta font-semibold">банкротство физических лиц</span>.
          </p>

          <div className="flex flex-wrap gap-4">
            <a
              href="#register"
              className="px-8 py-3 bg-neon-magenta text-primary-foreground font-display font-bold rounded-lg shadow-neon-magenta hover:opacity-90 transition-opacity text-sm uppercase tracking-wider"
            >
              Получить билет
            </a>
            <a
              href="#exhibition"
              className="px-8 py-3 border border-neon-cyan text-neon-cyan font-display font-bold rounded-lg hover:bg-accent/10 transition-colors text-sm uppercase tracking-wider"
            >
              Забронировать стенд
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
