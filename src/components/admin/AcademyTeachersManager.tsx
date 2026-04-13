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
import type { AcademyTeacher } from "@/lib/api";

export function AcademyTeachersManager() {
  const { toast } = useToast();
  const [teachers, setTeachers] = useState<AcademyTeacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<AcademyTeacher | null>(null);
  const [form, setForm] = useState({
    full_name: "", position: "", bio: "", expertise: "", experience: "",
    photo_url: "", display_order: 0, is_published: true,
  });

  const load = async () => {
    try {
      setLoading(true);
      setTeachers(await api.academy.teachers(true));
    } catch {
      toast({ title: "Ошибка загрузки преподавателей", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ full_name: "", position: "", bio: "", expertise: "", experience: "", photo_url: "", display_order: 0, is_published: true });
    setDialogOpen(true);
  };

  const openEdit = (t: AcademyTeacher) => {
    setEditing(t);
    setForm({
      full_name: t.full_name || "", position: t.position || "", bio: t.bio || "",
      expertise: t.expertise || "", experience: t.experience || "",
      photo_url: t.photo_url || "", display_order: (t as any).display_order || 0,
      is_published: (t as any).is_published !== false,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editing) {
        await api.academy.updateTeacher(editing.id, form);
        toast({ title: "Преподаватель обновлён" });
      } else {
        await api.academy.createTeacher(form);
        toast({ title: "Преподаватель добавлен" });
      }
      setDialogOpen(false);
      load();
    } catch {
      toast({ title: "Ошибка сохранения", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Удалить преподавателя?")) return;
    try {
      await api.academy.deleteTeacher(id);
      toast({ title: "Преподаватель удалён" });
      load();
    } catch {
      toast({ title: "Ошибка удаления", variant: "destructive" });
    }
  };

  const togglePublish = async (t: AcademyTeacher) => {
    try {
      await api.academy.toggleTeacherPublish(t.id, !(t as any).is_published);
      load();
    } catch {
      toast({ title: "Ошибка", variant: "destructive" });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const result = await api.media.uploadToPath(file);
      setForm(p => ({ ...p, photo_url: result.publicUrl }));
      toast({ title: "Фото загружено" });
    } catch {
      toast({ title: "Ошибка загрузки фото", variant: "destructive" });
    }
  };

  if (loading) return <p className="text-muted-foreground">Загрузка...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Преподаватели ({teachers.length})</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate}><Plus className="w-4 h-4 mr-2" /> Добавить</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editing ? "Редактировать преподавателя" : "Новый преподаватель"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><Label>ФИО *</Label><Input value={form.full_name} onChange={e => setForm(p => ({ ...p, full_name: e.target.value }))} /></div>
                <div><Label>Должность</Label><Input value={form.position} onChange={e => setForm(p => ({ ...p, position: e.target.value }))} /></div>
              </div>
              <div><Label>Биография</Label><Textarea value={form.bio} onChange={e => setForm(p => ({ ...p, bio: e.target.value }))} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Экспертиза</Label><Input value={form.expertise} onChange={e => setForm(p => ({ ...p, expertise: e.target.value }))} /></div>
                <div><Label>Опыт</Label><Input value={form.experience} onChange={e => setForm(p => ({ ...p, experience: e.target.value }))} /></div>
              </div>
              <div>
                <Label>Фото</Label>
                <Input type="file" accept="image/*" onChange={handleImageUpload} />
                {form.photo_url && <img src={form.photo_url} alt="" className="w-20 h-20 object-cover rounded-full mt-2" />}
                <Input className="mt-2" placeholder="Или URL фото" value={form.photo_url} onChange={e => setForm(p => ({ ...p, photo_url: e.target.value }))} />
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
        {teachers.map(t => (
          <Card key={t.id} className={!(t as any).is_published ? "opacity-50" : ""}>
            <CardContent className="flex items-center gap-4 p-4">
              {t.photo_url && <img src={t.photo_url} alt={t.full_name} className="w-14 h-14 rounded-full object-cover" />}
              <div className="flex-1 min-w-0">
                <p className="font-bold">{t.full_name}</p>
                <p className="text-sm text-muted-foreground">{t.position}</p>
                {t.bio && <p className="text-xs text-muted-foreground mt-1">{t.bio}</p>}
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={(t as any).is_published} onCheckedChange={() => togglePublish(t)} />
                <Button variant="ghost" size="icon" onClick={() => openEdit(t)}><Pencil className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(t.id)}><Trash2 className="w-4 h-4 text-red-500" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {teachers.length === 0 && <p className="text-muted-foreground text-center py-8">Преподавателей пока нет</p>}
      </div>
    </div>
  );
}
