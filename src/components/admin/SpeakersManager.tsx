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
import type { Speaker } from "@/lib/api";

export function SpeakersManager() {
  const { toast } = useToast();
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSpeaker, setEditingSpeaker] = useState<Speaker | null>(null);
  const [form, setForm] = useState({
    full_name: "", position: "", company: "", bio: "", photo_url: "",
    stream: "", talk_title: "", talk_description: "", display_order: 0, is_published: true,
  });

  const loadSpeakers = async () => {
    try {
      setLoading(true);
      const data = await api.speakers.list();
      setSpeakers(data);
    } catch {
      toast({ title: "Ошибка загрузки спикеров", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadSpeakers(); }, []);

  const openCreate = () => {
    setEditingSpeaker(null);
    setForm({ full_name: "", position: "", company: "", bio: "", photo_url: "", stream: "", talk_title: "", talk_description: "", display_order: 0, is_published: true });
    setDialogOpen(true);
  };

  const openEdit = (s: Speaker) => {
    setEditingSpeaker(s);
    setForm({
      full_name: s.full_name, position: s.position || "", company: s.company || "",
      bio: s.bio || "", photo_url: s.photo_url || "", stream: s.stream || "",
      talk_title: s.talk_title || "", talk_description: s.talk_description || "",
      display_order: s.display_order, is_published: s.is_published,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editingSpeaker) {
        await api.speakers.update(editingSpeaker.id, form);
        toast({ title: "Спикер обновлён" });
      } else {
        await api.speakers.create(form);
        toast({ title: "Спикер добавлен" });
      }
      setDialogOpen(false);
      loadSpeakers();
    } catch {
      toast({ title: "Ошибка сохранения", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Удалить спикера?")) return;
    try {
      await api.speakers.delete(id);
      toast({ title: "Спикер удалён" });
      loadSpeakers();
    } catch {
      toast({ title: "Ошибка удаления", variant: "destructive" });
    }
  };

  const togglePublish = async (s: Speaker) => {
    try {
      await api.speakers.togglePublish(s.id, !s.is_published);
      loadSpeakers();
    } catch {
      toast({ title: "Ошибка", variant: "destructive" });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const result = await api.media.uploadToPath(file);
      setForm(prev => ({ ...prev, photo_url: result.publicUrl }));
      toast({ title: "Фото загружено" });
    } catch {
      toast({ title: "Ошибка загрузки фото", variant: "destructive" });
    }
  };

  if (loading) return <p className="text-muted-foreground">Загрузка...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Спикеры ({speakers.length})</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate}><Plus className="w-4 h-4 mr-2" /> Добавить</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingSpeaker ? "Редактировать спикера" : "Новый спикер"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><Label>ФИО *</Label><Input value={form.full_name} onChange={e => setForm(p => ({ ...p, full_name: e.target.value }))} /></div>
                <div><Label>Должность</Label><Input value={form.position} onChange={e => setForm(p => ({ ...p, position: e.target.value }))} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Компания</Label><Input value={form.company} onChange={e => setForm(p => ({ ...p, company: e.target.value }))} /></div>
                <div><Label>Поток</Label><Input value={form.stream} onChange={e => setForm(p => ({ ...p, stream: e.target.value }))} /></div>
              </div>
              <div><Label>Тема доклада</Label><Input value={form.talk_title} onChange={e => setForm(p => ({ ...p, talk_title: e.target.value }))} /></div>
              <div><Label>Описание доклада</Label><Textarea value={form.talk_description} onChange={e => setForm(p => ({ ...p, talk_description: e.target.value }))} /></div>
              <div><Label>Биография</Label><Textarea value={form.bio} onChange={e => setForm(p => ({ ...p, bio: e.target.value }))} /></div>
              <div>
                <Label>Фото</Label>
                <Input type="file" accept="image/*" onChange={handleImageUpload} />
                {form.photo_url && <img src={form.photo_url} alt="" className="w-20 h-20 object-cover rounded mt-2" />}
                <Input className="mt-2" placeholder="Или URL фото" value={form.photo_url} onChange={e => setForm(p => ({ ...p, photo_url: e.target.value }))} />
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
        {speakers.map(s => (
          <Card key={s.id} className={!s.is_published ? "opacity-50" : ""}>
            <CardContent className="flex items-center gap-4 p-4">
              {s.photo_url && <img src={s.photo_url} alt={s.full_name} className="w-14 h-14 rounded-full object-cover" />}
              <div className="flex-1 min-w-0">
                <p className="font-bold">{s.full_name}</p>
                <p className="text-sm text-muted-foreground">{s.position}{s.company ? `, ${s.company}` : ""}</p>
                {s.talk_title && <p className="text-sm text-neon-cyan mt-1">📎 {s.talk_title}</p>}
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={s.is_published} onCheckedChange={() => togglePublish(s)} />
                <Button variant="ghost" size="icon" onClick={() => openEdit(s)}><Pencil className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(s.id)}><Trash2 className="w-4 h-4 text-red-500" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {speakers.length === 0 && <p className="text-muted-foreground text-center py-8">Спикеров пока нет</p>}
      </div>
    </div>
  );
}
