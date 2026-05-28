import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { BookOpen, ArrowRight, Star } from "lucide-react";
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

const bookReviews = [
  { name: "Алексей К.", role: "Арбитражный управляющий", text: "Идеально для старта — структурировано, без воды, с практическими шагами." },
  { name: "Мария С.", role: "Юрист по БФЛ", text: "Раздала сотрудникам — теперь все на одной волне. Особенно полезны чек-листы внутри." },
  { name: "Дмитрий Л.", role: "Руководитель практики", text: "117 страниц концентрированной пользы. Регулярно ссылаюсь на неё в работе." },
];

export const BookPromoSection = () => {
  const { data: settings = {} } = useSettings();

  const title = settings.book_title || "Банкротство физлиц: понятное руководство";
  const coverUrl = settings.book_cover_url || "";

  return (
    <section id="book" className="py-16 relative">
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[400px] h-[400px] bg-neon-magenta/[0.03] rounded-full blur-[120px] pointer-events-none" />
      <div className="container relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-neon-magenta/15 bg-card/50 p-6 md:p-8 hover:border-neon-magenta/30 transition-colors"
        >
          <div className="grid md:grid-cols-[auto_1fr] gap-6 md:gap-8 items-center">
            {/* Book cover — compact */}
            <div className="flex-shrink-0 flex justify-center md:justify-start">
              {coverUrl ? (
                <img src={coverUrl} alt={title} className="w-24 md:w-32 rounded-lg border border-border shadow-2xl shadow-black/30" />
              ) : (
                <div className="w-24 md:w-32">
                  <MiniBookCover />
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center gap-3 mb-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-neon-magenta/50">
                  Безоплатная книга · 117 стр.
                </p>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-bold uppercase tracking-wider">
                  Безоплатно
                </span>
              </div>

              <h2 className="font-display text-2xl md:text-3xl font-black mb-3 uppercase leading-tight">{title}</h2>

              <p className="text-muted-foreground text-sm md:text-base mb-4 max-w-lg">
                Руководство по банкротству физлиц: когда начинать, что с имуществом и долгами, как пройти процедуру по шагам.
              </p>

              {/* Compact reviews */}
              <div className="flex flex-wrap gap-3 mb-5">
                {bookReviews.map((r, i) => (
                  <div key={i} className="flex items-start gap-2 px-3 py-2 rounded-lg bg-white/[0.02] border border-white/[0.05] max-w-xs">
                    <div className="flex-shrink-0 mt-0.5">
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, si) => (
                          <Star key={si} className="w-2.5 h-2.5 text-yellow-400 fill-yellow-400" />
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-[11px] text-foreground/60 leading-snug line-clamp-2">{r.text}</p>
                      <p className="text-[9px] text-foreground/30 mt-1">{r.name} · {r.role}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Link
                  to="/book"
                  className="group inline-flex items-center gap-2 px-6 py-3 bg-neon-magenta text-primary-foreground font-display font-bold rounded-lg shadow-lg shadow-neon-magenta/20 hover:shadow-neon-magenta/40 transition-shadow text-sm uppercase tracking-wider"
                >
                  Получить книгу
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                </Link>
                <a
                  href="https://t.me/NeuroPravo_Bot?start=book"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs text-foreground/40 hover:text-foreground/60 transition-colors"
                >
                  или через @NeuroPravo_Bot →
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
