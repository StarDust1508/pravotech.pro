import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import {
  Sparkles, ArrowRight, ArrowDown, Check,
  Brain, BookOpenCheck, Award, Database,
  Scale, BotMessageSquare, AlertTriangle,
  Clock, BookX, QrCode, Users, Building2,
  User, Send, Phone, Mail, BadgeCheck,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingCubes } from "@/components/FloatingCubes";
import { TechCard } from "@/components/ui/TechCard";
import { usePageMeta } from "@/hooks/usePageMeta";

/* ────────────────────────────────────────────
   DATA
   ──────────────────────────────────────────── */

const painPoints = [
  {
    icon: BookX,
    title: "Формальные лекции — мимо практики",
    desc: "Управляющий слушает теорию, а потом теряется в реальном деле с живым должником. Между знанием закона и умением применить его — пропасть.",
  },
  {
    icon: Clock,
    title: "24 часа «для галочки»",
    desc: "Повышение квалификации превращается в формальность: прослушал запись, получил бумажку. Навыки не растут — растёт только стопка сертификатов.",
  },
  {
    icon: AlertTriangle,
    title: "Ошибки всплывают в суде",
    desc: "Слабые места управляющего выявляет не аттестация, а арбитражный суд. Цена ошибки — отстранение, убытки, репутационный ущерб.",
  },
];

const features = [
  {
    icon: Brain,
    title: "AI-тренировки",
    desc: "Реалистичные диалоги с должниками — текст и голос. ИИ моделирует поведение: уклонения, агрессию, манипуляции. После каждого ответа — разбор.",
    accent: "cyan" as const,
  },
  {
    icon: BookOpenCheck,
    title: "Интерактивные кейсы",
    desc: "Кейсы из арбитражной практики с ветвящимися сценариями. Каждое решение влияет на исход дела — как в реальном производстве.",
    accent: "magenta" as const,
  },
  {
    icon: Award,
    title: "Модульная аттестация",
    desc: "Тестирование по модулям с выдачей сертификата. QR-код на сертификате позволяет мгновенно проверить подлинность.",
    accent: "cyan" as const,
  },
  {
    icon: Database,
    title: "База знаний + AI-помощник",
    desc: "Встроенная база знаний по ФЗ-127, подзаконным актам и судебной практике. AI-помощник находит ответ за секунды.",
    accent: "magenta" as const,
  },
  {
    icon: Scale,
    title: "Мониторинг ВС РФ",
    desc: "Отслеживание изменений законодательства и позиций Верховного Суда в реальном времени. Уведомления о ключевых изменениях.",
    accent: "cyan" as const,
  },
  {
    icon: BotMessageSquare,
    title: "Telegram-бот",
    desc: "Доступ к тренировкам и базе знаний через Telegram. Учитесь в дороге, между заседаниями, в любое удобное время.",
    accent: "magenta" as const,
  },
];

const plans = [
  {
    icon: User,
    name: "Персональный",
    price: "3 900",
    unit: "₽/мес",
    features: [
      "Полный доступ ко всем модулям",
      "AI-тренировки без ограничений",
      "Сертификат с QR-верификацией",
      "Telegram-бот и веб-доступ",
      "База знаний + AI-помощник",
    ],
    accent: "cyan" as const,
    popular: false,
  },
  {
    icon: Users,
    name: "Команда",
    price: "от 2 900",
    unit: "₽/чел/мес",
    note: "5–10 человек",
    features: [
      "Всё из «Персонального»",
      "Дашборд руководителя",
      "Аналитика прогресса команды",
      "Групповые кейсы и рейтинг",
      "Приоритетная поддержка",
    ],
    accent: "magenta" as const,
    popular: true,
  },
  {
    icon: Building2,
    name: "СРО",
    price: "Индивидуально",
    unit: "",
    note: "от 10 человек",
    features: [
      "Всё из «Команды»",
      "Брендирование сертификатов",
      "Интеграция с системами СРО",
      "Выделенный менеджер",
      "SLA и договор",
    ],
    accent: "cyan" as const,
    popular: false,
  },
];

/* ────────────────────────────────────────────
   CERTIFICATE MOCK (SVG-based)
   ──────────────────────────────────────────── */

