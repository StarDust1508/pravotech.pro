import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import type { ExhibitionLead, SpeakerLead, SponsorLead, TicketLead } from "@/lib/api";

export function LeadsManager() {
  const { toast } = useToast();
  const [exhibitionLeads, setExhibitionLeads] = useState<ExhibitionLead[]>([]);
  const [speakerLeads, setSpeakerLeads] = useState<SpeakerLead[]>([]);
  const [sponsorLeads, setSponsorLeads] = useState<SponsorLead[]>([]);
  const [ticketLeads, setTicketLeads] = useState<TicketLead[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [ex, sp, sn, tk] = await Promise.all([
          api.leads.exhibition(),
          api.leads.speakers(),
          api.leads.sponsors(),
          api.leads.tickets(),
        ]);
        setExhibitionLeads(ex);
        setSpeakerLeads(sp);
        setSponsorLeads(sn);
        setTicketLeads(tk);
      } catch {
        toast({ title: "Ошибка загрузки заявок", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filter = (text: string) => text.toLowerCase().includes(search.toLowerCase());
  const fmt = (d: string) => new Date(d).toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });

  if (loading) return <p className="text-muted-foreground">Загрузка...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Заявки</h2>
        <Input placeholder="Поиск..." className="max-w-xs" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <Tabs defaultValue="exhibition">
        <TabsList>
          <TabsTrigger value="exhibition">Выставка ({exhibitionLeads.length})</TabsTrigger>
          <TabsTrigger value="speakers">Спикеры ({speakerLeads.length})</TabsTrigger>
          <TabsTrigger value="sponsors">Спонсоры ({sponsorLeads.length})</TabsTrigger>
          <TabsTrigger value="tickets">Билеты ({ticketLeads.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="exhibition" className="space-y-3 mt-4">
          {exhibitionLeads
            .filter(l => filter(l.company_name) || filter(l.contact_person) || filter(l.email))
            .map(l => (
              <Card key={l.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold">{l.company_name}</p>
                      <p className="text-sm text-muted-foreground">{l.contact_person} · {l.email} · {l.phone}</p>
                      <p className="text-sm">Стенд: {l.stand_size || "—"}</p>
                      {l.notes && <p className="text-sm text-muted-foreground mt-1">{l.notes}</p>}
                    </div>
                    <span className="text-xs text-muted-foreground">{fmt(l.created_at)}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          {exhibitionLeads.length === 0 && <p className="text-muted-foreground text-center py-8">Заявок нет</p>}
        </TabsContent>

        <TabsContent value="speakers" className="space-y-3 mt-4">
          {speakerLeads
            .filter(l => filter(l.full_name) || filter(l.email) || filter(l.talk_title || ""))
            .map(l => (
              <Card key={l.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold">{l.full_name}</p>
                      <p className="text-sm text-muted-foreground">{l.position}{l.company ? `, ${l.company}` : ""} · {l.email}</p>
                      <p className="text-sm">Поток: {l.stream || "—"}</p>
                      <p className="text-sm text-neon-cyan">{l.talk_title}</p>
                      {l.talk_description && <p className="text-sm text-muted-foreground mt-1">{l.talk_description}</p>}
                    </div>
                    <span className="text-xs text-muted-foreground">{fmt(l.created_at)}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          {speakerLeads.length === 0 && <p className="text-muted-foreground text-center py-8">Заявок нет</p>}
        </TabsContent>

        <TabsContent value="sponsors" className="space-y-3 mt-4">
          {sponsorLeads
            .filter(l => filter(l.company_name) || filter(l.contact_person) || filter(l.email))
            .map(l => (
              <Card key={l.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold">{l.company_name}</p>
                      <p className="text-sm text-muted-foreground">{l.contact_person} · {l.email}</p>
                      <p className="text-sm">Пакет: {l.tier || "—"}</p>
                      {l.notes && <p className="text-sm text-muted-foreground mt-1">{l.notes}</p>}
                    </div>
                    <span className="text-xs text-muted-foreground">{fmt(l.created_at)}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          {sponsorLeads.length === 0 && <p className="text-muted-foreground text-center py-8">Заявок нет</p>}
        </TabsContent>

        <TabsContent value="tickets" className="space-y-3 mt-4">
          {ticketLeads
            .filter(l => filter(l.full_name) || filter(l.email) || filter(l.phone || "") || filter(l.ticket_type || ""))
            .map(l => (
              <Card key={l.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold">{l.full_name}</p>
                      <p className="text-sm text-muted-foreground">{l.email} · {l.phone}</p>
                      <p className="text-sm">Билет: <span className="text-neon-cyan">{l.ticket_type}</span> · {l.ticket_price}</p>
                      <p className="text-sm">Способ оплаты: {l.payment_method}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{fmt(l.created_at)}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          {ticketLeads.length === 0 && <p className="text-muted-foreground text-center py-8">Заявок нет</p>}
        </TabsContent>
      </Tabs>
    </div>
  );
}
