import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";

interface Ticket {
  id: string;
  name: string;
  originalPrice: string;
  currentPrice: string;
  features: string[];
  backgroundColor: string;
  textColor: string;
  highlighted?: boolean;
  description?: string;
}

const tickets: Ticket[] = [
  {
    id: "standard",
    name: "СТАНДАРТ",
    originalPrice: "52 000",
    currentPrice: "15 500 р.",
    backgroundColor: "bg-white",
    textColor: "text-black",
    features: [
      "Доступ к тематическим потокам",
      "Доклады",
      "Мастер-классы",
      "Панельные дискуссии",
      "Интервью с экспертами",
      "Интервью с основателями крупных компаний",
      "Кейс-стади",
      "Доступ в зону выставки",
      "Доступ к приложению Tech Week",
      "Практикумы",
      "AI-воркшопы",
      "Speed networking",
      "Доступ к видеозаписям выступлений спикеров конференции"
    ]
  },
  {
    id: "business",
    name: "БИЗНЕС",
    originalPrice: "68 000",
    currentPrice: "24 600 р.",
    description: "Включает опции билета «Стандарт»",
    backgroundColor: "bg-neon-cyan",
    textColor: "text-black",
    features: [
      "Круглые столы",
      "Тренинги",
      "Бизнес-игра"
    ]
  },
  {
    id: "fullpass",
    name: "FULL PASS",
    currentPrice: "40 800 р.",
    originalPrice: "136 000",
    description: "Включает опции билета «Бизнес»",
    backgroundColor: "bg-slate-800",
    textColor: "text-white",
    highlighted: true,
    features: [
      "Групповой менторинг",
      "Стратегическая сессия",
      "Мастермайнды для ТОП-руководителей",
      "Отдельная стойка регистрации",
      "Доступ в Спикерскую"
    ]
  },
  {
    id: "corporate",
    name: "КОРПОРА-ТИВНЫЙ",
    currentPrice: "69 000 р.",
    originalPrice: "231 000",
    description: "Идеальный тимбилдинг — приходите всей командой",
    backgroundColor: "bg-purple-200",
    textColor: "text-black",
    features: [
      "2 дня нетворкинга и погружения в инновационные технологии",
      "Общение с топ-экспертами, которые зарядят вашу команду на обсуждения и инсайты",
      "5 билетов для всех уровней менеджмента: Full Pass + «Бизнес» + 3 билета категории «Базовый»"
    ]
  }
];

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
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<TicketFormData>({
    full_name: "",
    email: "",
    phone: "",
    payment_method: "",
    ticket_type: "",
    ticket_price: ""
  });

  const openPurchaseDialog = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setForm(prev => ({
      ...prev,
      ticket_type: ticket.name,
      ticket_price: ticket.currentPrice
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
      toast({ title: "Заявка на билет отправлена!" });
      setDialogOpen(false);
      setForm({
        full_name: "",
        email: "",
        phone: "",
        payment_method: "",
        ticket_type: "",
        ticket_price: ""
      });
    } catch (error) {
      toast({ title: "Ошибка отправки заявки", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="tickets" className="py-20 px-4 bg-background">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            <span className="text-neon-cyan">Билеты</span> на Конференцию
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Выберите подходящий тариф и станьте частью крупнейшего события в сфере правовых технологий
          </p>
        </div>

        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6">
          {tickets.map((ticket) => (
            <Card 
              key={ticket.id} 
              className={`relative h-full flex flex-col ${ticket.backgroundColor} ${
                ticket.highlighted ? 'ring-2 ring-neon-cyan' : ''
              } hover:shadow-lg transition-all duration-300`}
            >
              <CardHeader className="text-center pb-4">
                <CardTitle className={`text-lg font-bold ${ticket.textColor}`}>
                  {ticket.name}
                </CardTitle>
                {ticket.description && (
                  <p className={`text-xs ${ticket.textColor} opacity-80 mt-2`}>
                    {ticket.description}
                  </p>
                )}
              </CardHeader>
              
              <CardContent className="pb-6 flex flex-col flex-1">
                {ticket.features.some(f => f.startsWith("ПЛЮС")) ? (
                  <div className="mb-4">
                    <div className={`inline-block px-2 py-1 rounded text-xs font-bold ${
                      ticket.id === 'business' ? 'bg-pink-500 text-white' : 'bg-blue-500 text-white'
                    }`}>
                      ПЛЮС
                    </div>
                  </div>
                ) : null}
                
                <ul className="space-y-2 mb-6 flex-1">
                  {ticket.features.map((feature, index) => (
                    <li key={index} className={`flex items-start gap-2 text-sm ${ticket.textColor}`}>
                      <Check className="w-4 h-4 mt-0.5 flex-shrink-0 text-green-600" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="text-center space-y-2 mt-auto">
                  {ticket.originalPrice && (
                    <p className={`text-sm line-through ${ticket.textColor} opacity-60`}>
                      {ticket.originalPrice}
                    </p>
                  )}
                  <p className={`text-2xl font-bold ${ticket.textColor}`}>
                    {ticket.currentPrice}
                  </p>
                  
                  <Dialog open={dialogOpen && selectedTicket?.id === ticket.id} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        onClick={() => openPurchaseDialog(ticket)}
                        className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 rounded-lg"
                      >
                        КУПИТЬ
                      </Button>
                    </DialogTrigger>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {selectedTicket && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Покупка билета: {selectedTicket.name}</DialogTitle>
                <p className="text-sm text-muted-foreground">
                  Стоимость: {selectedTicket.currentPrice}
                </p>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="full_name">ФИО *</Label>
                  <Input
                    id="full_name"
                    value={form.full_name}
                    onChange={(e) => setForm(prev => ({ ...prev, full_name: e.target.value }))}
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
                    onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
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
                    onChange={(e) => setForm(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+7 (999) 123-45-67"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="payment_method">Способ оплаты *</Label>
                  <Select value={form.payment_method} onValueChange={(value) => setForm(prev => ({ ...prev, payment_method: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите способ оплаты" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="card">Банковская карта</SelectItem>
                      <SelectItem value="sbp">Система быстрых платежей (СБП)</SelectItem>
                      <SelectItem value="yoomoney">ЮMoney</SelectItem>
                      <SelectItem value="paypal">PayPal</SelectItem>
                      <SelectItem value="crypto">Криптовалюта</SelectItem>
                      <SelectItem value="invoice">Выставить счет</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-pink-500 hover:bg-pink-600" 
                  disabled={loading}
                >
                  {loading ? "Отправка..." : "Отправить заявку"}
                </Button>
                
                <p className="text-xs text-muted-foreground">
                  После отправки заявки с вами свяжется менеджер для подтверждения покупки и оплаты
                </p>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </section>
  );
}