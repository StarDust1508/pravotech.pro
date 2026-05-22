import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { Star, Gem, Crown, Check } from "lucide-react";
import { api } from "@/lib/api";
import type { SponsorTier } from "@/lib/api";

const defaultTiers = [
  {
    icon: Star,
    name: "Серебро",
    price: "от 300 000 ₽",
    perks: [
      "Логотип на сайте и в официальных презентациях",
      "2 билета на все дни мероприятия",
      "Упоминание в email-рассылке (5 000+ подписчиков)",
      "Брендирование зоны кофе-брейков",
      "База контактов участников по запросу",
      "Статус «Партнёр Технологии права 2026»",
    ],
  },
  {
    icon: Gem,
    name: "Золото",
    price: "от 700 000 ₽",
    perks: [
      "Всё из пакета «Серебро»",
      "Выделенный стенд 3×3 м в выставочной зоне",
      "5 билетов + 2 VIP на все дни",
      "Выступление 15 минут в основной программе",
      "Персональная страница спонсора на сайте",
      "Брендирование одной из тематических зон",
      "Промо-материалы в welcome bag участников",
      "Приоритетный доступ к лидам конференции",
    ],
  },
  {
    icon: Crown,
    name: "Платина",
    price: "от 1 500 000 ₽",
    perks: [
      "Всё из пакета «Золото»",
      "Премиум-стенд 5×5 м в лучшей локации",
      "10 билетов + 5 VIP + отдельная VIP-зона",
      "Пленарный доклад 30 минут в прайм-тайм",
      "Статус «Генеральный партнёр» — максимальная видимость",
      "Персональная сессия с ТОП-менеджментом целевых компаний",
      "Брендирование главной сцены и фотозоны",
      "Логотип на бейджах всех участников",
      "Пресс-релиз в отраслевых медиа",
      "Индивидуальная программа деловых встреч",
    ],
  },
];

const tierMeta = [
  { label: "Базовый пакет", accent: "cyan" as const },
  { label: "Расширенный пакет", accent: "cyan" as const },
  { label: "Генеральный партнёр", accent: "magenta" as const, featured: true },
];

const proofStats = [
  { value: "5 000+", label: "Участников" },
  { value: "300+", label: "Компаний" },
  { value: "50+", label: "Докладов" },
  { value: "20 000+", label: "Онлайн-просмотров" },
  { value: "15+", label: "Медиа-партнёров" },
];

const iconMap: Record<string, typeof Star> = { Star, Gem, Crown };

