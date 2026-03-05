import { useState } from "react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

export const SpeakerForm = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({ title: "Заявка отправлена!", description: "Программный комитет рассмотрит вашу заявку." });
      (e.target as HTMLFormElement).reset();
    }, 1000);
  };

  return (
    <section id="become-speaker" className="py-20">
      <div className="container">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <h2 className="font-display text-3xl md:text-5xl font-black mb-4 uppercase text-center">
            Стать спикером
          </h2>
          <p className="text-muted-foreground text-center mb-10">
            Поделитесь опытом с профессиональным сообществом юристов и технологов
          </p>

          <form onSubmit={handleSubmit} className="space-y-4 p-8 rounded-xl border border-border bg-card">
            <div className="grid md:grid-cols-2 gap-4">
              <input required placeholder="ФИО" className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-neon-cyan transition-colors text-sm" />
              <input required placeholder="Должность" className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-neon-cyan transition-colors text-sm" />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <input required placeholder="Компания" className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-neon-cyan transition-colors text-sm" />
              <input required type="email" placeholder="Email" className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-neon-cyan transition-colors text-sm" />
            </div>
            <select required className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground focus:outline-none focus:border-neon-cyan transition-colors text-sm">
              <option value="">Выберите поток</option>
              <option value="bankruptcy">Банкротство физических лиц</option>
              <option value="ai">AI в юриспруденции</option>
              <option value="cyber">Кибербезопасность и право</option>
              <option value="edoc">Электронный документооборот</option>
              <option value="odr">Онлайн-разрешение споров</option>
              <option value="digital">Регулирование цифровых активов</option>
            </select>
            <input required placeholder="Тема доклада" className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-neon-cyan transition-colors text-sm" />
            <textarea required placeholder="Краткое описание доклада" rows={4} className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-neon-cyan transition-colors text-sm resize-none" />
            <button type="submit" disabled={loading} className="w-full py-3 gradient-neon text-primary-foreground font-display font-bold rounded-lg hover:opacity-90 transition-opacity text-sm uppercase tracking-wider disabled:opacity-50">
              {loading ? "Отправка..." : "Подать заявку"}
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
};
