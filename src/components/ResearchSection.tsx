import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, BarChart3, BookOpen, Bot, FileText, Lock, Sparkles, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { ResearchReport } from "@/lib/api";
import { resolveResearchIcon } from "@/lib/researchIcons";
import { TechCard } from "@/components/ui/TechCard";

/* Все исследования показываются на /research. Статьи будут отдельным контентом. */
const ARTICLE_SLUGS = new Set<string>();

type FilterTab = "all" | "free" | "premium";

function formatPrice(price: number): string {
  return price.toLocaleString("ru-RU") + " ₽";
}

function RatingStars({ rating, count }: { rating: number; count: number }) {
  const r = Number(rating);
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-px">
        {Array.from({ length: 5 }).map((_, i) => {
          const filled = r >= i + 1;
          const half = !filled && r >= i + 0.5;
          return (
            <Star
              key={i}
              size={12}
              className={
                filled
                  ? "text-amber-400 fill-amber-400"
                  : half
                    ? "text-amber-400 fill-amber-400/50"
                    : "text-foreground/15"
              }
            />
          );
        })}
      </div>
      <span className="text-[10px] text-foreground/40">({count})</span>
    </div>
  );
}

/* ── Free card ── */
function FreeCard({ r, i }: { r: ResearchReport; i: number }) {
  const Icon = resolveResearchIcon(r.icon);
  const isCyan = r.accent !== "magenta";

  return (
    <motion.div
      key={r.id}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.07 }}
    >
      <Link to={`/research/${r.slug}`} className="block h-full">
        <TechCard
          spotlightColor={isCyan ? "rgba(0,255,255,0.07)" : "rgba(255,51,153,0.07)"}
          className="h-full"
        >
          <div className="p-6 flex flex-col h-full relative">
            <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${
              isCyan ? "from-neon-cyan/50 via-neon-cyan/20 to-transparent" : "from-neon-magenta/50 via-neon-magenta/20 to-transparent"
            }`} />

            <div className="flex items-center gap-3 mb-5">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                isCyan ? "bg-neon-cyan/10" : "bg-neon-magenta/10"
              }`}>
                <Icon className={`w-5 h-5 ${isCyan ? "text-neon-cyan" : "text-neon-magenta"}`} />
              </div>
              <div>
                <span className={`text-[10px] font-bold uppercase tracking-[0.2em] ${
                  isCyan ? "text-neon-cyan/60" : "text-neon-magenta/60"
                }`}>
                  {r.category}
                </span>
                {r.charts && r.charts.length > 0 && (
                  <div className="flex items-center gap-1 mt-0.5">
                    <BarChart3 className="w-3 h-3 text-foreground/25" />
                    <span className="text-[9px] text-foreground/30">{r.charts.length} графиков</span>
                  </div>
                )}
              </div>
            </div>

            <span className="inline-block self-start px-2.5 py-1 mb-3 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
              Безоплатно
            </span>

            <h3 className="font-display text-base font-bold mb-2 leading-snug">
              {r.title}
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
              {r.description}
            </p>

            {r.rating != null && r.rating_count != null && r.rating_count > 0 && (
              <div className="mt-3">
                <RatingStars rating={r.rating} count={r.rating_count} />
              </div>
            )}

            <div className={`mt-auto pt-5 flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
              isCyan
                ? "bg-neon-cyan/5 border border-neon-cyan/10 group-hover:bg-neon-cyan/10 group-hover:border-neon-cyan/25"
                : "bg-neon-magenta/5 border border-neon-magenta/10 group-hover:bg-neon-magenta/10 group-hover:border-neon-magenta/25"
            }`}>
              <span className={`font-display font-bold text-xs uppercase tracking-wider ${
                isCyan ? "text-neon-cyan/70" : "text-neon-magenta/70"
              }`}>
                Читать отчёт
              </span>
              <ArrowRight size={14} className={`${isCyan ? "text-neon-cyan/50" : "text-neon-magenta/50"} group-hover:translate-x-1 transition-transform`} />
            </div>
          </div>
        </TechCard>
      </Link>
    </motion.div>
  );
}

