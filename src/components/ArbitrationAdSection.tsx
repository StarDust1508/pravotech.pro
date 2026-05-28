import { motion } from "framer-motion";
import { Scale, ShieldCheck, Clock, Users, ArrowRight, CheckCircle2 } from "lucide-react";
import { useSettings } from "@/hooks/useSettings";

const DEFAULTS = {
  title: "Сопровождение банкротства под ключ",
  text: "Профессиональное арбитражное управление и сопровождение процедур банкротства физических лиц — от подготовки заявления до завершения дела и списания долгов.",
  cta: "Получить консультацию",
};

const perks = [
  { icon: ShieldCheck, text: "Опытные арбитражные управляющие в реестре СРО" },
  { icon: Scale, text: "Полное сопровождение от заявления до завершения" },
  { icon: Clock, text: "Прозрачные сроки и фиксированная стоимость" },
  { icon: Users, text: "Работа с кредиторами, ФНС и приставами" },
];

const steps = [
  "Безоплатная консультация",
  "Анализ ситуации и документов",
  "Подача заявления в суд",
  "Сопровождение процедуры",
  "Списание долгов",
];

export const ArbitrationAdSection = () => {
  const { data: settings = {} } = useSettings();

  const title = settings.au_ad_title || DEFAULTS.title;
  const text = settings.au_ad_text || DEFAULTS.text;
  const ctaText = settings.au_ad_cta || DEFAULTS.cta;
  const ctaUrl = settings.au_ad_cta_url || "#contacts";

  return (
    <section id="arbitrage" className="py-24 relative">
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[500px] h-[500px] bg-neon-cyan/[0.03] rounded-full blur-[120px] pointer-events-none" />
      <div className="container relative">
        <div className="rounded-2xl border border-border bg-card/50 p-8 md:p-12">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.35em] text-neon-cyan/50 mb-5">
              Арбитражное управление
            </p>

            <h2 className="font-display text-3xl md:text-4xl font-black mb-5 uppercase leading-tight">
              {title}
            </h2>

            <p className="text-muted-foreground text-base md:text-lg mb-8 max-w-lg">
              {text}
            </p>

            <div className="mb-8 space-y-2.5">
              {steps.map((step, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full border border-border bg-card flex items-center justify-center text-foreground/40 text-[10px] font-bold">
                    {i + 1}
                  </span>
                  <span className="text-sm text-foreground/60">{step}</span>
                  {i === steps.length - 1 && <CheckCircle2 size={14} className="text-neon-cyan/60 ml-1" />}
                </div>
              ))}
            </div>

            <a
              href={ctaUrl}
              className="group inline-flex items-center gap-2 px-8 py-3.5 bg-neon-cyan text-background font-display font-bold rounded-lg shadow-lg shadow-neon-cyan/20 hover:shadow-neon-cyan/40 transition-shadow text-sm uppercase tracking-wider"
            >
              {ctaText}
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
            </a>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-4">
            {perks.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="p-5 rounded-xl border border-border bg-card hover:border-neon-cyan/30 hover:shadow-lg hover:shadow-neon-cyan/5 transition-all"
              >
                <p.icon className="w-6 h-6 text-neon-cyan/60 mb-3" />
                <div className="text-sm text-foreground/70 leading-relaxed">{p.text}</div>
              </motion.div>
            ))}
          </div>
        </div>
        </div>
      </div>
    </section>
  );
};
