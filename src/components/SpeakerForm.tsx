import { useState } from "react";
import { motion } from "framer-motion";
import { Users, Sparkles, Mic2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";

const valueItems = [
  {
    icon: Users,
    title: "Аудитория",
    desc: "1 500+ юристов, управляющих и ТОП-менеджеров практик",
  },
  {
    icon: Sparkles,
    title: "Повестка",
    desc: "БФЛ, Legal Tech, ИИ и автоматизация юрбизнеса",
  },
  {
    icon: Mic2,
    title: "Состав",
    desc: "Ведущие эксперты отрасли и представители рынка",
  },
];

export const SpeakerForm = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = e.target as HTMLFormElement;
    const data = new FormData(form);
    try {
      await api.leads.submitSpeaker({
        full_name: data.get("full_name") as string,
        position: data.get("position") as string,
        company: data.get("company") as string,
        email: data.get("email") as string,
        stream: data.get("stream") as string,
        talk_title: data.get("talk_title") as string,
        talk_description: data.get("talk_description") as string,
      });
      toast({ title: "Заявка отправлена!", description: "Программный комитет рассмотрит вашу заявку." });
      form.reset();
    } catch {
      toast({ title: "Ошибка отправки", description: "Попробуйте позже.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="become-speaker" className="py-20 scroll-mt-16">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-10">
            <div className="text-neon-cyan text-[10px] font-bold uppercase tracking-[0.3em] mb-4">
              Программный комитет · Заявка спикера
            </div>
            <h2 className="font-display text-3xl md:text-5xl font-black mb-5 uppercase leading-[1.05]">
              Выступить в программе
            </h2>
            <p className="text-foreground/60 text-base md:text-lg leading-relaxed max-w-xl mx-auto">
              Конференция собирает профессиональное сообщество юридического рынка. Приглашаем экспертов с сильными кейсами, методиками и практическим взглядом на Legal Tech, БФЛ и ИИ.
            </p>
          </div>

          {/* Value layer */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
            {valueItems.map((v, i) => (
              <div
                key={i}
                className="p-4 rounded-xl border border-border bg-card/60 backdrop-blur-sm text-center sm:text-left"
              >
                <v.icon className="w-5 h-5 text-neon-cyan mb-2.5 mx-auto sm:mx-0" />
                <div className="font-display text-sm font-bold mb-1">{v.title}</div>
                <div className="text-muted-foreground text-xs leading-relaxed">{v.desc}</div>
              </div>
            ))}
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="relative p-7 md:p-8 rounded-2xl border border-neon-cyan/20 bg-card/80 backdrop-blur-sm overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-neon-cyan/[0.04] rounded-full blur-3xl pointer-events-none" />

            <div className="relative">
              <div className="mb-6">
                <div className="text-neon-cyan text-[10px] font-bold uppercase tracking-[0.25em] mb-3">
                  Заявка на выступление
                </div>
                <h3 className="font-display text-xl md:text-2xl font-black mb-2 leading-tight">
                  Подать заявку в программу
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Программный комитет рассматривает заявки еженедельно. Приоритет — практическим темам и реальным кейсам.
                </p>
              </div>

              <div className="space-y-3.5">
                <div className="grid md:grid-cols-2 gap-3.5">
                  <input
                    required
                    name="full_name"
                    placeholder="ФИО"
                    className="w-full px-4 py-3 rounded-lg bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-neon-cyan/60 transition-colors text-sm"
                  />
                  <input
                    required
                    name="position"
                    placeholder="Должность"
                    className="w-full px-4 py-3 rounded-lg bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-neon-cyan/60 transition-colors text-sm"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-3.5">
                  <input
                    required
                    name="company"
                    placeholder="Компания"
                    className="w-full px-4 py-3 rounded-lg bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-neon-cyan/60 transition-colors text-sm"
                  />
                  <input
                    required
                    name="email"
                    type="email"
                    placeholder="Email"
                    className="w-full px-4 py-3 rounded-lg bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-neon-cyan/60 transition-colors text-sm"
                  />
                </div>
                <select
                  required
                  name="stream"
                  defaultValue=""
                  className="w-full px-4 py-3 rounded-lg bg-muted/50 border border-border text-foreground focus:outline-none focus:border-neon-cyan/60 transition-colors text-sm"
                >
                  <option value="" disabled>
                    Тематический поток
                  </option>
                  <option value="bankruptcy">Банкротство физических лиц</option>
                  <option value="ai">ИИ в юридическом бизнесе</option>
                  <option value="automation">Автоматизация практики</option>
                  <option value="legal-tech">Legal Tech и сервисы</option>
                  <option value="data-security">Данные и безопасность</option>
                  <option value="growth">Рост и масштабирование</option>
                </select>
                <input
                  required
                  name="talk_title"
                  placeholder="Тема доклада"
                  className="w-full px-4 py-3 rounded-lg bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-neon-cyan/60 transition-colors text-sm"
                />
                <textarea
                  required
                  name="talk_description"
                  placeholder="Ключевой тезис, практическая ценность и краткое описание доклада"
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-neon-cyan/60 transition-colors text-sm resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-5 py-3 bg-neon-cyan text-accent-foreground font-display font-bold rounded-lg hover:bg-neon-cyan/90 transition-colors text-sm uppercase tracking-wider disabled:opacity-50"
              >
                {loading ? "Отправка..." : "Подать заявку в программу"}
              </button>

              <p className="text-[11px] text-foreground/40 mt-3 leading-relaxed text-center">
                После рассмотрения программный комитет свяжется для обсуждения формата выступления
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
};
