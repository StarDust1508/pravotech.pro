import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { Star, Gem, Crown } from "lucide-react";
import { api } from "@/lib/api";
import type { SponsorTier } from "@/lib/api";

const defaultTiers = [
  { 
    icon: Star, 
    name: "Серебро", 
    price: "от 300 000 ₽", 
    perks: [
      "Размещение логотипа на официальном сайте конференции",
      "2 билета на все дни мероприятия",
      "Упоминание в еженедельной email-рассылке 5000+ подписчикам",
      "Размещение в презентации «Партнеры и спонсоры»",
      "Брендирование зоны кофе-брейков (совместно с другими спонсорами)",
      "Доступ к базе контактов участников (по запросу)",
      "Сертификат партнера конференции",
      "Право использования статуса «Партнер Технологии Права 2026»"
    ]
  },
  { 
    icon: Gem, 
    name: "Золото", 
    price: "от 700 000 ₽", 
    perks: [
      "Все преимущества пакета «Серебро»",
      "Выделенный стенд 3×3 м в выставочной зоне",
      "5 билетов на все дни мероприятия + 2 VIP билета",
      "Выступление 15 минут в основной программе",
      "Персональная страница спонсора на сайте с описанием услуг",
      "Эксклюзивное брендирование одной из тематических зон",
      "Размещение баннера 2×3 м в центральном холле",
      "Промо-материалы в welcome bag каждого участника",
      "Возможность проведения мастер-класса или воркшопа",
      "Приоритетный доступ к спискам участников и лидс с мероприятия"
    ]
  },
  { 
    icon: Crown, 
    name: "Платина", 
    price: "от 1 500 000 ₽", 
    perks: [
      "Все преимущества пакета «Золото»",
      "Премиум стенд 5×5 м в лучшей локации выставки",
      "10 билетов + 5 VIP билетов + отдельная VIP-зона",
      "Пленарный доклад 30 минут в прайм-тайм",
      "Статус «Генеральный партнер» — максимальная видимость",
      "Персонализированная сессия с топ-менеджментом целевых компаний",
      "Эксклюзивное брендирование главной сцены и фотозоны",
      "Собственный брендированный networking cocktail",
      "Интеграция логотипа в дизайн бейджей всех участников",
      "Пресс-релиз о партнерстве в отраслевых медиа",
      "Видеопрезентация компании в рамках главной трансляции",
      "Индивидуальная программа встреч с ключевыми участниками"
    ]
  }
];

const iconMap: Record<string, typeof Star> = { Star, Gem, Crown };

