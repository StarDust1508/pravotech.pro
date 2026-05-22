import { useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowRight, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { ResearchReport } from "@/lib/api";
import { resolveResearchIcon } from "@/lib/researchIcons";
import { TechCard } from "@/components/ui/TechCard";

export const ResearchSection = () => {
  const { data: raw = [], isLoading: loading } = useQuery({
    queryKey: ["research-reports"],
    queryFn: () => api.research.reports(),
    staleTime: 5 * 60 * 1000,
  });
  const reports = useMemo(
    () => [...raw].sort((a: ResearchReport, b: ResearchReport) => a.display_order - b.display_order),
    [raw]
  );

  return (
    <section id="research" className="py-24">
      <div className="container">
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
            Аналитика рынка БФЛ и трендов ИИ в банкротстве физических лиц.
          </p>
        </motion.div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-56 rounded-2xl border border-border bg-card animate-pulse" />
            ))}
          </div>
        ) : reports.length === 0 ? (
          <p className="text-muted-foreground">Отчёты скоро появятся.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {reports.map((r, i) => {
              const Icon = resolveResearchIcon(r.icon);
              const isCyan = r.accent !== "magenta";
              const spotlightColor = isCyan
                ? "rgba(0,255,255,0.07)"
                : "rgba(255,51,153,0.07)";
              return (
                <motion.div
                  key={r.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                >
                  <Link to={`/research/${r.slug}`} className="block h-full">
                    <TechCard spotlightColor={spotlightColor} className="h-full">
                      <div className="p-6 flex flex-col h-full">
                        {/* Top accent bar */}
                        <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${
                          isCyan ? "from-neon-cyan/50 via-neon-cyan/20 to-transparent" : "from-neon-magenta/50 via-neon-magenta/20 to-transparent"
                        }`} />

                        {/* Icon + Category */}
                        <div className="flex items-center gap-3 mb-5">
                          <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors ${
                            isCyan ? "bg-neon-cyan/10 group-hover:bg-neon-cyan/20" : "bg-neon-magenta/10 group-hover:bg-neon-magenta/20"
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
                                <BarChart3 className={`w-3 h-3 ${isCyan ? "text-neon-cyan/40" : "text-neon-magenta/40"}`} />
                                <span className="text-[9px] text-foreground/30">{r.charts.length} графиков</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Title */}
                        <h3 className="font-display text-base font-bold mb-2 leading-snug group-hover:text-foreground transition-colors">
                          {r.title}
                        </h3>

                        {/* Description */}
                        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                          {r.description}
                        </p>

                        {/* CTA */}
                        <div className={`mt-auto pt-5 flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                          isCyan
                            ? "bg-neon-cyan/5 group-hover:bg-neon-cyan/10 border border-neon-cyan/10 group-hover:border-neon-cyan/25"
                            : "bg-neon-magenta/5 group-hover:bg-neon-magenta/10 border border-neon-magenta/10 group-hover:border-neon-magenta/25"
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
            })}
          </div>
        )}
      </div>
    </section>
  );
};
