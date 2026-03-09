import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { api, type Participant } from "@/lib/api";

export function ParticipantsSection() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadParticipants = async () => {
      try {
        const data = await api.participants.list(true); // только опубликованные
        setParticipants(data.sort((a, b) => a.display_order - b.display_order));
      } catch (error) {
        console.error('Ошибка загрузки участников:', error);
      } finally {
        setLoading(false);
      }
    };

    loadParticipants();
  }, []);

  if (loading) {
    return (
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="text-muted-foreground">Загрузка участников...</div>
        </div>
      </section>
    );
  }

  if (participants.length === 0) {
    return null; // не показываем секцию если участников нет
  }

  return (
    <section id="participants" className="py-20 px-4 bg-muted/20">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            <span className="text-neon-cyan">Участники</span> Конференции
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Ведущие компании и организации, которые принимают участие в конференции
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {participants.map((participant) => (
            <Card key={participant.id} className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-neon-cyan/20 bg-background">
              <CardContent className="p-6">
                <div className="text-center">
                  {participant.logo_url ? (
                    <div className="w-full h-20 flex items-center justify-center mb-4 p-2">
                      <img
                        src={participant.logo_url}
                        alt={participant.company_name}
                        className="max-w-full max-h-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-20 flex items-center justify-center mb-4 bg-muted rounded-lg">
                      <span className="text-lg font-bold text-neon-cyan">
                        {participant.company_name.charAt(0)}
                      </span>
                    </div>
                  )}
                  
                  <h3 className="text-sm font-semibold text-foreground group-hover:text-neon-cyan transition-colors">
                    {participant.company_name}
                  </h3>
                  
                  {participant.industry && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {participant.industry}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {participants.length > 0 && (
          <div className="text-center mt-12">
            <p className="text-sm text-muted-foreground">
              И многие другие ведущие компании отрасли
            </p>
          </div>
        )}
      </div>
    </section>
  );
}