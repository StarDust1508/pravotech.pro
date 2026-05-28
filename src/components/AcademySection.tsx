import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, BookOpen, X, Sparkles, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { AcademyCourse } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useUserProfile } from "@/hooks/useUserProfile";
import yuridicheskieAspektyHero from "@/assets/hero-image2.png";
import neosvobozhdenieHero from "@/assets/hero-image1.png";
import osparivanieHero from "@/assets/hero-image3.png";
import effektivnayaKomandaHero from "@/assets/hero-image4.png";
import prodazhiHero from "@/assets/hero-image5.png";
import expertyBflHero from "@/assets/hero-image6.png";

// Keyed by slug for slugged courses, by id for slug-less (modal-only) courses
const courseCardBackgrounds: Record<string, string> = {
  "yuridicheskie-aspekty-bfl": yuridicheskieAspektyHero,
  "neosvobozhdenie-ot-obyazatelstv": neosvobozhdenieHero,
  "osparivanie-sdelok": osparivanieHero,
  "effektivnaya-komanda": effektivnayaKomandaHero,
  "prodazhi-yuridicheskih-uslug": prodazhiHero,
  "eksperty-rynka-bfl": expertyBflHero,
  "6b1b4e4d-f049-4411-b339-d4ead206b851": expertyBflHero,
};

const resolveCourseBg = (course: AcademyCourse): string | null =>
  (course.slug && courseCardBackgrounds[course.slug]) || courseCardBackgrounds[course.id] || null;

const trajectoryStages = ["Старт", "Практика", "Рост", "Экспертный"];

const levelAccent: Record<string, "cyan" | "magenta" | "foreground"> = {
  Старт: "cyan",
  Практика: "foreground",
  Рост: "foreground",
  Экспертный: "magenta",
};

const markers = ["Практика, а не теория", "Эксперты рынка БФЛ", "Онлайн · с видеозаписями"];

