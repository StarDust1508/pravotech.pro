import { motion } from "framer-motion";
import { BarChart3, BookOpen, GraduationCap, Mic2, Users } from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "Исследования рынка",
    desc: "Глубокая аналитика рынка БФЛ, трендов автоматизации и внедрения ИИ в юридическую практику",
  },
  {
    icon: GraduationCap,
    title: "Академия",
    desc: "Онлайн-курсы по банкротству физлиц, управлению командой, продажам и маркетингу для юристов",
  },
  {
    icon: Mic2,
    title: "Отраслевая конференция",
    desc: "Флагманское мероприятие с ведущими экспертами индустрии, 6 тематических потоков и выставка",
  },
  {
    icon: BarChart3,
    title: "Аналитика и AI",
    desc: "Обзоры технологий, кейсы внедрения и прогнозы развития цифровых инструментов в праве",
  },
  {
    icon: Users,
    title: "Экспертное сообщество",
    desc: "Площадка для нетворкинга, обмена опытом и партнерства лидеров юридического рынка",
  },
];

export const AboutProjectSection = () => {
  return (
    <section id="about" className="py-20">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <h2 className="font-display text-3xl md:text-5xl font-black mb-6 uppercase">
            О проекте
          </h2>
          <p className="text-muted-foreground text-base md:text-lg">
            <span className="font-semibold">
              <span className="text-neon-cyan">Технолог</span><span className="text-neon-magenta font-bold">ии</span>{" "}
              <span className="text-neon-cyan">права</span>
            </span> — платформа
            об искусственном интеллекте, цифровых технологиях и масштабировании юридического
            бизнеса в сфере банкротства физических лиц. Мы объединяем исследования,
            аналитику, обучение и крупнейшую отраслевую конференцию.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-xl border border-border bg-card hover:border-neon-cyan/50 transition-all group"
            >
              <f.icon className="w-10 h-10 text-neon-cyan mb-4 group-hover:text-neon-magenta transition-colors" />
              <h3 className="font-display text-lg font-bold mb-2">{f.title}</h3>
              <p className="text-muted-foreground text-sm">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
