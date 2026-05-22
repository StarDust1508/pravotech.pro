import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, Copy, Upload, FileImage, ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import type { Media } from "@/lib/api";

export function MediaUploader() {
  const { toast } = useToast();
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const loadMedia = async () => {
    try {
      setLoading(true);
      const data = await api.media.list();
      setMedia(data);
    } catch {
      toast({ title: "Ошибка загрузки медиа", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadMedia(); }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        await api.media.upload(file);
      }
      toast({ title: "Файлы загружены" });
      loadMedia();
    } catch {
      toast({ title: "Ошибка загрузки", variant: "destructive" });
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Удалить файл?")) return;
    try {
      await api.media.delete(id);
      toast({ title: "Файл удалён" });
      loadMedia();
    } catch {
      toast({ title: "Ошибка удаления", variant: "destructive" });
    }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({ title: "URL скопирован" });
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="flex items-center gap-3 text-muted-foreground">
        <div className="w-5 h-5 border-2 border-neon-cyan border-t-transparent rounded-full animate-spin" />
        <span className="text-sm">Загрузка медиа...</span>
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-neon-cyan/10 flex items-center justify-center">
            <FileImage className="w-4.5 h-4.5 text-neon-cyan" />
          </div>
          <div>
            <h2 className="font-display text-lg font-bold">Медиа</h2>
            <p className="text-xs text-muted-foreground">{media.length} файлов</p>
          </div>
        </div>
        <div className="relative">
          <Input
            type="file"
            accept="image/*"
            multiple
            onChange={handleUpload}
            className="absolute inset-0 opacity-0 cursor-pointer"
            disabled={uploading}
          />
          <Button disabled={uploading} className="bg-neon-cyan text-background hover:bg-neon-cyan/90 font-bold text-xs uppercase tracking-wider">
            <Upload className="w-4 h-4 mr-1.5" /> {uploading ? "Загрузка..." : "Загрузить"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {media.map(m => (
          <div key={m.id} className="group rounded-xl border border-border bg-card/50 hover:border-neon-cyan/30 hover:bg-card overflow-hidden transition-all">
            <div className="aspect-square overflow-hidden bg-muted/50">
              <img src={m.file_url} alt={m.file_name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            </div>
            <div className="p-3">
              <p className="text-xs font-medium truncate">{m.file_name}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{formatSize(m.file_size)}</p>
              <div className="flex gap-1 mt-2">
                <button
                  onClick={() => copyUrl(m.file_url)}
                  className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-[10px] font-medium text-muted-foreground hover:text-neon-cyan hover:bg-neon-cyan/5 transition-colors"
                >
                  <Copy className="w-3 h-3" /> Копировать URL
                </button>
                <button
                  onClick={() => handleDelete(m.id)}
                  className="p-1.5 rounded-lg hover:bg-red-500/10 transition-colors text-muted-foreground hover:text-red-400"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {media.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
            <div className="w-14 h-14 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
              <ImageIcon className="w-7 h-7 text-muted-foreground/50" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">Файлов пока нет</p>
            <p className="text-xs text-muted-foreground/60 mt-1">Нажмите «Загрузить» чтобы добавить медиа</p>
          </div>
        )}
      </div>
    </div>
  );
}
