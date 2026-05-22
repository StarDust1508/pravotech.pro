import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Sparkles, ArrowRight, ArrowDown, Check, Monitor,
  GraduationCap, FileText, PhoneCall, MessageSquareWarning,
  ShieldCheck, Users, Layers,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingCubes } from "@/components/FloatingCubes";
import { TechCard } from "@/components/ui/TechCard";
import { api } from "@/lib/api";
import { usePageMeta } from "@/hooks/usePageMeta";

const bento = [
  { icon: GraduationCap, title: "Экзамены и тесты", desc: "Объективный балл по темам банкротства — готовность видно по цифрам." },
  { icon: FileText, title: "Кейсы и сценарии", desc: "Отработка ведения дела по шагам на готовых кейсах." },
  { icon: PhoneCall, title: "Скрипты и звонки", desc: "Тренажёр телефонного разговора и квалификации заявки." },
  { icon: MessageSquareWarning, title: "Возражения", desc: "Частые возражения клиента и отработанные ответы на них." },
  { icon: Users, title: "Роли команды", desc: "Сотрудник, руководитель, администратор — у каждого свой контур." },
  { icon: ShieldCheck, title: "Безопасность", desc: "Серверная авторизация, сессии и права доступа — не бутафория." },
];

const outcomes = [
  { metric: "Быстрее", title: "Онбординг новичка", desc: "Новый сотрудник набивает руку на симуляторе и выходит к клиентам уже готовым." },
  { metric: "Меньше", title: "Ошибок в делах", desc: "Слабые темы видны и закрываются раньше, чем станут проблемой в суде." },
  { metric: "Выше", title: "Доходимость клиента", desc: "Уверенный разговор и работа с возражениями поднимают конверсию из заявки в договор." },
];

const heroBullets = [
  "Новичок тренируется на симуляторе, а не сливает живых клиентов",
  "Слабые темы видны по цифрам — не по проигранным делам",
  "Руководитель контролирует прогресс, а не догадывается",
];

function ScreenshotPlaceholder({ imageUrl, label }: { imageUrl?: string; label: string }) {
  if (imageUrl) {
    return (
      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-2xl shadow-black/40">
        <img src={imageUrl} alt={label} className="w-full aspect-[16/9] object-cover" />
      </div>
    );
  }

  return (
    <div className="rounded-xl border-2 border-dashed border-border bg-gradient-to-br from-neon-cyan/5 via-background to-neon-magenta/5 overflow-hidden shadow-2xl shadow-black/40 aspect-[16/9] flex flex-col items-center justify-center gap-3">
      <div className="w-14 h-14 rounded-2xl bg-neon-cyan/10 border border-neon-cyan/20 flex items-center justify-center">
        <Monitor className="w-7 h-7 text-neon-cyan/60" />
      </div>
      <span className="text-sm text-muted-foreground/60 font-medium">{label}</span>
    </div>
  );
}

