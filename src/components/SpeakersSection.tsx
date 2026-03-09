import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { api, type Speaker } from "@/lib/api";

export function SpeakersSection() {
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSpeakers = async () => {
      try {
        const data = await api.speakers.list(true); // только опубликованные
        setSpeakers(data.sort((a, b) => a.display_order - b.display_order));
      } catch (error) {
        console.error('Ошибка загрузки спикеров:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSpeakers();
  }, []);

  if (loading) {
    return (
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="text-muted-foreground">Загрузка спикеров...</div>
        </div>
      </section>
    );
  }

  if (speakers.length === 0) {
    return null; // не показываем секцию если спикеров нет
  }

  return (
    <section id="speakers" className="py-20 px-4 bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            <span className="text-neon-cyan">Спикеры</span> Конференции
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Ведущие эксперты в области права и технологий поделятся своим опытом и знаниями
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {speakers.map((speaker) => (
            <Card key={speaker.id} className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-neon-cyan/20">
              <CardContent className="p-6">
                <div className="text-center">
                  {speaker.photo_url ? (
                    <div className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border-4 border-neon-cyan/20 group-hover:border-neon-cyan/40 transition-colors">
                      <img
                        src={speaker.photo_url}
                        alt={speaker.full_name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center border-4 border-neon-cyan/20 group-hover:border-neon-cyan/40 transition-colors">
                      <span className="text-4xl font-bold text-neon-cyan">
                        {speaker.full_name.charAt(0)}
                      </span>
                    </div>
                  )}
                  
                  <h3 className="text-xl font-bold mb-2">{speaker.full_name}</h3>
                  
                  {speaker.position && (
                    <p className="text-neon-cyan font-medium mb-1">
                      {speaker.position}
                    </p>
                  )}
                  
                  {speaker.company && (
                    <p className="text-muted-foreground mb-4">
                      {speaker.company}
                    </p>
                  )}
                  
                  {speaker.talk_title && (
                    <div className="mb-4 p-3 bg-muted rounded-lg">
                      <h4 className="text-sm font-semibold text-neon-cyan mb-2">
                        Доклад:
                      </h4>
                      <p className="text-sm">
                        {speaker.talk_title}
                      </p>
                    </div>
                  )}
                  
                  {speaker.stream && (
                    <div className="inline-block px-3 py-1 bg-neon-cyan/10 text-neon-cyan rounded-full text-sm font-medium">
                      {speaker.stream}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}