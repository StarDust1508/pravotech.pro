import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Plus, Pencil, Trash2, Mic2, Eye, EyeOff } from "lucide-react";
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

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="flex items-center gap-3 text-muted-foreground">
        <div className="w-5 h-5 border-2 border-neon-cyan border-t-transparent rounded-full animate-spin" />
        <span className="text-sm">Загрузка спикеров...</span>
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-neon-cyan/10 flex items-center justify-center">
            <Mic2 className="w-4.5 h-4.5 text-neon-cyan" />
          </div>
          <div>
            <h2 className="font-display text-lg font-bold">Спикеры</h2>
            <p className="text-xs text-muted-foreground">{speakers.length} {speakers.length === 1 ? "спикер" : "спикеров"}</p>
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
              <DialogTitle className="font-display">{editingSpeaker ? "Редактировать спикера" : "Новый спикер"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-5">
              <div className="space-y-3">
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">Персональные данные</div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label className="text-xs">ФИО *</Label><Input value={form.full_name} onChange={e => setForm(p => ({ ...p, full_name: e.target.value }))} className="mt-1" /></div>
                  <div><Label className="text-xs">Должность</Label><Input value={form.position} onChange={e => setForm(p => ({ ...p, position: e.target.value }))} className="mt-1" /></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label className="text-xs">Компания</Label><Input value={form.company} onChange={e => setForm(p => ({ ...p, company: e.target.value }))} className="mt-1" /></div>
                  <div><Label className="text-xs">Поток</Label><Input value={form.stream} onChange={e => setForm(p => ({ ...p, stream: e.target.value }))} className="mt-1" /></div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">Доклад</div>
                <div><Label className="text-xs">Тема доклада</Label><Input value={form.talk_title} onChange={e => setForm(p => ({ ...p, talk_title: e.target.value }))} className="mt-1" /></div>
                <div><Label className="text-xs">Описание доклада</Label><Textarea value={form.talk_description} onChange={e => setForm(p => ({ ...p, talk_description: e.target.value }))} className="mt-1" /></div>
              </div>
              <div className="space-y-3">
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">Дополнительно</div>
                <div><Label className="text-xs">Биография</Label><Textarea value={form.bio} onChange={e => setForm(p => ({ ...p, bio: e.target.value }))} className="mt-1" /></div>
                <div>
                  <Label className="text-xs">Фото</Label>
                  <Input type="file" accept="image/*" onChange={handleImageUpload} className="mt-1" />
                  {form.photo_url && <img src={form.photo_url} alt="" className="w-20 h-20 object-cover rounded-lg mt-2" />}
                  <Input className="mt-2" placeholder="Или URL фото" value={form.photo_url} onChange={e => setForm(p => ({ ...p, photo_url: e.target.value }))} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label className="text-xs">Порядок отображения</Label><Input type="number" value={form.display_order} onChange={e => setForm(p => ({ ...p, display_order: parseInt(e.target.value) || 0 }))} className="mt-1" /></div>
                  <div className="flex items-center gap-2 pt-5"><Switch checked={form.is_published} onCheckedChange={v => setForm(p => ({ ...p, is_published: v }))} /><Label className="text-xs">Опубликован</Label></div>
                </div>
              </div>
              <Button onClick={handleSave} className="w-full bg-neon-cyan text-background hover:bg-neon-cyan/90 font-bold">Сохранить</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-2">
        {speakers.map(s => (
          <div
            key={s.id}
            className={`group flex items-center gap-4 p-4 rounded-xl border border-border bg-card/50 hover:border-neon-cyan/30 hover:bg-card transition-all ${
              !s.is_published ? "opacity-50" : ""
            }`}
          >
            {s.photo_url ? (
              <img src={s.photo_url} alt={s.full_name} className="w-12 h-12 rounded-full object-cover ring-2 ring-border" />
            ) : (
              <div className="w-12 h-12 rounded-full bg-neon-cyan/10 flex items-center justify-center text-neon-cyan font-bold text-sm">
                {s.full_name.charAt(0)}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-display font-bold text-sm">{s.full_name}</p>
                {!s.is_published && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-muted text-muted-foreground uppercase tracking-wider">Черновик</span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{s.position}{s.company ? ` · ${s.company}` : ""}</p>
              {s.talk_title && (
                <p className="text-xs text-neon-cyan mt-1 flex items-center gap-1.5">
                  <Mic2 className="w-3 h-3" /> {s.talk_title}
                </p>
              )}
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => togglePublish(s)}
                className="p-2 rounded-lg hover:bg-muted/80 transition-colors text-muted-foreground hover:text-foreground"
                title={s.is_published ? "Снять с публикации" : "Опубликовать"}
              >
                {s.is_published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
              <button onClick={() => openEdit(s)} className="p-2 rounded-lg hover:bg-muted/80 transition-colors text-muted-foreground hover:text-foreground">
                <Pencil className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(s.id)} className="p-2 rounded-lg hover:bg-red-500/10 transition-colors text-muted-foreground hover:text-red-400">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        {speakers.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-14 h-14 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
              <Mic2 className="w-7 h-7 text-muted-foreground/50" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">Спикеров пока нет</p>
            <p className="text-xs text-muted-foreground/60 mt-1">Нажмите «Добавить» чтобы создать первого спикера</p>
          </div>
        )}
      </div>
    </div>
  );
}
