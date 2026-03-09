import { motion } from "framer-motion";
import { Scale, Brain, Shield, FileText, Users, Landmark } from "lucide-react";

const streams = [
  { icon: Scale, title: "Банкротство физических лиц", desc: "Процедуры, судебная практика, автоматизация подготовки документов" },
  { icon: Brain, title: "AI в юриспруденции", desc: "Нейросети для анализа документов, предиктивная аналитика судебных решений" },
  { icon: Shield, title: "Кибербезопасность и право", desc: "Защита персональных данных, GDPR, правовое регулирование" },
  { icon: FileText, title: "Электронный документооборот", desc: "Цифровая подпись, смарт-контракты, блокчейн в юриспруденции" },
  { icon: Users, title: "Онлайн-разрешение споров", desc: "ODR-платформы, медиация, арбитраж в цифровой среде" },
  { icon: Landmark, title: "Регулирование цифровых активов", desc: "Криптовалюты, NFT, цифровой рубль — правовые аспекты" },
];

export const StreamsSection = () => {
  return (
    <section id="streams" className="py-20">
      <div className="container">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="font-display text-3xl md:text-5xl font-black mb-12 uppercase"
        >
          Потоки
        </motion.h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {streams.map((stream, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`p-6 rounded-xl border transition-all hover:shadow-neon-cyan/20 ${
                i === 0
                  ? "border-neon-magenta bg-gradient-to-br from-muted to-background shadow-neon-magenta"
                  : "border-border bg-card hover:border-neon-cyan/50"
              }`}
            >
              <div className="relative w-10 h-10 mb-4">
                <stream.icon className={`absolute inset-0 w-10 h-10 ${i === 0 ? "text-neon-magenta" : "text-neon-cyan"}`} />
                {stream.icon === Scale && (
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center -top-2"
                    animate={{ rotate: [-10, 10, -10] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                     <div className="w-[10px] h-[10px] bg-neon-cyan rounded-full shadow-[0_0_10px_#00f0ff] translate-x-3 translate-y-2"></div>
                     <div className="w-[6px] h-[6px] bg-neon-magenta rounded-full shadow-[0_0_10px_#ff00ff] -translate-x-3 translate-y-1"></div>
                  </motion.div>
                )}
              </div>
              <h3 className="font-display text-lg font-bold mb-2">{stream.title}</h3>
              <p className="text-muted-foreground text-sm">{stream.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
