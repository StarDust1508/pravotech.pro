import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Mic2 } from "lucide-react";
import { api, type Speaker } from "@/lib/api";
import { TechCard } from "@/components/ui/TechCard";

export function SpeakersSection() {
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.speakers
      .list(true)
      .then((data) => setSpeakers(data.sort((a, b) => a.display_order - b.display_order)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading || speakers.length === 0) return null;

  return (
    <section id="speakers" className="py-14 scroll-mt-16">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mb-12"
        >
          <div className="text-neon-cyan text-[10px] font-bold uppercase tracking-[0.3em] mb-4">
            Эксперты индустрии
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-black mb-5 uppercase leading-[1.05]">
            Спикеры
          </h2>
          <p className="text-foreground/60 text-base md:text-lg leading-relaxed">
            Ведущие эксперты в области LegalTech, арбитражного управления и ИИ поделятся практическим опытом.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {speakers.map((speaker, i) => (
            <motion.div
              key={speaker.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <TechCard className="h-full">
                <div className="p-5 flex flex-col h-full">
                  <div className="flex items-start gap-4 mb-4">
                    {speaker.photo_url ? (
                      <img
                        src={speaker.photo_url}
                        alt={speaker.full_name}
                        className="w-16 h-16 rounded-xl object-cover ring-2 ring-white/[0.06] group-hover:ring-neon-cyan/30 transition-all flex-shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-neon-cyan/10 flex items-center justify-center text-neon-cyan font-display font-black text-xl flex-shrink-0">
                        {speaker.full_name.charAt(0)}
                      </div>
                    )}
                    <div className="min-w-0">
                      <h3 className="font-display text-sm font-bold leading-tight">{speaker.full_name}</h3>
                      {speaker.position && (
                        <p className="text-xs text-neon-cyan mt-0.5">{speaker.position}</p>
                      )}
                      {speaker.company && (
                        <p className="text-xs text-muted-foreground mt-0.5">{speaker.company}</p>
                      )}
                    </div>
                  </div>

                  {speaker.talk_title && (
                    <div className="flex-1">
                      <div className="flex items-start gap-2 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                        <Mic2 className="w-3.5 h-3.5 text-neon-cyan mt-0.5 flex-shrink-0" />
                        <p className="text-xs leading-relaxed text-foreground/75">{speaker.talk_title}</p>
                      </div>
                    </div>
                  )}

                  {speaker.stream && (
                    <div className="mt-3">
                      <span className="inline-block px-2 py-0.5 rounded-md bg-neon-cyan/8 text-neon-cyan text-[10px] font-bold uppercase tracking-wider">
                        {speaker.stream}
                      </span>
                    </div>
                  )}
                </div>
              </TechCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