export const AcademySection = () => {
  const { toast } = useToast();
  const userProfile = useUserProfile();
  const { data: raw = [], isLoading: loading } = useQuery({
    queryKey: ["academy-courses"],
    queryFn: () => api.academy.courses(),
    staleTime: 5 * 60 * 1000,
  });
  const courses = useMemo(
    () => [...raw].sort((a: AcademyCourse, b: AcademyCourse) => a.display_order - b.display_order),
    [raw]
  );
  const [modalCourse, setModalCourse] = useState<AcademyCourse | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!modalCourse) return;
    setSubmitting(true);
    const data = new FormData(e.currentTarget);
    try {
      await api.academy.register({
        name: data.get("name") as string,
        email: data.get("email") as string,
        phone: data.get("phone") as string,
        course_id: modalCourse.id,
        course_title: modalCourse.title,
      });
      toast({ title: "Заявка отправлена!", description: "Менеджер свяжется в ближайшее время." });
      setModalCourse(null);
    } catch {
      toast({ title: "Ошибка отправки", description: "Попробуйте позже.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const firstStartCourse = courses.find((c) => c.level === "Старт");
  const expertCourse = courses.find((c) => c.level === "Экспертный");

  return (
    <section id="academy" className="py-20 scroll-mt-20">
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mb-10"
        >
          <div className="text-neon-magenta text-[10px] font-bold uppercase tracking-[0.3em] mb-4">
            Образовательное направление
          </div>
          <div className="flex items-center gap-3 mb-5">
            <GraduationCap className="w-8 h-8 text-neon-magenta flex-shrink-0" />
            <h2 className="font-display text-3xl md:text-5xl font-black uppercase leading-[1.05]">Академия</h2>
          </div>
          <p className="text-foreground/60 text-base md:text-lg leading-relaxed mb-5">
            Системное обучение для юристов и руководителей практик в сфере банкротства физических лиц — от старта практики до экспертного уровня и масштабирования бизнеса.
          </p>

          {/* Micro-markers */}
          <div className="flex flex-wrap gap-2">
            {markers.map((m, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-full border border-border bg-card/60 backdrop-blur-sm text-xs text-foreground/70"
              >
                {m}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Trajectory strip */}
        {!loading && courses.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex flex-wrap items-center gap-2 md:gap-3 mb-10 pb-8 border-b border-border"
          >
            <span className="text-[10px] uppercase tracking-[0.25em] text-foreground/40 font-bold mr-2 hidden sm:inline">
              Траектория
            </span>
            {trajectoryStages.map((stage, i) => {
              const accent = levelAccent[stage];
              const colorClass =
                accent === "magenta"
                  ? "text-neon-magenta border-neon-magenta/40"
                  : accent === "cyan"
                    ? "text-neon-cyan border-neon-cyan/40"
                    : "text-foreground/70 border-border";
              return (
                <span key={stage} className="flex items-center gap-2 md:gap-3">
                  <span
                    className={`px-3 py-1 rounded-full border bg-card/40 text-xs font-display font-bold uppercase tracking-wider ${colorClass}`}
                  >
                    {stage}
                  </span>
                  {i < trajectoryStages.length - 1 && (
                    <ArrowRight size={14} className="text-foreground/25 flex-shrink-0" />
                  )}
                </span>
              );
            })}
          </motion.div>
        )}

        {loading && <div className="text-center text-muted-foreground py-12">Загрузка курсов...</div>}

        {!loading && courses.length === 0 && (
          <div className="text-center py-12 border border-border rounded-xl bg-card">
            <BookOpen className="w-12 h-12 text-neon-cyan mx-auto mb-4 opacity-60" />
            <p className="font-display text-lg font-bold mb-2">Курсы скоро появятся</p>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">
              Готовим программы от ведущих экспертов отрасли. Следите за обновлениями.
            </p>
          </div>
        )}

        {!loading && courses.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {courses.map((course, i) => {
              const level = course.level || "Курс";
              const accent = levelAccent[level] ?? "foreground";
              const isFlagship = course.id === expertCourse?.id;
              const isRecommendedStart = course.id === firstStartCourse?.id;

              const levelColor =
                accent === "magenta"
                  ? "text-neon-magenta"
                  : accent === "cyan"
                    ? "text-neon-cyan"
                    : "text-foreground/60";

              const ctaColor = isFlagship
                ? "border-neon-magenta text-neon-magenta hover:bg-neon-magenta/10"
                : isRecommendedStart
                  ? "border-neon-cyan text-neon-cyan hover:bg-neon-cyan/10"
                  : "border-foreground/20 text-foreground/80 hover:border-foreground/40 hover:text-foreground";

              const bgImage = resolveCourseBg(course);

              const cardClass = `relative group p-6 rounded-xl bg-card/80 backdrop-blur-sm flex flex-col h-full text-left w-full transition-all overflow-hidden ${
                isFlagship
                  ? "border border-neon-magenta/40 shadow-[0_0_30px_-10px_rgba(255,0,255,0.2)]"
                  : isRecommendedStart
                    ? "border border-neon-cyan/25 hover:border-neon-cyan/50"
                    : "border border-border hover:border-foreground/20"
              }`;

              const cardInner = (
                <>
                  {bgImage && (
                    <>
                      <img
                        src={bgImage}
                        alt=""
                        aria-hidden="true"
                        className="absolute inset-0 w-full h-full object-cover opacity-50 pointer-events-none"
                      />
                      <div className="absolute inset-0 bg-gradient-to-br from-background/55 via-background/65 to-background/85 pointer-events-none" />
                    </>
                  )}
                  {isFlagship && (
                    <div className="absolute inset-0 bg-gradient-to-b from-neon-magenta/[0.06] to-transparent rounded-xl pointer-events-none" />
                  )}

                  <div className="relative flex flex-col flex-1">
                    {/* Top badges row */}
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <span className={`text-[10px] font-bold uppercase tracking-[0.25em] ${levelColor}`}>
                        {level}
                      </span>
                      {isFlagship && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-neon-magenta/10 border border-neon-magenta/40 text-neon-magenta text-[9px] font-black uppercase tracking-[0.2em]">
                          <Sparkles size={10} /> Флагман
                        </span>
                      )}
                      {isRecommendedStart && (
                        <span className="px-2 py-0.5 rounded-full bg-neon-cyan/10 border border-neon-cyan/40 text-neon-cyan text-[9px] font-black uppercase tracking-[0.2em]">
                          С чего начать
                        </span>
                      )}
                    </div>

                    <BookOpen className={`w-7 h-7 flex-shrink-0 mb-3 ${levelColor}`} />

                    <h3 className="font-display text-base md:text-lg font-black mb-2 leading-snug">
                      {course.hero_title || course.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-5 flex-grow leading-relaxed">
                      {course.hero_subtitle || course.description}
                    </p>

                    {/* Meta + price */}
                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-border/60">
                      <span className="text-[11px] uppercase tracking-wider text-foreground/40">
                        Онлайн · Видеозаписи
                      </span>
                      {Number(course.price) > 0 && (
                        <span className="font-display text-lg font-black text-foreground leading-none">
                          {Number(course.price).toLocaleString("ru-RU")} ₽
                        </span>
                      )}
                    </div>

                    <div
                      className={`px-4 py-2.5 border font-display font-bold rounded-lg text-center text-sm uppercase tracking-wider transition-colors ${ctaColor}`}
                    >
                      Подробнее о курсе
                    </div>
                  </div>
                </>
              );

              return (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                >
                  {course.slug ? (
                    <Link to={`/courses/${course.slug}`} className={cardClass}>
                      {cardInner}
                    </Link>
                  ) : (
                    <button type="button" onClick={() => setModalCourse(course)} className={cardClass}>
                      {cardInner}
                    </button>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Telegram bot — course advisor */}
        <a
          href="https://t.me/NeuroPravo_Bot?start=academy"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-10 flex items-center gap-3 px-5 py-3 rounded-xl border border-border bg-card/30 hover:border-foreground/20 transition-colors group"
        >
          <Sparkles size={18} className="text-foreground/40 flex-shrink-0" />
          <span className="text-sm text-foreground/50 group-hover:text-foreground/70 transition-colors">
            Не знаете какой курс выбрать? Спросите бота —{" "}
            <span className="text-foreground/70 font-medium">@NeuroPravo_Bot</span>
          </span>
        </a>
      </div>

      {/* Modal — course registration */}
      <AnimatePresence>
        {modalCourse && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
              onClick={() => setModalCourse(null)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg rounded-2xl border border-neon-magenta/25 bg-card/95 backdrop-blur-xl overflow-hidden max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
              {(() => {
                const modalBg = resolveCourseBg(modalCourse);
                if (!modalBg) return null;
                return (
                  <>
                    <img
                      src={modalBg}
                      alt=""
                      aria-hidden="true"
                      className="absolute inset-0 w-full h-full object-cover object-top opacity-30 pointer-events-none"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-background/70 via-background/80 to-background pointer-events-none" />
                  </>
                );
              })()}
              <div className="absolute top-0 right-0 w-80 h-80 bg-neon-magenta/[0.05] rounded-full blur-3xl pointer-events-none" />

              <button
                onClick={() => setModalCourse(null)}
                className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full border border-border bg-card/80 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
                aria-label="Закрыть"
              >
                <X size={16} />
              </button>

              <div className="relative p-7 md:p-8">
                <div className="text-neon-magenta text-[10px] font-bold uppercase tracking-[0.3em] mb-4">
                  Заявка на курс
                </div>
                <h3 className="font-display text-2xl md:text-3xl font-black mb-2 leading-tight">
                  {modalCourse.hero_title || modalCourse.title}
                </h3>
                <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-5">
                  {modalCourse.hero_subtitle || modalCourse.description}
                </p>

                <div className="flex flex-wrap items-center gap-2 mb-6">
                  {modalCourse.level && (
                    <span className="px-3 py-1 rounded-full border border-neon-magenta/30 bg-neon-magenta/5 text-neon-magenta text-[11px] font-bold uppercase tracking-wider">
                      {modalCourse.level}
                    </span>
                  )}
                  {Number(modalCourse.price) > 0 && (
                    <span className="px-3 py-1 rounded-full border border-neon-cyan/30 bg-neon-cyan/5 text-neon-cyan text-[11px] font-bold uppercase tracking-wider">
                      {Number(modalCourse.price).toLocaleString("ru-RU")} ₽
                    </span>
                  )}
                </div>

                <div className="h-px bg-border/60 mb-6" />

                <p className="text-muted-foreground text-sm leading-relaxed mb-5">
                  Оставьте заявку — менеджер свяжется для обсуждения формата обучения и условий.
                </p>

                <form onSubmit={handleRegister} className="space-y-3.5">
                  <input
                    required
                    name="name"
                    defaultValue={userProfile.name}
                    placeholder="ФИО"
                    className="w-full px-4 py-3 rounded-lg bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-neon-magenta/60 transition-colors text-sm"
                  />
                  <div className="grid md:grid-cols-2 gap-3.5">
                    <input
                      required
                      name="email"
                      type="email"
                      defaultValue={userProfile.email}
                      placeholder="Email"
                      className="w-full px-4 py-3 rounded-lg bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-neon-magenta/60 transition-colors text-sm"
                    />
                    <input
                      required
                      name="phone"
                      type="tel"
                      defaultValue={userProfile.phone}
                      placeholder="Телефон"
                      className="w-full px-4 py-3 rounded-lg bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-neon-magenta/60 transition-colors text-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 bg-neon-magenta text-primary-foreground font-display font-bold rounded-lg hover:bg-neon-magenta/90 transition-colors text-sm uppercase tracking-wider disabled:opacity-50"
                  >
                    {submitting ? "Отправка..." : "Оставить заявку"}
                  </button>

                  <p className="text-[11px] text-foreground/40 text-center leading-relaxed">
                    Отправляя заявку, вы соглашаетесь на обработку персональных данных
                  </p>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