const PlatformPage = () => {
  const [settings, setSettings] = useState<Record<string, string>>({});

  useEffect(() => {
    api.settings.list().then(setSettings).catch(() => {});
  }, []);

  usePageMeta({
    title: "Платформа тренировок и тестов — ТехнологИИ права",
    description: "Тренажёр для команды юристов по банкротству: диалоговые тренировки с ИИ-оценкой, экзамены, разбор слабых тем и аналитика прогресса для руководителя.",
    canonicalPath: "/platform",
  });

  const platformUrl = settings.platform_url || "";
  const heroTitle = settings.platform_title || "Команда учится на симуляторе — не на ваших клиентах";
  const heroSubtitle = settings.platform_subtitle ||
    "Диалоговый тренажёр, экзамены и аналитика навыков для практики банкротства физлиц. Сразу видно, кто готов вести дело, а кому — закрыть слабые темы.";

  const OpenCta = ({ block = false }: { block?: boolean }) =>
    platformUrl ? (
      <a href={platformUrl} target="_blank" rel="noopener noreferrer"
        className={`inline-flex items-center justify-center gap-2 bg-neon-cyan text-background font-display font-bold rounded-lg shadow-neon-cyan hover:opacity-90 transition-opacity uppercase tracking-wider px-8 py-3.5 text-sm ${block ? "w-full sm:w-auto" : ""}`}>
        Открыть платформу <ArrowRight size={16} />
      </a>
    ) : (
      <span className="inline-flex items-center gap-2 px-8 py-3.5 border border-border text-muted-foreground font-display font-bold rounded-lg text-sm uppercase tracking-wider cursor-default">
        Скоро
      </span>
    );

  return (
    <div className="min-h-screen bg-background relative">
      <FloatingCubes />
      <Navbar />

      {/* ═══════════════════════════════════════════════════════════
          СЕКЦИЯ 1: HERO
          ═══════════════════════════════════════════════════════════ */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-neon-cyan/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-neon-magenta/5 rounded-full blur-3xl pointer-events-none" />
        <div className="container relative grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-neon-cyan/30 bg-neon-cyan/10 mb-6">
              <Sparkles className="w-4 h-4 text-neon-cyan" />
              <span className="text-neon-cyan text-xs font-bold uppercase tracking-wider">Платформа тренировок и тестов</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl xl:text-6xl font-black mb-6 uppercase leading-[1.04]">
              {heroTitle}
            </h1>
            <p className="text-muted-foreground text-lg mb-8 max-w-xl">{heroSubtitle}</p>

            {/* 3 bullet-points из бывшей секции Problem */}
            <ul className="space-y-3 mb-8">
              {heroBullets.map((b, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-foreground/90">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-neon-magenta flex-shrink-0" />
                  {b}
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-4">
              <OpenCta />
              <a href="#product" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 border border-neon-cyan text-neon-cyan font-display font-bold rounded-lg hover:bg-accent/10 transition-colors text-sm uppercase tracking-wider">
                Посмотреть, как работает <ArrowDown size={16} />
              </a>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-8 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2"><Check size={15} className="text-neon-cyan" /> ИИ-оценка ответов</span>
              <span className="inline-flex items-center gap-2"><Check size={15} className="text-neon-cyan" /> Аналитика для руководителя</span>
              <span className="inline-flex items-center gap-2"><Check size={15} className="text-neon-cyan" /> Роли и доступы</span>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.96, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
            <ScreenshotPlaceholder
              imageUrl={settings.platform_screenshot_hero || undefined}
              label="Скриншот платформы"
            />
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          СЕКЦИЯ 2: PRODUCT + BENTO
          ═══════════════════════════════════════════════════════════ */}
      <section id="product" className="py-20 border-y border-border bg-muted/20">
        <div className="container space-y-16">
          {/* Два скриншота-мокапа */}
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className="inline-flex items-center gap-2 text-neon-cyan text-xs font-bold uppercase tracking-wider mb-4">
                <Sparkles size={15} /> Тренировка
              </div>
              <h2 className="font-display text-2xl md:text-3xl font-black mb-4 uppercase leading-tight">Реальный диалог с клиентом — и разбор сразу</h2>
              <p className="text-muted-foreground text-sm mb-6">Сотрудник отрабатывает живые ситуации в формате разговора. После каждого ответа — ИИ-оценка с разбором: что сильно, что упустил.</p>
              <ScreenshotPlaceholder
                imageUrl={settings.platform_screenshot_training || undefined}
                label="Скриншот тренировки"
              />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
              <div className="inline-flex items-center gap-2 text-neon-magenta text-xs font-bold uppercase tracking-wider mb-4">
                <Sparkles size={15} /> Аналитика руководителю
              </div>
              <h2 className="font-display text-2xl md:text-3xl font-black mb-4 uppercase leading-tight">Видно, кто готов вести дело</h2>
              <p className="text-muted-foreground text-sm mb-6">Прогресс каждого сотрудника, средний балл и слабые темы команды — на одном экране. Аттестация строится на данных.</p>
              <ScreenshotPlaceholder
                imageUrl={settings.platform_screenshot_dashboard || undefined}
                label="Скриншот дашборда"
              />
            </motion.div>
          </div>

          {/* Bento-карточки */}
          <div>
            <div className="flex items-center gap-2 text-muted-foreground text-xs font-bold uppercase tracking-wider mb-3"><Layers size={15} /> И это ещё не всё</div>
            <h2 className="font-display text-3xl md:text-4xl font-black mb-12 uppercase">Полный тренажёрный контур</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {bento.map((b, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: (i % 3) * 0.06 }}>
                  <TechCard spotlightColor={i % 2 ? "rgba(255,51,153,0.06)" : "rgba(0,255,255,0.06)"} className="h-full">
                    <div className="p-6">
                      <b.icon className={`w-7 h-7 mb-4 ${i % 2 ? "text-neon-magenta" : "text-neon-cyan"}`} />
                      <h3 className="font-display text-base font-bold mb-1.5">{b.title}</h3>
                      <p className="text-muted-foreground text-sm">{b.desc}</p>
                    </div>
                  </TechCard>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          СЕКЦИЯ 3: CTA + OUTCOMES
          ═══════════════════════════════════════════════════════════ */}
      <section className="py-20">
        <div className="container space-y-16">
          {/* Outcomes */}
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-black mb-12 uppercase">Что это даёт практике</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {outcomes.map((o, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                  <TechCard className="h-full">
                    <div className="p-7">
                      <div className="font-display text-xs font-bold uppercase tracking-wider text-neon-cyan mb-2">{o.metric}</div>
                      <h3 className="font-display text-xl font-bold mb-2">{o.title}</h3>
                      <p className="text-muted-foreground text-sm">{o.desc}</p>
                    </div>
                  </TechCard>
                </motion.div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="rounded-3xl border border-neon-cyan/30 bg-gradient-to-br from-muted/60 to-background p-10 md:p-16 text-center relative overflow-hidden">
            <div className="absolute -top-10 right-0 w-80 h-80 bg-neon-cyan/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 left-0 w-72 h-72 bg-neon-magenta/10 rounded-full blur-3xl" />
            <div className="relative">
              <h2 className="font-display text-3xl md:text-5xl font-black mb-5 uppercase leading-tight">Сильная команда — за недели, не за годы</h2>
              <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">Системные тренировки и честная аттестация навыков: меньше ошибок в делах, выше доходимость клиента, быстрее онбординг.</p>
              <div className="flex justify-center"><OpenCta /></div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PlatformPage;
