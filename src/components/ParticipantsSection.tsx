import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { api, type Participant } from "@/lib/api";
import { TechCard } from "@/components/ui/TechCard";

export function ParticipantsSection() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.participants
      .list(true)
      .then((data) => setParticipants(data.sort((a, b) => a.display_order - b.display_order)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading || participants.length === 0) return null;

  return (
    <section id="participants" className="py-14 scroll-mt-16">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mb-8"
        >
          <div className="text-neon-cyan text-[10px] font-bold uppercase tracking-[0.3em] mb-4">
            Экосистема конференции
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-black mb-5 uppercase leading-[1.05]">
            Участники
          </h2>
          <p className="text-foreground/60 text-base md:text-lg leading-relaxed">
            Ведущие компании и организации юридического рынка, которые формируют повестку индустрии.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {participants.map((p, i) => {
            const inner = (
              <div className="p-4 flex flex-col items-center justify-center gap-2 text-center h-full">
                {p.logo_url ? (
                  <img
                    src={p.logo_url}
                    alt={p.company_name}
                    className="max-h-10 max-w-[100px] object-contain opacity-60 group-hover:opacity-100 transition-opacity"
                  />
                ) : (
                  <div className="w-11 h-11 rounded-xl bg-neon-cyan/10 flex items-center justify-center text-neon-cyan font-display font-black text-base">
                    {p.company_name.charAt(0)}
                  </div>
                )}
                <span className="font-display text-xs font-bold text-center leading-tight mt-1">
                  {p.company_name}
                </span>
                {p.industry && (
                  <span className="text-[10px] text-muted-foreground/60">{p.industry}</span>
                )}
                {p.website_url && (
                  <ExternalLink size={10} className="text-foreground/15 group-hover:text-foreground/40 transition-colors" />
                )}
              </div>
            );

            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.03 }}
              >
                {p.website_url ? (
                  <a href={p.website_url} target="_blank" rel="noopener noreferrer" className="block h-full">
                    <TechCard className="h-full">{inner}</TechCard>
                  </a>
                ) : (
                  <TechCard className="h-full">{inner}</TechCard>
                )}
              </motion.div>
            );
          })}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-xs text-muted-foreground/50 mt-8 uppercase tracking-wider"
        >
          И многие другие ведущие компании отрасли
        </motion.p>
      </div>
    </section>
  );
}
