import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Settings as SettingsIcon, Save } from "lucide-react";
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

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="flex items-center gap-3 text-muted-foreground">
        <div className="w-5 h-5 border-2 border-neon-cyan border-t-transparent rounded-full animate-spin" />
        <span className="text-sm">Загрузка настроек...</span>
      </div>
    </div>
  );

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="rounded-xl border border-border bg-card/50 overflow-hidden">
      <div className="px-5 py-3 border-b border-border bg-muted/30">
        <h3 className="font-display text-sm font-bold">{title}</h3>
      </div>
      <div className="p-5 space-y-4">{children}</div>
    </div>
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-neon-cyan/10 flex items-center justify-center">
            <SettingsIcon className="w-4.5 h-4.5 text-neon-cyan" />
          </div>
          <div>
            <h2 className="font-display text-lg font-bold">Настройки сайта</h2>
            <p className="text-xs text-muted-foreground">{Object.keys(settings).length} параметров</p>
          </div>
        </div>
        <Button onClick={handleSave} disabled={saving} className="bg-neon-cyan text-background hover:bg-neon-cyan/90 font-bold text-xs uppercase tracking-wider">
          <Save className="w-4 h-4 mr-1.5" /> {saving ? "Сохранение..." : "Сохранить все"}
        </Button>
      </div>

      <Section title="Главный экран (Hero)">
          <div>
            <Label className="text-xs">Дата мероприятия</Label>
            <Input value={settings.hero_date || ""} onChange={e => updateField("hero_date", e.target.value)} placeholder="25–26 СЕНТЯБРЯ 2026" className="mt-1" />
          </div>
          <div>
            <Label className="text-xs">Место проведения</Label>
            <Input value={settings.hero_location || ""} onChange={e => updateField("hero_location", e.target.value)} placeholder="Москва, Технополис «Инновация»" className="mt-1" />
          </div>
          <div>
            <Label className="text-xs">Заголовок</Label>
            <Input value={settings.hero_title || ""} onChange={e => updateField("hero_title", e.target.value)} placeholder="Технологии ПРАВА" className="mt-1" />
          </div>
          <div>
            <Label className="text-xs">Описание</Label>
            <Textarea value={settings.hero_description || ""} onChange={e => updateField("hero_description", e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label className="text-xs">Фоновое изображение</Label>
            <Input type="file" accept="image/*" onChange={handleHeroImageUpload} className="mt-1" />
            {settings.hero_image && (
              <img src={settings.hero_image} alt="Hero" className="w-full max-w-md h-40 object-cover rounded-lg mt-2" />
            )}
          </div>
      </Section>

      <Section title="Контакты">
          <div>
            <Label className="text-xs">Email</Label>
            <Input value={settings.contact_email || ""} onChange={e => updateField("contact_email", e.target.value)} placeholder="pravotechhub@mail.ru" className="mt-1" />
          </div>
          <div>
            <Label className="text-xs">Телефон</Label>
            <Input value={settings.contact_phone || ""} onChange={e => updateField("contact_phone", e.target.value)} placeholder="+7 (999) 123-45-67" className="mt-1" />
          </div>
          <div>
            <Label className="text-xs">Telegram</Label>
            <Input value={settings.contact_telegram || ""} onChange={e => updateField("contact_telegram", e.target.value)} placeholder="@channel" className="mt-1" />
          </div>
      </Section>

      <Section title="Подписка на Telegram-канал">
          <div>
            <Label className="text-xs">Ссылка на канал (URL)</Label>
            <Input value={settings.telegram_channel_url || ""} onChange={e => updateField("telegram_channel_url", e.target.value)} placeholder="https://t.me/your_channel" className="mt-1" />
            <p className="text-[10px] text-muted-foreground/60 mt-1">Пока поле пустое, блок на сайте показывает «Скоро».</p>
          </div>
          <div>
            <Label className="text-xs">Заголовок блока</Label>
            <Input value={settings.telegram_channel_title || ""} onChange={e => updateField("telegram_channel_title", e.target.value)} placeholder="Технологии права в Telegram" className="mt-1" />
          </div>
          <div>
            <Label className="text-xs">Описание блока</Label>
            <Textarea value={settings.telegram_channel_text || ""} onChange={e => updateField("telegram_channel_text", e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label className="text-xs">Ссылка на канал MAX (URL)</Label>
            <Input value={settings.max_channel_url || ""} onChange={e => updateField("max_channel_url", e.target.value)} placeholder="https://max.ru/id..." className="mt-1" />
            <p className="text-[10px] text-muted-foreground/60 mt-1">Кнопка «MAX» в блоке мессенджеров. Пусто — кнопка скрыта.</p>
          </div>
      </Section>

      <Section title="Книга по БФЛ">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Название книги</Label>
              <Input value={settings.book_title || ""} onChange={e => updateField("book_title", e.target.value)} placeholder="Банкротство физлиц: понятное руководство" className="mt-1" />
            </div>
            <div>
              <Label className="text-xs">Автор</Label>
              <Input value={settings.book_author || ""} onChange={e => updateField("book_author", e.target.value)} placeholder="Имя автора" className="mt-1" />
            </div>
          </div>
          <div>
            <Label className="text-xs">Подзаголовок</Label>
            <Textarea value={settings.book_subtitle || ""} onChange={e => updateField("book_subtitle", e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label className="text-xs">Описание (О книге)</Label>
            <Textarea value={settings.book_description || ""} onChange={e => updateField("book_description", e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label className="text-xs">Обложка</Label>
            <Input type="file" accept="image/*" onChange={async (e) => {
              const file = e.target.files?.[0]; if (!file) return;
              try { const r = await api.media.uploadToPath(file); updateField("book_cover_url", r.publicUrl); toast({ title: "Обложка загружена" }); }
              catch { toast({ title: "Ошибка загрузки", variant: "destructive" }); }
            }} className="mt-1" />
            {settings.book_cover_url && <img src={settings.book_cover_url} alt="" className="w-24 mt-2 rounded-lg" />}
            <Input className="mt-2" placeholder="Или URL обложки" value={settings.book_cover_url || ""} onChange={e => updateField("book_cover_url", e.target.value)} />
          </div>
          <div>
            <Label className="text-xs">Файл книги (PDF) — ссылка</Label>
            <Input value={settings.book_file_url || ""} onChange={e => updateField("book_file_url", e.target.value)} placeholder="/reports/book.pdf или внешняя ссылка" className="mt-1" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Текст кнопки</Label>
              <Input value={settings.book_cta_text || ""} onChange={e => updateField("book_cta_text", e.target.value)} placeholder="Получить книгу" className="mt-1" />
            </div>
            <div>
              <Label className="text-xs">Ссылка «Купить» (необязательно)</Label>
              <Input value={settings.book_cta_url || ""} onChange={e => updateField("book_cta_url", e.target.value)} placeholder="https://..." className="mt-1" />
            </div>
          </div>
      </Section>

      <Section title="Платформа тренировок и тестов">
          <div>
            <Label className="text-xs">Ссылка на платформу (URL)</Label>
            <Input value={settings.platform_url || ""} onChange={e => updateField("platform_url", e.target.value)} placeholder="https://platform.pravotech.pro" className="mt-1" />
            <p className="text-[10px] text-muted-foreground/60 mt-1">Пока поле пустое, кнопки «Открыть платформу» показывают «Скоро».</p>
          </div>
          <div>
            <Label className="text-xs">Заголовок лендинга</Label>
            <Input value={settings.platform_title || ""} onChange={e => updateField("platform_title", e.target.value)} placeholder="Платформа тренировок и тестов" className="mt-1" />
          </div>
          <div>
            <Label className="text-xs">Подзаголовок лендинга</Label>
            <Textarea value={settings.platform_subtitle || ""} onChange={e => updateField("platform_subtitle", e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label className="text-xs">Скриншот для Hero-секции</Label>
            <Input type="file" accept="image/*" onChange={async (e) => {
              const file = e.target.files?.[0]; if (!file) return;
              try { const r = await api.media.uploadToPath(file); updateField("platform_screenshot_hero", r.publicUrl); toast({ title: "Скриншот загружен" }); }
              catch { toast({ title: "Ошибка загрузки", variant: "destructive" }); }
            }} className="mt-1" />
            {settings.platform_screenshot_hero && <img src={settings.platform_screenshot_hero} alt="" className="w-full max-w-md h-32 object-cover rounded-lg mt-2" />}
            <Input className="mt-2" placeholder="Или URL скриншота" value={settings.platform_screenshot_hero || ""} onChange={e => updateField("platform_screenshot_hero", e.target.value)} />
          </div>
          <div>
            <Label className="text-xs">Скриншот тренировки</Label>
            <Input type="file" accept="image/*" onChange={async (e) => {
              const file = e.target.files?.[0]; if (!file) return;
              try { const r = await api.media.uploadToPath(file); updateField("platform_screenshot_training", r.publicUrl); toast({ title: "Скриншот загружен" }); }
              catch { toast({ title: "Ошибка загрузки", variant: "destructive" }); }
            }} className="mt-1" />
            {settings.platform_screenshot_training && <img src={settings.platform_screenshot_training} alt="" className="w-full max-w-md h-32 object-cover rounded-lg mt-2" />}
            <Input className="mt-2" placeholder="Или URL скриншота" value={settings.platform_screenshot_training || ""} onChange={e => updateField("platform_screenshot_training", e.target.value)} />
          </div>
          <div>
            <Label className="text-xs">Скриншот дашборда</Label>
            <Input type="file" accept="image/*" onChange={async (e) => {
              const file = e.target.files?.[0]; if (!file) return;
              try { const r = await api.media.uploadToPath(file); updateField("platform_screenshot_dashboard", r.publicUrl); toast({ title: "Скриншот загружен" }); }
              catch { toast({ title: "Ошибка загрузки", variant: "destructive" }); }
            }} className="mt-1" />
            {settings.platform_screenshot_dashboard && <img src={settings.platform_screenshot_dashboard} alt="" className="w-full max-w-md h-32 object-cover rounded-lg mt-2" />}
            <Input className="mt-2" placeholder="Или URL скриншота" value={settings.platform_screenshot_dashboard || ""} onChange={e => updateField("platform_screenshot_dashboard", e.target.value)} />
          </div>
      </Section>

      <Section title="Блок «Арбитражное управление»">
          <div>
            <Label className="text-xs">Заголовок</Label>
            <Input value={settings.au_ad_title || ""} onChange={e => updateField("au_ad_title", e.target.value)} placeholder="Сопровождение банкротства под ключ" className="mt-1" />
          </div>
          <div>
            <Label className="text-xs">Описание</Label>
            <Textarea value={settings.au_ad_text || ""} onChange={e => updateField("au_ad_text", e.target.value)} className="mt-1" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Текст кнопки</Label>
              <Input value={settings.au_ad_cta || ""} onChange={e => updateField("au_ad_cta", e.target.value)} placeholder="Получить консультацию" className="mt-1" />
            </div>
            <div>
              <Label className="text-xs">Ссылка кнопки</Label>
              <Input value={settings.au_ad_cta_url || ""} onChange={e => updateField("au_ad_cta_url", e.target.value)} placeholder="#contacts или https://..." className="mt-1" />
            </div>
          </div>
      </Section>
    </div>
  );
}
