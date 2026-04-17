import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-image.jpg";
import { BrandTitle } from "@/components/BrandTitle";

export const HeroSection = () => {
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
      {/* Background image — приглушена, затемнена */}
      <div className="absolute inset-0">
        <motion.div
          className="w-full h-full relative origin-center"
          animate={{
            scale: [1, 1.12, 1],
            x: ["0%", "-1.5%", "0%"],
            y: ["0%", "-0.5%", "0%"]
          }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        >
          <img
            src={heroImage}
            alt="Технологии права"
            className="w-full h-full object-cover brightness-[1.2] saturate-[0.85]"
          />
          {/* Headphone Neon Scanline — ослаблена */}
          <motion.div
            className="absolute hidden md:block bg-[#00ffff] pointer-events-none mix-blend-screen"
            style={{
              top: '15%',
              left: '31%',
              width: '8%',
              height: '2px',
              boxShadow: '0 0 15px 5px rgba(0,255,255,0.4), 0 0 30px 10px rgba(0,255,255,0.2)',
              borderRadius: '50%',
              rotate: '-10deg'
            }}
            animate={{
              opacity: [0, 0.6, 0.6, 0],
              y: [0, 120, 120, 0],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
          {/* Scale Base Neon Sweep — ослаблена */}
          <motion.div
            className="absolute hidden md:block bg-[#ff00ff] pointer-events-none mix-blend-screen"
            style={{
              top: '68%',
              left: '55%',
              width: '28%',
              height: '2px',
              boxShadow: '0 0 15px 5px rgba(255,0,255,0.3), 0 0 30px 10px rgba(255,0,255,0.15)',
              borderRadius: '50%'
            }}
            animate={{
              opacity: [0, 0.5, 0],
              scaleX: [0.5, 1, 0.5],
              y: [0, -40, 0]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
        {/* Усиленные градиенты для читаемости текста */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-background/60" />
      </div>

      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl"
        >
          {/* Бейдж платформы */}
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-neon-cyan/20 bg-background/40 backdrop-blur-md mb-8">
            <span className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse" />
            <span className="text-foreground/70 text-xs font-medium uppercase tracking-wider">Legal Tech платформа</span>
          </div>

          {/* Заголовок — главный акцент */}
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-black leading-[0.9] mb-6">
            <BrandTitle className="leading-[0.9]" lineBreakBeforeLaw />
          </h1>

          {/* Подзаголовок — сильный и короткий */}
          <p className="font-display text-base md:text-lg font-semibold text-foreground/60 mb-5 uppercase tracking-[0.2em]">
            Исследования · Аналитика · Конференция
          </p>

          {/* Описание — легче, лучше читается */}
          <p className="text-foreground/50 text-base md:text-lg mb-10 max-w-md leading-relaxed">
            Аналитика рынка, тренды ИИ и отраслевая конференция для лидеров
            юридического бизнеса в сфере <span className="text-neon-magenta/80 font-medium">банкротства физических лиц</span>.
          </p>

          {/* CTA — чёткая иерархия */}
          <div className="flex flex-col items-start gap-4">
            <div className="flex flex-wrap items-center gap-4">
              {/* Главная CTA */}
              <button
                onClick={() => scrollToSection("#research")}
                className="px-8 py-3.5 bg-neon-magenta text-primary-foreground font-display font-bold rounded-lg shadow-neon-magenta hover:opacity-90 transition-opacity text-sm uppercase tracking-wider"
              >
                Скачать исследование
              </button>
              {/* Вторичная CTA */}
              <Link
                to="/conference"
                className="px-8 py-3.5 border border-foreground/20 text-foreground/80 font-display font-bold rounded-lg hover:border-neon-cyan/40 hover:text-neon-cyan transition-colors text-sm uppercase tracking-wider"
              >
                Конференция
              </Link>
            </div>
            {/* Третичная */}
            <button
              onClick={() => scrollToSection("#academy")}
              className="px-8 py-3.5 bg-neon-cyan border border-neon-cyan text-background font-display font-bold rounded-lg shadow-neon-cyan hover:opacity-90 transition-opacity text-sm uppercase tracking-wider"
            >
              Академия &rarr;
            </button>
          </div>
        </motion.div>
      </div>

      {/* Тонкая разделительная линия снизу */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-cyan/20 to-transparent" />
    </section>
  );
};
