import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GraduationCap, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import type { AcademyCourse } from "@/lib/api";

export const AcademySection = () => {
  const [courses, setCourses] = useState<AcademyCourse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.academy.courses()
      .then(c => setCourses(c.filter(x => x.slug)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section id="academy" className="py-20">
        <div className="container text-center text-muted-foreground">Загрузка курсов...</div>
      </section>
    );
  }

  if (courses.length === 0) return null;

  return (
    <section id="academy" className="py-20">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <GraduationCap className="w-8 h-8 text-neon-magenta" />
            <h2 className="font-display text-3xl md:text-5xl font-black uppercase">
              Академия
            </h2>
          </div>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl">
            Онлайн-курсы по банкротству физических лиц для юристов, руководителей и специалистов.
            Практические программы от ведущих экспертов отрасли.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course, i) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <Link
                to={`/courses/${course.slug}`}
                className="group p-6 rounded-xl border border-border bg-card hover:border-neon-cyan/50 transition-all flex flex-col h-full"
              >
                <div className="flex items-center gap-3 mb-4">
                  <BookOpen className={`w-7 h-7 flex-shrink-0 ${i % 2 === 0 ? "text-neon-cyan" : "text-neon-magenta"}`} />
                  <span className={`text-xs font-bold uppercase tracking-wider ${i % 2 === 0 ? "text-neon-cyan" : "text-neon-magenta"}`}>
                    {course.level || "Курс"}
                  </span>
                </div>
                <h3 className="font-display text-base font-bold mb-2 leading-snug">
                  {course.hero_title || course.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4 flex-grow">
                  {course.hero_subtitle || course.description}
                </p>
                {Number(course.price) > 0 && (
                  <p className="text-lg font-display font-bold text-neon-cyan mb-4">
                    {Number(course.price).toLocaleString("ru-RU")} ₽
                  </p>
                )}
                <div className="px-4 py-2.5 border border-neon-cyan text-neon-cyan font-display font-bold rounded-lg text-center text-sm uppercase tracking-wider group-hover:bg-accent/10 transition-colors">
                  Подробнее о курсе
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
