import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, TrendingUp, Brain, Users, BarChart3, Cpu, FileStack, MessageSquare, X, Download, CheckCircle2 } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface Research {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: React.ElementType;
  isCyan: boolean;
}

const researches: Research[] = [
  {
    id: "bfl-market-2026",
    title: "Рынок БФЛ в России 2026",
    description: "Объем рынка, динамика роста, ключевые игроки и прогнозы развития рынка банкротства физических лиц.",
    category: "Рынок",
    icon: TrendingUp,
    isCyan: true,
  },
  {
    id: "bfl-players",
    title: "Кто выигрывает рынок БФЛ",
    description: "Сравнительный анализ юрфирм, партнерских сетей и платформ — кто растет быстрее и почему.",
    category: "Конкуренция",
    icon: Users,
    isCyan: false,
  },
  {
    id: "ai-lawyer",
    title: "Как ИИ меняет работу юриста по банкротству",
    description: "Обзор AI-инструментов, кейсы автоматизации и влияние на производительность практики.",
    category: "ИИ",
    icon: Brain,
    isCyan: true,
  },
  {
    id: "digital-client-journey",
    title: "Цифровой путь клиента в БФЛ",
    description: "Как клиенты находят юриста, принимают решение и какие точки контакта можно оцифровать.",
    category: "Маркетинг",
    icon: FileText,
    isCyan: false,
  },
  {
    id: "bfl-economics",
    title: "Экономика юридической практики в БФЛ",
    description: "Себестоимость дела, маржинальность, unit-экономика и точки оптимизации юридической практики.",
    category: "Экономика",
    icon: BarChart3,
    isCyan: true,
  },
  {
    id: "tech-leaders",
    title: "Какие технологии внедряют лидеры рынка",
    description: "CRM, AI-ассистенты, автоматизация документов — стек технологий лидеров рынка БФЛ.",
    category: "Технологии",
    icon: Cpu,
    isCyan: false,
  },
  {
    id: "document-automation",
    title: "Тренды автоматизации документооборота",
    description: "Генерация процессуальных документов, интеграция с судебными системами, электронная подпись.",
    category: "Автоматизация",
    icon: FileStack,
    isCyan: true,
  },
  {
    id: "ai-communication",
    title: "AI-инструменты для коммуникации и продаж",
    description: "Чат-боты, AI-обзвон, персонализированные воронки — инструменты для привлечения и удержания клиентов.",
    category: "Продажи",
    icon: MessageSquare,
    isCyan: false,
  },
];

