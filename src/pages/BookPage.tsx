import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { BookOpen, Check, Download, CheckCircle2, ArrowRight, Mail, Send } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingCubes } from "@/components/FloatingCubes";
import { TechCard } from "@/components/ui/TechCard";
import { api } from "@/lib/api";
import { usePageMeta } from "@/hooks/usePageMeta";
import { useToast } from "@/hooks/use-toast";
import { useUserProfile } from "@/hooks/useUserProfile";

const parts = [
  { part: "Часть I. Правовые основы", items: ["Что такое банкротство физлица", "Законодательная база и судебная практика", "Виды банкротства", "Признаки неплатёжеспособности и обязанность подать заявление"] },
  { part: "Часть II. Подготовка к процедуре", items: ["Альтернативы банкротству", "Сбор и подготовка документов", "Рисковые действия и оспаримание сделок"] },
  { part: "Часть III. Судебная процедура", items: ["Реструктуризация долгов", "Реализация имущества", "Завершение процедуры и списание долгов"] },
  { part: "Часть IV. Внесудебная процедура и новый старт", items: ["Внесудебное банкротство через МФЦ", "Последствия банкротства и жизнь после процедуры"] },
];

const audience = [
  "Тем, кто сам думает о банкротстве и хочет понять процедуру без юридического тумана",
  "Юристам и помощникам — как структурированная база по БФЛ",
  "Тем, кто помогает близким разобраться с долгами",
];

type DeliveryChannel = "email" | "telegram";

const emptyForm = { name: "", email: "", phone: "", telegram: "" };

