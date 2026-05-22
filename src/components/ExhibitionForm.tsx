import { useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { useUserProfile } from "@/hooks/useUserProfile";

const valueProps = [
  "Презентация продукта профессиональному юридическому рынку",
  "Прямые контакты с ЛПР юрфирм и арбитражными управляющими",
  "Нетворкинг и новые коммерческие связи в отрасли",
  "Узнаваемость бренда в сообществе Legal Tech",
];

export const ExhibitionForm = () => {
  const { toast } = useToast();
  const userProfile = useUserProfile();
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
    <section id="exhibition" className="py-14 scroll-mt-16">
      <div className="container max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid lg:grid-cols-[1fr_1.1fr] gap-10 lg:gap-14 items-start"
        >
          {/* LEFT — Value proposition */}
          <div>
            <div className="text-neon-cyan text-[10px] font-bold uppercase tracking-[0.3em] mb-4">
              B2B · Экспозона конференции
            </div>
            <h2 className="font-display text-3xl md:text-5xl font-black mb-5 uppercase leading-[1.05]">
              Представьте
              <br />
              <span className="text-neon-cyan">продукт</span> рынку
            </h2>
            <p className="text-foreground/60 text-base md:text-lg leading-relaxed mb-8 max-w-lg">
              Экспозона конференции — прямой выход к профессиональному юридическому рынку: юрфирмам, арбитражным управляющим, ТОП-менеджменту и партнёрам отрасли.
            </p>

            {/* Micro stats */}
            <div className="grid grid-cols-3 gap-3 mb-8">
              <div className="p-4 rounded-xl border border-border bg-card/60 backdrop-blur-sm">
                <div className="font-display text-xl md:text-2xl font-black text-neon-cyan leading-none mb-1.5">
                  1 500+
                </div>
                <div className="text-muted-foreground text-[11px] uppercase tracking-wider">Участников</div>
              </div>
              <div className="p-4 rounded-xl border border-border bg-card/60 backdrop-blur-sm">
                <div className="font-display text-xl md:text-2xl font-black text-neon-magenta leading-none mb-1.5">
                  2 дня
                </div>
                <div className="text-muted-foreground text-[11px] uppercase tracking-wider">B2B-контактов</div>
              </div>
              <div className="p-4 rounded-xl border border-border bg-card/60 backdrop-blur-sm">
                <div className="font-display text-xl md:text-2xl font-black text-neon-cyan leading-none mb-1.5">
                  80+
                </div>
                <div className="text-muted-foreground text-[11px] uppercase tracking-wider">Компаний</div>
              </div>
            </div>

            {/* Value bullets */}
            <ul className="space-y-3">
              {valueProps.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm md:text-[15px] text-foreground/75 leading-relaxed">
                  <Check className="w-4 h-4 mt-0.5 flex-shrink-0 text-neon-cyan" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* RIGHT — Form */}
          <form
            onSubmit={handleSubmit}
            className="relative p-7 md:p-8 rounded-2xl border border-neon-cyan/20 bg-card/80 backdrop-blur-sm overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-neon-cyan/[0.04] rounded-full blur-3xl pointer-events-none" />

            <div className="relative">
              <div className="mb-6">
                <div className="text-neon-cyan text-[10px] font-bold uppercase tracking-[0.25em] mb-3">
                  Заявка на участие
                </div>
                <h3 className="font-display text-xl md:text-2xl font-black mb-2 leading-tight">
                  Забронировать место на экспозоне
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Оставьте данные — команда свяжется для подбора формата и обсуждения условий участия.
                </p>
              </div>

              <div className="space-y-3.5">
                <div className="grid md:grid-cols-2 gap-3.5">
                  <input
                    required
                    name="company_name"
                    placeholder="Название компании"
                    className="w-full px-4 py-3 rounded-lg bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-neon-cyan/60 transition-colors text-sm"
                  />
                  <input
                    required
                    name="contact_person"
                    defaultValue={userProfile.name}
                    placeholder="Контактное лицо"
                    className="w-full px-4 py-3 rounded-lg bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-neon-cyan/60 transition-colors text-sm"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-3.5">
                  <input
                    required
                    name="email"
                    type="email"
                    defaultValue={userProfile.email}
                    placeholder="Email"
                    className="w-full px-4 py-3 rounded-lg bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-neon-cyan/60 transition-colors text-sm"
                  />
                  <input
                    required
                    name="phone"
                    type="tel"
                    defaultValue={userProfile.phone}
                    placeholder="Телефон"
                    className="w-full px-4 py-3 rounded-lg bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-neon-cyan/60 transition-colors text-sm"
                  />
                </div>
                <select
                  required
                  name="stand_size"
                  defaultValue=""
                  className="w-full px-4 py-3 rounded-lg bg-muted/50 border border-border text-foreground focus:outline-none focus:border-neon-cyan/60 transition-colors text-sm"
                >
                  <option value="" disabled>
                    Формат участия
                  </option>
                  <option value="small">Малый стенд · 4 м²</option>
                  <option value="medium">Средний стенд · 9 м²</option>
                  <option value="large">Большой стенд · 16 м²</option>
                  <option value="premium">Премиум-стенд · 25 м²</option>
                </select>
                <textarea
                  name="notes"
                  placeholder="Задачи и пожелания по участию"
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-neon-cyan/60 transition-colors text-sm resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-5 py-3 bg-neon-cyan text-accent-foreground font-display font-bold rounded-lg hover:bg-neon-cyan/90 transition-colors text-sm uppercase tracking-wider disabled:opacity-50"
              >
                {loading ? "Отправка..." : "Оставить заявку на участие"}
              </button>

              <p className="text-[11px] text-foreground/40 mt-3 leading-relaxed text-center">
                После заявки менеджер свяжется для подбора формата под задачи компании
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
};
