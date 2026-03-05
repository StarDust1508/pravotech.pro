import { useState } from "react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { Star, Gem, Crown } from "lucide-react";

const tiers = [
  { icon: Star, name: "Серебро", price: "от 300 000 ₽", perks: ["Логотип на сайте", "2 билета", "Упоминание в рассылке"] },
  { icon: Gem, name: "Золото", price: "от 700 000 ₽", perks: ["Стенд 9 м²", "5 билетов", "Выступление 15 мин"] },
  { icon: Crown, name: "Платина", price: "от 1 500 000 ₽", perks: ["Стенд 25 м²", "10 билетов", "Пленарный доклад"] },
];

export const SponsorForm = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({ title: "Заявка отправлена!", description: "Наш менеджер свяжется с вами." });
      (e.target as HTMLFormElement).reset();
    }, 1000);
  };

  return (
    <section id="sponsors" className="py-20 bg-muted/30">
      <div className="container">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="font-display text-3xl md:text-5xl font-black mb-4 uppercase text-center"
        >
          Стать спонсором
        </motion.h2>
        <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
          Усильте присутствие вашего бренда среди ведущих юристов и IT-специалистов
        </p>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {tiers.map((tier, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`p-6 rounded-xl border text-center ${
                i === 2
                  ? "border-neon-magenta bg-gradient-to-b from-card to-background shadow-neon-magenta"
                  : "border-border bg-card"
              }`}
            >
              <tier.icon className={`w-10 h-10 mx-auto mb-3 ${i === 2 ? "text-neon-magenta" : "text-neon-cyan"}`} />
              <h3 className="font-display text-xl font-bold mb-1">{tier.name}</h3>
              <p className="text-neon-cyan font-display font-bold text-lg mb-4">{tier.price}</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {tier.perks.map((p, j) => (
                  <li key={j}>• {p}</li>
                ))}
              </ul>
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
          <h3 className="font-display text-xl font-bold text-neon-magenta mb-4">Заявка на спонсорство</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <input required placeholder="Компания" className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-neon-magenta transition-colors text-sm" />
            <input required placeholder="Контактное лицо" className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-neon-magenta transition-colors text-sm" />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <input required type="email" placeholder="Email" className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-neon-magenta transition-colors text-sm" />
            <select required className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground focus:outline-none focus:border-neon-magenta transition-colors text-sm">
              <option value="">Пакет спонсорства</option>
              <option value="silver">Серебро</option>
              <option value="gold">Золото</option>
              <option value="platinum">Платина</option>
            </select>
          </div>
          <textarea placeholder="Комментарий" rows={3} className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-neon-magenta transition-colors text-sm resize-none" />
          <button type="submit" disabled={loading} className="w-full py-3 bg-neon-magenta text-primary-foreground font-display font-bold rounded-lg shadow-neon-magenta hover:opacity-90 transition-opacity text-sm uppercase tracking-wider disabled:opacity-50">
            {loading ? "Отправка..." : "Стать спонсором"}
          </button>
        </motion.form>
      </div>
    </section>
  );
};
