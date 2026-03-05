import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, Copy, Upload } from "lucide-react";
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

  if (loading) return <p className="text-muted-foreground">Загрузка...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Медиа ({media.length})</h2>
        <div className="relative">
          <Input
            type="file"
            accept="image/*"
            multiple
            onChange={handleUpload}
            className="absolute inset-0 opacity-0 cursor-pointer"
            disabled={uploading}
          />
          <Button disabled={uploading}>
            <Upload className="w-4 h-4 mr-2" /> {uploading ? "Загрузка..." : "Загрузить"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {media.map(m => (
          <Card key={m.id}>
            <CardContent className="p-3">
              <div className="aspect-square rounded overflow-hidden bg-muted mb-2">
                <img src={m.file_url} alt={m.file_name} className="w-full h-full object-cover" />
              </div>
              <p className="text-xs font-medium truncate">{m.file_name}</p>
              <p className="text-xs text-muted-foreground">{formatSize(m.file_size)}</p>
              <div className="flex gap-1 mt-2">
                <Button variant="ghost" size="sm" className="flex-1" onClick={() => copyUrl(m.file_url)}>
                  <Copy className="w-3 h-3 mr-1" /> URL
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(m.id)}>
                  <Trash2 className="w-3 h-3 text-red-500" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {media.length === 0 && <p className="text-muted-foreground text-center py-8 col-span-full">Файлов нет</p>}
      </div>
    </div>
  );
}
