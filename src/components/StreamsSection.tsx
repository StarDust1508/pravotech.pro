import { motion } from "framer-motion";
import { Scale, Brain, Workflow, Layers, Shield, TrendingUp } from "lucide-react";

const flagship = {
  icon: Scale,
  label: "Ключевой поток",
  title: "Банкротство физических лиц",
  desc: "Процедуры, судебная практика, автоматизация подготовки документов и масштабирование БФЛ-практики — флагманская повестка конференции.",
};

const strategic = {
  icon: Brain,
  label: "Стратегическое направление",
  title: "ИИ в юридическом бизнесе",
  desc: "Нейросети и LLM-ассистенты для юристов, анализ документов, предиктивная аналитика судебных решений.",
};

const supporting = [
  {
    icon: Workflow,
    title: "Автоматизация практики",
    desc: "CRM, документооборот, workflow и интеграции в юридических процессах.",
  },
  {
    icon: Layers,
    title: "Legal Tech и сервисы",
    desc: "Цифровые инструменты, онлайн-платформы и стандарты юридической практики.",
  },
  {
    icon: Shield,
    title: "Данные и безопасность",
    desc: "Защита персональных данных, конфиденциальность и compliance в юрбизнесе.",
  },
  {
    icon: TrendingUp,
    title: "Рост и масштабирование",
    desc: "Управление командой, продажи, операционка и рост юридической практики.",
  },
];

export const StreamsSection = () => {
  return (
    <section id="streams" className="py-14 scroll-mt-16">
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mb-14"
        >
          <div className="text-neon-cyan text-xs font-bold uppercase tracking-[0.25em] mb-4">
            Деловая программа
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-black mb-5 uppercase leading-[1.05]">
            Ключевые направления
          </h2>
          <p className="text-foreground/60 text-base md:text-lg leading-relaxed">
            Шесть тематических потоков — архитектура деловой программы, отражающая ключевые изменения юридического рынка: от флагманской повестки БФЛ до ИИ и цифровой трансформации практики.
          </p>
        </motion.div>

        {/* Tier 1 — Flagship + Strategic */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-5">
          {/* Flagship */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 p-7 md:p-8 rounded-2xl border border-neon-magenta/40 bg-gradient-to-br from-neon-magenta/[0.08] via-card to-card relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-60 h-60 bg-neon-magenta/[0.06] rounded-full blur-3xl pointer-events-none" />
            <div className="relative">
              <div className="text-neon-magenta text-[10px] font-bold uppercase tracking-[0.3em] mb-5">
                {flagship.label}
              </div>
              <div className="relative w-12 h-12 mb-6">
                <flagship.icon className="absolute inset-0 w-12 h-12 text-neon-magenta" />
                <motion.div
                  className="absolute inset-0 flex items-center justify-center -top-2"
                  animate={{ rotate: [-10, 10, -10] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="w-[12px] h-[12px] bg-neon-cyan rounded-full shadow-[0_0_12px_#00f0ff] translate-x-4 translate-y-2.5" />
                  <div className="w-[8px] h-[8px] bg-neon-magenta rounded-full shadow-[0_0_12px_#ff00ff] -translate-x-4 translate-y-1.5" />
                </motion.div>
              </div>
              <h3 className="font-display text-xl md:text-2xl font-black mb-3 leading-tight">
                {flagship.title}
              </h3>
              <p className="text-foreground/70 text-sm md:text-base leading-relaxed max-w-lg">
                {flagship.desc}
              </p>
            </div>
          </motion.div>

          {/* Strategic */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08 }}
            className="lg:col-span-2 p-7 md:p-8 rounded-2xl border border-neon-cyan/30 bg-gradient-to-br from-neon-cyan/[0.05] via-card to-card relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-60 h-60 bg-neon-cyan/[0.05] rounded-full blur-3xl pointer-events-none" />
            <div className="relative">
              <div className="text-neon-cyan text-[10px] font-bold uppercase tracking-[0.3em] mb-5">
                {strategic.label}
              </div>
              <strategic.icon className="w-12 h-12 text-neon-cyan mb-6" />
              <h3 className="font-display text-xl md:text-2xl font-black mb-3 leading-tight">
                {strategic.title}
              </h3>
              <p className="text-foreground/70 text-sm md:text-base leading-relaxed max-w-lg">
                {strategic.desc}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Tier 2 — Supporting */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {supporting.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 + i * 0.06 }}
              className="p-6 rounded-xl border border-border bg-card hover:border-neon-cyan/40 transition-colors"
            >
              <item.icon className="w-8 h-8 text-foreground/45 mb-4" />
              <h3 className="font-display text-base font-bold mb-2 leading-snug">{item.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