function CertificateMock() {
  return (
    <div className="relative mx-auto max-w-lg">
      {/* Glow */}
      <div className="absolute -inset-4 bg-gradient-to-br from-neon-cyan/20 via-transparent to-neon-magenta/20 rounded-3xl blur-2xl pointer-events-none" />
      <div className="relative rounded-2xl border border-neon-cyan/30 bg-gradient-to-br from-card via-background to-card p-8 md:p-10 shadow-2xl shadow-black/40">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 text-neon-cyan text-[10px] font-bold uppercase tracking-[0.3em] mb-3">
            <BadgeCheck size={14} /> LegalHunter
          </div>
          <h3 className="font-display text-xl md:text-2xl font-black uppercase tracking-wider">
            Сертификат
          </h3>
          <p className="text-muted-foreground text-xs mt-1">о повышении квалификации</p>
        </div>

        {/* Body */}
        <div className="border-t border-b border-border/50 py-5 mb-5 space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">ФИО</span>
            <span className="font-medium">Иванов Иван Иванович</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Программа</span>
            <span className="font-medium text-right">ФЗ-127, 24 акад. часа</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Дата выдачи</span>
            <span className="font-medium">27.05.2026</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Рег. номер</span>
            <span className="font-mono text-neon-cyan text-xs">LH-2026-00481</span>
          </div>
        </div>

        {/* QR placeholder */}
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-lg border border-neon-cyan/30 bg-neon-cyan/5 flex items-center justify-center flex-shrink-0">
            <QrCode className="w-10 h-10 text-neon-cyan/60" />
          </div>
          <div className="text-xs text-muted-foreground">
            <p className="font-bold text-foreground mb-1">QR-верификация</p>
            <p>Отсканируйте код для мгновенной проверки подлинности сертификата на сайте LegalHunter.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────
   LEAD FORM
   ──────────────────────────────────────────── */

function LeadForm() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    // Simulate form submission
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 800);
  };

  if (sent) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-2xl border border-neon-cyan/30 bg-card p-10 text-center"
      >
        <div className="w-16 h-16 rounded-full bg-neon-cyan/10 border border-neon-cyan/30 flex items-center justify-center mx-auto mb-5">
          <Check className="w-8 h-8 text-neon-cyan" />
        </div>
        <h3 className="font-display text-2xl font-black uppercase mb-3">Заявка отправлена</h3>
        <p className="text-muted-foreground">Мы свяжемся с вами в течение рабочего дня.</p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-card p-8 md:p-10 space-y-5">
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block">Имя</label>
        <input
          type="text"
          required
          placeholder="Иван Иванов"
          className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground/40 focus:outline-none focus:border-neon-cyan/50 focus:ring-1 focus:ring-neon-cyan/20 transition-colors"
        />
      </div>
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block">Email</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" />
          <input
            type="email"
            required
            placeholder="ivan@example.com"
            className="w-full rounded-lg border border-border bg-background pl-10 pr-4 py-3 text-sm placeholder:text-muted-foreground/40 focus:outline-none focus:border-neon-cyan/50 focus:ring-1 focus:ring-neon-cyan/20 transition-colors"
          />
        </div>
      </div>
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block">Телефон</label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" />
          <input
            type="tel"
            placeholder="+7 (999) 000-00-00"
            className="w-full rounded-lg border border-border bg-background pl-10 pr-4 py-3 text-sm placeholder:text-muted-foreground/40 focus:outline-none focus:border-neon-cyan/50 focus:ring-1 focus:ring-neon-cyan/20 transition-colors"
          />
        </div>
      </div>
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block">СРО / Компания</label>
        <div className="relative">
          <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" />
          <input
            type="text"
            placeholder="Название СРО или компании"
            className="w-full rounded-lg border border-border bg-background pl-10 pr-4 py-3 text-sm placeholder:text-muted-foreground/40 focus:outline-none focus:border-neon-cyan/50 focus:ring-1 focus:ring-neon-cyan/20 transition-colors"
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full inline-flex items-center justify-center gap-2 bg-neon-cyan text-background font-display font-bold rounded-lg shadow-lg shadow-neon-cyan/20 hover:shadow-neon-cyan/40 transition-all uppercase tracking-wider px-8 py-3.5 text-sm disabled:opacity-60"
      >
        {loading ? "Отправляем..." : "Оставить заявку"}
        {!loading && <Send size={16} />}
      </button>
      <p className="text-[11px] text-muted-foreground/50 text-center">
        Нажимая кнопку, вы соглашаетесь на обработку персональных данных
      </p>
    </form>
  );
}

/* ────────────────────────────────────────────
   PAGE
   ──────────────────────────────────────────── */

