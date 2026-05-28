import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Bot,
  BrainCircuit,
  GraduationCap,
  Swords,
  Award,
  BarChart3,
  BookOpen,
  CheckSquare,
  FileText,
  CalendarDays,
  Smartphone,
  Sparkles,
  ArrowRight,
  Clock,
  Download,
  Store,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingCubes } from "@/components/FloatingCubes";

/* ── Категории ── */
type Category = "bots" | "education" | "analytics" | "tools" | "events";

const categoryLabels: Record<Category, string> = {
  bots: "Боты",
  education: "Обучение",
  analytics: "Аналитика",
  tools: "Инструменты",
  events: "Мероприятия",
};

const categoryIcons: Record<Category, typeof Bot> = {
  bots: Bot,
  education: GraduationCap,
  analytics: BarChart3,
  tools: CheckSquare,
  events: CalendarDays,
};

interface Product {
  icon: typeof Bot;
  title: string;
  description: string;
  accent: "cyan" | "magenta";
  badge: string;
  category: Category;
  available: boolean;
  link?: string;
  external?: boolean;
  isDownload?: boolean;
}

const products: Product[] = [
  /* ── Боты (cyan) ── */
  {
    icon: BrainCircuit,
    title: "NeuroPravo Bot",
    description:
      "AI-ассистент юриста по БФЛ: книга, чек-листы, консультации",
    accent: "cyan",
    badge: "Бесплатно",
    category: "bots",
    available: true,
    link: "https://t.me/NeuroPravo_Bot",
    external: true,
  },
  {
    icon: Sparkles,
    title: "Бот для работы с ИИ",
    description:
      "Промты, шаблоны и сценарии нейронок для юридической практики",
    accent: "cyan",
    badge: "Скоро",
    category: "bots",
    available: false,
  },
  {
    icon: Swords,
    title: "Бот-задачник",
    description:
      "Ежедневные задачи и кейсы для прокачки навыков юриста по БФЛ",
    accent: "cyan",
    badge: "Скоро",
    category: "bots",
    available: false,
  },

  /* ── Обучение (magenta) ── */
  {
    icon: GraduationCap,
    title: "Академия ТехнологИИ Права",
    description: "Курсы от Старта до Экспертного уровня",
    accent: "magenta",
    badge: "от 4 990 ₽",
    category: "education",
    available: true,
    link: "/academy",
  },
  {
    icon: Swords,
    title: "LegalHunter — AI-тренировки",
    description:
      "Симулятор переговоров с должниками и кредиторами",
    accent: "magenta",
    badge: "Скоро",
    category: "education",
    available: true,
    link: "/platform",
  },
  {
    icon: Award,
    title: "Аттестация юристов",
    description: "250 вопросов + сертификат от СРО «Дело»",
    accent: "magenta",
    badge: "Скоро · 9 990 ₽",
    category: "education",
    available: false,
  },

  /* ── Аналитика (cyan) ── */
  {
    icon: BarChart3,
    title: "Исследования рынка БФЛ",
    description:
      "15 аналитических отчётов с данными Федресурса и ЕФРСБ",
    accent: "cyan",
    badge: "от 1 490 ₽",
    category: "analytics",
    available: true,
    link: "/research",
  },
  {
    icon: BookOpen,
    title: "Книга «Банкротство физлиц»",
    description:
      "117 страниц: от подачи заявления до списания долгов",
    accent: "cyan",
    badge: "Бесплатно",
    category: "analytics",
    available: true,
    link: "/book",
  },

  /* ── Инструменты (magenta) ── */
  {
    icon: CheckSquare,
    title: "Чек-листы юриста",
    description:
      "Интерактивные чек-листы для процедур банкротства",
    accent: "magenta",
    badge: "Бесплатно",
    category: "tools",
    available: true,
    link: "/checklists",
  },
  {
    icon: FileText,
    title: "Шаблоны документов",
    description:
      "Заявления, отзывы, ходатайства для дел по БФЛ",
    accent: "magenta",
    badge: "Скоро",
    category: "tools",
    available: false,
  },

  /* ── Мероприятия (magenta) ── */
  {
    icon: CalendarDays,
    title: "Конференция ТехнологИИ Права",
    description:
      "25-26 сентября 2026, Москва, 80+ спикеров",
    accent: "magenta",
    badge: "от 15 500 ₽",
    category: "events",
    available: true,
    link: "/conference",
  },
  {
    icon: Smartphone,
    title: "Приложение TechForum",
    description:
      "Расписание, нетворкинг, материалы конференции",
    accent: "magenta",
    badge: "Android",
    category: "events",
    available: true,
    link: "/TechForum2026.apk",
    isDownload: true,
  },
];

