import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { BookOpen, ArrowRight } from "lucide-react";
import { useSettings } from "@/hooks/useSettings";

/* Mini 3D book cover — same design as BookPage */
function MiniBookCover() {
  return (
    <div className="relative w-44" style={{ perspective: "800px" }}>
      <motion.div
        initial={{ rotateY: 6, rotateX: -2 }}
        whileHover={{ rotateY: 0, rotateX: 0, scale: 1.03 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative aspect-[3/4] rounded-xl overflow-hidden"
        style={{
          transformStyle: "preserve-3d",
          boxShadow: "0 20px 60px -15px rgba(0,0,0,0.8), -6px 0 25px -8px rgba(0,255,255,0.1), 6px 0 25px -8px rgba(255,0,255,0.08)",
        }}
      >
        {/* Base background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#080e18] via-[#0c1828] to-[#0a0f1a]" />

        {/* Ambient glows */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_20%,rgba(0,255,255,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_80%,rgba(255,0,255,0.1),transparent_50%)]" />

        {/* Grid texture */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: "linear-gradient(rgba(0,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.3) 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }} />

        {/* Spine */}
        <div className="absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-b from-neon-cyan/50 via-[#0d1520] to-neon-magenta/40 shadow-[2px_0_6px_rgba(0,0,0,0.5)]" />
        <div className="absolute left-3 top-0 bottom-0 w-px bg-gradient-to-b from-neon-cyan/20 via-white/[0.04] to-neon-magenta/15" />

        {/* Border frame */}
        <div className="absolute inset-0 rounded-xl border border-white/[0.12]" />
        <div className="absolute inset-[4px] rounded-lg border border-white/[0.04]" />

        {/* Edge glows */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-neon-cyan/60 via-neon-cyan/20 to-neon-magenta/40" />
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-neon-magenta/40 via-neon-magenta/15 to-neon-cyan/30" />

        {/* Geometric accents */}
        <div className="absolute top-6 right-4 w-14 h-14 border border-neon-cyan/10 rounded-xl rotate-[15deg]" />
        <div className="absolute top-9 right-7 w-8 h-8 border border-neon-magenta/8 rounded-lg rotate-[30deg]" />

        {/* Content */}
        <div className="relative h-full flex flex-col justify-between p-5 pl-7">
          {/* Icon */}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-magenta/15 to-neon-cyan/10 border border-white/[0.08] flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-neon-magenta" />
          </div>

          {/* Title */}
          <div>
            <div className="w-8 h-[2px] bg-neon-cyan/40 rounded-full mb-2" />
            <h3 className="font-display font-black text-[17px] uppercase leading-[1.05] tracking-tight">
              <span className="text-white">Банкрот</span><span className="text-white/60">ство</span><br />
              <span className="text-neon-cyan">физических</span><br />
              <span className="text-white">лиц</span>
            </h3>
            <div className="flex gap-1 mt-2">
              <div className="w-8 h-[1.5px] rounded-full bg-neon-magenta/60" />
              <div className="w-4 h-[1.5px] rounded-full bg-neon-cyan/40" />
              <div className="w-2 h-[1.5px] rounded-full bg-neon-magenta/25" />
            </div>
          </div>

          {/* Branding */}
          <div>
            <div className="font-display text-[8px] font-black uppercase tracking-[0.15em]">
              <span className="text-neon-magenta">Технолог</span><span className="text-neon-cyan">ИИ</span>{" "}
              <span className="text-neon-magenta">права</span>
            </div>
            <span className="text-[7px] text-foreground/25">{new Date().getFullYear()} · 117 стр.</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export const BookPromoSection = () => {
  const { data: settings = {} } = useSettings();

  const title = settings.book_title || "Банкротство физлиц: понятное руководство";
  const coverUrl = settings.book_cover_url || "";

  return (
    <section id="book" className="py-24 relative">
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[400px] h-[400px] bg-neon-magenta/[0.03] rounded-full blur-[120px] pointer-events-none" />
      <div className="container relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-neon-magenta/15 bg-card/50 p-8 md:p-12 hover:border-neon-magenta/30 transition-colors"
        >
          <div className="grid md:grid-cols-[1fr_auto] gap-10 items-center">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.35em] text-neon-magenta/50 mb-5">
                Книга по БФЛ
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-black mb-4 uppercase leading-tight">{title}</h2>
              <p className="text-muted-foreground text-base md:text-lg mb-8 max-w-lg">
                Понятное руководство по банкротству физических лиц: когда начинать, что с имуществом и долгами, как пройти процедуру по шагам.
              </p>
              <Link
                to="/book"
                className="group inline-flex items-center gap-2 px-8 py-3.5 bg-neon-magenta text-primary-foreground font-display font-bold rounded-lg shadow-lg shadow-neon-magenta/20 hover:shadow-neon-magenta/40 transition-shadow text-sm uppercase tracking-wider"
              >
                Подробнее
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
            <div className="hidden md:block">
              {coverUrl ? (
                <img src={coverUrl} alt={title} className="w-44 rounded-lg border border-border shadow-2xl shadow-black/30" />
              ) : (
                <MiniBookCover />
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
