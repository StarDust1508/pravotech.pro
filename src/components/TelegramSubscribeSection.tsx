import { motion } from "framer-motion";
import { Send, ExternalLink, MessageCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useSettings } from "@/hooks/useSettings";

function channelFromUrl(url: string): string {
  const m = url.match(/t\.me\/(?:s\/)?@?([a-zA-Z0-9_]+)/);
  return m ? m[1] : "";
}

function formatDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("ru-RU", { day: "numeric", month: "long" });
}

export const TelegramSubscribeSection = () => {
  const { data: settings = {} } = useSettings();

  const channel =
    settings.telegram_channel_username ||
    channelFromUrl(settings.telegram_channel_url || "") ||
    "ainovaci";
  const url = settings.telegram_channel_url || "https://t.me/ainovaci";
  const text =
    settings.telegram_channel_text ||
    "Разборы дел, изменения в законодательстве о банкротстве, чек-листы и кейсы — коротко и по делу.";
  const maxUrl = settings.max_channel_url || "https://max.ru/id645211616449_biz";

  const { data: feedData } = useQuery({
    queryKey: ["telegram-feed", channel],
    queryFn: () => api.telegram.feed(channel, 4),
    enabled: !!channel,
    staleTime: 5 * 60 * 1000,
  });
  const posts = feedData?.posts || [];

  return (
    <section id="telegram" className="py-20 relative">
      <div className="container relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-2xl overflow-hidden"
          style={{
            boxShadow: "0 25px 60px -15px rgba(0,0,0,0.6), 0 0 40px -15px rgba(255,0,255,0.1), inset 0 1px 0 rgba(255,255,255,0.05)",
          }}
        >
          {/* Background layers */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#120a1e] via-[#0e1020] to-[#0a0e18]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(255,0,255,0.1),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(0,255,255,0.06),transparent_50%)]" />

          {/* Border + top accent */}
          <div className="absolute inset-0 rounded-2xl border border-neon-magenta/20" />
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-neon-magenta/60 via-neon-magenta/30 to-neon-cyan/20" />

          {/* Subtle grid texture */}
          <div className="absolute inset-0 opacity-[0.02]" style={{
            backgroundImage: "linear-gradient(rgba(255,0,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,0,255,0.3) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }} />

          {/* Geometric accents */}
          <div className="absolute top-8 right-8 w-20 h-20 border border-neon-magenta/10 rounded-xl rotate-12 hidden lg:block" />
          <div className="absolute bottom-8 right-16 w-12 h-12 border border-neon-cyan/8 rounded-lg rotate-[30deg] hidden lg:block" />

          <div className="relative p-8 md:p-12">
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8 lg:gap-12">
              <div className="flex-1">
                {/* Telegram icon orb */}
                <motion.div
                  animate={{ boxShadow: ["0 0 20px rgba(255,0,255,0.1)", "0 0 35px rgba(255,0,255,0.2)", "0 0 20px rgba(255,0,255,0.1)"] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="w-14 h-14 rounded-2xl bg-gradient-to-br from-neon-magenta/15 to-neon-cyan/10 border border-neon-magenta/25 flex items-center justify-center mb-5"
                >
                  <Send className="w-6 h-6 text-neon-magenta" />
                </motion.div>

                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-neon-magenta mb-3">
                  @{channel}
                </p>
                <h2 className="font-display text-3xl md:text-4xl font-black mb-4 uppercase leading-tight text-white">
                  Telegram-канал
                </h2>
                <p className="text-foreground/70 text-base md:text-lg max-w-lg leading-relaxed">{text}</p>
              </div>

              <div className="flex-shrink-0 flex flex-col gap-3 w-full sm:w-auto">
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-neon-magenta to-neon-magenta/80 text-primary-foreground font-display font-bold rounded-lg shadow-lg shadow-neon-magenta/25 hover:shadow-neon-magenta/40 hover:scale-[1.02] transition-all text-sm uppercase tracking-wider"
                >
                  <Send size={16} /> Подписаться
                </a>
                {maxUrl && (
                  <a
                    href={maxUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-8 py-3.5 border border-white/[0.12] text-foreground/60 font-display font-bold rounded-lg hover:border-neon-cyan/30 hover:text-neon-cyan transition-all text-sm uppercase tracking-wider"
                  >
                    <MessageCircle size={16} /> MAX
                  </a>
                )}
              </div>
            </div>

            {posts.length > 0 && (
              <>
                <div className="h-px bg-gradient-to-r from-transparent via-neon-magenta/15 to-transparent my-10" />
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {posts.map((p) => (
                    <a
                      key={p.id}
                      href={p.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative block rounded-xl overflow-hidden transition-all hover:scale-[1.02] bg-[#0e1520] border border-white/[0.08] hover:border-neon-magenta/25"
                      style={{
                        boxShadow: "0 8px 25px -8px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)",
                      }}
                    >
                      {p.photo && (
                        <img src={p.photo} alt="" loading="lazy" className="w-full h-32 object-cover" />
                      )}
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[11px] text-foreground/40">{formatDate(p.date)}</span>
                          <ExternalLink size={11} className="text-foreground/20 group-hover:text-neon-magenta transition-colors" />
                        </div>
                        {p.text && (
                          <p className="text-sm text-foreground/70 line-clamp-3 whitespace-pre-line leading-relaxed">{p.text}</p>
                        )}
                      </div>
                    </a>
                  ))}
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