/* ── Premium card ── */
function PremiumCard({ r, i }: { r: ResearchReport; i: number }) {
  const Icon = resolveResearchIcon(r.icon);

  return (
    <motion.div
      key={r.id}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.07, type: "spring", stiffness: 300, damping: 25 }}
    >
      <Link to={`/research/${r.slug}`} className="block h-full group">
        <div className="relative h-full rounded-2xl border border-neon-magenta/20 bg-card/80 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:border-neon-magenta/40 hover:shadow-[0_0_40px_-12px_rgba(255,0,255,0.15)]">
          {/* Gradient glow — subtle, not flashy */}
          <div className="absolute inset-0 bg-gradient-to-br from-neon-magenta/[0.03] via-transparent to-neon-cyan/[0.02] pointer-events-none" />
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-neon-magenta/[0.04] rounded-full blur-3xl pointer-events-none group-hover:bg-neon-magenta/[0.07] transition-all duration-500" />

          {/* Top accent */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-neon-magenta/60 via-neon-magenta/30 to-neon-cyan/20" />

          <div className="relative p-6 flex flex-col h-full">
            {/* Header row: icon + premium badge */}
            <div className="flex items-center justify-between mb-4">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-neon-magenta/10 group-hover:bg-neon-magenta/15 transition-colors">
                <Icon className="w-5 h-5 text-neon-magenta" />
              </div>
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-neon-magenta/8 border border-neon-magenta/20">
                <Sparkles size={10} className="text-neon-magenta/70" />
                <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-neon-magenta/70">
                  Экспертный
                </span>
              </div>
            </div>

            {/* Category */}
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neon-magenta/50 mb-2">
              {r.category}
            </span>

            {/* Title */}
            <h3 className="font-display text-base font-bold mb-2 leading-snug group-hover:text-foreground transition-colors">
              {r.title}
            </h3>

            {/* Description */}
            <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 mb-3">
              {r.description}
            </p>

            {/* What's inside — honest value indicators */}
            <div className="flex flex-wrap gap-x-3 gap-y-1 mb-3">
              {r.charts && r.charts.length > 0 && (
                <div className="flex items-center gap-1">
                  <BarChart3 size={11} className="text-neon-cyan/50" />
                  <span className="text-[10px] text-foreground/40">{r.charts.length} графиков</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <FileText size={11} className="text-neon-cyan/50" />
                <span className="text-[10px] text-foreground/40">PDF-отчёт</span>
              </div>
              <div className="flex items-center gap-1">
                <BookOpen size={11} className="text-neon-cyan/50" />
                <span className="text-[10px] text-foreground/40">25–40 стр.</span>
              </div>
            </div>

            {/* Rating */}
            {r.rating != null && r.rating_count != null && r.rating_count > 0 && (
              <div className="mb-4">
                <RatingStars rating={r.rating} count={r.rating_count} />
              </div>
            )}

            {/* CTA with price — transparent, no tricks */}
            <div className="mt-auto pt-3">
              <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-neon-magenta/8 border border-neon-magenta/15 group-hover:bg-neon-magenta/12 group-hover:border-neon-magenta/30 transition-all">
                <div className="flex flex-col">
                  <span className="font-display font-black text-sm text-neon-magenta leading-none">
                    {r.price ? formatPrice(r.price) : "Премиум"}
                  </span>
                  <span className="text-[9px] text-foreground/35 mt-0.5">
                    полный доступ к отчёту
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-neon-magenta/70 group-hover:text-neon-magenta transition-colors">
                  <span className="font-display font-bold text-[11px] uppercase tracking-wider">
                    Подробнее
                  </span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export const ResearchSection = () => {
  const [filter, setFilter] = useState<FilterTab>("all");

  const { data: raw = [], isLoading: loading } = useQuery({
    queryKey: ["research-reports"],
    queryFn: () => api.research.reports(),
    staleTime: 5 * 60 * 1000,
  });

  const allReports = useMemo(
    () =>
      [...raw]
        .filter((r: ResearchReport) => !ARTICLE_SLUGS.has(r.slug))
        .sort((a: ResearchReport, b: ResearchReport) => {
          if (a.is_free !== b.is_free) return a.is_free ? -1 : 1;
          return a.display_order - b.display_order;
        }),
    [raw]
  );

  const freeReports = useMemo(() => allReports.filter((r) => r.is_free), [allReports]);
  const premiumReports = useMemo(() => allReports.filter((r) => !r.is_free), [allReports]);

  const reports = useMemo(() => {
    if (filter === "free") return freeReports;
    if (filter === "premium") return premiumReports;
    return allReports;
  }, [allReports, freeReports, premiumReports, filter]);

  const freeCount = freeReports.length;
  const premiumCount = premiumReports.length;

  const tabs: { key: FilterTab; label: string; count: number }[] = [
    { key: "all", label: "Все", count: allReports.length },
    { key: "free", label: "Безоплатные", count: freeCount },
    { key: "premium", label: "Экспертные", count: premiumCount },
  ];

  return (
    <section id="research" className="py-24">
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="mb-4">
            <h2 className="font-display text-3xl md:text-5xl font-black uppercase">
              Исследования
            </h2>
          </div>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl">
            Аналитика рынка БФЛ — от обзорных материалов до глубоких экспертных отчётов
            с данными, графиками и готовыми инструментами.
          </p>
        </motion.div>

        {/* Filter tabs with counts */}
        {!loading && allReports.length > 0 && (
          <div className="flex items-center gap-2 mb-10">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`px-4 py-2 rounded-lg text-sm font-display font-bold uppercase tracking-wider transition-all ${
                  filter === tab.key
                    ? tab.key === "premium"
                      ? "bg-neon-magenta/15 text-neon-magenta border border-neon-magenta/30"
                      : "bg-neon-cyan/15 text-neon-cyan border border-neon-cyan/30"
                    : "bg-muted/30 text-muted-foreground border border-border hover:border-foreground/20 hover:text-foreground"
                }`}
              >
                {tab.label}
                <span className="ml-1.5 text-[10px] opacity-60">{tab.count}</span>
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-56 rounded-2xl border border-border bg-card animate-pulse" />
            ))}
          </div>
        ) : reports.length === 0 ? (
          <p className="text-muted-foreground">Отчёты скоро появятся.</p>
        ) : filter === "all" ? (
          <>
            {/* Free section */}
            {freeReports.length > 0 && (
              <div className="mb-14">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <BookOpen size={16} className="text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold">Безоплатные отчёты</h3>
                    <p className="text-foreground/40 text-xs">Полный доступ без регистрации</p>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
                  {freeReports.map((r, i) => (
                    <FreeCard key={r.id} r={r} i={i} />
                  ))}
                </div>
              </div>
            )}

            {/* Premium section — visual separator */}
            {premiumReports.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-neon-magenta/10 flex items-center justify-center">
                    <Sparkles size={16} className="text-neon-magenta" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold">Экспертные отчёты</h3>
                    <p className="text-foreground/40 text-xs">Глубокая аналитика с данными, графиками и инструментами</p>
                  </div>
                </div>
                <p className="text-foreground/35 text-sm mb-6 ml-11">
                  Каждый отчёт — 25-40 страниц исследования с актуальными данными Федресурса, ЕФРСБ и судебной практики.
                  Чек-листы, алгоритмы и шаблоны документов готовы к применению.
                </p>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
                  {premiumReports.map((r, i) => (
                    <PremiumCard key={r.id} r={r} i={i} />
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          /* Filtered view — single grid */
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {reports.map((r, i) =>
              r.is_free ? (
                <FreeCard key={r.id} r={r} i={i} />
              ) : (
                <PremiumCard key={r.id} r={r} i={i} />
              )
            )}
          </div>
        )}

        {/* Telegram bot — delivery channel for reports */}
        <a
          href="https://t.me/NeuroPravo_Bot"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-10 flex items-center gap-3 px-5 py-3 rounded-xl border border-border bg-card/30 hover:border-neon-cyan/30 transition-colors group"
        >
          <Bot size={18} className="text-neon-cyan/60 flex-shrink-0" />
          <span className="text-sm text-foreground/50 group-hover:text-foreground/70 transition-colors">
            Получите бесплатные отчёты прямо в Telegram —{" "}
            <span className="text-neon-cyan/70 font-medium">@NeuroPravo_Bot</span>
          </span>
        </a>
      </div>
    </section>
  );
};
