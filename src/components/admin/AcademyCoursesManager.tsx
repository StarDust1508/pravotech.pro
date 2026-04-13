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
import type { AcademyCourse } from "@/lib/api";

export function AcademyCoursesManager() {
  const { toast } = useToast();
  const [courses, setCourses] = useState<AcademyCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<AcademyCourse | null>(null);
  const [form, setForm] = useState({
    title: "", slug: "", description: "", hero_title: "", hero_subtitle: "",
    hero_description: "", price: "", level: "", display_order: 0, is_published: true,
    intro_title: "", intro_description: "",
    cta_title: "", cta_description: "", cta_button_text: "",
    program_badge: "", program_format_title: "", program_format_description: "",
  });

  const load = async () => {
    try {
      setLoading(true);
      setCourses(await api.academy.courses(true));
    } catch {
      toast({ title: "Ошибка загрузки курсов", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({
      title: "", slug: "", description: "", hero_title: "", hero_subtitle: "",
      hero_description: "", price: "", level: "", display_order: 0, is_published: true,
      intro_title: "", intro_description: "",
      cta_title: "", cta_description: "", cta_button_text: "",
      program_badge: "", program_format_title: "", program_format_description: "",
    });
    setDialogOpen(true);
  };

  const openEdit = (c: AcademyCourse) => {
    setEditing(c);
    setForm({
      title: c.title || "", slug: c.slug || "", description: c.description || "",
      hero_title: c.hero_title || "", hero_subtitle: c.hero_subtitle || "",
      hero_description: c.hero_description || "", price: c.price || "",
      level: c.level || "", display_order: c.display_order || 0,
      is_published: c.is_published !== false,
      intro_title: c.intro_title || "", intro_description: c.intro_description || "",
      cta_title: c.cta_title || "", cta_description: c.cta_description || "",
      cta_button_text: c.cta_button_text || "",
      program_badge: c.program_badge || "",
      program_format_title: c.program_format_title || "",
      program_format_description: c.program_format_description || "",
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editing) {
        await api.academy.updateCourse(editing.id, form);
        toast({ title: "Курс обновлён" });
      } else {
        await api.academy.createCourse(form);
        toast({ title: "Курс создан" });
      }
      setDialogOpen(false);
      load();
    } catch {
      toast({ title: "Ошибка сохранения", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Удалить курс?")) return;
    try {
      await api.academy.deleteCourse(id);
      toast({ title: "Курс удалён" });
      load();
    } catch {
      toast({ title: "Ошибка удаления", variant: "destructive" });
    }
  };

  const togglePublish = async (c: AcademyCourse) => {
    try {
      await api.academy.toggleCoursePublish(c.id, !c.is_published);
      load();
    } catch {
      toast({ title: "Ошибка", variant: "destructive" });
    }
  };

  if (loading) return <p className="text-muted-foreground">Загрузка...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Курсы Академии ({courses.length})</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate}><Plus className="w-4 h-4 mr-2" /> Добавить</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editing ? "Редактировать курс" : "Новый курс"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Название *</Label><Input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} /></div>
                <div><Label>Slug</Label><Input value={form.slug} onChange={e => setForm(p => ({ ...p, slug: e.target.value }))} placeholder="my-course" /></div>
              </div>
              <div><Label>Описание</Label><Textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Hero заголовок</Label><Input value={form.hero_title} onChange={e => setForm(p => ({ ...p, hero_title: e.target.value }))} /></div>
                <div><Label>Hero подзаголовок</Label><Input value={form.hero_subtitle} onChange={e => setForm(p => ({ ...p, hero_subtitle: e.target.value }))} /></div>
              </div>
              <div><Label>Hero описание</Label><Textarea value={form.hero_description} onChange={e => setForm(p => ({ ...p, hero_description: e.target.value }))} /></div>
              <div className="grid grid-cols-3 gap-4">
                <div><Label>Цена</Label><Input value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))} placeholder="35000" /></div>
                <div><Label>Уровень</Label><Input value={form.level} onChange={e => setForm(p => ({ ...p, level: e.target.value }))} placeholder="Начинающий" /></div>
                <div><Label>Порядок</Label><Input type="number" value={form.display_order} onChange={e => setForm(p => ({ ...p, display_order: parseInt(e.target.value) || 0 }))} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Intro заголовок</Label><Input value={form.intro_title} onChange={e => setForm(p => ({ ...p, intro_title: e.target.value }))} /></div>
                <div><Label>Program badge</Label><Input value={form.program_badge} onChange={e => setForm(p => ({ ...p, program_badge: e.target.value }))} /></div>
              </div>
              <div><Label>Intro описание</Label><Textarea value={form.intro_description} onChange={e => setForm(p => ({ ...p, intro_description: e.target.value }))} /></div>
              <div><Label>Формат обучения заголовок</Label><Input value={form.program_format_title} onChange={e => setForm(p => ({ ...p, program_format_title: e.target.value }))} /></div>
              <div><Label>Формат обучения описание</Label><Textarea value={form.program_format_description} onChange={e => setForm(p => ({ ...p, program_format_description: e.target.value }))} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>CTA заголовок</Label><Input value={form.cta_title} onChange={e => setForm(p => ({ ...p, cta_title: e.target.value }))} /></div>
                <div><Label>CTA кнопка</Label><Input value={form.cta_button_text} onChange={e => setForm(p => ({ ...p, cta_button_text: e.target.value }))} /></div>
              </div>
              <div><Label>CTA описание</Label><Textarea value={form.cta_description} onChange={e => setForm(p => ({ ...p, cta_description: e.target.value }))} /></div>
              <div className="flex items-center gap-2">
                <Switch checked={form.is_published} onCheckedChange={v => setForm(p => ({ ...p, is_published: v }))} />
                <Label>Опубликован</Label>
              </div>
              <Button onClick={handleSave} className="w-full">Сохранить</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {courses.map(c => (
          <Card key={c.id} className={!c.is_published ? "opacity-50" : ""}>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex-1 min-w-0">
                <p className="font-bold">{c.hero_title || c.title}</p>
                <p className="text-sm text-muted-foreground">{c.hero_subtitle || c.description}</p>
                <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
                  {c.slug && <span className="text-neon-cyan">/courses/{c.slug}</span>}
                  {c.price && <span>{Number(c.price).toLocaleString("ru-RU")} ₽</span>}
                  {c.level && <span>{c.level}</span>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={c.is_published} onCheckedChange={() => togglePublish(c)} />
                <Button variant="ghost" size="icon" onClick={() => openEdit(c)}><Pencil className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(c.id)}><Trash2 className="w-4 h-4 text-red-500" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {courses.length === 0 && <p className="text-muted-foreground text-center py-8">Курсов пока нет</p>}
      </div>
    </div>
  );
}
