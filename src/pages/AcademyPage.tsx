import { useEffect } from "react";
import { motion } from "framer-motion";
import {
  GraduationCap,
  TrendingUp,
  Shield,
  Users,
  Clock,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Zap,
  Target,
  Award,
  BookOpen,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { AcademySection } from "@/components/AcademySection";
import { Footer } from "@/components/Footer";
import { FloatingCubes } from "@/components/FloatingCubes";

/* ─── Pain points ─── */
const painPoints = [
  {
    icon: AlertTriangle,
    title: "Ошибки стоят дорого",
    text: "Одна ошибка в процедуре БФЛ — и клиент не освобождается от долгов. Репутация теряется мгновенно.",
  },
  {
    icon: Clock,
    title: "Законы меняются быстрее",
    text: "За 2024–2026 приняли 12 ключевых поправок в закон о банкротстве. Вы уверены, что знаете все?",
  },
  {
    icon: TrendingUp,
    title: "Конкуренция растёт",
    text: "Количество юристов в БФЛ выросло в 3 раза. Выигрывает тот, кто знает больше и работает точнее.",
  },
];

/* ─── Results / benefits ─── */
const benefits = [
  {
    icon: Target,
    metric: "94%",
    label: "клиентов освобождены от долгов",
    sub: "у выпускников академии",
  },
  {
    icon: Users,
    metric: "500+",
    label: "юристов прошли обучение",
    sub: "по всей России",
  },
  {
    icon: Award,
    metric: "12",
    label: "модулей глубокой практики",
    sub: "от действующих экспертов",
  },
  {
    icon: Zap,
    metric: "×3",
    label: "рост дохода практики",
    sub: "в первые 6 месяцев",
  },
];

/* ─── What you get ─── */
const whatYouGet = [
  "Пошаговые алгоритмы каждой процедуры БФЛ",
  "Разбор реальных дел и судебной практики 2024–2026",
  "Шаблоны документов — заявления, ходатайства, жалобы",
  "Стратегии работы с кредиторами и финуправляющим",
  "Навыки продажи юридических услуг по банкротству",
  "Доступ к закрытому сообществу экспертов",
];

export default function AcademyPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background relative">
      <FloatingCubes />
      <Navbar />

      <div className="relative z-10">
        {/* ═══════════════ HERO ═══════════════ */}
        <section className="pt-32 pb-16 md:pt-40 md:pb-20">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl"
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-neon-magenta/30 bg-neon-magenta/5 mb-6">
                <GraduationCap className="w-4 h-4 text-neon-magenta" />
                <span className="text-neon-magenta text-xs font-bold uppercase tracking-[0.2em]">
                  Академия PravоTech
                </span>
              </div>

              {/* Main headline */}
              <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-black uppercase leading-[0.95] mb-6">
                Юристы, которые{" "}
                <span className="text-neon-magenta">зарабатывают</span>
                <br />
                на банкротстве —{" "}
                <span className="text-neon-cyan">учились здесь</span>
              </h1>

              <p className="text-foreground/60 text-lg md:text-xl leading-relaxed max-w-2xl mb-8">
                Единственная образовательная платформа в России, где юристы
                осваивают банкротство физических лиц от первого дела до
                масштабирования практики на миллионы.
              </p>

              {/* CTA row */}
              <div className="flex flex-wrap items-center gap-4">
                <a
                  href="#academy"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-neon-magenta text-primary-foreground font-display font-bold rounded-xl text-base uppercase tracking-wider hover:bg-neon-magenta/90 transition-colors shadow-[0_0_30px_-5px_rgba(255,0,255,0.3)]"
                >
                  Смотреть курсы
                  <ArrowRight className="w-5 h-5" />
                </a>
                <Link
                  to="/conference"
                  className="inline-flex items-center gap-2 px-6 py-4 border border-foreground/20 text-foreground/70 font-display font-bold rounded-xl text-sm uppercase tracking-wider hover:border-neon-cyan/40 hover:text-neon-cyan transition-colors"
                >
                  Конференция · 25 сентября
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ═══════════════ PAIN POINTS ═══════════════ */}
        <section className="py-16 border-t border-border/40">
          <div className="container">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mb-10"
            >
              <h2 className="font-display text-2xl md:text-3xl font-black uppercase mb-2">
                Почему юристу в БФЛ{" "}
                <span className="text-red-400">опасно</span> учиться на своих
                ошибках
              </h2>
              <p className="text-foreground/50 text-base max-w-xl">
                Рынок банкротства не прощает некомпетентности. Вот что происходит
                без системных знаний:
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-5">
              {painPoints.map((p, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-6 rounded-xl border border-red-500/15 bg-red-500/[0.03] hover:border-red-500/30 transition-colors"
                >
                  <p.icon className="w-8 h-8 text-red-400 mb-4" />
                  <h3 className="font-display text-lg font-black mb-2">
                    {p.title}
                  </h3>
                  <p className="text-foreground/55 text-sm leading-relaxed">
                    {p.text}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════ RESULTS / SOCIAL PROOF ═══════════════ */}
        <section className="py-16 border-t border-border/40">
          <div className="container">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="font-display text-2xl md:text-3xl font-black uppercase mb-2">
                Результаты наших выпускников
              </h2>
              <p className="text-foreground/50 text-base">
                Цифры, которые говорят сами за себя
              </p>
            </motion.div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              {benefits.map((b, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="text-center p-6 rounded-xl border border-border bg-card/60 backdrop-blur-sm"
                >
                  <b.icon className="w-6 h-6 text-neon-cyan mx-auto mb-3" />
                  <div className="font-display text-3xl md:text-4xl font-black text-neon-cyan mb-1">
                    {b.metric}
                  </div>
                  <div className="font-display text-sm font-bold mb-1">
                    {b.label}
                  </div>
                  <div className="text-foreground/40 text-xs">{b.sub}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════ WHAT YOU GET ═══════════════ */}
        <section className="py-16 border-t border-border/40">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-10 items-center">
              {/* Left — checklist */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="text-neon-cyan text-[10px] font-bold uppercase tracking-[0.3em] mb-4">
                  Что вы получите
                </div>
                <h2 className="font-display text-2xl md:text-3xl font-black uppercase mb-6">
                  Не теория из учебников —{" "}
                  <span className="text-neon-cyan">рабочие инструменты</span>
                </h2>

                <ul className="space-y-3">
                  {whatYouGet.map((item, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.06 }}
                      className="flex items-start gap-3"
                    >
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span className="text-foreground/80 text-base leading-relaxed">
                        {item}
                      </span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              {/* Right — urgency card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative p-8 rounded-2xl border border-neon-magenta/25 bg-gradient-to-br from-neon-magenta/[0.04] to-transparent"
              >
                <div className="absolute top-0 right-0 w-40 h-40 bg-neon-magenta/[0.06] rounded-full blur-3xl pointer-events-none" />

                <Shield className="w-10 h-10 text-neon-magenta mb-5" />

                <h3 className="font-display text-xl md:text-2xl font-black mb-3 leading-tight">
                  Рынок БФЛ в 2026 году —{" "}
                  <span className="text-neon-magenta">800 000+ дел</span>
                </h3>
                <p className="text-foreground/60 text-base leading-relaxed mb-6">
                  Количество заявлений о банкротстве граждан растёт каждый
                  квартал. Юристы, которые владеют системной методологией,
                  забирают 80% рынка. Остальные — конкурируют за остатки ценой.
                </p>

                <div className="flex flex-wrap gap-3 mb-6">
                  <div className="px-4 py-2 rounded-lg bg-card/60 border border-border">
                    <div className="font-display text-lg font-black text-neon-cyan">
                      +37%
                    </div>
                    <div className="text-foreground/40 text-xs">
                      рост дел за год
                    </div>
                  </div>
                  <div className="px-4 py-2 rounded-lg bg-card/60 border border-border">
                    <div className="font-display text-lg font-black text-neon-magenta">
                      14 900 ₽
                    </div>
                    <div className="text-foreground/40 text-xs">
                      стоимость курса
                    </div>
                  </div>
                  <div className="px-4 py-2 rounded-lg bg-card/60 border border-border">
                    <div className="font-display text-lg font-black text-emerald-400">
                      ×10
                    </div>
                    <div className="text-foreground/40 text-xs">
                      окупаемость с 1 клиента
                    </div>
                  </div>
                </div>

                <a
                  href="#academy"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-neon-magenta text-primary-foreground font-display font-bold rounded-xl text-sm uppercase tracking-wider hover:bg-neon-magenta/90 transition-colors"
                >
                  <BookOpen className="w-4 h-4" />
                  Выбрать курс
                </a>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ═══════════════ COURSES GRID (existing component) ═══════════════ */}
        <AcademySection />

        {/* ═══════════════ BOTTOM CTA ═══════════════ */}
        <section className="py-16 border-t border-border/40">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center max-w-2xl mx-auto"
            >
              <h2 className="font-display text-2xl md:text-4xl font-black uppercase mb-4">
                Не знаешь, с чего начать?
              </h2>
              <p className="text-foreground/55 text-base md:text-lg mb-8 leading-relaxed">
                Напиши нашему боту — он подберёт курс под твой уровень и
                ответит на вопросы за 2 минуты.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <a
                  href="https://t.me/NeuroPravo_Bot"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-[#2AABEE] text-white font-display font-bold rounded-xl text-base uppercase tracking-wider hover:bg-[#2AABEE]/85 transition-colors"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="w-5 h-5 fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                  </svg>
                  Написать боту
                </a>
                <a
                  href="#academy"
                  className="inline-flex items-center gap-2 px-6 py-4 border border-foreground/20 text-foreground/70 font-display font-bold rounded-xl text-sm uppercase tracking-wider hover:border-neon-magenta/40 hover:text-neon-magenta transition-colors"
                >
                  Все курсы ↑
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