const tabs: { key: Category | "all"; label: string }[] = [
  { key: "all", label: "Все" },
  { key: "bots", label: "Боты" },
  { key: "education", label: "Обучение" },
  { key: "analytics", label: "Аналитика" },
  { key: "tools", label: "Инструменты" },
  { key: "events", label: "Мероприятия" },
];

export default function ProductsPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [activeTab, setActiveTab] = useState<Category | "all">("all");

  const filtered =
    activeTab === "all"
      ? products
      : products.filter((p) => p.category === activeTab);

  return (
    <div className="min-h-screen bg-background relative">
      <FloatingCubes />
      <Navbar />
      <div className="relative z-10 pt-28 pb-24">
        <div className="container">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mb-12"
          >
            <div className="flex items-center gap-3 mb-4">
              <Store className="w-8 h-8 text-neon-cyan flex-shrink-0" />
              <h1 className="font-display text-3xl md:text-5xl font-black uppercase">
                Маркетплейс продуктов
              </h1>
            </div>
            <p className="text-muted-foreground text-base md:text-lg max-w-2xl">
              Боты, сервисы, обучение и инструменты для юристов по БФЛ
            </p>
          </motion.div>

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex gap-2 mb-10 flex-wrap"
          >
            {tabs.map((tab) => {
              const count =
                tab.key === "all"
                  ? products.length
                  : products.filter((p) => p.category === tab.key).length;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
                    isActive
                      ? "bg-neon-cyan/15 text-neon-cyan border border-neon-cyan/30"
                      : "bg-card/60 text-foreground/50 border border-border hover:border-foreground/20 hover:text-foreground/70"
                  }`}
                >
                  {tab.label}
                  <span
                    className={`ml-2 text-xs ${
                      isActive ? "text-neon-cyan/60" : "text-foreground/30"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </motion.div>

          {/* Category group headers when "all" */}
          {activeTab === "all" ? (
            (Object.keys(categoryLabels) as Category[]).map((catKey) => {
              const catProducts = products.filter(
                (p) => p.category === catKey
              );
              if (catProducts.length === 0) return null;
              const CatIcon = categoryIcons[catKey];
              const isCatCyan =
                catKey === "bots" || catKey === "analytics";
              return (
                <div key={catKey} className="mb-12">
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-3 mb-6"
                  >
                    <CatIcon
                      className={`w-5 h-5 ${
                        isCatCyan
                          ? "text-neon-cyan"
                          : "text-neon-magenta"
                      }`}
                    />
                    <h2 className="font-display text-lg font-bold uppercase tracking-wider text-foreground/80">
                      {categoryLabels[catKey]}
                    </h2>
                    <div
                      className={`flex-1 h-px ${
                        isCatCyan
                          ? "bg-neon-cyan/15"
                          : "bg-neon-magenta/15"
                      }`}
                    />
                  </motion.div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {catProducts.map((p, i) => (
                      <ProductCard key={p.title} product={p} index={i} />
                    ))}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((p, i) => (
                <ProductCard key={p.title} product={p} index={i} />
              ))}
            </div>
          )}

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <div className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl border border-neon-magenta/15 bg-card/60 backdrop-blur-sm">
              <Sparkles className="w-5 h-5 text-neon-magenta/50" />
              <p className="text-sm text-foreground/60">
                Новые продукты появляются каждый месяц.{" "}
                <a
                  href="https://t.me/NeuroPravo_Bot"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neon-magenta hover:text-neon-magenta/80 font-bold transition-colors"
                >
                  Подпишитесь на бота
                </a>
                , чтобы узнать первым.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

/* ── Product Card component ── */
function ProductCard({ product: p, index: i }: { product: Product; index: number }) {
  const isCyan = p.accent === "cyan";
  const dimmed = !p.available;

  const card = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.06 }}
      className={`group relative p-7 rounded-2xl border bg-card/80 backdrop-blur-sm flex flex-col h-full overflow-hidden transition-all hover:shadow-xl ${
        dimmed ? "opacity-60" : ""
      } ${
        isCyan
          ? "border-border hover:border-neon-cyan/40 hover:shadow-neon-cyan/5"
          : "border-border hover:border-neon-magenta/40 hover:shadow-neon-magenta/5"
      }`}
    >
      {/* Top accent line */}
      <div
        className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r transition-all ${
          isCyan
            ? "from-neon-cyan/30 via-neon-cyan/50 to-neon-cyan/30 group-hover:from-neon-cyan/50 group-hover:via-neon-cyan/80 group-hover:to-neon-cyan/50"
            : "from-neon-magenta/30 via-neon-magenta/50 to-neon-magenta/30 group-hover:from-neon-magenta/50 group-hover:via-neon-magenta/80 group-hover:to-neon-magenta/50"
        }`}
      />

      {/* Badge row */}
      <div className="flex items-center gap-2 mb-5">
        <span
          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.15em] ${
            isCyan
              ? "bg-neon-cyan/10 text-neon-cyan/80 border border-neon-cyan/20"
              : "bg-neon-magenta/10 text-neon-magenta/80 border border-neon-magenta/20"
          }`}
        >
          {p.badge}
        </span>
        {!p.available && (
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.15em] bg-amber-500/10 text-amber-400/80 border border-amber-500/20">
            <Clock size={10} />
            Скоро
          </span>
        )}
      </div>

      {/* Icon */}
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all ${
          isCyan
            ? "bg-neon-cyan/10 group-hover:bg-neon-cyan/20 group-hover:shadow-[0_0_20px_rgba(0,255,255,0.15)]"
            : "bg-neon-magenta/10 group-hover:bg-neon-magenta/20 group-hover:shadow-[0_0_20px_rgba(255,51,153,0.15)]"
        }`}
      >
        <p.icon
          className={`w-6 h-6 ${
            isCyan ? "text-neon-cyan" : "text-neon-magenta"
          }`}
        />
      </div>

      {/* Title */}
      <h3 className="font-display text-lg font-black mb-3 leading-snug group-hover:text-foreground transition-colors">
        {p.title}
      </h3>

      {/* Description */}
      <p className="text-muted-foreground text-sm leading-relaxed mb-5 flex-1">
        {p.description}
      </p>

      {/* CTA */}
      <div
        className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
          p.available
            ? isCyan
              ? "bg-neon-cyan/5 group-hover:bg-neon-cyan/10 border border-neon-cyan/10 group-hover:border-neon-cyan/25"
              : "bg-neon-magenta/5 group-hover:bg-neon-magenta/10 border border-neon-magenta/10 group-hover:border-neon-magenta/25"
            : "bg-foreground/[0.02] border border-foreground/[0.06]"
        }`}
      >
        <span
          className={`font-display font-bold text-xs uppercase tracking-wider ${
            p.available
              ? isCyan
                ? "text-neon-cyan/70"
                : "text-neon-magenta/70"
              : "text-foreground/30"
          }`}
        >
          {p.available
            ? p.isDownload
              ? "Скачать"
              : "Открыть"
            : "В разработке"}
        </span>
        {p.available && !p.isDownload && (
          <ArrowRight
            size={14}
            className={`${
              isCyan ? "text-neon-cyan/50" : "text-neon-magenta/50"
            } group-hover:translate-x-1 transition-transform`}
          />
        )}
        {p.available && p.isDownload && (
          <Download
            size={14}
            className={`${
              isCyan ? "text-neon-cyan/50" : "text-neon-magenta/50"
            } group-hover:translate-y-0.5 transition-transform`}
          />
        )}
        {!p.available && (
          <Sparkles size={14} className="text-amber-400/40" />
        )}
      </div>
    </motion.div>
  );

  if (p.available && p.external && p.link) {
    return (
      <a
        href={p.link}
        target="_blank"
        rel="noopener noreferrer"
        className="block h-full"
      >
        {card}
      </a>
    );
  }

  if (p.available && p.isDownload && p.link) {
    return (
      <a href={p.link} download className="block h-full">
        {card}
      </a>
    );
  }

  if (p.available && p.link) {
    return (
      <a href={p.link} className="block h-full">
        {card}
      </a>
    );
  }

  return <div className="block h-full">{card}</div>;
}
