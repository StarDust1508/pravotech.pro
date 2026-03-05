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
import type { Stream } from "@/lib/api";

const ICONS = ["Scale", "Brain", "Shield", "FileText", "Users", "Landmark", "Gavel", "Database", "Globe", "Lock"];

export function StreamsManager() {
  const { toast } = useToast();
  const [streams, setStreams] = useState<Stream[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingStream, setEditingStream] = useState<Stream | null>(null);
  const [form, setForm] = useState({
    title: "", description: "", icon: "Scale", display_order: 0, is_highlighted: false, is_published: true,
  });

  const loadStreams = async () => {
    try {
      setLoading(true);
      const data = await api.streams.list();
      setStreams(data);
    } catch {
      toast({ title: "Ошибка загрузки потоков", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadStreams(); }, []);

  const openCreate = () => {
    setEditingStream(null);
    setForm({ title: "", description: "", icon: "Scale", display_order: 0, is_highlighted: false, is_published: true });
    setDialogOpen(true);
  };

  const openEdit = (s: Stream) => {
    setEditingStream(s);
    setForm({
      title: s.title, description: s.description || "", icon: s.icon || "Scale",
      display_order: s.display_order, is_highlighted: s.is_highlighted, is_published: s.is_published,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editingStream) {
        await api.streams.update(editingStream.id, form);
        toast({ title: "Поток обновлён" });
      } else {
        await api.streams.create(form);
        toast({ title: "Поток добавлен" });
      }
      setDialogOpen(false);
      loadStreams();
    } catch {
      toast({ title: "Ошибка сохранения", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Удалить поток?")) return;
    try {
      await api.streams.delete(id);
      toast({ title: "Поток удалён" });
      loadStreams();
    } catch {
      toast({ title: "Ошибка удаления", variant: "destructive" });
    }
  };

  if (loading) return <p className="text-muted-foreground">Загрузка...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Потоки ({streams.length})</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate}><Plus className="w-4 h-4 mr-2" /> Добавить</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingStream ? "Редактировать поток" : "Новый поток"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div><Label>Название *</Label><Input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} /></div>
              <div><Label>Описание</Label><Textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} /></div>
              <div>
                <Label>Иконка</Label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {ICONS.map(icon => (
                    <Button key={icon} variant={form.icon === icon ? "default" : "outline"} size="sm" onClick={() => setForm(p => ({ ...p, icon }))}>{icon}</Button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Порядок</Label><Input type="number" value={form.display_order} onChange={e => setForm(p => ({ ...p, display_order: parseInt(e.target.value) || 0 }))} /></div>
              </div>
              <div className="flex gap-6">
                <div className="flex items-center gap-2"><Switch checked={form.is_highlighted} onCheckedChange={v => setForm(p => ({ ...p, is_highlighted: v }))} /><Label>Выделен</Label></div>
                <div className="flex items-center gap-2"><Switch checked={form.is_published} onCheckedChange={v => setForm(p => ({ ...p, is_published: v }))} /><Label>Опубликован</Label></div>
              </div>
              <Button onClick={handleSave} className="w-full">Сохранить</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {streams.map(s => (
          <Card key={s.id} className={!s.is_published ? "opacity-50" : ""}>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-xs font-mono">{s.icon}</div>
              <div className="flex-1">
                <p className="font-bold">{s.title} {s.is_highlighted && <span className="text-neon-magenta text-xs">★ выделен</span>}</p>
                <p className="text-sm text-muted-foreground">{s.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => openEdit(s)}><Pencil className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(s.id)}><Trash2 className="w-4 h-4 text-red-500" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {streams.length === 0 && <p className="text-muted-foreground text-center py-8">Потоков пока нет</p>}
      </div>
    </div>
  );
}
