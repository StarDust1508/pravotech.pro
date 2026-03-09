import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Plus, Pencil, Trash2 } from "lucide-react";
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

  if (loading) return <p className="text-muted-foreground">Загрузка...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Участники ({participants.length})</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate}><Plus className="w-4 h-4 mr-2" /> Добавить</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingParticipant ? "Редактировать участника" : "Новый участник"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Название компании *</Label><Input value={form.company_name} onChange={e => setForm(p => ({ ...p, company_name: e.target.value }))} /></div>
                <div><Label>Отрасль</Label><Input value={form.industry} onChange={e => setForm(p => ({ ...p, industry: e.target.value }))} /></div>
              </div>
              <div><Label>Описание</Label><Textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} /></div>
              <div><Label>Сайт</Label><Input value={form.website_url} onChange={e => setForm(p => ({ ...p, website_url: e.target.value }))} placeholder="https://example.com" /></div>
              <div>
                <Label>Логотип</Label>
                <Input type="file" accept="image/*" onChange={handleImageUpload} />
                {form.logo_url && <img src={form.logo_url} alt="" className="w-20 h-20 object-contain mt-2" />}
                <Input className="mt-2" placeholder="Или URL логотипа" value={form.logo_url} onChange={e => setForm(p => ({ ...p, logo_url: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Порядок отображения</Label><Input type="number" value={form.display_order} onChange={e => setForm(p => ({ ...p, display_order: parseInt(e.target.value) || 0 }))} /></div>
                <div className="flex items-center gap-2 pt-6"><Switch checked={form.is_published} onCheckedChange={v => setForm(p => ({ ...p, is_published: v }))} /><Label>Опубликован</Label></div>
              </div>
              <Button onClick={handleSave} className="w-full">Сохранить</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {participants.map(p => (
          <Card key={p.id} className={!p.is_published ? "opacity-50" : ""}>
            <CardContent className="flex items-center gap-4 p-4">
              {p.logo_url && <img src={p.logo_url} alt={p.company_name} className="w-14 h-14 object-contain" />}
              <div className="flex-1 min-w-0">
                <p className="font-bold">{p.company_name}</p>
                <p className="text-sm text-muted-foreground">{p.industry}{p.website_url && ` • ${new URL(p.website_url).hostname}`}</p>
                {p.description && <p className="text-sm text-muted-foreground mt-1">{p.description}</p>}
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={p.is_published} onCheckedChange={() => togglePublish(p)} />
                <Button variant="ghost" size="icon" onClick={() => openEdit(p)}><Pencil className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)}><Trash2 className="w-4 h-4 text-red-500" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {participants.length === 0 && <p className="text-muted-foreground text-center py-8">Участников пока нет</p>}
      </div>
    </div>
  );
}