import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Plus, Pencil, Trash2, Radio, Sparkles } from "lucide-react";
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

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="flex items-center gap-3 text-muted-foreground">
        <div className="w-5 h-5 border-2 border-neon-cyan border-t-transparent rounded-full animate-spin" />
        <span className="text-sm">Загрузка потоков...</span>
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-neon-cyan/10 flex items-center justify-center">
            <Radio className="w-4.5 h-4.5 text-neon-cyan" />
          </div>
          <div>
            <h2 className="font-display text-lg font-bold">Потоки</h2>
            <p className="text-xs text-muted-foreground">{streams.length} {streams.length === 1 ? "поток" : "потоков"}</p>
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
              <DialogTitle className="font-display">{editingStream ? "Редактировать поток" : "Новый поток"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div><Label className="text-xs">Название *</Label><Input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} className="mt-1" /></div>
              <div><Label className="text-xs">Описание</Label><Textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} className="mt-1" /></div>
              <div>
                <Label className="text-xs">Иконка</Label>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {ICONS.map(icon => (
                    <button
                      key={icon}
                      onClick={() => setForm(p => ({ ...p, icon }))}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        form.icon === icon
                          ? "bg-neon-cyan/15 text-neon-cyan border border-neon-cyan/30"
                          : "bg-muted/50 text-muted-foreground border border-transparent hover:border-border"
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
              <div><Label className="text-xs">Порядок</Label><Input type="number" value={form.display_order} onChange={e => setForm(p => ({ ...p, display_order: parseInt(e.target.value) || 0 }))} className="mt-1" /></div>
              <div className="flex gap-6">
                <div className="flex items-center gap-2"><Switch checked={form.is_highlighted} onCheckedChange={v => setForm(p => ({ ...p, is_highlighted: v }))} /><Label className="text-xs">Выделен</Label></div>
                <div className="flex items-center gap-2"><Switch checked={form.is_published} onCheckedChange={v => setForm(p => ({ ...p, is_published: v }))} /><Label className="text-xs">Опубликован</Label></div>
              </div>
              <Button onClick={handleSave} className="w-full bg-neon-cyan text-background hover:bg-neon-cyan/90 font-bold">Сохранить</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-2">
        {streams.map((s, i) => (
          <div
            key={s.id}
            className={`group flex items-center gap-4 p-4 rounded-xl border bg-card/50 hover:bg-card transition-all ${
              !s.is_published ? "opacity-50 border-border" : s.is_highlighted ? "border-neon-magenta/30 hover:border-neon-magenta/50" : "border-border hover:border-neon-cyan/30"
            }`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-mono font-bold ${
              s.is_highlighted ? "bg-neon-magenta/10 text-neon-magenta" : "bg-muted/80 text-muted-foreground"
            }`}>
              {s.icon?.substring(0, 2) || (i + 1)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-display font-bold text-sm">{s.title}</p>
                {s.is_highlighted && (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-neon-magenta/10 text-neon-magenta uppercase tracking-wider">
                    <Sparkles className="w-3 h-3" /> Выделен
                  </span>
                )}
                {!s.is_published && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-muted text-muted-foreground uppercase tracking-wider">Черновик</span>
                )}
              </div>
              {s.description && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{s.description}</p>}
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
        ))}
        {streams.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-14 h-14 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
              <Radio className="w-7 h-7 text-muted-foreground/50" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">Потоков пока нет</p>
            <p className="text-xs text-muted-foreground/60 mt-1">Нажмите «Добавить» чтобы создать первый поток</p>
          </div>
        )}
      </div>
    </div>
  );
}