export const ResearchSection = () => {
  const [selectedResearch, setSelectedResearch] = useState<Research | null>(null);
  const [formState, setFormState] = useState<"form" | "success">("form");
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    telegram: "",
    company: "",
    position: "",
  });

  const openModal = (research: Research) => {
    setSelectedResearch(research);
    setFormState("form");
    setFormData({ name: "", email: "", phone: "", telegram: "", company: "", position: "" });
  };

  const closeModal = () => {
    setSelectedResearch(null);
    setFormState("form");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedResearch) return;

    setSubmitting(true);
    try {
      await api.leads.submitResearch({
        ...formData,
        research_id: selectedResearch.id,
        research_title: selectedResearch.title,
        source_form: "research_card",
      });
      setFormState("success");
    } catch {
      toast({
        title: "Ошибка",
        description: "Не удалось отправить заявку. Попробуйте снова.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="research" className="py-20">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="font-display text-3xl md:text-5xl font-black mb-4 uppercase">
            Исследования
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl">
            Аналитика рынка БФЛ и трендов ИИ в банкротстве физических лиц.
            Получите исследование — оставьте контакты, и мы отправим материал вам.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {researches.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="group p-6 rounded-xl border border-border bg-card hover:border-neon-cyan/50 transition-all flex flex-col"
            >
              <div className="flex items-center gap-3 mb-4">
                <r.icon className={`w-8 h-8 flex-shrink-0 ${r.isCyan ? "text-neon-cyan" : "text-neon-magenta"}`} />
                <span className={`text-xs font-bold uppercase tracking-wider ${r.isCyan ? "text-neon-cyan" : "text-neon-magenta"}`}>
                  {r.category}
                </span>
              </div>
              <h3 className="font-display text-base font-bold mb-2 leading-snug">{r.title}</h3>
              <p className="text-muted-foreground text-sm mb-6 flex-grow">{r.description}</p>
              <button
                onClick={() => openModal(r)}
                className="w-full px-4 py-2.5 border border-neon-cyan text-neon-cyan font-display font-bold rounded-lg hover:bg-accent/10 transition-colors text-sm uppercase tracking-wider"
              >
                Получить исследование
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lead Capture Modal */}
      <AnimatePresence>
        {selectedResearch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          >
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={closeModal} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-card border border-border rounded-2xl p-6 md:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={20} />
              </button>

              {formState === "form" ? (
                <>
                  <div className="flex items-center gap-3 mb-2">
                    <selectedResearch.icon className="w-8 h-8 text-neon-cyan" />
                    <span className="text-xs font-bold uppercase tracking-wider text-neon-magenta">
                      {selectedResearch.category}
                    </span>
                  </div>
                  <h3 className="font-display text-xl font-bold mb-2">{selectedResearch.title}</h3>
                  <p className="text-muted-foreground text-sm mb-6">{selectedResearch.description}</p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Имя <span className="text-neon-magenta">*</span></label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2.5 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:border-neon-cyan transition-colors"
                        placeholder="Ваше имя"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Email <span className="text-neon-magenta">*</span></label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-2.5 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:border-neon-cyan transition-colors"
                        placeholder="email@example.com"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Телефон <span className="text-neon-magenta">*</span></label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-2.5 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:border-neon-cyan transition-colors"
                        placeholder="+7 (___) ___-__-__"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Telegram</label>
                      <input
                        type="text"
                        value={formData.telegram}
                        onChange={(e) => setFormData({ ...formData, telegram: e.target.value })}
                        className="w-full px-4 py-2.5 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:border-neon-cyan transition-colors"
                        placeholder="@username"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-1 block">Компания</label>
                        <input
                          type="text"
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                          className="w-full px-4 py-2.5 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:border-neon-cyan transition-colors"
                          placeholder="Название"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Должность</label>
                        <input
                          type="text"
                          value={formData.position}
                          onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                          className="w-full px-4 py-2.5 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:border-neon-cyan transition-colors"
                          placeholder="Должность"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full px-6 py-3 bg-neon-magenta text-primary-foreground font-display font-bold rounded-lg shadow-neon-magenta hover:opacity-90 transition-opacity text-sm uppercase tracking-wider disabled:opacity-50"
                    >
                      {submitting ? "Отправка..." : "Получить исследование"}
                    </button>

                    <p className="text-xs text-muted-foreground text-center">
                      Нажимая кнопку, вы соглашаетесь на обработку персональных данных
                    </p>
                  </form>
                </>
              ) : (
                <div className="text-center py-6">
                  <CheckCircle2 className="w-16 h-16 text-neon-cyan mx-auto mb-4" />
                  <h3 className="font-display text-2xl font-bold mb-2">Спасибо!</h3>
                  <p className="text-muted-foreground mb-6">
                    Исследование «{selectedResearch.title}» готово для вас.
                    Мы также отправим его на указанный email.
                  </p>
                  <div className="flex flex-col gap-3">
                    <button
                      onClick={closeModal}
                      className="w-full px-6 py-3 bg-neon-magenta text-primary-foreground font-display font-bold rounded-lg shadow-neon-magenta hover:opacity-90 transition-opacity text-sm uppercase tracking-wider inline-flex items-center justify-center gap-2"
                    >
                      <Download size={16} />
                      Скачать PDF
                    </button>
                    <button
                      onClick={closeModal}
                      className="w-full px-6 py-3 border border-border text-foreground/70 font-display font-bold rounded-lg hover:border-neon-cyan/50 transition-colors text-sm uppercase tracking-wider"
                    >
                      Закрыть
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
