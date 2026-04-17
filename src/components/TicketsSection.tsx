import { useState } from "react";
import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";

type Tier = "standard" | "business" | "featured";

interface Ticket {
  id: string;
  tier: Tier;
  eyebrow: string;
  name: string;
  audience: string;
  oldPrice?: string;
  price: string;
  priceRaw: string;
  includesPrev?: string;
  features: string[];
  recommended?: boolean;
}

const tickets: Ticket[] = [
  {
    id: "standard",
    tier: "standard",
    eyebrow: "Базовый тариф",
    name: "Стандарт",
    audience: "Для участников и специалистов практики",
    oldPrice: "52 000 ₽",
    price: "15 500 ₽",
    priceRaw: "15 500 р.",
    features: [
      "Все тематические потоки программы",
      "Доклады, мастер-классы и панельные дискуссии",
      "AI-воркшопы и практикумы",
      "Зона выставки и speed networking",
      "Приложение конференции",
      "Видеозаписи выступлений",
    ],
  },
  {
    id: "business",
    tier: "business",
    eyebrow: "Для бизнеса",
    name: "Бизнес",
    audience: "Для руководителей практик и команд",
    oldPrice: "68 000 ₽",
    price: "24 600 ₽",
    priceRaw: "24 600 р.",
    includesPrev: "Всё из тарифа «Стандарт»",
    features: [
      "Круглые столы с лидерами рынка",
      "Тренинги для руководителей",
      "Бизнес-игра",
    ],
  },
  {
    id: "fullpass",
    tier: "featured",
    eyebrow: "Премиальный тариф",
    name: "Full Pass",
    audience: "Для ТОП-менеджмента и партнёров отрасли",
    oldPrice: "136 000 ₽",
    price: "40 800 ₽",
    priceRaw: "40 800 р.",
    includesPrev: "Всё из тарифа «Бизнес»",
    recommended: true,
    features: [
      "Групповой менторинг",
      "Стратегическая сессия",
      "Мастермайнды для ТОП-руководителей",
      "Отдельная стойка регистрации",
      "Доступ в Спикерскую",
    ],
  },
];

const corporateTicket = {
  id: "corporate",
  name: "Корпоративный",
  priceRaw: "69 000 р.",
  oldPrice: "231 000 ₽",
  price: "69 000 ₽",
  bullets: [
    "5 билетов для всех уровней менеджмента: Full Pass + Бизнес + 3 Стандарта",
    "2 дня погружения и нетворкинга всей командой",
    "Приоритетное общение с топ-экспертами отрасли",
    "Формат для корпоративного обучения и тимбилдинга",
  ],
};

interface TicketFormData {
  full_name: string;
  email: string;
  phone: string;
  payment_method: string;
  ticket_type: string;
  ticket_price: string;
}

