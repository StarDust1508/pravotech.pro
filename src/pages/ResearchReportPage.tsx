import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, Download, FileText } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { api } from "@/lib/api";
import type { ResearchReport } from "@/lib/api";
import { resolveResearchIcon } from "@/lib/researchIcons";
import { ResearchCharts } from "@/components/ResearchCharts";
import { usePageMeta } from "@/hooks/usePageMeta";
import { useToast } from "@/hooks/use-toast";

const emptyForm = { name: "", email: "", phone: "", telegram: "", company: "", position: "" };

const ResearchReportPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { toast } = useToast();

  const [report, setReport] = useState<ResearchReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setNotFound(false);
    api.research
      .report(slug)
      .then((data) => setReport(data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  usePageMeta({
    title: report ? `${report.title} — Исследование БФЛ` : "Исследование",
    description: report?.description || undefined,
    ogImage: report?.cover_image_url || undefined,
    canonicalPath: slug ? `/research/${slug}` : undefined,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!report) return;
    setSubmitting(true);
    try {
      await api.leads.submitResearch({
        ...formData,
        research_id: report.slug,
        research_title: report.title,
        source_form: "research_page",
      });
      setSubmitted(true);
    } catch {
      toast({
        title: "Ошибка",
        description: "Не удалось отправить заявку. Попробуйте снова.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const Icon = resolveResearchIcon(report?.icon);
  const isCyan = report?.accent !== "magenta";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container pt-28 pb-20 max-w-3xl">
        <Link
          to="/#research"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft size={16} /> Все исследования
        </Link>

        {loading ? (
          <div className="space-y-4">
            <div className="h-8 w-40 rounded bg-card animate-pulse" />
            <div className="h-12 w-3/4 rounded bg-card animate-pulse" />
            <div className="h-40 rounded bg-card animate-pulse" />
          </div>
        ) : notFound || !report ? (
          <div className="text-center py-16">
            <FileText className="w-14 h-14 text-muted-foreground mx-auto mb-4" />
            <h1 className="font-display text-2xl font-bold mb-2">Отчёт не найден</h1>
            <p className="text-muted-foreground mb-6">
              Возможно, он ещё не опубликован или ссылка устарела.
            </p>
            <Link
              to="/#research"
              className="px-6 py-3 border border-neon-cyan text-neon-cyan font-display font-bold rounded-lg hover:bg-accent/10 transition-colors text-sm uppercase tracking-wider"
            >
              К списку исследований
            </Link>
          </div>
        ) : (
          <article>
            <div className="flex items-center gap-3 mb-4">
              <Icon className={`w-9 h-9 ${isCyan ? "text-neon-cyan" : "text-neon-magenta"}`} />
              <span className={`text-xs font-bold uppercase tracking-wider ${isCyan ? "text-neon-cyan" : "text-neon-magenta"}`}>
                {report.category}
              </span>
            </div>

            <h1 className="font-display text-3xl md:text-4xl font-black mb-4 uppercase leading-tight">
              {report.title}
            </h1>

            <p className="text-muted-foreground text-base md:text-lg mb-8">
              {report.description}
            </p>

            {report.cover_image_url && (
              <img
                src={report.cover_image_url}
                alt={report.title}
                className="w-full rounded-xl border border-border mb-8"
              />
            )}

            {report.summary && (
              <div className="prose prose-invert max-w-none mb-10 whitespace-pre-line text-foreground/90">
                {report.summary}
              </div>
            )}

            {report.charts && report.charts.length > 0 && (
              <ResearchCharts charts={report.charts} />
            )}

            {/* Гейт: форма получения полного отчёта */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl border border-neon-magenta/30 bg-gradient-to-br from-muted/50 to-background p-6 md:p-8"
            >
              {submitted ? (
                <div className="text-center py-4">
                  <CheckCircle2 className="w-14 h-14 text-neon-cyan mx-auto mb-4" />
                  <h3 className="font-display text-2xl font-bold mb-2">Спасибо!</h3>
                  <p className="text-muted-foreground mb-6">
                    Отчёт «{report.title}» готов. Мы также отправим его на указанный email.
                  </p>
                  {report.pdf_url ? (
                    <a
                      href={report.pdf_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-7 py-3 bg-neon-magenta text-primary-foreground font-display font-bold rounded-lg shadow-neon-magenta hover:opacity-90 transition-opacity text-sm uppercase tracking-wider"
                    >
                      <Download size={16} /> Скачать PDF
                    </a>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Файл готовится к публикации — мы пришлём его на ваш email.
                    </p>
                  )}
                </div>
              ) : (
                <>
                  <h3 className="font-display text-xl font-bold mb-1">Получить полный отчёт</h3>
                  <p className="text-muted-foreground text-sm mb-6">
                    Оставьте контакты — пришлём полную версию исследования.
                  </p>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-1 block">
                          Имя <span className="text-neon-magenta">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-4 py-2.5 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:border-neon-cyan transition-colors"
                          placeholder="Ваше имя"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">
                          Email <span className="text-neon-magenta">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-4 py-2.5 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:border-neon-cyan transition-colors"
                          placeholder="email@example.com"
                        />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-1 block">
                          Телефон <span className="text-neon-magenta">*</span>
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full px-4 py-2.5 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:border-neon-cyan transition-colors"
                          placeholder="+7 (___) ___-__-__"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Telegram</label>
                        <input
                          type="text"
                          value={formData.telegram}
                          onChange={(e) => setFormData({ ...formData, telegram: e.target.value })}
                          className="w-full px-4 py-2.5 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:border-neon-cyan transition-colors"
                          placeholder="@username"
                        />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-1 block">Компания</label>
                        <input
                          type="text"
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                          className="w-full px-4 py-2.5 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:border-neon-cyan transition-colors"
                          placeholder="Название"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Должность</label>
                        <input
                          type="text"
                          value={formData.position}
                          onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                          className="w-full px-4 py-2.5 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:border-neon-cyan transition-colors"
                          placeholder="Должность"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full px-6 py-3 bg-neon-magenta text-primary-foreground font-display font-bold rounded-lg shadow-neon-magenta hover:opacity-90 transition-opacity text-sm uppercase tracking-wider disabled:opacity-50"
                    >
                      {submitting ? "Отправка..." : "Получить отчёт"}
                    </button>
                    <p className="text-xs text-muted-foreground text-center">
                      Нажимая кнопку, вы соглашаетесь на обработку персональных данных
                    </p>
                  </form>
                </>
              )}
            </motion.div>
          </article>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ResearchReportPage;
