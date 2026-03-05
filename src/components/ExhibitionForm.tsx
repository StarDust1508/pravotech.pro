import { useState } from "react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";

export const ExhibitionForm = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = e.target as HTMLFormElement;
    const data = new FormData(form);
    try {
      await api.leads.submitExhibition({
        company_name: data.get("company_name") as string,
        contact_person: data.get("contact_person") as string,
        email: data.get("email") as string,
        phone: data.get("phone") as string,
        stand_size: data.get("stand_size") as string,
        notes: data.get("notes") as string,
      });
      toast({ title: "Заявка отправлена!", description: "Мы свяжемся с вами в ближайшее время." });
      form.reset();
    } catch {
      toast({ title: "Ошибка отправки", description: "Попробуйте позже.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
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
                name="company_name"
                placeholder="Название компании"
                className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-neon-cyan transition-colors text-sm"
              />
              <input
                required
                name="contact_person"
                placeholder="Контактное лицо"
                className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-neon-cyan transition-colors text-sm"
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <input
                required
                name="email"
                type="email"
                placeholder="Email"
                className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-neon-cyan transition-colors text-sm"
              />
              <input
                required
                name="phone"
                type="tel"
                placeholder="Телефон"
                className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-neon-cyan transition-colors text-sm"
              />
            </div>
            <select
              required
              name="stand_size"
              className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground focus:outline-none focus:border-neon-cyan transition-colors text-sm"
            >
              <option value="">Размер стенда</option>
              <option value="small">Малый (4 м²)</option>
              <option value="medium">Средний (9 м²)</option>
              <option value="large">Большой (16 м²)</option>
              <option value="premium">Премиум (25 м²)</option>
            </select>
            <textarea
              name="notes"
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
