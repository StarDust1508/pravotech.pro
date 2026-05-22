import React from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

const metrics = [
  { value: "5 000+", label: "Участников", context: "Ежегодная аудитория платформы" },
  { value: "85%", label: "C-Level", context: "Топ-менеджеры и собственники практик" },
  { value: "320%", label: "Средний ROI", context: "По данным партнёров прошлых выпусков" },
  { value: "150+", label: "Лидов", context: "Квалифицированные контакты на партнёра" },
];

const valueProps = [
  {
    title: "Доступ к decision-makers",
    desc: "Прямые контакты с ЛПР юрфирм, арбитражных управляющих и владельцев практик.",
  },
  {
    title: "Тёплые B2B-лиды",
    desc: "Квалифицированная аудитория, готовая к диалогу и коммерческим решениям.",
  },
  {
    title: "Интеграция в отраслевую повестку",
    desc: "Освещение в профильных каналах, сообществах и индустриальных публикациях.",
  },
  {
    title: "Узнаваемость в Legal Tech",
    desc: "Позиционирование бренда в сегменте legal tech и рынке БФЛ.",
  },
];

const proofCase = {
  company: "LegalTech Solutions",
  personName: "Алексей Петров",
  personRole: "Директор по развитию",
  kpis: [
    { value: "180", label: "лидов" },
    { value: "3", label: "сделки" },
    { value: "420%", label: "ROI" },
  ],
  quote:
    "За 2 дня мы получили 180 качественных лидов и заключили 3 крупные сделки. Формат конференции даёт прямой выход на целевую аудиторию — собрать такой срез рынка другими каналами было бы в разы дороже.",
};

export default function WhyPartnerSection() {
  const scrollToSponsorForm = () => {
    const element = document.getElementById("sponsor-form");
    if (element) element.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-grid" />
      <div className="relative container max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mb-14"
        >
          <div className="text-neon-cyan text-[10px] font-bold uppercase tracking-[0.3em] mb-4">
            B2B · Партнёрство и спонсорство
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-black mb-5 uppercase leading-[1.05]">
            Прямой выход
            <br />
            на юридический рынок
          </h2>
          <p className="text-foreground/60 text-base md:text-lg leading-relaxed">
            Партнёры получают 2 дня прямых контактов с ЛПР юрфирм, арбитражных управляющих и владельцев практик — аудиторию, которую сложно собрать другими каналами.
          </p>
        </motion.div>

        {/* Proof metrics — unified */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-border bg-card/60 backdrop-blur-sm overflow-hidden mb-16"
        >
          <div className="grid md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-border/60">
            {metrics.map((m, i) => (
              <div key={i} className="p-6 md:p-7">
                <div className="font-display text-4xl md:text-5xl font-black text-neon-cyan leading-none mb-3">
                  {m.value}
                </div>
                <div className="font-display text-sm font-bold mb-1.5 uppercase tracking-wider">{m.label}</div>
                <div className="text-muted-foreground text-xs leading-relaxed">{m.context}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Value props + Proof case */}
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-start">
          {/* Left — Value proposition */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-neon-cyan text-[10px] font-bold uppercase tracking-[0.3em] mb-3">
              Что получает партнёр
            </div>
            <h3 className="font-display text-2xl md:text-3xl font-black mb-8 leading-tight">
              Экосистема результата, а не просто площадка
            </h3>
            <div className="space-y-6">
              {valueProps.map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-7 h-7 rounded-full border border-neon-cyan/40 bg-neon-cyan/5 flex-shrink-0 mt-0.5 flex items-center justify-center">
                    <Check size={14} className="text-neon-cyan" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold mb-1.5 text-base">{item.title}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — Proof case */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative rounded-2xl border border-neon-magenta/25 bg-card/80 backdrop-blur-sm overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-neon-magenta/[0.05] rounded-full blur-3xl pointer-events-none" />

            <div className="relative p-7 md:p-8">
              {/* Eyebrow */}
              <div className="flex items-center justify-between mb-6">
                <div className="text-neon-magenta text-[10px] font-bold uppercase tracking-[0.3em]">
                  Кейс партнёра
                </div>
                <div className="font-display text-xs font-bold text-foreground/50 uppercase tracking-wider">
                  {proofCase.company}
                </div>
              </div>

              {/* KPI row — proof headline */}
              <div className="grid grid-cols-3 gap-3 mb-6 pb-6 border-b border-border/60">
                {proofCase.kpis.map((kpi, i) => (
                  <div key={i}>
                    <div className="font-display text-2xl md:text-3xl font-black text-neon-magenta leading-none mb-1.5">
                      {kpi.value}
                    </div>
                    <div className="text-muted-foreground text-[11px] uppercase tracking-wider">{kpi.label}</div>
                  </div>
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-foreground/80 text-sm md:text-base leading-relaxed mb-6">
                «{proofCase.quote}»
              </blockquote>

              {/* Signature */}
              <div className="flex items-center gap-3 pt-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-cyan/20 to-neon-magenta/20 border border-border flex items-center justify-center font-display font-black text-sm text-foreground/80">
                  {proofCase.personName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <div className="font-display font-bold text-sm">{proofCase.personName}</div>
                  <div className="text-xs text-muted-foreground">
                    {proofCase.personRole}, {proofCase.company}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* CTA band */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-14 rounded-2xl border border-neon-cyan/25 bg-gradient-to-r from-neon-cyan/[0.05] via-card/50 to-neon-magenta/[0.05] backdrop-blur-sm"
        >
          <div className="grid md:grid-cols-[1.5fr_1fr] gap-6 p-7 md:p-8 items-center">
            <div>
              <h3 className="font-display text-xl md:text-2xl font-black mb-2 leading-tight">
                Обсудить форматы партнёрства
              </h3>
              <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                Команда подберёт формат участия под задачи бизнеса — от отраслевой интеграции до целевой lead-кампании.
              </p>
            </div>
            <button
              onClick={scrollToSponsorForm}
              className="px-7 py-3.5 bg-neon-cyan text-accent-foreground font-display font-bold rounded-lg hover:bg-neon-cyan/90 transition-colors text-sm uppercase tracking-wider"
            >
              Стать партнёром
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