export const SponsorForm = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [tiers, setTiers] = useState(defaultTiers);

  useEffect(() => {
    api.sponsors.tiers().then((data: SponsorTier[]) => {
      if (data.length > 0) {
        setTiers(data.map(t => ({
          icon: iconMap[t.icon] || Star,
          name: t.name,
          price: t.price,
          perks: t.perks,
        })));
      }
    }).catch(() => {});
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
    <section id="sponsor-form" className="py-20 bg-muted/30">
      <div className="container">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="font-display text-3xl md:text-5xl font-black mb-4 uppercase text-center"
        >
          Спонсорские <span className="text-neon-magenta">Пакеты</span>
        </motion.h2>
        <p className="text-muted-foreground text-center mb-4 max-w-2xl mx-auto text-lg">
          Станьте частью ключевого события года в сфере правовых технологий
        </p>
        <div className="text-center mb-12 space-y-2">
          <p className="text-neon-cyan font-semibold">
            🎯 <strong>5000+</strong> специалистов • 📈 <strong>300+</strong> компаний • 🚀 <strong>50+</strong> докладов
          </p>
          <p className="text-sm text-muted-foreground">
            📺 <span className="text-neon-magenta">Онлайн-трансляция</span> на 20,000+ зрителей • 
            📱 Освещение в <span className="text-neon-cyan">15+ медиа</span> • 
            💼 <span className="text-yellow-500">B2B-встречи</span> с ключевыми игроками
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {tiers.map((tier, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`p-6 rounded-xl border text-center h-full flex flex-col ${
                i === 2
                  ? "border-neon-magenta bg-gradient-to-b from-card to-background shadow-neon-magenta"
                  : "border-border bg-card"
              }`}
            >
              <div className="flex-shrink-0">
                <tier.icon className={`w-12 h-12 mx-auto mb-4 ${i === 2 ? "text-neon-magenta" : "text-neon-cyan"}`} />
                <h3 className="font-display text-2xl font-bold mb-2">{tier.name}</h3>
                <p className="text-neon-cyan font-display font-bold text-xl mb-6">{tier.price}</p>
              </div>
              
              <div className="flex-1 overflow-hidden">
                <ul className="space-y-3 text-left text-sm leading-relaxed max-h-96 overflow-y-auto custom-scrollbar">
                  {tier.perks.map((perk, j) => (
                    <li key={j} className="flex items-start gap-3">
                      <span className={`flex-shrink-0 w-1.5 h-1.5 rounded-full mt-2 ${i === 2 ? "bg-neon-magenta" : "bg-neon-cyan"}`} />
                      <span className="text-muted-foreground">{perk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.form
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          onSubmit={handleSubmit}
          className="max-w-2xl mx-auto space-y-4 p-8 rounded-xl border border-border bg-card"
        >
          <div className="text-center mb-6">
            <h3 className="font-display text-xl font-bold text-neon-magenta mb-2">Заявка на спонсорство</h3>
            <p className="text-muted-foreground text-sm">
              Заполните форму, и наш менеджер свяжется с вами в течение рабочего дня
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <input required name="company_name" placeholder="Название компании" className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-neon-magenta transition-colors text-sm" />
            <input required name="contact_person" placeholder="Контактное лицо" className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-neon-magenta transition-colors text-sm" />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <input required name="email" type="email" placeholder="Корпоративный email" className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-neon-magenta transition-colors text-sm" />
            <select required name="tier" className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground focus:outline-none focus:border-neon-magenta transition-colors text-sm">
              <option value="">Выберите пакет спонсорства</option>
              <option value="silver">💎 Серебро — от 300 000 ₽</option>
              <option value="gold">🏆 Золото — от 700 000 ₽</option>
              <option value="platinum">👑 Платина — от 1 500 000 ₽</option>
              <option value="custom">🎯 Индивидуальный пакет</option>
            </select>
          </div>
          <textarea name="notes" placeholder="Расскажите о ваших маркетинговых целях и пожеланиях к партнерству..." rows={4} className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-neon-magenta transition-colors text-sm resize-none" />
          <button type="submit" disabled={loading} className="w-full py-3 bg-neon-magenta text-primary-foreground font-display font-bold rounded-lg shadow-neon-magenta hover:opacity-90 transition-opacity text-sm uppercase tracking-wider disabled:opacity-50">
            {loading ? "Отправка..." : "🚀 Стать партнером"}
          </button>
          <p className="text-center text-xs text-muted-foreground">
            Или свяжитесь напрямую: <span className="text-neon-cyan font-semibold">+7 (495) 123-45-67</span> • partnerships@pravo-tech.ru
          </p>
        </motion.form>
        
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 grid md:grid-cols-3 gap-8 max-w-4xl mx-auto"
        >
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-neon-cyan/10 rounded-full flex items-center justify-center">
              <span className="text-2xl text-neon-cyan font-bold">ROI</span>
            </div>
            <h4 className="font-display font-bold mb-2">Высокий ROI</h4>
            <p className="text-sm text-muted-foreground">Средний ROI партнеров прошлой конференции составил <span className="text-neon-cyan font-semibold">320%</span></p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-neon-magenta/10 rounded-full flex items-center justify-center">
              <span className="text-2xl">🎯</span>
            </div>
            <h4 className="font-display font-bold mb-2">Целевая аудитория</h4>
            <p className="text-sm text-muted-foreground">85% участников — лица, принимающие решения о закупке IT-решений</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-neon-cyan/10 rounded-full flex items-center justify-center">
              <span className="text-2xl">📈</span>
            </div>
            <h4 className="font-display font-bold mb-2">Лид-генерация</h4>
            <p className="text-sm text-muted-foreground">В среднем спонсоры получают <span className="text-neon-magenta font-semibold">150+ качественных</span> лидов</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
