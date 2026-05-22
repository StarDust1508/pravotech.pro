import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Plus, Pencil, Trash2, ListChecks, Eye, EyeOff, FileCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import type { Checklist, ChecklistGroup } from "@/lib/api";

const ICON_OPTIONS = [
  "ClipboardList", "ClipboardCheck", "FileCheck", "Handshake",
  "ShieldCheck", "Scale", "Gavel", "ListChecks",
];

const emptyForm = {
  slug: "",
  title: "",
  description: "",
  category: "",
  icon: "ClipboardList",
  accent: "cyan",
  intro: "",
  items: "",
  pdf_url: "",
  display_order: 0,
  is_published: true,
};

const countPoints = (items: ChecklistGroup[] | null) =>
  (items || []).reduce((s, g) => s + (g.points?.length || 0), 0);

export function ChecklistsManager() {
  const { toast } = useToast();
  const [checklists, setChecklists] = useState<Checklist[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Checklist | null>(null);
  const [form, setForm] = useState(emptyForm);

  const load = async () => {
    try {
      setLoading(true);
      const data = await api.checklists.list(true);
      setChecklists([...data].sort((a, b) => a.display_order - b.display_order));
    } catch {
      toast({ title: "Ошибка загрузки чек-листов", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (c: Checklist) => {
    setEditing(c);
    setForm({
      slug: c.slug,
      title: c.title,
      description: c.description || "",
      category: c.category || "",
      icon: c.icon || "ClipboardList",
      accent: c.accent || "cyan",
      intro: c.intro || "",
      items: c.items ? JSON.stringify(c.items, null, 2) : "",
      pdf_url: c.pdf_url || "",
      display_order: c.display_order,
      is_published: c.is_published,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.slug || !form.title) {
      toast({ title: "Заполните slug и заголовок", variant: "destructive" });
      return;
    }
    let itemsParsed: ChecklistGroup[] | null = null;
    if (form.items.trim()) {
      try {
        itemsParsed = JSON.parse(form.items) as ChecklistGroup[];
      } catch {
        toast({ title: "Пункты: некорректный JSON", variant: "destructive" });
        return;
      }
    }
    const { items, ...rest } = form;
    const payload = { ...rest, items: itemsParsed };
    try {
      if (editing) {
        await api.checklists.update(editing.id, payload);
        toast({ title: "Чек-лист обновлён" });
      } else {
        await api.checklists.create(payload);
        toast({ title: "Чек-лист добавлен" });
      }
      setDialogOpen(false);
      load();
    } catch (e) {
      toast({ title: "Ошибка сохранения", description: e instanceof Error ? e.message : undefined, variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Удалить чек-лист?")) return;
    try {
      await api.checklists.delete(id);
      toast({ title: "Чек-лист удалён" });
      load();
    } catch {
      toast({ title: "Ошибка удаления", variant: "destructive" });
    }
  };

  const togglePublish = async (c: Checklist) => {
    try {
      await api.checklists.togglePublish(c.id, !c.is_published);
      load();
    } catch {
      toast({ title: "Ошибка", variant: "destructive" });
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="flex items-center gap-3 text-muted-foreground">
        <div className="w-5 h-5 border-2 border-neon-cyan border-t-transparent rounded-full animate-spin" />
        <span className="text-sm">Загрузка чек-листов...</span>
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-neon-magenta/10 flex items-center justify-center">
            <ListChecks className="w-4.5 h-4.5 text-neon-magenta" />
          </div>
          <div>
            <h2 className="font-display text-lg font-bold">Чек-листы</h2>
            <p className="text-xs text-muted-foreground">{checklists.length} чек-листов</p>
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
              <DialogTitle>{editing ? "Редактировать чек-лист" : "Новый чек-лист"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Slug * (латиницей, в URL)</Label>
                  <Input value={form.slug} onChange={e => setForm(p => ({ ...p, slug: e.target.value }))} placeholder="podgotovka-zayavleniya-bfl" />
                </div>
                <div>
                  <Label>Категория</Label>
                  <Input value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} placeholder="Подача" />
                </div>
              </div>
              <div>
                <Label>Заголовок *</Label>
                <Input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
              </div>
              <div>
                <Label>Краткое описание (тизер карточки)</Label>
                <Textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
              </div>
              <div>
                <Label>Вводный текст (на странице чек-листа)</Label>
                <Textarea value={form.intro} onChange={e => setForm(p => ({ ...p, intro: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Иконка</Label>
                  <select className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                    value={form.icon} onChange={e => setForm(p => ({ ...p, icon: e.target.value }))}>
                    {ICON_OPTIONS.map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
                <div>
                  <Label>Акцент</Label>
                  <select className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                    value={form.accent} onChange={e => setForm(p => ({ ...p, accent: e.target.value }))}>
                    <option value="cyan">cyan</option>
                    <option value="magenta">magenta</option>
                  </select>
                </div>
              </div>
              <div>
                <Label>Пункты (JSON: массив групп)</Label>
                <Textarea
                  rows={10}
                  className="font-mono text-xs"
                  value={form.items}
                  onChange={e => setForm(p => ({ ...p, items: e.target.value }))}
                  placeholder='[{"group":"Группа","points":[{"text":"Пункт","hint":"Подсказка"}]}]'
                />
                <p className="text-xs text-muted-foreground mt-1">Формат: [{`{"group":"...","points":[{"text":"...","hint":"..."}]}`}]. hint необязателен.</p>
              </div>
              <div>
                <Label>PDF (ссылка, необязательно)</Label>
                <Input value={form.pdf_url} onChange={e => setForm(p => ({ ...p, pdf_url: e.target.value }))} placeholder="/checklists/file.pdf или внешняя ссылка" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Порядок отображения</Label>
                  <Input type="number" value={form.display_order} onChange={e => setForm(p => ({ ...p, display_order: parseInt(e.target.value) || 0 }))} />
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <Switch checked={form.is_published} onCheckedChange={v => setForm(p => ({ ...p, is_published: v }))} />
                  <Label>Опубликован</Label>
                </div>
              </div>
              <Button onClick={handleSave} className="w-full bg-neon-cyan text-background hover:bg-neon-cyan/90 font-bold">Сохранить</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-2">
        {checklists.map(c => {
          const accentColor = c.accent === "magenta" ? "neon-magenta" : "neon-cyan";
          const pts = countPoints(c.items);
          return (
            <div
              key={c.id}
              className={`group flex items-center gap-4 p-4 rounded-xl border bg-card/50 hover:bg-card transition-all ${
                !c.is_published ? "opacity-50 border-border" : `border-border hover:border-${accentColor}/30`
              }`}
            >
              <div className={`w-10 h-10 rounded-xl bg-${accentColor}/10 flex items-center justify-center flex-shrink-0`}>
                <ListChecks className={`w-5 h-5 text-${accentColor}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-display font-bold text-sm">{c.title}</p>
                  {c.category && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-muted text-muted-foreground">{c.category}</span>
                  )}
                  {!c.is_published && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-muted text-muted-foreground uppercase tracking-wider">Черновик</span>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-muted-foreground">/checklists/{c.slug}</span>
                  <span className={`text-[10px] text-${accentColor}`}>{pts} пунктов</span>
                  {c.pdf_url && (
                    <span className="inline-flex items-center gap-1 text-[10px] text-green-400"><FileCheck className="w-3 h-3" /> PDF</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => togglePublish(c)}
                  className="p-2 rounded-lg hover:bg-muted/80 transition-colors text-muted-foreground hover:text-foreground"
                  title={c.is_published ? "Снять с публикации" : "Опубликовать"}
                >
                  {c.is_published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <button onClick={() => openEdit(c)} className="p-2 rounded-lg hover:bg-muted/80 transition-colors text-muted-foreground hover:text-foreground">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(c.id)} className="p-2 rounded-lg hover:bg-red-500/10 transition-colors text-muted-foreground hover:text-red-400">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
        {checklists.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-14 h-14 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
              <ListChecks className="w-7 h-7 text-muted-foreground/50" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">Чек-листов пока нет</p>
            <p className="text-xs text-muted-foreground/60 mt-1">Нажмите «Добавить» чтобы создать первый чек-лист</p>
          </div>
        )}
      </div>
    </div>
  );
}
