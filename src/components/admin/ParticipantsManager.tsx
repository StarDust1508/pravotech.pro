import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Plus, Pencil, Trash2, Users, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import type { Participant } from "@/lib/api";

export function ParticipantsManager() {
  const { toast } = useToast();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingParticipant, setEditingParticipant] = useState<Participant | null>(null);
  const [form, setForm] = useState({
    company_name: "",
    logo_url: "",
    website_url: "",
    industry: "",
    description: "",
    display_order: 0,
    is_published: true,
  });

  const loadParticipants = async () => {
    try {
      setLoading(true);
      const data = await api.participants.list();
      setParticipants(data);
    } catch {
      toast({ title: "Ошибка загрузки участников", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadParticipants(); }, []);

  const openCreate = () => {
    setEditingParticipant(null);
    setForm({
      company_name: "",
      logo_url: "",
      website_url: "",
      industry: "",
      description: "",
      display_order: 0,
      is_published: true,
    });
    setDialogOpen(true);
  };

  const openEdit = (p: Participant) => {
    setEditingParticipant(p);
    setForm({
      company_name: p.company_name,
      logo_url: p.logo_url || "",
      website_url: p.website_url || "",
      industry: p.industry || "",
      description: p.description || "",
      display_order: p.display_order,
      is_published: p.is_published,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editingParticipant) {
        await api.participants.update(editingParticipant.id, form);
        toast({ title: "Участник обновлён" });
      } else {
        await api.participants.create(form);
        toast({ title: "Участник добавлен" });
      }
      setDialogOpen(false);
      loadParticipants();
    } catch {
      toast({ title: "Ошибка сохранения", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Удалить участника?")) return;
    try {
      await api.participants.delete(id);
      toast({ title: "Участник удалён" });
      loadParticipants();
    } catch {
      toast({ title: "Ошибка удаления", variant: "destructive" });
    }
  };

  const togglePublish = async (p: Participant) => {
    try {
      await api.participants.togglePublish(p.id, !p.is_published);
      loadParticipants();
    } catch {
      toast({ title: "Ошибка", variant: "destructive" });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const result = await api.media.uploadToPath(file);
      setForm(prev => ({ ...prev, logo_url: result.publicUrl }));
      toast({ title: "Логотип загружен" });
    } catch {
      toast({ title: "Ошибка загрузки логотипа", variant: "destructive" });
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="flex items-center gap-3 text-muted-foreground">
        <div className="w-5 h-5 border-2 border-neon-cyan border-t-transparent rounded-full animate-spin" />
        <span className="text-sm">Загрузка участников...</span>
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-neon-cyan/10 flex items-center justify-center">
            <Users className="w-4.5 h-4.5 text-neon-cyan" />
          </div>
          <div>
            <h2 className="font-display text-lg font-bold">Участники</h2>
            <p className="text-xs text-muted-foreground">{participants.length} компаний</p>
          </div>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate} className="bg-neon-cyan text-background hover:bg-neon-cyan/90 font-bold text-xs uppercase tracking-wider">
              <Plus className="w-4 h-4 mr-1.5" /> Добавить
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-display">{editingParticipant ? "Редактировать участника" : "Новый участник"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div><Label className="text-xs">Название компании *</Label><Input value={form.company_name} onChange={e => setForm(p => ({ ...p, company_name: e.target.value }))} className="mt-1" /></div>
                <div><Label className="text-xs">Отрасль</Label><Input value={form.industry} onChange={e => setForm(p => ({ ...p, industry: e.target.value }))} className="mt-1" /></div>
              </div>
              <div><Label className="text-xs">Описание</Label><Textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} className="mt-1" /></div>
              <div><Label className="text-xs">Сайт</Label><Input value={form.website_url} onChange={e => setForm(p => ({ ...p, website_url: e.target.value }))} placeholder="https://example.com" className="mt-1" /></div>
              <div>
                <Label className="text-xs">Логотип</Label>
                <Input type="file" accept="image/*" onChange={handleImageUpload} className="mt-1" />
                {form.logo_url && <img src={form.logo_url} alt="" className="w-20 h-20 object-contain rounded-lg mt-2" />}
                <Input className="mt-2" placeholder="Или URL логотипа" value={form.logo_url} onChange={e => setForm(p => ({ ...p, logo_url: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label className="text-xs">Порядок отображения</Label><Input type="number" value={form.display_order} onChange={e => setForm(p => ({ ...p, display_order: parseInt(e.target.value) || 0 }))} className="mt-1" /></div>
                <div className="flex items-center gap-2 pt-5"><Switch checked={form.is_published} onCheckedChange={v => setForm(p => ({ ...p, is_published: v }))} /><Label className="text-xs">Опубликован</Label></div>
              </div>
              <Button onClick={handleSave} className="w-full bg-neon-cyan text-background hover:bg-neon-cyan/90 font-bold">Сохранить</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-2">
        {participants.map(p => (
          <div
            key={p.id}
            className={`group flex items-center gap-4 p-4 rounded-xl border border-border bg-card/50 hover:border-neon-cyan/30 hover:bg-card transition-all ${
              !p.is_published ? "opacity-50" : ""
            }`}
          >
            {p.logo_url ? (
              <img src={p.logo_url} alt={p.company_name} className="w-12 h-12 object-contain rounded-lg" />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-neon-cyan/10 flex items-center justify-center text-neon-cyan font-bold text-sm">
                {p.company_name.charAt(0)}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-display font-bold text-sm">{p.company_name}</p>
                {p.industry && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-muted text-muted-foreground">{p.industry}</span>
                )}
                {!p.is_published && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-muted text-muted-foreground uppercase tracking-wider">Черновик</span>
                )}
              </div>
              {p.website_url && <p className="text-xs text-muted-foreground mt-0.5">{(() => { try { return new URL(p.website_url).hostname; } catch { return p.website_url; } })()}</p>}
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => togglePublish(p)}
                className="p-2 rounded-lg hover:bg-muted/80 transition-colors text-muted-foreground hover:text-foreground"
                title={p.is_published ? "Снять с публикации" : "Опубликовать"}
              >
                {p.is_published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
              <button onClick={() => openEdit(p)} className="p-2 rounded-lg hover:bg-muted/80 transition-colors text-muted-foreground hover:text-foreground">
                <Pencil className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(p.id)} className="p-2 rounded-lg hover:bg-red-500/10 transition-colors text-muted-foreground hover:text-red-400">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        {participants.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-14 h-14 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
              <Users className="w-7 h-7 text-muted-foreground/50" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">Участников пока нет</p>
            <p className="text-xs text-muted-foreground/60 mt-1">Нажмите «Добавить» чтобы создать первого участника</p>
          </div>
        )}
      </div>
    </div>
  );
}