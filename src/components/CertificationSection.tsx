import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { CheckCircle2, Award, ArrowRight, Shield } from "lucide-react";

/* ── Mini certificate mockup ── */
function MiniCertificate() {
  return (
    <div className="relative w-56 mx-auto" style={{ perspective: "800px" }}>
      <motion.div
        initial={{ rotateY: -4, rotateX: 2 }}
        whileHover={{ rotateY: 0, rotateX: 0, scale: 1.03 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative aspect-[4/3] rounded-xl overflow-hidden"
        style={{
          transformStyle: "preserve-3d",
          boxShadow:
            "0 20px 60px -15px rgba(0,0,0,0.8), 0 0 30px -10px rgba(0,255,255,0.1)",
        }}
      >
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#080e18] via-[#0c1828] to-[#0a0f1a]" />

        {/* Ambient glows */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_20%,rgba(0,255,255,0.12),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_80%,rgba(255,51,153,0.08),transparent_50%)]" />

        {/* Grid texture */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.3) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        {/* Border frame */}
        <div className="absolute inset-0 rounded-xl border border-neon-cyan/15" />
        <div className="absolute inset-[6px] rounded-lg border border-neon-cyan/8" />

        {/* Edge glows */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-neon-cyan/50 via-neon-cyan/20 to-neon-magenta/30" />
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-neon-magenta/30 via-neon-magenta/10 to-neon-cyan/20" />

        {/* Geometric accents */}
        <div className="absolute top-4 right-4 w-10 h-10 border border-neon-cyan/10 rounded-lg rotate-[15deg]" />
        <div className="absolute bottom-4 left-4 w-8 h-8 border border-neon-magenta/8 rounded-lg rotate-[-12deg]" />

        {/* Content */}
        <div className="relative h-full flex flex-col items-center justify-center p-5 text-center gap-3">
          {/* Icon */}
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-cyan/15 to-neon-magenta/10 border border-white/[0.08] flex items-center justify-center">
            <Award className="w-6 h-6 text-neon-cyan" />
          </div>

          {/* Title */}
          <div>
            <div className="w-6 h-[2px] bg-neon-cyan/40 rounded-full mx-auto mb-2" />
            <h3 className="font-display font-black text-[15px] uppercase leading-tight tracking-tight text-white">
              СЕРТИФИКАТ
            </h3>
            <p className="text-[9px] text-foreground/40 mt-1">
              Аттестация юристов по БФЛ
            </p>
          </div>

          {/* Decorative lines */}
          <div className="flex gap-1 mt-1">
            <div className="w-10 h-[1.5px] rounded-full bg-neon-cyan/40" />
            <div className="w-5 h-[1.5px] rounded-full bg-neon-magenta/30" />
            <div className="w-3 h-[1.5px] rounded-full bg-neon-cyan/20" />
          </div>

          {/* QR placeholder */}
          <div className="w-10 h-10 rounded border border-neon-cyan/10 bg-white/[0.03] grid grid-cols-3 grid-rows-3 gap-px p-1">
            {Array.from({ length: 9 }).map((_, i) => (
              <div
                key={i}
                className={`rounded-[1px] ${
                  [0, 2, 3, 5, 6, 8].includes(i)
                    ? "bg-neon-cyan/30"
                    : "bg-transparent"
                }`}
              />
            ))}
          </div>

          {/* Branding */}
          <div className="font-display text-[7px] font-black uppercase tracking-[0.15em]">
            <span className="text-neon-magenta">Технолог</span>
            <span className="text-neon-cyan">ИИ</span>{" "}
            <span className="text-neon-magenta">права</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

const features = [
  "250 вопросов по ФЗ-127 и судебной практике",
  "3 часа на выполнение, онлайн",
  "Сертификат с QR-верификацией",
  "Признаётся СРО арбитражных управляющих",
];

export const CertificationSection = () => {
  return (
    <section id="certification" className="py-16 relative">
      <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-neon-cyan/[0.03] rounded-full blur-[120px] pointer-events-none" />
      <div className="container relative">
        <div className="rounded-2xl border border-neon-cyan/20 bg-card/50 overflow-hidden relative">
          {/* Top strip */}
          <div className="bg-gradient-to-r from-neon-cyan/15 via-neon-cyan/10 to-transparent border-b border-neon-cyan/15 px-8 md:px-12 py-3 flex items-center gap-2">
            <span className="text-base">🏆</span>
            <span className="text-neon-cyan text-xs font-bold uppercase tracking-wider">
              Аттестация юристов · Совместно с СРО
            </span>
          </div>

          <div className="p-8 md:p-12">
            <div className="grid md:grid-cols-[1fr_auto] gap-10 items-center">
              {/* Left column */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="font-display text-3xl md:text-4xl font-black mb-4 uppercase leading-tight">
                  Аттестация юристов{" "}
                  <span className="text-neon-cyan">по БФЛ</span>
                </h2>

                <p className="text-muted-foreground text-base md:text-lg mb-6 max-w-lg">
                  Проверьте свой уровень и получите сертификат от СРО «Дело» —
                  Первая школа банкротства
                </p>

                {/* Feature list */}
                <div className="space-y-3 mb-8">
                  {features.map((text, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 + i * 0.07, duration: 0.4 }}
                      className="flex items-start gap-3"
                    >
                      <CheckCircle2 className="w-5 h-5 text-neon-cyan flex-shrink-0 mt-0.5" />
                      <span className="text-foreground/80 text-sm md:text-base">
                        {text}
                      </span>
                    </motion.div>
                  ))}
                </div>

                {/* CTAs */}
                <div className="flex flex-wrap gap-3">
                  <Link
                    to="/academy"
                    className="group inline-flex items-center gap-2 px-7 py-3.5 bg-neon-cyan text-primary-foreground font-display font-bold rounded-lg shadow-lg shadow-neon-cyan/20 hover:shadow-neon-cyan/40 transition-shadow text-sm uppercase tracking-wider"
                  >
                    Пройти бесплатный тест — 25 вопросов
                    <ArrowRight
                      size={14}
                      className="group-hover:translate-x-0.5 transition-transform"
                    />
                  </Link>
                  <Link
                    to="/academy"
                    className="inline-flex items-center gap-2 px-7 py-3.5 border border-foreground/15 text-foreground/60 font-display font-bold rounded-lg hover:border-neon-cyan/40 hover:text-neon-cyan transition-colors text-sm uppercase tracking-wider"
                  >
                    Полная аттестация — 9 990 ₽
                  </Link>
                </div>
              </motion.div>

              {/* Right column — certificate mockup */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15, duration: 0.5 }}
                className="hidden md:block"
              >
                <MiniCertificate />
              </motion.div>
            </div>

            {/* Social proof */}
            <div className="mt-8 pt-5 border-t border-white/[0.06] flex items-center gap-2">
              <Shield className="w-4 h-4 text-neon-cyan/40" />
              <span className="text-foreground/30 text-xs">
                1 247 юристов уже прошли аттестацию
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
