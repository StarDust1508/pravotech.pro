import { useState } from "react";
import { X, Send, MessageCircle, Bot } from "lucide-react";
import { Link } from "react-router-dom";
import { BrandTitle } from "@/components/BrandTitle";
import { docs, type DocKey } from "@/lib/legalDocs";
import { useSettings } from "@/hooks/useSettings";

export const Footer = () => {
  const [openDoc, setOpenDoc] = useState<DocKey | null>(null);
  const { data: settings = {} } = useSettings();
  const tgUrl = settings.telegram_channel_url || "https://t.me/ainovaci";
  const maxUrl = settings.max_channel_url || "https://max.ru/id645211616449_biz";

  return (
    <>
      <footer id="contacts" className="relative py-14 border-t border-border overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-neon-cyan/[0.03] rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-neon-magenta/[0.03] rounded-full blur-3xl pointer-events-none" />

        <div className="container relative">
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            <div>
              <BrandTitle className="font-display text-lg font-bold" uppercase />
              <p className="text-muted-foreground/70 text-sm mt-3 max-w-xs leading-relaxed">
                Платформа об ИИ, цифровых технологиях и масштабировании юридического бизнеса в сфере БФЛ.
              </p>
            </div>
            <div>
              <h4 className="font-display font-bold text-[10px] uppercase tracking-[0.2em] mb-4 text-foreground/50">Разделы</h4>
              <nav className="space-y-2.5" aria-label="Навигация по разделам">
                <Link to="/conference" className="block text-sm text-muted-foreground hover:text-neon-cyan transition-colors">Конференция</Link>
                <Link to="/academy" className="block text-sm text-muted-foreground hover:text-neon-cyan transition-colors">Академия</Link>
                <Link to="/research" className="block text-sm text-muted-foreground hover:text-neon-cyan transition-colors">Исследования</Link>
                <Link to="/articles" className="block text-sm text-muted-foreground hover:text-neon-cyan transition-colors">Статьи</Link>
                <Link to="/products" className="block text-sm text-muted-foreground hover:text-neon-cyan transition-colors">Продукты</Link>
              </nav>
            </div>
            <div>
              <h4 className="font-display font-bold text-[10px] uppercase tracking-[0.2em] mb-4 text-foreground/50">Каналы</h4>
              <div className="space-y-2.5">
                <a href={tgUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-neon-magenta transition-colors group">
                  <div className="w-7 h-7 rounded-lg bg-neon-magenta/10 flex items-center justify-center group-hover:bg-neon-magenta/15 transition-colors">
                    <Send size={12} className="text-neon-magenta" />
                  </div>
                  Telegram
                </a>
                <a href={maxUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-neon-cyan transition-colors group">
                  <div className="w-7 h-7 rounded-lg bg-neon-cyan/10 flex items-center justify-center group-hover:bg-neon-cyan/15 transition-colors">
                    <MessageCircle size={12} className="text-neon-cyan" />
                  </div>
                  MAX
                </a>
                <a href="https://t.me/NeuroPravo_Bot" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-neon-cyan transition-colors group">
                  <div className="w-7 h-7 rounded-lg bg-neon-cyan/10 flex items-center justify-center group-hover:bg-neon-cyan/15 transition-colors">
                    <Bot size={13} className="text-neon-cyan" />
                  </div>
                  NeuroPravo Bot
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-display font-bold text-[10px] uppercase tracking-[0.2em] mb-4 text-foreground/50">Контакты</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <a href="mailto:pravotechhub@mail.ru" className="block hover:text-neon-cyan transition-colors">pravotechhub@mail.ru</a>
                <p>Москва, Россия</p>
              </div>
            </div>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

          <div className="pt-6">
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-5 text-xs text-muted-foreground/60">
              <button onClick={() => setOpenDoc("privacy")} className="hover:text-neon-cyan transition-colors">Политика конфиденциальности</button>
              <button onClick={() => setOpenDoc("cookie")} className="hover:text-neon-cyan transition-colors">Политика использования cookies</button>
              <button onClick={() => setOpenDoc("terms")} className="hover:text-neon-cyan transition-colors">Пользовательское соглашение</button>
              <button onClick={() => setOpenDoc("consent")} className="hover:text-neon-cyan transition-colors">Согласие на обработку ПДн</button>
            </div>
            <p className="text-center text-xs text-muted-foreground/50 mb-1">
              &copy; {new Date().getFullYear()} Технологии права. Все права защищены.
            </p>
            <p className="text-center text-[10px] text-muted-foreground/40 max-w-2xl mx-auto leading-relaxed">
              Оставляя свои данные на сайте, вы даёте согласие на обработку персональных данных в соответствии с Федеральным законом №152-ФЗ «О персональных данных» и подтверждаете ознакомление с политикой конфиденциальности.
            </p>
          </div>
        </div>
      </footer>

      {openDoc && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="legal-doc-title">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setOpenDoc(null)} />
          <div className="relative bg-card border border-border rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between p-6 pb-4 border-b border-border">
              <h3 id="legal-doc-title" className="font-display text-xl font-bold">{docs[openDoc].title}</h3>
              <button onClick={() => setOpenDoc(null)} className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Закрыть">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto custom-scrollbar">
              <div className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
                {docs[openDoc].content}
              </div>
            </div>
            <div className="p-4 border-t border-border">
              <button
                onClick={() => setOpenDoc(null)}
                className="w-full px-6 py-2.5 border border-border text-foreground/70 font-display font-bold rounded-lg hover:border-neon-cyan/50 transition-colors text-sm uppercase tracking-wider"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
