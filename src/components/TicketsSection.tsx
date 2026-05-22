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
    <section id="tickets" className="py-14 scroll-mt-16">
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
        <div className="grid md:grid-cols-3 gap-5 mb-5" style={{ perspective: "1200px" }}>
          {tickets.map((ticket, i) => {
            const isFeatured = ticket.tier === "featured";
            const isBusiness = ticket.tier === "business";
            const accentColor = isFeatured ? "magenta" : isBusiness ? "cyan" : "muted";

            return (
              <motion.div
                key={ticket.id}
                initial={{ opacity: 0, y: 30, rotateX: 5 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className={`group relative flex flex-col rounded-2xl overflow-hidden ${
                  isFeatured
                    ? "lg:-translate-y-3"
                    : ""
                }`}
                style={{
                  boxShadow: isFeatured
                    ? "0 25px 60px -15px rgba(255,0,255,0.2), 0 0 40px -10px rgba(255,0,255,0.15), inset 0 1px 0 rgba(255,255,255,0.06)"
                    : isBusiness
                      ? "0 20px 50px -15px rgba(0,0,0,0.5), 0 0 30px -10px rgba(0,255,255,0.08), inset 0 1px 0 rgba(255,255,255,0.04)"
                      : "0 15px 40px -15px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.03)",
                }}
              >
                {/* Background */}
                <div className={`absolute inset-0 ${
                  isFeatured
                    ? "bg-gradient-to-b from-[#1a0a1e] via-[#12101e] to-[#0c0e18]"
                    : "bg-gradient-to-b from-[#0e1520] via-[#0c1220] to-[#0a0e18]"
                }`} />

                {/* Ambient glows */}
                {isFeatured && (
                  <>
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,0,255,0.12),transparent_60%)]" />
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(0,255,255,0.06),transparent_50%)]" />
                  </>
                )}
                {isBusiness && (
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,255,255,0.08),transparent_60%)]" />
                )}

                {/* Top accent line */}
                <div className={`absolute top-0 left-0 right-0 h-[2px] ${
                  isFeatured
                    ? "bg-gradient-to-r from-neon-magenta/60 via-neon-magenta/80 to-neon-cyan/40"
                    : isBusiness
                      ? "bg-gradient-to-r from-neon-cyan/40 via-neon-cyan/60 to-transparent"
                      : "bg-gradient-to-r from-white/10 via-white/5 to-transparent"
                }`} />

                {/* Border */}
                <div className={`absolute inset-0 rounded-2xl border ${
                  isFeatured
                    ? "border-neon-magenta/30"
                    : isBusiness
                      ? "border-neon-cyan/20"
                      : "border-white/[0.08]"
                }`} />

                {/* Holographic shimmer for featured */}
                {isFeatured && (
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                    style={{
                      background: "linear-gradient(105deg, transparent 40%, rgba(255,0,255,0.06) 45%, rgba(0,255,255,0.06) 50%, rgba(255,0,255,0.06) 55%, transparent 60%)",
                      backgroundSize: "200% 100%",
                      animation: "shimmer 3s ease-in-out infinite",
                    }}
                  />
                )}

                {/* Recommended badge */}
                {ticket.recommended && (
                  <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 z-10">
                    <div className="px-4 py-1.5 rounded-b-lg bg-gradient-to-r from-neon-magenta to-neon-magenta/80 text-primary-foreground text-[9px] font-black uppercase tracking-[0.3em] shadow-lg shadow-neon-magenta/30 whitespace-nowrap">
                      Рекомендуемый
                    </div>
                  </div>
                )}

                <div className="relative flex flex-col flex-1 p-7 md:p-8">
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
                  <p className="text-foreground/50 text-sm mb-6 leading-relaxed">{ticket.audience}</p>

                  {/* Includes prev */}
                  {ticket.includesPrev && (
                    <div className={`inline-flex items-center gap-2 text-xs font-medium mb-5 pb-5 border-b ${
                      isFeatured ? "text-neon-magenta/50 border-neon-magenta/15" : "text-foreground/40 border-white/[0.06]"
                    }`}>
                      <ArrowRight size={12} />
                      {ticket.includesPrev}
                    </div>
                  )}

                  {/* Features */}
                  <ul className="space-y-2.5 mb-8 flex-1">
                    {ticket.features.map((feature, j) => (
                      <li key={j} className="flex items-start gap-2.5 text-sm text-foreground/70 leading-relaxed">
                        <Check
                          className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                            accentColor === "magenta"
                              ? "text-neon-magenta"
                              : accentColor === "cyan"
                                ? "text-neon-cyan"
                                : "text-foreground/30"
                          }`}
                        />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Pricing block */}
                  <div className={`p-4 rounded-xl mb-5 ${
                    isFeatured
                      ? "bg-neon-magenta/[0.06] border border-neon-magenta/15"
                      : isBusiness
                        ? "bg-neon-cyan/[0.04] border border-neon-cyan/10"
                        : "bg-white/[0.02] border border-white/[0.05]"
                  }`}>
                    <div className="text-[10px] uppercase tracking-[0.2em] text-foreground/40 mb-1.5 font-medium">
                      Специальная цена
                    </div>
                    {ticket.oldPrice && (
                      <div className="text-xs text-foreground/25 line-through mb-1">{ticket.oldPrice}</div>
                    )}
                    <div className={`font-display text-3xl md:text-4xl font-black leading-none ${
                      isFeatured ? "bg-gradient-to-r from-neon-magenta to-neon-cyan bg-clip-text text-transparent" : ""
                    }`}>{ticket.price}</div>
                  </div>

                  {/* CTA */}
                  <button
                    onClick={() => openPurchaseDialog({ name: ticket.name, priceRaw: ticket.priceRaw })}
                    className={`w-full px-6 py-3.5 font-display font-bold rounded-lg text-sm uppercase tracking-wider transition-all ${
                      isFeatured
                        ? "bg-gradient-to-r from-neon-magenta to-neon-magenta/80 text-primary-foreground shadow-lg shadow-neon-magenta/25 hover:shadow-neon-magenta/40 hover:scale-[1.02]"
                        : isBusiness
                          ? "border border-neon-cyan/40 text-neon-cyan hover:bg-neon-cyan/10 hover:border-neon-cyan hover:shadow-lg hover:shadow-neon-cyan/10"
                          : "border border-white/[0.12] text-foreground/70 hover:border-white/[0.25] hover:text-foreground"
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
