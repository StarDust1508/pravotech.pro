import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";

export function SiteSettingsManager() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.settings.list()
      .then(setSettings)
      .catch(() => toast({ title: "Ошибка загрузки настроек", variant: "destructive" }))
      .finally(() => setLoading(false));
  }, []);

  const updateField = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      for (const [key, value] of Object.entries(settings)) {
        await api.settings.update(key, value);
      }
      toast({ title: "Настройки сохранены" });
    } catch {
      toast({ title: "Ошибка сохранения", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleHeroImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const result = await api.media.uploadToPath(file);
      updateField("hero_image", result.publicUrl);
      toast({ title: "Изображение загружено" });
    } catch {
      toast({ title: "Ошибка загрузки", variant: "destructive" });
    }
  };

  if (loading) return <p className="text-muted-foreground">Загрузка...</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Настройки сайта</h2>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Сохранение..." : "Сохранить все"}
        </Button>
      </div>

      <Card>
        <CardHeader><CardTitle>Главный экран (Hero)</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Дата мероприятия</Label>
            <Input value={settings.hero_date || ""} onChange={e => updateField("hero_date", e.target.value)} placeholder="24–25 ИЮНЯ 2026" />
          </div>
          <div>
            <Label>Место проведения</Label>
            <Input value={settings.hero_location || ""} onChange={e => updateField("hero_location", e.target.value)} placeholder="Москва, Технограм" />
          </div>
          <div>
            <Label>Заголовок</Label>
            <Input value={settings.hero_title || ""} onChange={e => updateField("hero_title", e.target.value)} placeholder="Технологии ПРАВА" />
          </div>
          <div>
            <Label>Описание</Label>
            <Textarea value={settings.hero_description || ""} onChange={e => updateField("hero_description", e.target.value)} />
          </div>
          <div>
            <Label>Фоновое изображение</Label>
            <Input type="file" accept="image/*" onChange={handleHeroImageUpload} />
            {settings.hero_image && (
              <img src={settings.hero_image} alt="Hero" className="w-full max-w-md h-40 object-cover rounded mt-2" />
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Контакты</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Email</Label>
            <Input value={settings.contact_email || ""} onChange={e => updateField("contact_email", e.target.value)} placeholder="info@example.com" />
          </div>
          <div>
            <Label>Телефон</Label>
            <Input value={settings.contact_phone || ""} onChange={e => updateField("contact_phone", e.target.value)} placeholder="+7 (999) 123-45-67" />
          </div>
          <div>
            <Label>Telegram</Label>
            <Input value={settings.contact_telegram || ""} onChange={e => updateField("contact_telegram", e.target.value)} placeholder="@channel" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
