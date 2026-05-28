import { useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, ClipboardList } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Checklist } from "@/lib/api";
import { resolveChecklistIcon } from "@/lib/checklistIcons";
import { TechCard } from "@/components/ui/TechCard";

const countPoints = (c: Checklist) =>
  (c.items || []).reduce((sum, g) => sum + (g.points?.length || 0), 0);

export const ChecklistsSection = () => {
  const { data: raw = [], isLoading: loading } = useQuery({
    queryKey: ["checklists"],
    queryFn: () => api.checklists.list(),
    staleTime: 5 * 60 * 1000,
  });
  const checklists = useMemo(
    () => [...raw].sort((a: Checklist, b: Checklist) => a.display_order - b.display_order),
    [raw]
  );

  if (!loading && checklists.length === 0) return null;

  return (
    <section id="checklists" className="py-24">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="font-display text-3xl md:text-5xl font-black mb-4 uppercase">
            Чек-листы
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl">
            Практические чек-листы для процедур банкротства и работы с арбитражным управляющим.
          </p>
        </motion.div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-52 rounded-2xl border border-border bg-card animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {checklists.map((c, i) => {
              const Icon = resolveChecklistIcon(c.icon);
              const isCyan = c.accent !== "magenta";
              const spotlightColor = isCyan
                ? "rgba(0,255,255,0.07)"
                : "rgba(255,51,153,0.07)";
              const total = countPoints(c);
              const groups = c.items?.length || 0;

              return (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                >
                  <Link to={`/checklists/${c.slug}`} className="block h-full">
                    <TechCard spotlightColor={spotlightColor} className="h-full">
                      <div className="p-6 flex flex-col h-full">
                        {/* Top accent bar */}
                        <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${
                          isCyan ? "from-neon-cyan/50 via-neon-cyan/20 to-transparent" : "from-neon-magenta/50 via-neon-magenta/20 to-transparent"
                        }`} />

                        {/* Icon + Category + Stats */}
                        <div className="flex items-center justify-between mb-5">
                          <div className="flex items-center gap-3">
                            <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors ${
                              isCyan ? "bg-neon-cyan/10 group-hover:bg-neon-cyan/20" : "bg-neon-magenta/10 group-hover:bg-neon-magenta/20"
                            }`}>
                              <Icon className={`w-5 h-5 ${isCyan ? "text-neon-cyan" : "text-neon-magenta"}`} />
                            </div>
                            <span className={`text-[10px] font-bold uppercase tracking-[0.2em] ${
                              isCyan ? "text-neon-cyan/60" : "text-neon-magenta/60"
                            }`}>
                              {c.category}
                            </span>
                          </div>
                          {total > 0 && (
                            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${
                              isCyan ? "bg-neon-cyan/8" : "bg-neon-magenta/8"
                            }`}>
                              <CheckCircle2 className={`w-3.5 h-3.5 ${isCyan ? "text-neon-cyan/50" : "text-neon-magenta/50"}`} />
                              <span className={`text-[11px] font-bold ${isCyan ? "text-neon-cyan/60" : "text-neon-magenta/60"}`}>{total}</span>
                            </div>
                          )}
                        </div>

                        {/* Title */}
                        <h3 className="font-display text-base font-bold mb-2 leading-snug group-hover:text-foreground transition-colors">
                          {c.title}
                        </h3>

                        {/* Description */}
                        <p className="text-muted-foreground text-sm mb-4 flex-grow leading-relaxed line-clamp-3">
                          {c.description}
                        </p>

                        {/* Progress-like bar */}
                        {groups > 0 && (
                          <div className="mb-5 flex gap-1">
                            {Array.from({ length: Math.min(groups, 6) }).map((_, gi) => (
                              <div key={gi} className={`h-1 flex-1 rounded-full transition-colors ${
                                isCyan ? "bg-neon-cyan/15 group-hover:bg-neon-cyan/35" : "bg-neon-magenta/15 group-hover:bg-neon-magenta/35"
                              }`} style={{ transitionDelay: `${gi * 50}ms` }} />
                            ))}
                          </div>
                        )}

                        {/* CTA */}
                        <div className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                          isCyan
                            ? "bg-neon-cyan/5 group-hover:bg-neon-cyan/10 border border-neon-cyan/10 group-hover:border-neon-cyan/25"
                            : "bg-neon-magenta/5 group-hover:bg-neon-magenta/10 border border-neon-magenta/10 group-hover:border-neon-magenta/25"
                        }`}>
                          <span className={`font-display font-bold text-xs uppercase tracking-wider ${
                            isCyan ? "text-neon-cyan/70" : "text-neon-magenta/70"
                          }`}>
                            Открыть чек-лист
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

        {/* Telegram bot — checklist downloads */}
        <a
          href="https://t.me/NeuroPravo_Bot?start=checklist"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-10 flex items-center gap-3 px-5 py-3 rounded-xl border border-border bg-card/30 hover:border-neon-magenta/30 transition-colors group"
        >
          <ClipboardList size={18} className="text-neon-magenta/60 flex-shrink-0" />
          <span className="text-sm text-foreground/50 group-hover:text-foreground/70 transition-colors">
            Скачайте чек-листы в PDF через бота — напишите <span className="font-mono text-neon-magenta/70">/checklist</span> в{" "}
            <span className="text-neon-magenta/70 font-medium">@NeuroPravo_Bot</span>
          </span>
        </a>
      </div>
    </section>
  );
};
