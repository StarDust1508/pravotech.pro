import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Check, Download, ListChecks, RotateCcw, Mail, User, Phone, X, FileDown, CheckCircle2, MessageCircle } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { api } from "@/lib/api";
import type { Checklist } from "@/lib/api";
import { resolveChecklistIcon } from "@/lib/checklistIcons";
import { usePageMeta } from "@/hooks/usePageMeta";
import { useToast } from "@/hooks/use-toast";

const storageKey = (slug: string) => `checklist:${slug}`;
const leadStorageKey = "checklist-lead-submitted";

/* ── Lead capture gate for PDF downloads ── */
function ChecklistDownloadGate({ pdfUrl, checklistTitle, isCyan }: { pdfUrl: string; checklistTitle: string; isCyan: boolean }) {
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(() => {
    try { return localStorage.getItem(leadStorageKey) === "true"; } catch { return false; }
  });
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      toast({ title: "Заполните имя и email", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      await api.leads.submitResearch({
        name: form.name,
        email: form.email,
        phone: form.phone || "",
        source_form: `checklist-pdf`,
        research_title: checklistTitle,
      } as any);
      localStorage.setItem(leadStorageKey, "true");
      setSubmitted(true);
      setShowForm(false);
      toast({ title: "Готово! Ссылка на PDF открыта." });
      window.open(pdfUrl, "_blank");
    } catch {
      toast({ title: "Ошибка отправки. Попробуйте ещё раз.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  // If already submitted — direct download
  if (submitted) {
    return (
      <div className="mt-10">
        <a
          href={pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center justify-center gap-2 px-7 py-3 border font-display font-bold rounded-lg hover:bg-accent/10 transition-colors text-sm uppercase tracking-wider ${
            isCyan ? "border-neon-cyan text-neon-cyan" : "border-neon-magenta text-neon-magenta"
          }`}
        >
          <Download size={16} /> Скачать PDF
        </a>
      </div>
    );
  }

  return (
    <div className="mt-10">
      {!showForm ? (
        <motion.button
          onClick={() => setShowForm(true)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`inline-flex items-center justify-center gap-2 px-7 py-3.5 font-display font-bold rounded-lg text-sm uppercase tracking-wider transition-all ${
            isCyan
              ? "bg-neon-cyan text-background shadow-lg shadow-neon-cyan/20 hover:shadow-neon-cyan/40"
              : "bg-neon-magenta text-primary-foreground shadow-lg shadow-neon-magenta/20 hover:shadow-neon-magenta/40"
          }`}
        >
          <FileDown size={16} /> Скачать PDF чек-листа
        </motion.button>
      ) : (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className={`relative rounded-2xl border p-6 max-w-md ${
              isCyan ? "border-neon-cyan/20 bg-neon-cyan/[0.03]" : "border-neon-magenta/20 bg-neon-magenta/[0.03]"
            }`}>
              <button
                onClick={() => setShowForm(false)}
                className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                <X size={14} className="text-foreground/40" />
              </button>

              <div className="flex items-center gap-2 mb-4">
                <FileDown className={`w-5 h-5 ${isCyan ? "text-neon-cyan" : "text-neon-magenta"}`} />
                <h3 className="font-display text-sm font-bold uppercase tracking-wider">Скачать PDF</h3>
              </div>
              <p className="text-xs text-muted-foreground mb-5">
                Оставьте контакт — мы отправим PDF и будем присылать обновления чек-листов.
              </p>

              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="relative">
                  <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/30" />
                  <input
                    type="text"
                    placeholder="Ваше имя *"
                    value={form.name}
                    onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                    required
                    className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-background border border-border text-sm placeholder:text-foreground/25 focus:outline-none focus:border-neon-cyan/40 transition-colors"
                  />
                </div>
                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/30" />
                  <input
                    type="email"
                    placeholder="Email *"
                    value={form.email}
                    onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                    required
                    className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-background border border-border text-sm placeholder:text-foreground/25 focus:outline-none focus:border-neon-cyan/40 transition-colors"
                  />
                </div>
                <div className="relative">
                  <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/30" />
                  <input
                    type="tel"
                    placeholder="Телефон (необязательно)"
                    value={form.phone}
                    onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                    className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-background border border-border text-sm placeholder:text-foreground/25 focus:outline-none focus:border-neon-cyan/40 transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 rounded-lg font-display font-bold text-sm uppercase tracking-wider transition-all disabled:opacity-50 ${
                    isCyan
                      ? "bg-neon-cyan text-background hover:shadow-lg hover:shadow-neon-cyan/30"
                      : "bg-neon-magenta text-primary-foreground hover:shadow-lg hover:shadow-neon-magenta/30"
                  }`}
                >
                  {loading ? "Отправка..." : "Получить PDF"}
                </button>
                <p className="text-[10px] text-foreground/25 text-center">
                  Нажимая кнопку, вы соглашаетесь на обработку персональных данных
                </p>
              </form>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}

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

            {checklist.pdf_url ? (
              <a
                href={checklist.pdf_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 mb-6 border border-neon-cyan/30 bg-neon-cyan/5 text-neon-cyan hover:bg-neon-cyan/10 font-display font-bold text-sm uppercase tracking-wider rounded-lg transition-colors"
              >
                <FileDown size={15} /> Скачать PDF чек-лист
              </a>
            ) : (
              <a
                href="https://t.me/NeuroPravo_Bot?start=checklist"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 mb-6 border border-neon-cyan/30 bg-neon-cyan/5 text-neon-cyan hover:bg-neon-cyan/10 font-display font-bold text-sm uppercase tracking-wider rounded-lg transition-colors"
              >
                <MessageCircle size={15} /> Получить в Telegram
              </a>
            )}

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
              <ChecklistDownloadGate pdfUrl={checklist.pdf_url} checklistTitle={checklist.title} isCyan={isCyan} />
            )}
          </article>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ChecklistPage;
