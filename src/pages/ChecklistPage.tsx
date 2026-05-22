import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Check, Download, ListChecks, RotateCcw } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { api } from "@/lib/api";
import type { Checklist } from "@/lib/api";
import { resolveChecklistIcon } from "@/lib/checklistIcons";
import { usePageMeta } from "@/hooks/usePageMeta";

const storageKey = (slug: string) => `checklist:${slug}`;

const ChecklistPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [checklist, setChecklist] = useState<Checklist | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setNotFound(false);
    api.checklists
      .get(slug)
      .then((data) => setChecklist(data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  // Загрузка сохранённого прогресса.
  useEffect(() => {
    if (!slug) return;
    try {
      const raw = localStorage.getItem(storageKey(slug));
      if (raw) setChecked(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, [slug]);

  const toggle = (key: string) => {
    setChecked((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      if (slug) {
        try {
          localStorage.setItem(storageKey(slug), JSON.stringify(next));
        } catch {
          /* ignore */
        }
      }
      return next;
    });
  };

  const reset = () => {
    setChecked({});
    if (slug) {
      try {
        localStorage.removeItem(storageKey(slug));
      } catch {
        /* ignore */
      }
    }
  };

  usePageMeta({
    title: checklist ? `${checklist.title} — Чек-лист` : "Чек-лист",
    description: checklist?.description || undefined,
    canonicalPath: slug ? `/checklists/${slug}` : undefined,
  });

  const groups = useMemo(() => checklist?.items || [], [checklist]);
  const { total, done } = useMemo(() => {
    let t = 0;
    let d = 0;
    groups.forEach((g, gi) =>
      g.points.forEach((_, pi) => {
        t += 1;
        if (checked[`${gi}-${pi}`]) d += 1;
      })
    );
    return { total: t, done: d };
  }, [groups, checked]);

  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  const Icon = resolveChecklistIcon(checklist?.icon);
  const isCyan = checklist?.accent !== "magenta";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container pt-28 pb-20 max-w-3xl">
        <Link
          to="/#checklists"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft size={16} /> Все чек-листы
        </Link>

        {loading ? (
          <div className="space-y-4">
            <div className="h-8 w-40 rounded bg-card animate-pulse" />
            <div className="h-12 w-3/4 rounded bg-card animate-pulse" />
            <div className="h-64 rounded bg-card animate-pulse" />
          </div>
        ) : notFound || !checklist ? (
          <div className="text-center py-16">
            <ListChecks className="w-14 h-14 text-muted-foreground mx-auto mb-4" />
            <h1 className="font-display text-2xl font-bold mb-2">Чек-лист не найден</h1>
            <p className="text-muted-foreground mb-6">Возможно, он ещё не опубликован или ссылка устарела.</p>
            <Link
              to="/#checklists"
              className="px-6 py-3 border border-neon-cyan text-neon-cyan font-display font-bold rounded-lg hover:bg-accent/10 transition-colors text-sm uppercase tracking-wider"
            >
              К списку чек-листов
            </Link>
          </div>
        ) : (
          <article>
            <div className="flex items-center gap-3 mb-4">
              <Icon className={`w-9 h-9 ${isCyan ? "text-neon-cyan" : "text-neon-magenta"}`} />
              <span className={`text-xs font-bold uppercase tracking-wider ${isCyan ? "text-neon-cyan" : "text-neon-magenta"}`}>
                {checklist.category}
              </span>
            </div>

            <h1 className="font-display text-3xl md:text-4xl font-black mb-4 uppercase leading-tight">
              {checklist.title}
            </h1>

            {checklist.intro && (
              <p className="text-muted-foreground text-sm md:text-base mb-8 whitespace-pre-line">
                {checklist.intro}
              </p>
            )}

            {/* Прогресс */}
            {total > 0 && (
              <div className="sticky top-16 z-10 bg-background/90 backdrop-blur rounded-xl border border-border p-4 mb-8">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">
                    Выполнено {done} из {total}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className={`font-display font-bold ${isCyan ? "text-neon-cyan" : "text-neon-magenta"}`}>{pct}%</span>
                    <button
                      onClick={reset}
                      className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <RotateCcw size={13} /> Сбросить
                    </button>
                  </div>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    className={isCyan ? "h-full bg-neon-cyan" : "h-full bg-neon-magenta"}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
              </div>
            )}

            {/* Группы пунктов */}
            <div className="space-y-8">
              {groups.map((g, gi) => (
                <div key={gi}>
                  <h2 className="font-display text-lg font-bold mb-4">{g.group}</h2>
                  <ul className="space-y-2">
                    {g.points.map((p, pi) => {
                      const key = `${gi}-${pi}`;
                      const isDone = !!checked[key];
                      return (
                        <li key={pi}>
                          <button
                            onClick={() => toggle(key)}
                            className={`w-full text-left flex items-start gap-3 p-3 rounded-lg border transition-colors ${
                              isDone
                                ? "border-neon-cyan/40 bg-neon-cyan/5"
                                : "border-border bg-card hover:border-neon-cyan/30"
                            }`}
                          >
                            <span
                              className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                                isDone ? "bg-neon-cyan border-neon-cyan" : "border-muted-foreground/40"
                              }`}
                            >
                              {isDone && <Check size={14} className="text-background" />}
                            </span>
                            <span className="flex-1">
                              <span className={`text-sm ${isDone ? "line-through text-muted-foreground" : ""}`}>
                                {p.text}
                              </span>
                              {p.hint && (
                                <span className="block text-xs text-muted-foreground mt-1">{p.hint}</span>
                              )}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>

            {checklist.pdf_url && (
              <div className="mt-10">
                <a
                  href={checklist.pdf_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3 border border-neon-cyan text-neon-cyan font-display font-bold rounded-lg hover:bg-accent/10 transition-colors text-sm uppercase tracking-wider"
                >
                  <Download size={16} /> Скачать PDF
                </a>
              </div>
            )}
          </article>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ChecklistPage;
