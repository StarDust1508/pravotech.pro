import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Plus, Pencil, Trash2, FileText, Eye, EyeOff, FileCheck, FileX } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import type { ResearchReport, ResearchChart } from "@/lib/api";

const ICON_OPTIONS = [
  "TrendingUp", "Users", "Brain", "FileText",
  "BarChart3", "Cpu", "FileStack", "MessageSquare",
];

const emptyForm = {
  slug: "",
  title: "",
  description: "",
  category: "",
  icon: "FileText",
  accent: "cyan",
  summary: "",
  cover_image_url: "",
  pdf_url: "",
  charts: "",
  display_order: 0,
  is_published: true,
};

export function ReportsManager() {
  const { toast } = useToast();
  const [reports, setReports] = useState<ResearchReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<ResearchReport | null>(null);
  const [form, setForm] = useState(emptyForm);

  const load = async () => {
    try {
      setLoading(true);
      const data = await api.research.reports(true);
      setReports([...data].sort((a, b) => a.display_order - b.display_order));
    } catch {
      toast({ title: "Ошибка загрузки отчётов", variant: "destructive" });
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

  const openEdit = (r: ResearchReport) => {
    setEditing(r);
    setForm({
      slug: r.slug,
      title: r.title,
      description: r.description || "",
      category: r.category || "",
      icon: r.icon || "FileText",
      accent: r.accent || "cyan",
      summary: r.summary || "",
      cover_image_url: r.cover_image_url || "",
      pdf_url: r.pdf_url || "",
      charts: r.charts ? JSON.stringify(r.charts, null, 2) : "",
      display_order: r.display_order,
      is_published: r.is_published,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.slug || !form.title) {
      toast({ title: "Заполните slug и заголовок", variant: "destructive" });
      return;
    }

    // Графики хранятся как JSON-строка в форме — парсим и валидируем.
    let chartsParsed: ResearchChart[] | null = null;
    if (form.charts.trim()) {
      try {
        chartsParsed = JSON.parse(form.charts) as ResearchChart[];
      } catch {
        toast({ title: "Графики: некорректный JSON", variant: "destructive" });
        return;
      }
    }

    const { charts, ...rest } = form;
    const payload = { ...rest, charts: chartsParsed };

    try {
      if (editing) {
        await api.research.updateReport(editing.id, payload);
        toast({ title: "Отчёт обновлён" });
      } else {
        await api.research.createReport(payload);
        toast({ title: "Отчёт добавлен" });
      }
      setDialogOpen(false);
      load();
    } catch (e) {
      toast({ title: "Ошибка сохранения", description: e instanceof Error ? e.message : undefined, variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Удалить отчёт?")) return;
    try {
      await api.research.deleteReport(id);
      toast({ title: "Отчёт удалён" });
      load();
    } catch {
      toast({ title: "Ошибка удаления", variant: "destructive" });
    }
  };

  const togglePublish = async (r: ResearchReport) => {
    try {
      await api.research.toggleReportPublish(r.id, !r.is_published);
      load();
    } catch {
      toast({ title: "Ошибка", variant: "destructive" });
    }
  };

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const result = await api.media.uploadToPath(file);
      setForm(prev => ({ ...prev, pdf_url: result.publicUrl }));
      toast({ title: "PDF загружен" });
    } catch {
      toast({ title: "Ошибка загрузки PDF", variant: "destructive" });
    }
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const result = await api.media.uploadToPath(file);
      setForm(prev => ({ ...prev, cover_image_url: result.publicUrl }));
      toast({ title: "Обложка загружена" });
    } catch {
      toast({ title: "Ошибка загрузки обложки", variant: "destructive" });
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="flex items-center gap-3 text-muted-foreground">
        <div className="w-5 h-5 border-2 border-neon-cyan border-t-transparent rounded-full animate-spin" />
        <span className="text-sm">Загрузка отчётов...</span>
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-neon-cyan/10 flex items-center justify-center">
            <FileText className="w-4.5 h-4.5 text-neon-cyan" />
          </div>
          <div>
            <h2 className="font-display text-lg font-bold">Отчёты</h2>
            <p className="text-xs text-muted-foreground">{reports.length} исследований</p>
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
              <DialogTitle className="font-display">{editing ? "Редактировать отчёт" : "Новый отчёт"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Slug * (латиницей, в URL)</Label>
                  <Input value={form.slug} onChange={e => setForm(p => ({ ...p, slug: e.target.value }))} placeholder="bfl-market-2026" />
                </div>
                <div>
                  <Label>Категория</Label>
                  <Input value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} placeholder="Рынок" />
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
                <Label>Полный анонс (текст на странице отчёта)</Label>
                <Textarea rows={6} value={form.summary} onChange={e => setForm(p => ({ ...p, summary: e.target.value }))} placeholder="Можно оставить пустым — наполняется позже" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Иконка</Label>
                  <select
                    className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                    value={form.icon}
                    onChange={e => setForm(p => ({ ...p, icon: e.target.value }))}
                  >
                    {ICON_OPTIONS.map(name => <option key={name} value={name}>{name}</option>)}
                  </select>
                </div>
                <div>
                  <Label>Акцент</Label>
                  <select
                    className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                    value={form.accent}
                    onChange={e => setForm(p => ({ ...p, accent: e.target.value }))}
                  >
                    <option value="cyan">cyan</option>
                    <option value="magenta">magenta</option>
                  </select>
                </div>
              </div>
              <div>
                <Label>Обложка</Label>
                <Input type="file" accept="image/*" onChange={handleCoverUpload} />
                {form.cover_image_url && <img src={form.cover_image_url} alt="" className="w-32 h-20 object-cover mt-2 rounded" />}
                <Input className="mt-2" placeholder="Или URL обложки" value={form.cover_image_url} onChange={e => setForm(p => ({ ...p, cover_image_url: e.target.value }))} />
              </div>
              <div>
                <Label>PDF отчёта</Label>
                <Input type="file" accept="application/pdf" onChange={handlePdfUpload} />
                <Input className="mt-2" placeholder="Или внешняя ссылка на PDF (Диск/CDN)" value={form.pdf_url} onChange={e => setForm(p => ({ ...p, pdf_url: e.target.value }))} />
                {form.pdf_url && <p className="text-xs text-muted-foreground mt-1 truncate">Текущий файл: {form.pdf_url}</p>}
              </div>
              <div>
                <Label>Графики (JSON, необязательно)</Label>
                <Textarea
                  rows={6}
                  className="font-mono text-xs"
                  value={form.charts}
                  onChange={e => setForm(p => ({ ...p, charts: e.target.value }))}
                  placeholder='[{"type":"bar","title":"...","unit":" тыс.","data":[{"label":"2024","value":431.9}],"note":"Источник: ..."}]'
                />
                <p className="text-xs text-muted-foreground mt-1">Массив объектов. type: bar | line | pie. Оставьте пустым, если графики не нужны.</p>
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
        {reports.map(r => {
          const accentColor = r.accent === "magenta" ? "neon-magenta" : "neon-cyan";
          return (
            <div
              key={r.id}
              className={`group flex items-center gap-4 p-4 rounded-xl border bg-card/50 hover:bg-card transition-all ${
                !r.is_published ? "opacity-50 border-border" : `border-border hover:border-${accentColor}/30`
              }`}
            >
              <div className={`w-10 h-10 rounded-xl bg-${accentColor}/10 flex items-center justify-center flex-shrink-0`}>
                <FileText className={`w-5 h-5 text-${accentColor}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-display font-bold text-sm">{r.title}</p>
                  {r.category && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-muted text-muted-foreground">{r.category}</span>
                  )}
                  {!r.is_published && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-muted text-muted-foreground uppercase tracking-wider">Черновик</span>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-muted-foreground">/research/{r.slug}</span>
                  {r.pdf_url ? (
                    <span className="inline-flex items-center gap-1 text-[10px] text-green-400"><FileCheck className="w-3 h-3" /> PDF</span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground/50"><FileX className="w-3 h-3" /> Нет PDF</span>
                  )}
                  {r.charts && r.charts.length > 0 && (
                    <span className="text-[10px] text-neon-cyan">{r.charts.length} графиков</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => togglePublish(r)}
                  className="p-2 rounded-lg hover:bg-muted/80 transition-colors text-muted-foreground hover:text-foreground"
                  title={r.is_published ? "Снять с публикации" : "Опубликовать"}
                >
                  {r.is_published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <button onClick={() => openEdit(r)} className="p-2 rounded-lg hover:bg-muted/80 transition-colors text-muted-foreground hover:text-foreground">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(r.id)} className="p-2 rounded-lg hover:bg-red-500/10 transition-colors text-muted-foreground hover:text-red-400">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
        {reports.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-14 h-14 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
              <FileText className="w-7 h-7 text-muted-foreground/50" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">Отчётов пока нет</p>
            <p className="text-xs text-muted-foreground/60 mt-1">Нажмите «Добавить» чтобы создать первый отчёт</p>
          </div>
        )}
      </div>
    </div>
  );
}
