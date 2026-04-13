import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Plus, Pencil, Trash2, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import type { AcademyReview, AcademyCourse } from "@/lib/api";

export function AcademyReviewsManager() {
  const { toast } = useToast();
  const [reviews, setReviews] = useState<AcademyReview[]>([]);
  const [courses, setCourses] = useState<AcademyCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<AcademyReview | null>(null);
  const [form, setForm] = useState({
    author_name: "", rating: 5, comment: "", author_avatar_url: "",
    review_image_url: "", review_video_url: "", course_id: "", is_published: true,
  });

  const load = async () => {
    try {
      setLoading(true);
      const [r, c] = await Promise.all([
        api.academy.reviews(undefined, true),
        api.academy.courses(true),
      ]);
      setReviews(r);
      setCourses(c);
    } catch {
      toast({ title: "Ошибка загрузки отзывов", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ author_name: "", rating: 5, comment: "", author_avatar_url: "", review_image_url: "", review_video_url: "", course_id: "", is_published: true });
    setDialogOpen(true);
  };

  const openEdit = (r: AcademyReview) => {
    setEditing(r);
    setForm({
      author_name: r.author_name || "", rating: r.rating || 5,
      comment: r.comment || "", author_avatar_url: r.author_avatar_url || "",
      review_image_url: r.review_image_url || "", review_video_url: r.review_video_url || "",
      course_id: r.course_id || "", is_published: r.is_published !== false,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      const data = { ...form, course_id: form.course_id || null };
      if (editing) {
        await api.academy.updateReview(editing.id, data);
        toast({ title: "Отзыв обновлён" });
      } else {
        await api.academy.createReview(data);
        toast({ title: "Отзыв добавлен" });
      }
      setDialogOpen(false);
      load();
    } catch {
      toast({ title: "Ошибка сохранения", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Удалить отзыв?")) return;
    try {
      await api.academy.deleteReview(id);
      toast({ title: "Отзыв удалён" });
      load();
    } catch {
      toast({ title: "Ошибка удаления", variant: "destructive" });
    }
  };

  const togglePublish = async (r: AcademyReview) => {
    try {
      await api.academy.toggleReviewPublish(r.id, !r.is_published);
      load();
    } catch {
      toast({ title: "Ошибка", variant: "destructive" });
    }
  };

  const getCourseName = (id: string) => {
    const c = courses.find(x => x.id === id);
    return c ? (c.hero_title || c.title) : "—";
  };

  if (loading) return <p className="text-muted-foreground">Загрузка...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Отзывы Академии ({reviews.length})</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate}><Plus className="w-4 h-4 mr-2" /> Добавить</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editing ? "Редактировать отзыв" : "Новый отзыв"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Автор *</Label><Input value={form.author_name} onChange={e => setForm(p => ({ ...p, author_name: e.target.value }))} /></div>
                <div>
                  <Label>Рейтинг</Label>
                  <div className="flex gap-1 mt-1">
                    {[1, 2, 3, 4, 5].map(n => (
                      <button key={n} type="button" onClick={() => setForm(p => ({ ...p, rating: n }))}>
                        <Star size={20} className={n <= form.rating ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div><Label>Комментарий *</Label><Textarea rows={4} value={form.comment} onChange={e => setForm(p => ({ ...p, comment: e.target.value }))} /></div>
              <div>
                <Label>Курс</Label>
                <select
                  className="w-full px-4 py-2 bg-muted/50 border border-border rounded-lg text-sm"
                  value={form.course_id}
                  onChange={e => setForm(p => ({ ...p, course_id: e.target.value }))}
                >
                  <option value="">Без привязки к курсу</option>
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>{c.hero_title || c.title}</option>
                  ))}
                </select>
              </div>
              <div><Label>URL аватара</Label><Input value={form.author_avatar_url} onChange={e => setForm(p => ({ ...p, author_avatar_url: e.target.value }))} placeholder="https://..." /></div>
              <div><Label>URL фото отзыва</Label><Input value={form.review_image_url} onChange={e => setForm(p => ({ ...p, review_image_url: e.target.value }))} /></div>
              <div><Label>URL видео отзыва</Label><Input value={form.review_video_url} onChange={e => setForm(p => ({ ...p, review_video_url: e.target.value }))} /></div>
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
        {reviews.map(r => (
          <Card key={r.id} className={!r.is_published ? "opacity-50" : ""}>
            <CardContent className="flex items-center gap-4 p-4">
              {r.author_avatar_url && <img src={r.author_avatar_url} alt={r.author_name} className="w-10 h-10 rounded-full object-cover" />}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-bold">{r.author_name}</p>
                  <div className="flex gap-0.5">
                    {Array.from({ length: r.rating }).map((_, i) => (
                      <Star key={i} size={12} className="text-yellow-500 fill-yellow-500" />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">{r.comment}</p>
                {r.course_id && <p className="text-xs text-neon-cyan mt-1">Курс: {getCourseName(r.course_id)}</p>}
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={r.is_published} onCheckedChange={() => togglePublish(r)} />
                <Button variant="ghost" size="icon" onClick={() => openEdit(r)}><Pencil className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(r.id)}><Trash2 className="w-4 h-4 text-red-500" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {reviews.length === 0 && <p className="text-muted-foreground text-center py-8">Отзывов пока нет</p>}
      </div>
    </div>
  );
}
