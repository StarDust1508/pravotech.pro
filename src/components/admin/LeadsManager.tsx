import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Mail, Search, Building2, Mic2, Handshake, Ticket, FileText, GraduationCap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import type { ExhibitionLead, SpeakerLead, SponsorLead, TicketLead, ResearchLead } from "@/lib/api";

export function LeadsManager() {
  const { toast } = useToast();
  const [exhibitionLeads, setExhibitionLeads] = useState<ExhibitionLead[]>([]);
  const [speakerLeads, setSpeakerLeads] = useState<SpeakerLead[]>([]);
  const [sponsorLeads, setSponsorLeads] = useState<SponsorLead[]>([]);
  const [ticketLeads, setTicketLeads] = useState<TicketLead[]>([]);
  const [researchLeads, setResearchLeads] = useState<ResearchLead[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [ex, sp, sn, tk, rs] = await Promise.all([
          api.leads.exhibition(),
          api.leads.speakers(),
          api.leads.sponsors(),
          api.leads.tickets(),
          api.leads.research(),
        ]);
        setExhibitionLeads(ex);
        setSpeakerLeads(sp);
        setSponsorLeads(sn);
        setTicketLeads(tk);
        setResearchLeads(rs);
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

  const [activeTab, setActiveTab] = useState("exhibition");

  const tabs = [
    { id: "exhibition", label: "Выставка", count: exhibitionLeads.length, icon: Building2 },
    { id: "speakers", label: "Спикеры", count: speakerLeads.length, icon: Mic2 },
    { id: "sponsors", label: "Спонсоры", count: sponsorLeads.length, icon: Handshake },
    { id: "tickets", label: "Билеты", count: ticketLeads.length, icon: Ticket },
    { id: "research", label: "Исследования", count: researchLeads.filter(l => l.source_form !== 'academy_course').length, icon: FileText },
    { id: "academy", label: "Академия", count: researchLeads.filter(l => l.source_form === 'academy_course').length, icon: GraduationCap },
  ];

  const totalLeads = tabs.reduce((s, t) => s + t.count, 0);

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="flex items-center gap-3 text-muted-foreground">
        <div className="w-5 h-5 border-2 border-neon-cyan border-t-transparent rounded-full animate-spin" />
        <span className="text-sm">Загрузка заявок...</span>
      </div>
    </div>
  );

  const LeadCard = ({ children, date }: { children: React.ReactNode; date: string }) => (
    <div className="flex justify-between items-start gap-4 p-4 rounded-xl border border-border bg-card/50 hover:border-neon-cyan/20 hover:bg-card transition-all">
      <div className="flex-1 min-w-0">{children}</div>
      <span className="text-[10px] text-muted-foreground/60 whitespace-nowrap pt-0.5">{fmt(date)}</span>
    </div>
  );

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-12 h-12 rounded-2xl bg-muted/50 flex items-center justify-center mb-3">
        <Mail className="w-6 h-6 text-muted-foreground/40" />
      </div>
      <p className="text-sm text-muted-foreground">Заявок пока нет</p>
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-neon-magenta/10 flex items-center justify-center">
            <Mail className="w-4.5 h-4.5 text-neon-magenta" />
          </div>
          <div>
            <h2 className="font-display text-lg font-bold">Заявки</h2>
            <p className="text-xs text-muted-foreground">{totalLeads} всего</p>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Поиск..." className="pl-9 max-w-xs h-9 text-sm" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {/* Custom tabs */}
      <div className="flex flex-wrap gap-1.5 mb-5 p-1 rounded-xl bg-muted/30 border border-border">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === tab.id
                ? "bg-card text-foreground shadow-sm border border-border"
                : "text-muted-foreground hover:text-foreground hover:bg-card/50 border border-transparent"
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
            {tab.count > 0 && (
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold min-w-[18px] text-center ${
                activeTab === tab.id ? "bg-neon-magenta/15 text-neon-magenta" : "bg-muted text-muted-foreground"
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {activeTab === "exhibition" && (
          <>
            {exhibitionLeads
              .filter(l => filter(l.company_name) || filter(l.contact_person) || filter(l.email))
              .map(l => (
                <LeadCard key={l.id} date={l.created_at}>
                  <p className="font-display font-bold text-sm">{l.company_name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{l.contact_person} · {l.email} · {l.phone}</p>
                  {l.stand_size && <p className="text-xs mt-1">Стенд: <span className="text-neon-cyan">{l.stand_size}</span></p>}
                  {l.notes && <p className="text-xs text-muted-foreground/70 mt-1">{l.notes}</p>}
                </LeadCard>
              ))}
            {exhibitionLeads.length === 0 && <EmptyState />}
          </>
        )}

        {activeTab === "speakers" && (
          <>
            {speakerLeads
              .filter(l => filter(l.full_name) || filter(l.email) || filter(l.talk_title || ""))
              .map(l => (
                <LeadCard key={l.id} date={l.created_at}>
                  <p className="font-display font-bold text-sm">{l.full_name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{l.position}{l.company ? `, ${l.company}` : ""} · {l.email}</p>
                  {l.stream && <p className="text-xs mt-1">Поток: <span className="text-muted-foreground">{l.stream}</span></p>}
                  {l.talk_title && <p className="text-xs text-neon-cyan mt-1">{l.talk_title}</p>}
                  {l.talk_description && <p className="text-xs text-muted-foreground/70 mt-1 line-clamp-2">{l.talk_description}</p>}
                </LeadCard>
              ))}
            {speakerLeads.length === 0 && <EmptyState />}
          </>
        )}

        {activeTab === "sponsors" && (
          <>
            {sponsorLeads
              .filter(l => filter(l.company_name) || filter(l.contact_person) || filter(l.email))
              .map(l => (
                <LeadCard key={l.id} date={l.created_at}>
                  <p className="font-display font-bold text-sm">{l.company_name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{l.contact_person} · {l.email}</p>
                  {l.tier && <p className="text-xs mt-1">Пакет: <span className="text-neon-magenta">{l.tier}</span></p>}
                  {l.notes && <p className="text-xs text-muted-foreground/70 mt-1">{l.notes}</p>}
                </LeadCard>
              ))}
            {sponsorLeads.length === 0 && <EmptyState />}
          </>
        )}

        {activeTab === "tickets" && (
          <>
            {ticketLeads
              .filter(l => filter(l.full_name) || filter(l.email) || filter(l.phone || "") || filter(l.ticket_type || ""))
              .map(l => (
                <LeadCard key={l.id} date={l.created_at}>
                  <p className="font-display font-bold text-sm">{l.full_name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{l.email} · {l.phone}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs">Билет: <span className="text-neon-cyan font-medium">{l.ticket_type}</span></span>
                    <span className="text-xs text-muted-foreground">{l.ticket_price}</span>
                    <span className="text-xs text-muted-foreground">Оплата: {l.payment_method}</span>
                  </div>
                </LeadCard>
              ))}
            {ticketLeads.length === 0 && <EmptyState />}
          </>
        )}

        {activeTab === "research" && (
          <>
            {researchLeads
              .filter(l => l.source_form !== 'academy_course')
              .filter(l => filter(l.name) || filter(l.email) || filter(l.research_title || ""))
              .map(l => (
                <LeadCard key={l.id} date={l.created_at}>
                  <p className="font-display font-bold text-sm">{l.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{l.email} · {l.phone}</p>
                  {l.company && <p className="text-xs mt-0.5">{l.position ? `${l.position}, ` : ""}{l.company}</p>}
                  {l.telegram && <p className="text-xs text-muted-foreground">Telegram: {l.telegram}</p>}
                  {l.research_title && <p className="text-xs text-neon-cyan mt-1">{l.research_title}</p>}
                </LeadCard>
              ))}
            {researchLeads.filter(l => l.source_form !== 'academy_course').length === 0 && <EmptyState />}
          </>
        )}

        {activeTab === "academy" && (
          <>
            {researchLeads
              .filter(l => l.source_form === 'academy_course')
              .filter(l => filter(l.name) || filter(l.email) || filter(l.research_title || ""))
              .map(l => (
                <LeadCard key={l.id} date={l.created_at}>
                  <p className="font-display font-bold text-sm">{l.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{l.email} · {l.phone}</p>
                  {l.research_title && <p className="text-xs text-neon-cyan mt-1">Курс: {l.research_title}</p>}
                </LeadCard>
              ))}
            {researchLeads.filter(l => l.source_form === 'academy_course').length === 0 && <EmptyState />}
          </>
        )}
      </div>
    </div>
  );
}