const PlatformPage = () => {
  usePageMeta({
    title: "LegalHunter — повышение квалификации по ФЗ-127",
    description: "Образовательная платформа для арбитражных управляющих: AI-тренировки, интерактивные кейсы, модульная аттестация с сертификатом. 24 академических часа по ФЗ-127.",
    canonicalPath: "/platform",
  });

  return (
    <div className="min-h-screen bg-background relative">
      <FloatingCubes />
      <Navbar />

      {/* ═══════════════════════════════════════════════════════════
          HERO
          ═══════════════════════════════════════════════════════════ */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-neon-cyan/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-neon-magenta/5 rounded-full blur-3xl pointer-events-none" />
        <div className="container relative max-w-4xl text-center">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-neon-cyan/30 bg-neon-cyan/10 mb-6">
              <Sparkles className="w-4 h-4 text-neon-cyan" />
              <span className="text-neon-cyan text-xs font-bold uppercase tracking-wider">Образовательная платформа</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl xl:text-6xl font-black mb-6 uppercase leading-[1.04]">
              Legal<span className="text-neon-cyan">Hunter</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-4 max-w-2xl mx-auto font-display uppercase tracking-wide font-bold">
              24 академических часа повышения квалификации по ФЗ-127
            </p>
            <p className="text-muted-foreground text-base md:text-lg mb-10 max-w-2xl mx-auto">
              Тренировки с AI-должниками, интерактивные кейсы из арбитражной практики и модульная аттестация с сертификатом — всё, что нужно арбитражному управляющему для реального роста навыков.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <a href="#lead-form" className="inline-flex items-center justify-center gap-2 bg-neon-cyan text-background font-display font-bold rounded-lg shadow-lg shadow-neon-cyan/20 hover:shadow-neon-cyan/40 transition-shadow uppercase tracking-wider px-8 py-3.5 text-sm">
                Оставить заявку <ArrowRight size={16} />
              </a>
              <a href="#features" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 border border-neon-cyan text-neon-cyan font-display font-bold rounded-lg hover:bg-accent/10 transition-colors text-sm uppercase tracking-wider">
                Подробнее <ArrowDown size={16} />
              </a>
            </div>

            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2"><Check size={15} className="text-neon-cyan" /> Веб-приложение</span>
              <span className="inline-flex items-center gap-2"><Check size={15} className="text-neon-cyan" /> Telegram-бот</span>
              <span className="inline-flex items-center gap-2"><Check size={15} className="text-neon-cyan" /> Сертификат с QR</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          ПРОБЛЕМА
          ═══════════════════════════════════════════════════════════ */}
      <section className="py-20 border-y border-border bg-muted/20">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <p className="text-[11px] font-bold uppercase tracking-[0.35em] text-neon-magenta/60 mb-4">Проблема</p>
            <h2 className="font-display text-3xl md:text-4xl font-black uppercase">
              Почему формальные лекции не работают
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {painPoints.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <TechCard spotlightColor="rgba(255,51,153,0.06)" className="h-full">
                  <div className="p-7">
                    <div className="w-12 h-12 rounded-xl bg-neon-magenta/10 border border-neon-magenta/20 flex items-center justify-center mb-5">
                      <p.icon className="w-6 h-6 text-neon-magenta" />
                    </div>
                    <h3 className="font-display text-base font-bold mb-2">{p.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{p.desc}</p>
                  </div>
                </TechCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          РЕШЕНИЕ — 6 ФИЧЕЙ
          ═══════════════════════════════════════════════════════════ */}
      <section id="features" className="py-20">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <p className="text-[11px] font-bold uppercase tracking-[0.35em] text-neon-cyan/60 mb-4">Решение</p>
            <h2 className="font-display text-3xl md:text-4xl font-black uppercase mb-4">
              Что внутри LegalHunter
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Шесть модулей, которые превращают 24 обязательных часа из формальности в реальный рост квалификации.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => {
              const isCyan = f.accent === "cyan";
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (i % 3) * 0.06 }}
                >
                  <TechCard
                    spotlightColor={isCyan ? "rgba(0,255,255,0.06)" : "rgba(255,51,153,0.06)"}
                    className="h-full"
                  >
                    <div className="p-6">
                      <div className={`w-12 h-12 rounded-xl ${isCyan ? "bg-neon-cyan/10 border-neon-cyan/20" : "bg-neon-magenta/10 border-neon-magenta/20"} border flex items-center justify-center mb-4`}>
                        <f.icon className={`w-6 h-6 ${isCyan ? "text-neon-cyan" : "text-neon-magenta"}`} />
                      </div>
                      <h3 className="font-display text-base font-bold mb-2">{f.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
                    </div>
                  </TechCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          СЕРТИФИКАЦИЯ
          ═══════════════════════════════════════════════════════════ */}
      <section className="py-20 border-y border-border bg-muted/20">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <p className="text-[11px] font-bold uppercase tracking-[0.35em] text-neon-cyan/60 mb-4">Результат обучения</p>
              <h2 className="font-display text-3xl md:text-4xl font-black uppercase mb-5 leading-tight">
                Сертификат с QR-верификацией
              </h2>
              <p className="text-muted-foreground text-base mb-6 max-w-lg">
                После прохождения модульной аттестации вы получаете сертификат о повышении квалификации на 24 академических часа по ФЗ-127. QR-код на сертификате позволяет мгновенно проверить подлинность — достаточно навести камеру.
              </p>
              <ul className="space-y-3 mb-6">
                {[
                  "Уникальный регистрационный номер",
                  "Мгновенная онлайн-верификация по QR-коду",
                  "Соответствие требованиям ФЗ-127 к повышению квалификации",
                  "Электронная и печатная версии",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-foreground/90">
                    <Check size={16} className="text-neon-cyan mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <CertificateMock />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          ТАРИФЫ
          ═══════════════════════════════════════════════════════════ */}
      <section className="py-20">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <p className="text-[11px] font-bold uppercase tracking-[0.35em] text-neon-cyan/60 mb-4">Тарифы</p>
            <h2 className="font-display text-3xl md:text-4xl font-black uppercase mb-4">
              Выберите подходящий план
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Гибкие условия для индивидуальных управляющих, команд и саморегулируемых организаций.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((plan, i) => {
              const isCyan = plan.accent === "cyan";
              const borderClass = plan.popular
                ? "border-neon-magenta/50 shadow-lg shadow-neon-magenta/10"
                : "border-border";
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                >
                  <div className={`relative rounded-2xl border ${borderClass} bg-card p-7 h-full flex flex-col`}>
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-neon-magenta text-background text-[10px] font-bold uppercase tracking-wider rounded-full">
                        Популярный
                      </div>
                    )}
                    <div className={`w-11 h-11 rounded-xl ${isCyan ? "bg-neon-cyan/10 border-neon-cyan/20" : "bg-neon-magenta/10 border-neon-magenta/20"} border flex items-center justify-center mb-5`}>
                      <plan.icon className={`w-5 h-5 ${isCyan ? "text-neon-cyan" : "text-neon-magenta"}`} />
                    </div>
                    <h3 className="font-display text-lg font-bold uppercase tracking-wider mb-1">{plan.name}</h3>
                    {plan.note && <p className="text-xs text-muted-foreground mb-3">{plan.note}</p>}
                    <div className="flex items-baseline gap-1 mb-6">
                      <span className="font-display text-3xl font-black">{plan.price}</span>
                      {plan.unit && <span className="text-sm text-muted-foreground">{plan.unit}</span>}
                    </div>
                    <ul className="space-y-2.5 mb-7 flex-1">
                      {plan.features.map((feat, fi) => (
                        <li key={fi} className="flex items-start gap-2.5 text-sm">
                          <Check size={14} className={`mt-0.5 flex-shrink-0 ${isCyan ? "text-neon-cyan" : "text-neon-magenta"}`} />
                          {feat}
                        </li>
                      ))}
                    </ul>
                    <a
                      href="#lead-form"
                      className={`inline-flex items-center justify-center gap-2 w-full py-3 rounded-lg font-display font-bold text-sm uppercase tracking-wider transition-all ${
                        plan.popular
                          ? "bg-neon-magenta text-background shadow-lg shadow-neon-magenta/20 hover:shadow-neon-magenta/40"
                          : "border border-border text-foreground hover:border-neon-cyan/50 hover:text-neon-cyan"
                      }`}
                    >
                      Оставить заявку
                    </a>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          CTA + ФОРМА ЗАЯВКИ
          ═══════════════════════════════════════════════════════════ */}
      <section id="lead-form" className="py-20 border-t border-border bg-muted/20">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-start max-w-5xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="font-display text-3xl md:text-4xl font-black uppercase mb-5 leading-tight">
                Начните обучение команды уже сегодня
              </h2>
              <p className="text-muted-foreground text-base mb-8 max-w-lg">
                Оставьте заявку — мы свяжемся в течение рабочего дня, подберём тариф и предоставим демо-доступ к платформе.
              </p>
              <div className="space-y-4 text-sm">
                {[
                  "Демо-доступ к платформе",
                  "Индивидуальный подбор тарифа",
                  "Помощь с интеграцией для СРО",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-foreground/80">
                    <div className="w-8 h-8 rounded-lg bg-neon-cyan/10 border border-neon-cyan/20 flex items-center justify-center flex-shrink-0">
                      <Check size={14} className="text-neon-cyan" />
                    </div>
                    {item}
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
              <LeadForm />
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PlatformPage;