const BookPage = () => {
  const { toast } = useToast();
  const userProfile = useUserProfile();
  const prefilled = useRef(false);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [form, setForm] = useState(emptyForm);
  const [deliveryChannel, setDeliveryChannel] = useState<DeliveryChannel>("email");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [downloadToken, setDownloadToken] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState<boolean | null>(null);
  const [telegramLink, setTelegramLink] = useState<string | null>(null);

  /* Auto-fill form from user profile */
  useEffect(() => {
    if (prefilled.current) return;
    if (userProfile.name || userProfile.email || userProfile.phone) {
      setForm((prev) => ({
        ...prev,
        name: prev.name || userProfile.name,
        email: prev.email || userProfile.email,
        phone: prev.phone || userProfile.phone,
      }));
      prefilled.current = true;
    }
  }, [userProfile.name, userProfile.email, userProfile.phone]);

  useEffect(() => {
    api.settings.list().then(setSettings).catch(() => {});
  }, []);

  const title = settings.book_title || "Банкротство физических лиц";
  const author = settings.book_author || "";
  const subtitle =
    settings.book_subtitle ||
    `Практическое руководство для должника и специалиста. Перепроверенная редакция: ${new Date().getFullYear()} год.`;
  const coverUrl = settings.book_cover_url || "";
  const buyUrl = settings.book_cta_url || "";
  const ctaText = settings.book_cta_text || "Получить книгу";

  usePageMeta({
    title: `${title} — книга по БФЛ`,
    description: subtitle,
    ogImage: coverUrl || undefined,
    canonicalPath: "/book",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const result = await api.leads.submitResearch({
        ...form,
        research_id: "book",
        research_title: title,
        source_form: "book",
        delivery_channel: deliveryChannel,
      }) as Record<string, unknown>;

      // Capture delivery data from the API response
      if (result.downloadToken && typeof result.downloadToken === "string") {
        setDownloadToken(result.downloadToken);
      }
      if (typeof result.emailSent === "boolean") {
        setEmailSent(result.emailSent);
      }
      if (result.telegramLink && typeof result.telegramLink === "string") {
        setTelegramLink(result.telegramLink);
      }

      setSubmitted(true);
    } catch {
      toast({ title: "Ошибка", description: "Не удалось отправить заявку. Попробуйте снова.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const Cover = () => (
    coverUrl ? (
      <img src={coverUrl} alt={title} className="w-full max-w-sm mx-auto rounded-xl border border-border shadow-2xl shadow-black/40" />
    ) : (
      <div className="relative w-full max-w-sm mx-auto" style={{ perspective: "1200px" }}>
        {/* 3D tilt wrapper */}
        <motion.div
          initial={{ rotateY: 8, rotateX: -2 }}
          animate={{ rotateY: 4, rotateX: -1 }}
          whileHover={{ rotateY: 0, rotateX: 0, scale: 1.02 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative aspect-[3/4] rounded-xl overflow-hidden"
          style={{ transformStyle: "preserve-3d", boxShadow: "0 25px 80px -20px rgba(0,0,0,0.8), -8px 0 30px -10px rgba(0,255,255,0.1), 8px 0 30px -10px rgba(255,0,255,0.08)" }}
        >
          {/* Base background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#080e18] via-[#0c1828] to-[#0a0f1a]" />

          {/* Ambient glows */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_20%,rgba(0,255,255,0.15),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_80%,rgba(255,0,255,0.1),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,255,0.04),transparent_70%)]" />

          {/* Circuit pattern texture */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: `
              linear-gradient(rgba(0,255,255,0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,255,255,0.3) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }} />

          {/* Spine with depth */}
          <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-b from-neon-cyan/50 via-[#0d1520] to-neon-magenta/40 shadow-[2px_0_8px_rgba(0,0,0,0.5)]" />
          <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-neon-cyan/20 via-white/[0.04] to-neon-magenta/15" />

          {/* Border frame — double */}
          <div className="absolute inset-0 rounded-xl border border-white/[0.12]" />
          <div className="absolute inset-[6px] rounded-lg border border-white/[0.04]" />

          {/* Top edge glow */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-neon-cyan/60 via-neon-cyan/20 to-neon-magenta/40" />
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-neon-magenta/40 via-neon-magenta/15 to-neon-cyan/30" />

          {/* Diagonal accent line */}
          <div className="absolute top-0 right-0 w-[200px] h-[200px] overflow-hidden pointer-events-none">
            <div className="absolute top-[30px] right-[-60px] w-[250px] h-px bg-gradient-to-r from-transparent via-neon-cyan/25 to-transparent rotate-[-35deg]" />
            <div className="absolute top-[50px] right-[-60px] w-[250px] h-px bg-gradient-to-r from-transparent via-neon-cyan/10 to-transparent rotate-[-35deg]" />
          </div>

          {/* Geometric accents */}
          <div className="absolute top-10 right-7 w-20 h-20 border border-neon-cyan/10 rounded-xl rotate-[15deg]" />
          <div className="absolute top-14 right-11 w-12 h-12 border border-neon-magenta/8 rounded-lg rotate-[30deg]" />
          <div className="absolute bottom-20 right-8 w-6 h-6 border border-neon-cyan/8 rounded rotate-45" />

          {/* Content */}
          <div className="relative h-full flex flex-col justify-between p-8 pl-11">
            {/* Top section */}
            <div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-neon-magenta/15 to-neon-cyan/10 border border-white/[0.08] flex items-center justify-center backdrop-blur-sm shadow-lg shadow-neon-magenta/10">
                <BookOpen className="w-7 h-7 text-neon-magenta" />
              </div>
            </div>

            {/* Title block */}
            <div>
              <div className="w-10 h-[2px] bg-neon-cyan/40 rounded-full mb-4" />
              <h3 className="font-display font-black text-[28px] md:text-[34px] uppercase leading-[1.05] mb-2 tracking-tight">
                <span className="text-white">Банкрот</span><span className="text-white/60">ство</span><br />
                <span className="text-neon-cyan">физических</span><br />
                <span className="text-white">лиц</span>
              </h3>
              {author && <p className="text-[13px] text-foreground/40 mt-2">{author}</p>}
              <div className="flex gap-1 mt-4">
                <div className="w-12 h-[2px] rounded-full bg-neon-magenta/60" />
                <div className="w-6 h-[2px] rounded-full bg-neon-cyan/40" />
                <div className="w-3 h-[2px] rounded-full bg-neon-magenta/25" />
              </div>
            </div>

            {/* Bottom branding */}
            <div className="flex items-end justify-between">
              <div>
                <div className="font-display text-[11px] font-black uppercase tracking-[0.2em]">
                  <span className="text-neon-magenta">Технолог</span><span className="text-neon-cyan">ИИ</span>{" "}
                  <span className="text-neon-magenta">права</span>
                </div>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="text-[9px] text-foreground/25">{new Date().getFullYear()}</span>
                  <span className="w-3 h-px bg-foreground/15" />
                  <span className="text-[9px] text-foreground/25">117 стр.</span>
                  <span className="w-3 h-px bg-foreground/15" />
                  <span className="text-[9px] text-foreground/25">12 глав</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl border border-white/[0.08] bg-gradient-to-br from-white/[0.04] to-transparent flex items-center justify-center">
                <span className="font-display text-[11px] font-black bg-gradient-to-br from-neon-cyan to-neon-magenta bg-clip-text text-transparent">TP</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    )
  );

  return (
    <div className="min-h-screen bg-background relative">
      <FloatingCubes />
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute top-0 right-0 w-[36rem] h-[36rem] bg-neon-magenta/5 rounded-full blur-3xl pointer-events-none" />
        <div className="container relative grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-neon-magenta/30 bg-neon-magenta/10 mb-6">
              <BookOpen className="w-4 h-4 text-neon-magenta" />
              <span className="text-neon-magenta text-xs font-bold uppercase tracking-wider">Книга по банкротству физлиц</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl xl:text-6xl font-black mb-5 uppercase leading-[1.05]">{title}</h1>
            {author && <p className="text-foreground/80 text-base mb-4">{author}</p>}
            <p className="text-muted-foreground text-lg mb-8 max-w-xl">{subtitle}</p>
            <div className="flex flex-wrap gap-4">
              <a href="#get" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-neon-magenta text-primary-foreground font-display font-bold rounded-lg shadow-neon-magenta hover:opacity-90 transition-opacity text-sm uppercase tracking-wider">
                {ctaText} <ArrowRight size={16} />
              </a>
              {buyUrl && (
                <a href={buyUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 border border-neon-cyan text-neon-cyan font-display font-bold rounded-lg hover:bg-accent/10 transition-colors text-sm uppercase tracking-wider">
                  Купить
                </a>
              )}
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.1 }}>
            <Cover />
          </motion.div>
        </div>
      </section>

      {/* О книге + Получить книгу */}
      <section id="get" className="py-16 border-y border-border bg-muted/20">
        <div className="container">
          <div className="grid lg:grid-cols-[1fr_480px] gap-10 items-start">
            {/* Left — about */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className="text-neon-magenta text-[10px] font-bold uppercase tracking-[0.3em] mb-4">
                О книге
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-black mb-6 uppercase leading-[1.05]">
                Пошаговая карта<br />
                <span className="text-neon-magenta">банкротства</span> физлиц
              </h2>
              <div className="text-foreground/70 text-base md:text-lg leading-relaxed space-y-4 mb-8">
                <p>Книга выстроена как маршрут: от первых признаков неплатёжеспособности — через выбор процедуры, подготовку документов и судебные стадии — до завершения дела и списания долгов.</p>
                <p>Для должника это понятный навигатор без юридического тумана. Для практикующего юриста — структурированный чек-лист: какие вопросы задать клиенту, где скрыты риски, какие формулировки критичны.</p>
              </div>

              {/* Для кого */}
              <div className="mb-8">
                <h3 className="font-display text-lg font-bold mb-4 uppercase">Для кого</h3>
                <ul className="space-y-3">
                  {audience.map((a, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check size={18} className="text-neon-magenta flex-shrink-0 mt-0.5" />
                      <span className="text-foreground/80 text-sm leading-relaxed">{a}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-6">
                {[
                  { value: "117", label: "страниц" },
                  { value: "4", label: "части" },
                  { value: "12", label: "глав" },
                ].map((s, i) => (
                  <div key={i} className="flex items-baseline gap-2">
                    <span className="font-display text-2xl font-black text-neon-cyan">{s.value}</span>
                    <span className="text-muted-foreground text-xs uppercase tracking-wider">{s.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right — form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl border border-neon-cyan/25 bg-card/80 backdrop-blur-sm overflow-hidden"
            >
              <div className="h-[2px] bg-gradient-to-r from-neon-cyan/60 via-neon-cyan/20 to-transparent" />

              <div className="p-8 md:p-10">
                {submitted ? (
                  <div className="text-center py-6">
                    <CheckCircle2 className="w-12 h-12 text-neon-magenta mx-auto mb-4" />
                    <h3 className="font-display text-xl font-bold mb-2">Спасибо!</h3>
                    <p className="text-muted-foreground text-sm mb-6">
                      {deliveryChannel === "email" && emailSent === true
                        ? `Книга «${title}» отправлена на ваш email. Вы также можете скачать её прямо сейчас.`
                        : deliveryChannel === "email" && emailSent === false
                        ? `Email не удалось отправить — скачайте книгу «${title}» по ссылке ниже.`
                        : deliveryChannel === "telegram"
                        ? `Книга «${title}» готова. Получите её через нашего Telegram-бота или скачайте прямо сейчас.`
                        : `Книга «${title}» готова к скачиванию.`
                      }
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                      {/* Token-based download button (always shown as fallback) */}
                      {downloadToken && (
                        <a
                          href={`${import.meta.env.VITE_API_URL || '/api'}/downloads/${downloadToken}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-2 px-7 py-3 bg-neon-magenta text-primary-foreground font-display font-bold rounded-lg shadow-neon-magenta hover:opacity-90 transition-opacity text-sm uppercase tracking-wider"
                        >
                          <Download size={16} /> Скачать книгу
                        </a>
                      )}
                      {/* Telegram deep link with lead-specific ID */}
                      {deliveryChannel === "telegram" && (
                        <a
                          href={telegramLink || "https://t.me/NeuroPravo_Bot?start=book"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-2 px-7 py-3 border border-neon-cyan text-neon-cyan font-display font-bold rounded-lg hover:bg-neon-cyan/10 transition-colors text-sm uppercase tracking-wider"
                        >
                          <Send size={16} /> Получить в Telegram
                        </a>
                      )}
                    </div>

                    {!downloadToken && deliveryChannel === "email" && (
                      <p className="text-sm text-muted-foreground mt-4">Файл готовится — мы пришлём его на ваш email.</p>
                    )}
                    {downloadToken && (
                      <p className="text-xs text-foreground/30 mt-4">Ссылка для скачивания действительна 24 часа</p>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="mb-6">
                      <div className="text-neon-cyan text-[10px] font-bold uppercase tracking-[0.25em] mb-3">
                        Безоплатно
                      </div>
                      <h3 className="font-display text-xl md:text-2xl font-black mb-2 leading-tight">
                        {ctaText}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        Оставьте контакты — получите книгу и подборку материалов по банкротству.
                      </p>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-3.5">
                      <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Имя"
                        className="w-full px-4 py-3 rounded-lg bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-neon-magenta/60 transition-colors text-sm" />
                      <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="Email"
                        className="w-full px-4 py-3 rounded-lg bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-neon-magenta/60 transition-colors text-sm" />
                      <div className="grid grid-cols-2 gap-3.5">
                        <input type="tel" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          placeholder="Телефон"
                          className="w-full px-4 py-3 rounded-lg bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-neon-magenta/60 transition-colors text-sm" />
                        <input type="text" value={form.telegram} onChange={(e) => setForm({ ...form, telegram: e.target.value })}
                          placeholder="Telegram"
                          className="w-full px-4 py-3 rounded-lg bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-neon-magenta/60 transition-colors text-sm" />
                      </div>

                      {/* Delivery channel selector */}
                      <div className="pt-1">
                        <p className="text-xs text-muted-foreground mb-2.5">Куда отправить книгу?</p>
                        <div className="grid grid-cols-2 gap-2.5">
                          <button
                            type="button"
                            onClick={() => setDeliveryChannel("email")}
                            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                              deliveryChannel === "email"
                                ? "border-neon-cyan bg-neon-cyan/10 text-neon-cyan"
                                : "border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground/70"
                            }`}
                          >
                            <Mail size={15} />
                            Email
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeliveryChannel("telegram")}
                            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                              deliveryChannel === "telegram"
                                ? "border-neon-cyan bg-neon-cyan/10 text-neon-cyan"
                                : "border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground/70"
                            }`}
                          >
                            <Send size={15} />
                            Telegram
                          </button>
                        </div>
                      </div>

                      <button type="submit" disabled={submitting}
                        className="w-full mt-2 py-3 bg-neon-magenta text-primary-foreground font-display font-bold rounded-lg hover:bg-neon-magenta/90 transition-colors text-sm uppercase tracking-wider disabled:opacity-50">
                        {submitting ? "Отправка..." : ctaText}
                      </button>
                      <p className="text-[11px] text-foreground/40 text-center leading-relaxed">
                        Нажимая кнопку, вы соглашаетесь на обработку персональных данных
                      </p>
                    </form>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Что внутри — реальная структура книги */}
      <section className="py-16">
        <div className="container">
          <h2 className="font-display text-3xl md:text-4xl font-black mb-3 uppercase">Что внутри</h2>
          <p className="text-muted-foreground mb-12">117 страниц · 4 части · 12 глав · приложения с чек-листами и таблицами</p>
          <div className="grid sm:grid-cols-2 gap-5">
            {parts.map((p, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: (i % 2) * 0.06 }}>
                <TechCard spotlightColor="rgba(255,51,153,0.06)" className="h-full">
                  <div className="p-6">
                    <h3 className="font-display text-base font-bold mb-3 leading-snug text-neon-magenta">{p.part}</h3>
                    <ul className="space-y-1.5">
                      {p.items.map((it, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm text-foreground/90">
                          <span className="mt-1.5 w-1 h-1 rounded-full bg-neon-cyan flex-shrink-0" />{it}
                        </li>
                      ))}
                    </ul>
                  </div>
                </TechCard>
              </motion.div>
            ))}
          </div>
          <p className="text-muted-foreground text-sm mt-6">+ Приложения: чек-листы, таблицы, справочник рисков, нормативные источники.</p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BookPage;
