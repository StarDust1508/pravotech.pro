import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Handshake } from "lucide-react";
import { api, type Sponsor } from "@/lib/api";
import conferenceHero from "@/assets/conference-hero.png";

const tierLabels: Record<string, { label: string; accent: "cyan" | "magenta" }> = {
  platinum: { label: "Генеральный партнёр", accent: "magenta" },
  gold: { label: "Золотой партнёр", accent: "magenta" },
  silver: { label: "Серебряный партнёр", accent: "cyan" },
  bronze: { label: "Бронзовый партнёр", accent: "cyan" },
};

const tierOrder = ["platinum", "gold", "silver", "bronze"];

export function SponsorsSection() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.sponsors
      .list(true)
      .then((data) => setSponsors(data.sort((a, b) => a.display_order - b.display_order)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading || sponsors.length === 0) return null;

  const grouped = tierOrder
    .map((tier) => ({
      tier,
      meta: tierLabels[tier] || { label: tier, accent: "cyan" as const },
      items: sponsors.filter((s) => s.tier === tier),
    }))
    .filter((g) => g.items.length > 0);

  return (
    <section id="sponsors" className="py-14 scroll-mt-16">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mb-8"
        >
          <div className="text-neon-magenta text-[10px] font-bold uppercase tracking-[0.3em] mb-4">
            Партнёры конференции
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-black mb-5 uppercase leading-[1.05]">
            Спонсоры
          </h2>
          <p className="text-foreground/60 text-base md:text-lg leading-relaxed">
            Компании, которые делают конференцию возможной и развивают Legal Tech экосистему.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Sponsor cards */}
          <div className="space-y-6">
            {grouped.map((group) => (
              <div key={group.tier}>
                <div
                  className={`text-[10px] font-bold uppercase tracking-[0.25em] mb-4 ${
                    group.meta.accent === "magenta" ? "text-neon-magenta" : "text-neon-cyan"
                  }`}
                >
                  {group.meta.label}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {group.items.map((sponsor, i) => (
                    <motion.div
                      key={sponsor.id}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05 }}
                    >
                      {sponsor.website_url ? (
                        <a
                          href={sponsor.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`group flex flex-col items-center justify-center gap-2.5 p-4 rounded-xl border bg-card transition-all hover:shadow-lg ${
                            group.meta.accent === "magenta"
                              ? "border-neon-magenta/20 hover:border-neon-magenta/40 hover:shadow-neon-magenta/5"
                              : "border-border hover:border-neon-cyan/40 hover:shadow-neon-cyan/5"
                          }`}
                        >
                          <SponsorContent sponsor={sponsor} accent={group.meta.accent} />
                        </a>
                      ) : (
                        <div
                          className={`flex flex-col items-center justify-center gap-2.5 p-4 rounded-xl border bg-card ${
                            group.meta.accent === "magenta"
                              ? "border-neon-magenta/20"
                              : "border-border"
                          }`}
                        >
                          <SponsorContent sponsor={sponsor} accent={group.meta.accent} />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Right side — conference visual */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="hidden lg:block"
          >
            <div className="relative rounded-2xl overflow-hidden border border-neon-magenta/20 h-full">
              <img
                src={conferenceHero}
                alt="Конференция Технологии права"
                className="w-full h-full object-cover absolute inset-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-7">
                <div className="flex items-center gap-2.5 mb-3">
                  <Handshake className="w-5 h-5 text-neon-magenta" />
                  <span className="text-xs font-bold uppercase tracking-[0.25em] text-neon-magenta">
                    Партнёрство
                  </span>
                </div>
                <p className="font-display text-xl md:text-2xl font-black leading-snug mb-2">
                  Станьте частью экосистемы
                </p>
                <p className="text-sm md:text-base text-foreground/60 leading-relaxed">
                  Прямой доступ к decision-makers юридического рынка
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function SponsorContent({ sponsor, accent }: { sponsor: Sponsor; accent: "cyan" | "magenta" }) {
  return (
    <>
      {sponsor.logo_url ? (
        <img
          src={sponsor.logo_url}
          alt={sponsor.company_name}
          className="max-h-12 max-w-[140px] object-contain"
        />
      ) : (
        <div
          className={`w-14 h-14 rounded-xl flex items-center justify-center text-xl font-black ${
            accent === "magenta"
              ? "bg-neon-magenta/10 text-neon-magenta"
              : "bg-neon-cyan/10 text-neon-cyan"
          }`}
        >
          {sponsor.company_name.charAt(0)}
        </div>
      )}
      <span className="font-display text-sm font-bold text-center leading-tight">
        {sponsor.company_name}
      </span>
      {sponsor.website_url && (
        <ExternalLink size={12} className="text-foreground/20 group-hover:text-foreground/50 transition-colors" />
      )}
    </>
  );
}
