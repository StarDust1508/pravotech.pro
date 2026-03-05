import { useState } from "react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

export const ExhibitionForm = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({ title: "Заявка отправлена!", description: "Мы свяжемся с вами в ближайшее время." });
      (e.target as HTMLFormElement).reset();
    }, 1000);
  };

  return (
    <section id="exhibition" className="py-20">
      <div className="container">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <h2 className="font-display text-3xl md:text-5xl font-black mb-4 uppercase text-center">
            Выставка
          </h2>
          <p className="text-muted-foreground text-center mb-10">
            Забронируйте стенд и представьте свой продукт 1500+ участникам конференции
          </p>

          <form onSubmit={handleSubmit} className="space-y-4 p-8 rounded-xl border border-border bg-card">
            <h3 className="font-display text-xl font-bold text-neon-cyan mb-4">Забронировать стенд</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <input
                required
                placeholder="Название компании"
                className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-neon-cyan transition-colors text-sm"
              />
              <input
                required
                placeholder="Контактное лицо"
                className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-neon-cyan transition-colors text-sm"
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <input
                required
                type="email"
                placeholder="Email"
                className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-neon-cyan transition-colors text-sm"
              />
              <input
                required
                type="tel"
                placeholder="Телефон"
                className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-neon-cyan transition-colors text-sm"
              />
            </div>
            <select
              required
              className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground focus:outline-none focus:border-neon-cyan transition-colors text-sm"
            >
              <option value="">Размер стенда</option>
              <option value="small">Малый (4 м²)</option>
              <option value="medium">Средний (9 м²)</option>
              <option value="large">Большой (16 м²)</option>
              <option value="premium">Премиум (25 м²)</option>
            </select>
            <textarea
              placeholder="Дополнительные пожелания"
              rows={3}
              className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-neon-cyan transition-colors text-sm resize-none"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-neon-cyan text-accent-foreground font-display font-bold rounded-lg shadow-neon-cyan hover:opacity-90 transition-opacity text-sm uppercase tracking-wider disabled:opacity-50"
            >
              {loading ? "Отправка..." : "Отправить заявку"}
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
};
