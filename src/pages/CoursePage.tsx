import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ChevronDown, ChevronLeft, ChevronRight, GraduationCap, BookOpen, Users, CheckCircle2, Star, X } from "lucide-react";
import { api } from "@/lib/api";
import type { AcademyCourse, AcademyTeacher, AcademyReview } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function CoursePage() {
  const { slug } = useParams<{ slug: string }>();
  const { toast } = useToast();
  const [course, setCourse] = useState<AcademyCourse | null>(null);
  const [teachers, setTeachers] = useState<AcademyTeacher[]>([]);
  const [reviews, setReviews] = useState<AcademyReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [openLesson, setOpenLesson] = useState<number | null>(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [reviewPage, setReviewPage] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formDone, setFormDone] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "" });

  useEffect(() => {
    if (!slug) return;
    const load = async () => {
      setLoading(true);
      try {
        const [c, t, r] = await Promise.all([
          api.academy.course(slug),
          api.academy.teachers(),
          api.academy.reviews(),
        ]);
        setCourse(c);
        setTeachers(t);
        setReviews(r.filter(rv => !rv.course_id || rv.course_id === c.id));
      } catch {
        setCourse(null);
      } finally {
        setLoading(false);
      }
    };
    load();
    window.scrollTo(0, 0);
  }, [slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!course) return;
    setSubmitting(true);
    try {
      await api.academy.register({
        ...form,
        course_id: course.id,
        course_title: course.title,
      });
      setFormDone(true);
    } catch {
      toast({ title: "Ошибка отправки", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const openFormModal = () => {
    setShowForm(true);
    setFormDone(false);
    setForm({ name: "", phone: "", email: "" });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Загрузка курса...</div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <p className="text-xl text-muted-foreground">Курс не найден</p>
        <Link to="/" className="text-neon-cyan hover:underline">Вернуться на главную</Link>
      </div>
    );
  }

  const price = Number(course.price);
  const courseTeachers = course.team_order?.length
    ? course.team_order
        .map(key => {
          // Try UUID match first, then match by last name (lowercase)
          const byId = teachers.find(t => t.id === key);
          if (byId) return byId;
          const k = key.toLowerCase();
          return teachers.find(t => t.full_name.toLowerCase().startsWith(k));
        })
        .filter(Boolean) as AcademyTeacher[]
    : teachers;

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <Link to="/" className="font-display text-lg font-bold">
            <span className="text-neon-cyan">ТЕХНОЛОГ</span><span className="text-neon-magenta">ИИ</span>{" "}
            <span className="text-neon-cyan">ПРАВА</span>
          </Link>
          <Link to="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-neon-cyan transition-colors">
            <ArrowLeft size={16} /> На главную
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-28 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-neon-magenta/5 to-transparent" />
        <div className="container relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-neon-cyan/30 bg-muted/50 backdrop-blur mb-4">
              <GraduationCap size={14} className="text-neon-cyan" />
              <span className="text-xs font-bold uppercase tracking-wider text-neon-cyan">{course.level || "Курс"}</span>
            </div>
            <h1 className="font-display text-3xl md:text-5xl font-black mb-4 leading-tight">
              {course.hero_title || course.title}
            </h1>
            {course.hero_subtitle && (
              <p className="text-lg md:text-xl text-neon-magenta font-display font-bold mb-3">{course.hero_subtitle}</p>
            )}
            {course.hero_description && (
              <p className="text-muted-foreground text-base md:text-lg mb-8 max-w-2xl mx-auto">{course.hero_description}</p>
            )}
            <div className="flex flex-wrap items-center justify-center gap-4">
              <button onClick={openFormModal} className="px-8 py-3 bg-neon-magenta text-primary-foreground font-display font-bold rounded-lg shadow-neon-magenta hover:opacity-90 transition-opacity text-sm uppercase tracking-wider">
                Оставить заявку
              </button>
              {price > 0 && (
                <span className="text-2xl font-display font-bold text-neon-cyan">
                  {price.toLocaleString("ru-RU")} ₽
                </span>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Intro / Description */}
      {(course.intro_title || course.description) && (
        <section className="py-16 border-t border-border">
          <div className="container max-w-3xl">
            {course.intro_title && (
              <h2 className="font-display text-2xl md:text-3xl font-black mb-4">{course.intro_title}</h2>
            )}
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
              {course.intro_description || course.description}
            </p>
          </div>
        </section>
      )}

      {/* Target Audience */}
      {course.target_audience?.length > 0 && (
        <section className="py-16 border-t border-border">
          <div className="container">
            <h2 className="font-display text-2xl md:text-3xl font-black mb-8 uppercase">Для кого этот курс</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {course.target_audience.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-start gap-4 p-5 rounded-xl border border-border bg-card"
                >
                  <Users className="w-6 h-6 text-neon-cyan flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-foreground/80">{item}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Learning Results */}
      {course.learning_results?.length > 0 && (
        <section className="py-16 border-t border-border">
          <div className="container">
            <h2 className="font-display text-2xl md:text-3xl font-black mb-8 uppercase">Что вы получите</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {course.learning_results.map((item: any, i: number) => {
                const title = typeof item === 'string' ? null : item?.title;
                const text = typeof item === 'string' ? item : item?.text || '';
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-start gap-3 p-4 rounded-xl border border-border bg-card"
                  >
                    <CheckCircle2 className="w-5 h-5 text-neon-magenta flex-shrink-0 mt-0.5" />
                    <div>
                      {title && <p className="text-sm font-bold mb-1">{title}</p>}
                      <p className="text-sm text-foreground/80">{text}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Selling Points */}
      {course.selling_points?.length > 0 && (
        <section className="py-16 border-t border-border">
          <div className="container">
            <h2 className="font-display text-2xl md:text-3xl font-black mb-8 uppercase">Что входит в курс</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {course.selling_points.map((item: any, i: number) => {
                const text = typeof item === 'string' ? item : item?.text || item?.title || '';
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-start gap-3 p-4 rounded-xl border border-border bg-card"
                  >
                    <CheckCircle2 className="w-5 h-5 text-neon-cyan flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-foreground/80">{text}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Program / Lessons */}
      {course.lessons?.length > 0 && (
        <section className="py-16 border-t border-border">
          <div className="container max-w-3xl">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-display text-2xl md:text-3xl font-black uppercase">Программа курса</h2>
              {course.program_badge && (
                <span className="text-xs font-bold text-neon-magenta uppercase tracking-wider border border-neon-magenta/30 px-3 py-1 rounded-full">
                  {course.program_badge}
                </span>
              )}
            </div>
            {course.program_format_description && (
              <p className="text-muted-foreground mb-8">{course.program_format_description}</p>
            )}
            <div className="space-y-3">
              {course.lessons.map((lesson, i) => (
                <div key={i} className="border border-border rounded-xl overflow-hidden bg-card">
                  <button
                    onClick={() => setOpenLesson(openLesson === i ? null : i)}
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-muted/30 transition-colors"
                  >
                    <span className="font-display font-bold text-sm pr-4">{lesson.title}</span>
                    <ChevronDown
                      size={18}
                      className={`text-muted-foreground flex-shrink-0 transition-transform ${openLesson === i ? "rotate-180" : ""}`}
                    />
                  </button>
                  <AnimatePresence>
                    {openLesson === i && lesson.points?.length > 0 && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <ul className="px-5 pb-5 space-y-2">
                          {lesson.points.map((pt, j) => (
                            <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                              <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan mt-1.5 flex-shrink-0" />
                              {pt}
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Program Features */}
      {course.program_features?.length > 0 && (
        <section className="py-16 border-t border-border">
          <div className="container">
            <h2 className="font-display text-2xl md:text-3xl font-black mb-8 uppercase text-center">Формат обучения</h2>
            <div className="flex flex-wrap justify-center gap-4">
              {course.program_features.map((f, i) => (
                <div key={i} className="p-5 rounded-xl border border-border bg-card flex items-start gap-3 max-w-sm">
                  <BookOpen className="w-5 h-5 text-neon-cyan flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-foreground/80">{f}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Materials */}
      {course.materials_includes?.length > 0 && (
        <section className="py-16 border-t border-border">
          <div className="container max-w-3xl">
            <h2 className="font-display text-2xl md:text-3xl font-black mb-8 uppercase">Материалы курса</h2>
            <div className="space-y-3">
              {course.materials_includes.map((m, i) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-xl border border-border bg-card">
                  <CheckCircle2 className="w-5 h-5 text-neon-magenta flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-foreground/80">{m}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Practice Tasks */}
      {course.practice_tasks?.length > 0 && (
        <section className="py-16 border-t border-border">
          <div className="container max-w-3xl">
            <h2 className="font-display text-2xl md:text-3xl font-black mb-8 uppercase">Практические задания</h2>
            <div className="space-y-3">
              {course.practice_tasks.map((t: any, i: number) => {
                const text = typeof t === 'string' ? t : t?.text || t?.title || '';
                return (
                  <div key={i} className="flex items-start gap-3 p-4 rounded-xl border border-border bg-card">
                    <span className="w-6 h-6 rounded-full bg-neon-cyan/10 text-neon-cyan text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <p className="text-sm text-foreground/80">{text}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Download Materials Form */}
      {course.download_form_title && (
        <section className="py-16 border-t border-border">
          <div className="container">
            <div className="rounded-2xl border border-neon-cyan/30 bg-gradient-to-br from-muted/50 to-background p-8 md:p-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-neon-cyan/5 rounded-full blur-3xl" />
              <div className="relative grid md:grid-cols-2 gap-8 items-center">
                <div>
                  {course.download_form_banner_url && (
                    <img
                      src={course.download_form_banner_url}
                      alt=""
                      className="rounded-xl mb-4 max-h-48 object-cover w-full"
                    />
                  )}
                </div>
                <div>
                  <h3 className="font-display text-xl md:text-2xl font-bold mb-3">{course.download_form_title}</h3>
                  {course.download_form_description && (
                    <p className="text-muted-foreground text-sm mb-6">{course.download_form_description}</p>
                  )}
                  <button
                    onClick={openFormModal}
                    className="px-8 py-3 bg-neon-cyan text-background font-display font-bold rounded-lg hover:opacity-90 transition-opacity text-sm uppercase tracking-wider"
                  >
                    Получить материалы
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Teachers */}
      {courseTeachers.length > 0 && (
        <section className="py-16 border-t border-border">
          <div className="container">
            <h2 className="font-display text-2xl md:text-3xl font-black mb-8 uppercase">Преподаватели</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {courseTeachers.map((t) => (
                <div key={t.id} className="rounded-xl border border-border bg-card flex flex-col items-center text-center overflow-hidden">
                  {t.photo_url && (
                    <div className="w-full aspect-square overflow-hidden bg-muted/20">
                      <img
                        src={t.photo_url}
                        alt={t.full_name}
                        className="w-full h-full object-cover"
                        style={{ objectPosition: 'center top' }}
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-display font-bold text-sm mb-1">{t.full_name}</h3>
                    <p className="text-xs text-neon-magenta mb-2">{t.position}</p>
                    {t.bio && <p className="text-xs text-muted-foreground">{t.bio}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Reviews */}
      {reviews.length > 0 && (() => {
        const perPage = 3;
        const totalPages = Math.ceil(reviews.length / perPage);
        const visible = reviews.slice(reviewPage * perPage, reviewPage * perPage + perPage);
        return (
          <section className="py-16 border-t border-border">
            <div className="container">
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-display text-2xl md:text-3xl font-black uppercase">Отзывы</h2>
                {totalPages > 1 && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setReviewPage(p => Math.max(0, p - 1))}
                      disabled={reviewPage === 0}
                      className="w-10 h-10 rounded-lg border border-border flex items-center justify-center hover:border-neon-cyan/50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <span className="text-sm text-muted-foreground min-w-[3rem] text-center">
                      {reviewPage + 1} / {totalPages}
                    </span>
                    <button
                      onClick={() => setReviewPage(p => Math.min(totalPages - 1, p + 1))}
                      disabled={reviewPage >= totalPages - 1}
                      className="w-10 h-10 rounded-lg border border-border flex items-center justify-center hover:border-neon-cyan/50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                )}
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {visible.map((r) => (
                  <motion.div
                    key={r.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-6 rounded-xl border border-border bg-card"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      {r.author_avatar_url && (
                        <img src={r.author_avatar_url} alt={r.author_name} className="w-10 h-10 rounded-full object-cover" />
                      )}
                      <div>
                        <p className="font-bold text-sm">{r.author_name}</p>
                        <div className="flex gap-0.5">
                          {Array.from({ length: r.rating }).map((_, i) => (
                            <Star key={i} size={12} className="text-yellow-500 fill-yellow-500" />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{r.comment}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        );
      })()}

      {/* FAQ */}
      {course.faq_items?.length > 0 && (
        <section className="py-16 border-t border-border">
          <div className="container max-w-3xl">
            <h2 className="font-display text-2xl md:text-3xl font-black mb-8 uppercase">Часто задаваемые вопросы</h2>
            <div className="space-y-3">
              {course.faq_items.map((faq, i) => (
                  <div key={i} className="border border-border rounded-xl bg-card overflow-hidden">
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full flex items-center justify-between p-5 text-left hover:bg-muted/30 transition-colors"
                    >
                      <span className="font-display font-bold text-sm pr-4">{faq.question}</span>
                      <ChevronDown size={18} className={`text-muted-foreground flex-shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                    </button>
                    <AnimatePresence>
                      {openFaq === i && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <p className="px-5 pb-5 text-sm text-muted-foreground">{faq.answer}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA / Price */}
      <section className="py-16 border-t border-border">
        <div className="container">
          <div className="rounded-2xl border border-neon-magenta/30 bg-gradient-to-br from-muted/50 to-background p-8 md:p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-neon-magenta/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-neon-cyan/5 rounded-full blur-3xl" />
            <div className="relative z-10">
              <h2 className="font-display text-2xl md:text-3xl font-black mb-3">
                {course.cta_title || "Оставить заявку"}
              </h2>
              {course.cta_description && (
                <p className="text-muted-foreground mb-6 max-w-xl mx-auto">{course.cta_description}</p>
              )}
              {price > 0 && (
                <p className="text-3xl font-display font-bold text-neon-cyan mb-6">
                  {price.toLocaleString("ru-RU")} ₽
                </p>
              )}
              <button onClick={openFormModal} className="px-10 py-3 bg-neon-magenta text-primary-foreground font-display font-bold rounded-lg shadow-neon-magenta hover:opacity-90 transition-opacity text-sm uppercase tracking-wider">
                {course.cta_button_text || "Оставить заявку"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer mini */}
      <footer className="py-8 border-t border-border">
        <div className="container text-center">
          <Link to="/" className="font-display text-lg font-bold">
            <span className="text-neon-cyan">ТЕХНОЛОГ</span><span className="text-neon-magenta">ИИ</span>{" "}
            <span className="text-neon-cyan">ПРАВА</span>
          </Link>
          <p className="text-xs text-muted-foreground mt-2">&copy; 2026 ТехнологИИ права. Все права защищены.</p>
        </div>
      </footer>

      {/* Registration Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setShowForm(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-card border border-border rounded-2xl p-6 md:p-8 max-w-md w-full"
            >
              <button onClick={() => setShowForm(false)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors">
                <X size={20} />
              </button>

              {!formDone ? (
                <>
                  <GraduationCap className="w-8 h-8 text-neon-magenta mb-3" />
                  <h3 className="font-display text-xl font-bold mb-1">Оставить заявку</h3>
                  <p className="text-sm text-muted-foreground mb-6">{course.title}</p>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Имя <span className="text-neon-magenta">*</span></label>
                      <input required type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                        className="w-full px-4 py-2.5 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:border-neon-cyan transition-colors" placeholder="Ваше имя" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Телефон <span className="text-neon-magenta">*</span></label>
                      <input required type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                        className="w-full px-4 py-2.5 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:border-neon-cyan transition-colors" placeholder="+7 (___) ___-__-__" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Email <span className="text-neon-magenta">*</span></label>
                      <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                        className="w-full px-4 py-2.5 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:border-neon-cyan transition-colors" placeholder="email@example.com" />
                    </div>
                    <button type="submit" disabled={submitting}
                      className="w-full px-6 py-3 bg-neon-magenta text-primary-foreground font-display font-bold rounded-lg shadow-neon-magenta hover:opacity-90 transition-opacity text-sm uppercase tracking-wider disabled:opacity-50">
                      {submitting ? "Отправка..." : "Отправить заявку"}
                    </button>
                    <p className="text-xs text-muted-foreground text-center">Нажимая кнопку, вы соглашаетесь на обработку персональных данных</p>
                  </form>
                </>
              ) : (
                <div className="text-center py-4">
                  <CheckCircle2 className="w-14 h-14 text-neon-cyan mx-auto mb-4" />
                  <h3 className="font-display text-xl font-bold mb-2">Заявка отправлена!</h3>
                  <p className="text-muted-foreground text-sm mb-6">Мы свяжемся с вами в ближайшее время для уточнения деталей.</p>
                  <button onClick={() => setShowForm(false)}
                    className="px-6 py-2.5 border border-border text-foreground/70 font-display font-bold rounded-lg hover:border-neon-cyan/50 transition-colors text-sm uppercase tracking-wider">
                    Закрыть
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
