import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Plus, Pencil, Trash2, Handshake, Eye, EyeOff, Star, Gem, Crown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import type { Sponsor } from "@/lib/api";

const tierConfig: Record<string, { label: string; color: string; bg: string; icon: typeof Star }> = {
  platinum: { label: "Платина", color: "text-neon-magenta", bg: "bg-neon-magenta/10", icon: Crown },
  gold: { label: "Золото", color: "text-yellow-400", bg: "bg-yellow-400/10", icon: Gem },
  silver: { label: "Серебро", color: "text-neon-cyan", bg: "bg-neon-cyan/10", icon: Star },
  bronze: { label: "Бронза", color: "text-orange-400", bg: "bg-orange-400/10", icon: Star },
};

export function SponsorsManager() {
  const { toast } = useToast();
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSponsor, setEditingSponsor] = useState<Sponsor | null>(null);
  const [form, setForm] = useState({
    company_name: "", logo_url: "", website_url: "", tier: "silver", display_order: 0, is_published: true,
  });

  const loadSponsors = async () => {
    try {
      setLoading(true);
      const data = await api.sponsors.list();
      setSponsors(data);
    } catch {
      toast({ title: "Ошибка загрузки спонсоров", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadSponsors(); }, []);

  const openCreate = () => {
    setEditingSponsor(null);
    setForm({ company_name: "", logo_url: "", website_url: "", tier: "silver", display_order: 0, is_published: true });
    setDialogOpen(true);
  };

  const openEdit = (s: Sponsor) => {
    setEditingSponsor(s);
    setForm({
      company_name: s.company_name, logo_url: s.logo_url || "", website_url: s.website_url || "",
      tier: s.tier, display_order: s.display_order, is_published: s.is_published,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editingSponsor) {
        await api.sponsors.update(editingSponsor.id, form);
        toast({ title: "Спонсор обновлён" });
      } else {
        await api.sponsors.create(form);
        toast({ title: "Спонсор добавлен" });
      }
      setDialogOpen(false);
      loadSponsors();
    } catch {
      toast({ title: "Ошибка сохранения", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Удалить спонсора?")) return;
    try {
      await api.sponsors.delete(id);
      toast({ title: "Спонсор удалён" });
      loadSponsors();
    } catch {
      toast({ title: "Ошибка удаления", variant: "destructive" });
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const result = await api.media.uploadToPath(file);
      setForm(prev => ({ ...prev, logo_url: result.publicUrl }));
      toast({ title: "Логотип загружен" });
    } catch {
      toast({ title: "Ошибка загрузки", variant: "destructive" });
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="flex items-center gap-3 text-muted-foreground">
        <div className="w-5 h-5 border-2 border-neon-cyan border-t-transparent rounded-full animate-spin" />
        <span className="text-sm">Загрузка спонсоров...</span>
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-neon-magenta/10 flex items-center justify-center">
            <Handshake className="w-4.5 h-4.5 text-neon-magenta" />
          </div>
          <div>
            <h2 className="font-display text-lg font-bold">Спонсоры</h2>
            <p className="text-xs text-muted-foreground">{sponsors.length} {sponsors.length === 1 ? "спонсор" : "спонсоров"}</p>
          </div>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate} className="bg-neon-cyan text-background hover:bg-neon-cyan/90 font-bold text-xs uppercase tracking-wider">
              <Plus className="w-4 h-4 mr-1.5" /> Добавить
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-display">{editingSponsor ? "Редактировать спонсора" : "Новый спонсор"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div><Label className="text-xs">Компания *</Label><Input value={form.company_name} onChange={e => setForm(p => ({ ...p, company_name: e.target.value }))} className="mt-1" /></div>
              <div><Label className="text-xs">Сайт</Label><Input value={form.website_url} onChange={e => setForm(p => ({ ...p, website_url: e.target.value }))} placeholder="https://..." className="mt-1" /></div>
              <div>
                <Label className="text-xs">Логотип</Label>
                <Input type="file" accept="image/*" onChange={handleLogoUpload} className="mt-1" />
                {form.logo_url && <img src={form.logo_url} alt="" className="w-20 h-20 object-contain rounded-lg mt-2" />}
                <Input className="mt-2" placeholder="Или URL логотипа" value={form.logo_url} onChange={e => setForm(p => ({ ...p, logo_url: e.target.value }))} />
              </div>
              <div>
                <Label className="text-xs">Пакет</Label>
                <div className="flex gap-1.5 mt-1.5">
                  {(["silver", "gold", "platinum"] as const).map(t => {
                    const cfg = tierConfig[t];
                    return (
                      <button
                        key={t}
                        onClick={() => setForm(p => ({ ...p, tier: t }))}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          form.tier === t
                            ? `${cfg.bg} ${cfg.color} border border-current/30`
                            : "bg-muted/50 text-muted-foreground border border-transparent hover:border-border"
                        }`}
                      >
                        <cfg.icon className="w-3.5 h-3.5" />
                        {cfg.label}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label className="text-xs">Порядок</Label><Input type="number" value={form.display_order} onChange={e => setForm(p => ({ ...p, display_order: parseInt(e.target.value) || 0 }))} className="mt-1" /></div>
                <div className="flex items-center gap-2 pt-5"><Switch checked={form.is_published} onCheckedChange={v => setForm(p => ({ ...p, is_published: v }))} /><Label className="text-xs">Опубликован</Label></div>
              </div>
              <Button onClick={handleSave} className="w-full bg-neon-cyan text-background hover:bg-neon-cyan/90 font-bold">Сохранить</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-2">
        {sponsors.map(s => {
          const cfg = tierConfig[s.tier] || tierConfig.silver;
          return (
            <div
              key={s.id}
              className={`group flex items-center gap-4 p-4 rounded-xl border bg-card/50 hover:bg-card transition-all ${
                !s.is_published ? "opacity-50 border-border" : s.tier === "platinum" ? "border-neon-magenta/20 hover:border-neon-magenta/40" : "border-border hover:border-neon-cyan/30"
              }`}
            >
              {s.logo_url ? (
                <img src={s.logo_url} alt={s.company_name} className="w-12 h-12 object-contain rounded-lg" />
              ) : (
                <div className={`w-12 h-12 rounded-xl ${cfg.bg} flex items-center justify-center ${cfg.color} font-bold text-lg`}>
                  {s.company_name.charAt(0)}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-display font-bold text-sm">{s.company_name}</p>
                  <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold ${cfg.bg} ${cfg.color} uppercase tracking-wider`}>
                    <cfg.icon className="w-3 h-3" /> {cfg.label}
                  </span>
                  {!s.is_published && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-muted text-muted-foreground uppercase tracking-wider">Черновик</span>
                  )}
                </div>
                {s.website_url && <p className="text-xs text-muted-foreground mt-0.5">{s.website_url}</p>}
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEdit(s)} className="p-2 rounded-lg hover:bg-muted/80 transition-colors text-muted-foreground hover:text-foreground">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(s.id)} className="p-2 rounded-lg hover:bg-red-500/10 transition-colors text-muted-foreground hover:text-red-400">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
        {sponsors.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-14 h-14 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
              <Handshake className="w-7 h-7 text-muted-foreground/50" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">Спонсоров пока нет</p>
            <p className="text-xs text-muted-foreground/60 mt-1">Нажмите «Добавить» чтобы создать первого спонсора</p>
          </div>
        )}
      </div>
    </div>
  );
}
