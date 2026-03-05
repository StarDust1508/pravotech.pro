import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import type { Sponsor } from "@/lib/api";

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

  if (loading) return <p className="text-muted-foreground">Загрузка...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Спонсоры ({sponsors.length})</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate}><Plus className="w-4 h-4 mr-2" /> Добавить</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingSponsor ? "Редактировать спонсора" : "Новый спонсор"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div><Label>Компания *</Label><Input value={form.company_name} onChange={e => setForm(p => ({ ...p, company_name: e.target.value }))} /></div>
              <div><Label>Сайт</Label><Input value={form.website_url} onChange={e => setForm(p => ({ ...p, website_url: e.target.value }))} placeholder="https://..." /></div>
              <div>
                <Label>Логотип</Label>
                <Input type="file" accept="image/*" onChange={handleLogoUpload} />
                {form.logo_url && <img src={form.logo_url} alt="" className="w-20 h-20 object-contain rounded mt-2" />}
                <Input className="mt-2" placeholder="Или URL логотипа" value={form.logo_url} onChange={e => setForm(p => ({ ...p, logo_url: e.target.value }))} />
              </div>
              <div>
                <Label>Пакет</Label>
                <div className="flex gap-2 mt-1">
                  {["silver", "gold", "platinum"].map(t => (
                    <Button key={t} variant={form.tier === t ? "default" : "outline"} size="sm" onClick={() => setForm(p => ({ ...p, tier: t }))}>
                      {t === "silver" ? "Серебро" : t === "gold" ? "Золото" : "Платина"}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Порядок</Label><Input type="number" value={form.display_order} onChange={e => setForm(p => ({ ...p, display_order: parseInt(e.target.value) || 0 }))} /></div>
                <div className="flex items-center gap-2 pt-6"><Switch checked={form.is_published} onCheckedChange={v => setForm(p => ({ ...p, is_published: v }))} /><Label>Опубликован</Label></div>
              </div>
              <Button onClick={handleSave} className="w-full">Сохранить</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {sponsors.map(s => (
          <Card key={s.id} className={!s.is_published ? "opacity-50" : ""}>
            <CardContent className="flex items-center gap-4 p-4">
              {s.logo_url && <img src={s.logo_url} alt={s.company_name} className="w-14 h-14 object-contain" />}
              <div className="flex-1">
                <p className="font-bold">{s.company_name}</p>
                <p className="text-sm text-muted-foreground capitalize">{s.tier === "silver" ? "Серебро" : s.tier === "gold" ? "Золото" : "Платина"}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => openEdit(s)}><Pencil className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(s.id)}><Trash2 className="w-4 h-4 text-red-500" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {sponsors.length === 0 && <p className="text-muted-foreground text-center py-8">Спонсоров пока нет</p>}
      </div>
    </div>
  );
}