export const SponsorForm = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [tiers, setTiers] = useState(defaultTiers);

  useEffect(() => {
    api.sponsors
      .tiers()
      .then((data: SponsorTier[]) => {
        if (data.length > 0) {
          setTiers(
            data.map((t) => ({
              icon: iconMap[t.icon] || Star,
              name: t.name,
              price: t.price,
              perks: t.perks,
            })),
          );
        }
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = e.target as HTMLFormElement;
    const data = new FormData(form);
    try {
      await api.leads.submitSponsor({
        company_name: data.get("company_name") as string,
        contact_person: data.get("contact_person") as string,
        email: data.get("email") as string,
        tier: data.get("tier") as string,
        notes: data.get("notes") as string,
      });
      toast({ title: "Заявка отправлена!", description: "Наш менеджер свяжется с вами." });
      form.reset();
    } catch {
      toast({ title: "Ошибка отправки", description: "Попробуйте позже.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="sponsor-form" className="py-14 bg-muted/30 scroll-mt-16">
      <div className="container max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mb-12"
        >
          <div className="text-neon-magenta text-[10px] font-bold uppercase tracking-[0.3em] mb-4">
            B2B · Спонсорские пакеты
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-black mb-5 uppercase leading-[1.05]">
            Спонсорское участие
          </h2>
          <p className="text-foreground/60 text-base md:text-lg leading-relaxed">
            Интеграция в отраслевую повестку, доступ к decision-makers юридического рынка и видимость среди ключевых игроков Legal Tech и БФЛ.
          </p>
        </motion.div>

        {/* Proof row — premium */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap items-center gap-x-8 gap-y-4 mb-12 pb-10 border-b border-border"
        >
          {proofStats.map((s, i) => (
            <div key={i} className="flex items-baseline gap-2.5">
              <span className="font-display text-xl md:text-2xl font-black text-neon-cyan leading-none">
                {s.value}
              </span>
              <span className="text-muted-foreground text-[11px] uppercase tracking-wider">{s.label}</span>
            </div>
          ))}
        </motion.div>

        {/* Packages + Form in one grid */}
        <div className="grid md:grid-cols-3 gap-5">
          {tiers.map((tier, i) => {
            const meta = tierMeta[i] ?? tierMeta[0];
            const isFeatured = meta.featured;

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className={`relative flex flex-col p-7 md:p-8 rounded-2xl bg-card/80 backdrop-blur-sm ${
                  isFeatured
                    ? "border border-neon-magenta/50 shadow-[0_0_40px_-10px_rgba(255,0,255,0.25)] lg:-translate-y-2"
                    : "border border-border"
                }`}
              >
                {isFeatured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-neon-magenta text-primary-foreground text-[10px] font-black uppercase tracking-[0.25em] whitespace-nowrap">
                    Генеральный
                  </div>
                )}

                {isFeatured && (
                  <div className="absolute inset-0 bg-gradient-to-b from-neon-magenta/[0.06] to-transparent rounded-2xl pointer-events-none" />
                )}

                <div className="relative flex flex-col flex-1">
                  <div
                    className={`text-[10px] font-bold uppercase tracking-[0.25em] mb-4 ${
                      meta.accent === "magenta" ? "text-neon-magenta" : "text-neon-cyan"
                    }`}
                  >
                    {meta.label}
                  </div>

                  <div className="flex items-center gap-3 mb-2">
                    <tier.icon
                      className={`w-7 h-7 ${meta.accent === "magenta" ? "text-neon-magenta" : "text-neon-cyan"}`}
                    />
                    <h3 className="font-display text-2xl md:text-3xl font-black leading-tight">{tier.name}</h3>
                  </div>

                  <div className="font-display text-lg md:text-xl font-black text-foreground/90 mb-6">
                    {tier.price}
                  </div>

                  <ul className="space-y-3 flex-1">
                    {tier.perks.map((perk, j) => (
                      <li
                        key={j}
                        className="flex items-start gap-2.5 text-sm text-foreground/75 leading-relaxed"
                      >
                        <Check
                          className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                            meta.accent === "magenta" ? "text-neon-magenta" : "text-neon-cyan"
                          }`}
                        />
                        <span>{perk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}

          {/* Form — fills remaining space in the grid */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            onSubmit={handleSubmit}
            className={`relative flex flex-col p-7 md:p-8 rounded-2xl border border-neon-magenta/25 bg-card/80 backdrop-blur-sm overflow-hidden ${
              tiers.length % 3 === 1 ? "md:col-span-2" : tiers.length % 3 === 0 ? "md:col-span-3" : ""
            }`}
          >
          <div className="absolute top-0 right-0 w-64 h-64 bg-neon-magenta/[0.05] rounded-full blur-3xl pointer-events-none" />

          <div className="relative">
            <div className="mb-6">
              <div className="text-neon-magenta text-[10px] font-bold uppercase tracking-[0.25em] mb-3">
                Персональное предложение
              </div>
              <h3 className="font-display text-xl md:text-2xl font-black mb-2 leading-tight">
                Обсудить условия партнёрства
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Под каждый пакет подбираем условия под задачи и маркетинговые цели компании. Менеджер свяжется в течение рабочего дня.
              </p>
            </div>

            <div className="space-y-3.5">
              <div className="grid md:grid-cols-2 gap-3.5">
                <input
                  required
                  name="company_name"
                  placeholder="Название компании"
                  className="w-full px-4 py-3 rounded-lg bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-neon-magenta/60 transition-colors text-sm"
                />
                <input
                  required
                  name="contact_person"
                  placeholder="Контактное лицо"
                  className="w-full px-4 py-3 rounded-lg bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-neon-magenta/60 transition-colors text-sm"
                />
              </div>
              <div className="grid md:grid-cols-2 gap-3.5">
                <input
                  required
                  name="email"
                  type="email"
                  placeholder="Корпоративный email"
                  className="w-full px-4 py-3 rounded-lg bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-neon-magenta/60 transition-colors text-sm"
                />
                <select
                  required
                  name="tier"
                  defaultValue=""
                  className="w-full px-4 py-3 rounded-lg bg-muted/50 border border-border text-foreground focus:outline-none focus:border-neon-magenta/60 transition-colors text-sm"
                >
                  <option value="" disabled>
                    Интересующий пакет
                  </option>
                  {tiers.map((t) => (
                    <option key={t.name} value={t.name}>
                      {t.name} — {t.price}
                    </option>
                  ))}
                  <option value="custom">Индивидуальный пакет</option>
                </select>
              </div>
              <textarea
                name="notes"
                placeholder="Маркетинговые цели и задачи партнёрства"
                rows={4}
                className="w-full px-4 py-3 rounded-lg bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-neon-magenta/60 transition-colors text-sm resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-5 py-3 bg-neon-magenta text-primary-foreground font-display font-bold rounded-lg hover:bg-neon-magenta/90 transition-colors text-sm uppercase tracking-wider disabled:opacity-50"
            >
              {loading ? "Отправка..." : "Обсудить партнёрство"}
            </button>

            <p className="text-[11px] text-foreground/40 mt-4 text-center leading-relaxed">
              Или напрямую:{" "}
              <a href="mailto:pravotechhub@mail.ru" className="text-foreground/60 font-medium hover:text-neon-cyan transition-colors">pravotechhub@mail.ru</a>
            </p>
          </div>
        </motion.form>
        </div>
      </div>
    </section>
  );
};