export function TicketsSection() {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<{ name: string; priceRaw: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<TicketFormData>({
    full_name: "",
    email: "",
    phone: "",
    payment_method: "",
    ticket_type: "",
    ticket_price: "",
  });

  const openPurchaseDialog = (ticket: { name: string; priceRaw: string }) => {
    setSelectedTicket(ticket);
    setForm((prev) => ({
      ...prev,
      ticket_type: ticket.name,
      ticket_price: ticket.priceRaw,
    }));
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.full_name.trim() || !form.email.trim() || !form.phone.trim() || !form.payment_method) {
      toast({ title: "Заполните все обязательные поля", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      await api.leads.submitTicket(form);
      toast({ title: "Заявка отправлена!" });
      setDialogOpen(false);
      setForm({ full_name: "", email: "", phone: "", payment_method: "", ticket_type: "", ticket_price: "" });
    } catch {
      toast({ title: "Ошибка отправки заявки", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="tickets" className="py-20 scroll-mt-16">
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mb-14"
        >
          <div className="text-neon-cyan text-xs font-bold uppercase tracking-[0.25em] mb-4">
            Участие в конференции
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-black mb-5 uppercase leading-[1.05]">
            Билеты и тарифы
          </h2>
          <p className="text-foreground/60 text-base md:text-lg leading-relaxed">
            Четыре формата участия — от индивидуального до корпоративного. Ранние цены действуют ограниченное время.
          </p>
        </motion.div>

        {/* Individual tariffs */}
        <div className="grid md:grid-cols-3 gap-5 mb-5">
          {tickets.map((ticket, i) => {
            const isFeatured = ticket.tier === "featured";
            const accentColor = isFeatured ? "magenta" : ticket.tier === "business" ? "cyan" : "muted";

            return (
              <motion.div
                key={ticket.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className={`relative flex flex-col p-7 md:p-8 rounded-2xl bg-card/80 backdrop-blur-sm transition-colors ${
                  isFeatured
                    ? "border border-neon-magenta/50 shadow-[0_0_40px_-10px_rgba(255,0,255,0.25)] lg:-translate-y-2"
                    : ticket.tier === "business"
                      ? "border border-neon-cyan/25"
                      : "border border-border"
                }`}
              >
                {/* Recommended badge */}
                {ticket.recommended && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-neon-magenta text-primary-foreground text-[10px] font-black uppercase tracking-[0.25em] shadow-neon-magenta whitespace-nowrap">
                    Рекомендуемый
                  </div>
                )}

                {/* Subtle glow bg for featured */}
                {isFeatured && (
                  <div className="absolute inset-0 bg-gradient-to-b from-neon-magenta/[0.06] to-transparent rounded-2xl pointer-events-none" />
                )}

                <div className="relative flex flex-col flex-1">
                  {/* Eyebrow */}
                  <div
                    className={`text-[10px] font-bold uppercase tracking-[0.25em] mb-3 ${
                      accentColor === "magenta"
                        ? "text-neon-magenta"
                        : accentColor === "cyan"
                          ? "text-neon-cyan"
                          : "text-foreground/40"
                    }`}
                  >
                    {ticket.eyebrow}
                  </div>

                  {/* Name */}
                  <h3 className="font-display text-2xl md:text-3xl font-black mb-2 leading-tight">
                    {ticket.name}
                  </h3>

                  {/* Audience */}
                  <p className="text-muted-foreground text-sm mb-6 leading-relaxed">{ticket.audience}</p>

                  {/* Includes prev */}
                  {ticket.includesPrev && (
                    <div className="inline-flex items-center gap-2 text-xs font-medium text-foreground/50 mb-5 pb-5 border-b border-border">
                      <ArrowRight size={12} className="text-foreground/30" />
                      {ticket.includesPrev}
                    </div>
                  )}

                  {/* Features */}
                  <ul className="space-y-2.5 mb-8 flex-1">
                    {ticket.features.map((feature, j) => (
                      <li key={j} className="flex items-start gap-2.5 text-sm text-foreground/75 leading-relaxed">
                        <Check
                          className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                            accentColor === "magenta"
                              ? "text-neon-magenta"
                              : accentColor === "cyan"
                                ? "text-neon-cyan"
                                : "text-foreground/40"
                          }`}
                        />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Pricing */}
                  <div className="mb-5">
                    <div className="text-[10px] uppercase tracking-[0.2em] text-foreground/40 mb-1.5 font-medium">
                      Специальная цена
                    </div>
                    {ticket.oldPrice && (
                      <div className="text-xs text-foreground/30 line-through mb-1">{ticket.oldPrice}</div>
                    )}
                    <div className="font-display text-3xl md:text-4xl font-black leading-none">{ticket.price}</div>
                  </div>

                  {/* CTA */}
                  <button
                    onClick={() => openPurchaseDialog({ name: ticket.name, priceRaw: ticket.priceRaw })}
                    className={`w-full px-6 py-3.5 font-display font-bold rounded-lg transition-all text-sm uppercase tracking-wider ${
                      isFeatured
                        ? "bg-neon-magenta text-primary-foreground shadow-neon-magenta hover:opacity-90"
                        : ticket.tier === "business"
                          ? "border border-neon-cyan/50 text-neon-cyan hover:bg-neon-cyan/10 hover:border-neon-cyan"
                          : "border border-foreground/20 text-foreground/80 hover:border-foreground/40 hover:text-foreground"
                    }`}
                  >
                    Оставить заявку
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Corporate — B2B full-width card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.25 }}
          className="relative rounded-2xl border border-neon-cyan/30 bg-card/80 backdrop-blur-sm overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-neon-cyan/[0.04] rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-neon-magenta/[0.03] rounded-full blur-3xl pointer-events-none" />

          <div className="relative grid lg:grid-cols-[1.5fr_1fr] gap-8 p-8 md:p-10">
            {/* Left — content */}
            <div>
              <div className="text-neon-cyan text-[10px] font-bold uppercase tracking-[0.3em] mb-3">
                B2B · Командный тариф
              </div>
              <h3 className="font-display text-2xl md:text-3xl font-black mb-3 leading-tight">
                {corporateTicket.name}
              </h3>
              <p className="text-muted-foreground text-sm md:text-base mb-6 leading-relaxed max-w-xl">
                Для компаний, которые приводят на конференцию команду — от руководства до специалистов практики.
              </p>

              <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2.5">
                {corporateTicket.bullets.map((b, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-foreground/75 leading-relaxed">
                    <Check className="w-4 h-4 mt-0.5 flex-shrink-0 text-neon-cyan" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right — pricing + CTA */}
            <div className="flex flex-col justify-center lg:border-l lg:border-white/[0.06] lg:pl-8">
              <div className="text-[10px] uppercase tracking-[0.2em] text-foreground/40 mb-1.5 font-medium">
                Специальная цена за пакет
              </div>
              {corporateTicket.oldPrice && (
                <div className="text-xs text-foreground/30 line-through mb-1">{corporateTicket.oldPrice}</div>
              )}
              <div className="font-display text-3xl md:text-4xl font-black leading-none mb-6">
                {corporateTicket.price}
              </div>
              <button
                onClick={() =>
                  openPurchaseDialog({ name: corporateTicket.name, priceRaw: corporateTicket.priceRaw })
                }
                className="w-full px-6 py-3.5 border border-neon-cyan/50 text-neon-cyan font-display font-bold rounded-lg hover:bg-neon-cyan/10 hover:border-neon-cyan transition-colors text-sm uppercase tracking-wider"
              >
                Запросить условия
              </button>
              <p className="text-[11px] text-foreground/40 mt-3 leading-relaxed">
                Менеджер свяжется для подбора под команду
              </p>
            </div>
          </div>
        </motion.div>

        {/* Purchase dialog */}
        {selectedTicket && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Заявка на билет: {selectedTicket.name}</DialogTitle>
                <p className="text-sm text-muted-foreground">Стоимость: {selectedTicket.priceRaw}</p>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="full_name">ФИО *</Label>
                  <Input
                    id="full_name"
                    value={form.full_name}
                    onChange={(e) => setForm((prev) => ({ ...prev, full_name: e.target.value }))}
                    placeholder="Иванов Иван Иванович"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                    placeholder="example@mail.ru"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Номер телефона *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                    placeholder="+7 (999) 123-45-67"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="payment_method">Способ оплаты *</Label>
                  <Select
                    value={form.payment_method}
                    onValueChange={(value) => setForm((prev) => ({ ...prev, payment_method: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите способ оплаты" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="card">Банковская карта</SelectItem>
                      <SelectItem value="sbp">Система быстрых платежей (СБП)</SelectItem>
                      <SelectItem value="yoomoney">ЮMoney</SelectItem>
                      <SelectItem value="paypal">PayPal</SelectItem>
                      <SelectItem value="crypto">Криптовалюта</SelectItem>
                      <SelectItem value="invoice">Выставить счёт</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Отправка..." : "Отправить заявку"}
                </Button>

                <p className="text-xs text-muted-foreground">
                  После отправки заявки с вами свяжется менеджер для подтверждения и оплаты
                </p>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </section>
  );
}
