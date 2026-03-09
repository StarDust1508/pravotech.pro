import { motion } from "framer-motion";
import heroImage from "@/assets/hero-image.jpg";

export const HeroSection = () => {
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
      <div className="absolute inset-0">
        <motion.div
          className="w-full h-full relative origin-center"
          animate={{ 
            scale: [1, 1.15, 1],
            x: ["0%", "-2%", "0%"],
            y: ["0%", "-1%", "0%"]
          }} 
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }} 
        >
          <img 
            src={heroImage} 
            alt="Технологии в праве" 
            className="w-full h-full object-cover" 
          />
          {/* Headphone Neon Scanline */}
          <motion.div 
            className="absolute hidden md:block bg-[#00ffff] pointer-events-none mix-blend-screen"
            style={{ 
              top: '15%', 
              left: '31%', 
              width: '8%', 
              height: '2px',
              boxShadow: '0 0 20px 8px #00ffff, 0 0 40px 15px rgba(0,255,255,0.6)',
              borderRadius: '50%',
              rotate: '-10deg'
            }}
            animate={{ 
              opacity: [0, 1, 1, 0],
              y: [0, 120, 120, 0],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
          {/* Scale Base Neon Sweep */}
          <motion.div 
            className="absolute hidden md:block bg-[#ff00ff] pointer-events-none mix-blend-screen"
            style={{ 
              top: '68%', 
              left: '55%', 
              width: '28%', 
              height: '3px',
              boxShadow: '0 0 20px 8px #ff00ff, 0 0 40px 15px rgba(255,0,255,0.6)',
              borderRadius: '50%'
            }}
            animate={{ 
              opacity: [0, 0.8, 0],
              scaleX: [0.5, 1, 0.5],
              y: [0, -40, 0]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50" />
      </div>

      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl">
          
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-neon-cyan/30 bg-muted/50 backdrop-blur mb-6">
            <span className="text-neon-cyan font-display text-sm font-bold">24–25 ИЮНЯ 2026</span>
            <span className="text-muted-foreground text-sm">Москва, Технограм</span>
          </div>

          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-black leading-tight mb-2">
            <span className="text-neon-cyan">Технологии</span>
            <br />
            <span className="text-neon-magenta">ПРАВА</span>
          </h1>

          <p className="font-display text-lg md:text-xl font-bold text-foreground/90 mb-4 uppercase tracking-wide">

          </p>
          <p className="text-muted-foreground text-base md:text-lg mb-8 max-w-lg">
            Крупнейшая конференция и выставка, посвящённая технологиям в юриспруденции. 
            Особый фокус — <span className="text-neon-magenta font-semibold">банкротство физических лиц</span>.
          </p>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => scrollToSection("#tickets")}
              className="px-8 py-3 bg-neon-magenta text-primary-foreground font-display font-bold rounded-lg shadow-neon-magenta hover:opacity-90 transition-opacity text-sm uppercase tracking-wider">
              
              Получить билет
            </button>
            <button
              onClick={() => scrollToSection("#exhibition")}
              className="px-8 py-3 border border-neon-cyan text-neon-cyan font-display font-bold rounded-lg hover:bg-accent/10 transition-colors text-sm uppercase tracking-wider">
              
              Забронировать стенд
            </button>
          </div>
        </motion.div>
      </div>
    </section>);

};