import { useState, useEffect, useCallback } from 'react';
import { api, Lesson } from '@/lib/api';
import VideoPlayer from './VideoPlayer';
import LessonTest from './LessonTest';
import { Lock, CheckCircle2, PlayCircle, FileText, ClipboardList, Download, ChevronRight } from 'lucide-react';

interface LessonPanelProps {
  courseId: string;
}

type TabKey = 'video' | 'materials' | 'test';

export default function LessonPanel({ courseId }: LessonPanelProps) {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>('video');
  const [loading, setLoading] = useState(true);
  const [lessonLoading, setLessonLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Загрузка списка уроков
  useEffect(() => {
    const fetchLessons = async () => {
      try {
        setLoading(true);
        const data = await api.lessons.list(courseId);
        setLessons(data);
        if (data.length > 0 && !currentLesson) {
          // Выбираем первый незавершённый или первый урок
          const firstIncomplete = data.find((l) => !l.progress?.completed);
          await selectLesson(firstIncomplete || data[0]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка загрузки');
      } finally {
        setLoading(false);
      }
    };
    fetchLessons();
  }, [courseId]);

  const selectLesson = async (lesson: Lesson) => {
    try {
      setLessonLoading(true);
      const detailed = await api.lessons.get(lesson.id);
      setCurrentLesson(detailed);
      setActiveTab('video');
    } catch (err) {
      console.error('Ошибка загрузки урока:', err);
    } finally {
      setLessonLoading(false);
    }
  };

  const handleProgress = useCallback(
    (seconds: number) => {
      if (!currentLesson) return;
      api.lessons.progress(currentLesson.id, { watched_seconds: seconds }).catch(console.error);
    },
    [currentLesson]
  );

  const markCompleted = useCallback(() => {
    if (!currentLesson) return;
    api.lessons
      .progress(currentLesson.id, { completed: true })
      .then(() => {
        setLessons((prev) =>
          prev.map((l) =>
            l.id === currentLesson.id
              ? { ...l, progress: { ...l.progress!, completed: true, test_score: l.progress?.test_score ?? null, test_answers: l.progress?.test_answers ?? null, watched_seconds: l.progress?.watched_seconds ?? 0 } }
              : l
          )
        );
      })
      .catch(console.error);
  }, [currentLesson]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  if (lessons.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Уроки пока не добавлены</p>
      </div>
    );
  }

  const tabs: { key: TabKey; label: string; icon: React.ReactNode; disabled?: boolean }[] = [
    { key: 'video', label: 'Видео', icon: <PlayCircle className="w-4 h-4" /> },
    {
      key: 'materials',
      label: 'Материалы',
      icon: <FileText className="w-4 h-4" />,
      disabled: !currentLesson?.accessible,
    },
    {
      key: 'test',
      label: 'Тест',
      icon: <ClipboardList className="w-4 h-4" />,
      disabled: !currentLesson?.test_data || !currentLesson?.accessible,
    },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Основной контент */}
      <div className="flex-1 min-w-0">
        {currentLesson && (
          <div className="space-y-6">
            {/* Табы — ВЫШЕ контента */}
            <div className="flex gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => !tab.disabled && setActiveTab(tab.key)}
                  disabled={tab.disabled}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all
                              ${
                                activeTab === tab.key
                                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                                  : tab.disabled
                                  ? 'bg-gray-800/30 text-gray-600 cursor-not-allowed'
                                  : 'bg-gray-800/50 text-gray-400 border border-gray-700/50 hover:text-gray-200 hover:border-gray-600'
                              }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Загрузка при смене урока */}
            {lessonLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <>
                {/* Видеоплеер */}
                {activeTab === 'video' && (
                  <VideoPlayer
                    videoToken={currentLesson.video_token ?? null}
                    accessible={currentLesson.accessible}
                    lessonId={currentLesson.id}
                    onProgress={handleProgress}
                  />
                )}

                {/* Материалы */}
                {activeTab === 'materials' && currentLesson.accessible && (
                  <div className="p-6 rounded-xl bg-gray-800/50 border border-gray-700/50 space-y-4">
                    <h3 className="text-lg font-semibold text-white">Материалы к уроку</h3>
                    {currentLesson.presentation_url ? (
                      <a
                        href={`/api/presentations/${currentLesson.presentation_url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-4 rounded-lg bg-gray-900/50 border border-gray-700/50
                                   hover:border-cyan-500/30 transition-colors group"
                      >
                        <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                          <FileText className="w-5 h-5 text-red-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-200 font-medium group-hover:text-cyan-400 transition-colors">
                            {currentLesson.presentation_url}
                          </p>
                          <p className="text-xs text-gray-500">PDF-презентация</p>
                        </div>
                        <Download className="w-5 h-5 text-gray-500 group-hover:text-cyan-400 transition-colors" />
                      </a>
                    ) : (
                      <p className="text-gray-500">Нет дополнительных материалов</p>
                    )}
                  </div>
                )}

                {/* Тест */}
                {activeTab === 'test' && currentLesson.accessible && currentLesson.test_data && (
                  <LessonTest
                    lessonId={currentLesson.id}
                    questions={currentLesson.test_data.questions}
                    previousScore={currentLesson.progress?.test_score}
                  />
                )}
              </>
            )}

            {/* Информация об уроке */}
            <div className="p-4 rounded-xl bg-gray-800/30 border border-gray-700/30">
              <h2 className="text-xl font-bold text-white mb-2">
                {currentLesson.display_order}. {currentLesson.title}
              </h2>
              {currentLesson.description && (
                <p className="text-gray-400 text-sm">{currentLesson.description}</p>
              )}
              {currentLesson.accessible && !currentLesson.progress?.completed && (
                <button
                  onClick={markCompleted}
                  className="mt-4 text-sm text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Отметить как пройденный
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Боковая панель — список уроков */}
      <div className={`lg:w-80 flex-shrink-0 ${sidebarOpen ? '' : 'lg:w-12'}`}>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="hidden lg:flex items-center gap-1 text-xs text-gray-500 hover:text-gray-300 mb-2 transition-colors"
        >
          <ChevronRight className={`w-4 h-4 transition-transform ${sidebarOpen ? 'rotate-90' : ''}`} />
          {sidebarOpen ? 'Скрыть' : 'Показать'} список
        </button>

        {sidebarOpen && (
          <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 overflow-hidden">
            <div className="p-3 border-b border-gray-700/50">
              <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">
                Содержание курса
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                {lessons.filter((l) => l.progress?.completed).length} / {lessons.length} уроков пройдено
              </p>
              {/* Прогресс-бар */}
              <div className="mt-2 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all"
                  style={{
                    width: `${(lessons.filter((l) => l.progress?.completed).length / lessons.length) * 100}%`,
                  }}
                />
              </div>
            </div>

            <div className="max-h-[600px] overflow-y-auto">
              {lessons.map((lesson) => {
                const isCurrent = currentLesson?.id === lesson.id;
                const isCompleted = lesson.progress?.completed;

                return (
                  <button
                    key={lesson.id}
                    onClick={() => selectLesson(lesson)}
                    className={`w-full text-left p-3 flex items-start gap-3 border-b border-gray-700/30 transition-all
                                ${isCurrent ? 'bg-cyan-500/10 border-l-2 border-l-cyan-500' : 'hover:bg-gray-700/30'}
                                ${!lesson.accessible ? 'opacity-60' : ''}`}
                  >
                    {/* Иконка статуса */}
                    <div className="flex-shrink-0 mt-0.5">
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-green-400" />
                      ) : !lesson.accessible ? (
                        <Lock className="w-5 h-5 text-gray-600" />
                      ) : isCurrent ? (
                        <PlayCircle className="w-5 h-5 text-cyan-400" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-gray-600 flex items-center justify-center">
                          <span className="text-[10px] text-gray-500">{lesson.display_order}</span>
                        </div>
                      )}
                    </div>

                    {/* Текст */}
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm font-medium truncate ${
                          isCurrent ? 'text-cyan-400' : isCompleted ? 'text-gray-400' : 'text-gray-300'
                        }`}
                      >
                        {lesson.title}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-gray-500">{lesson.duration_minutes} мин</span>
                        {lesson.is_free && (
                          <span className="text-[10px] px-1.5 py-0.5 bg-green-500/20 text-green-400 rounded font-medium">
                            Бесплатно
                          </span>
                        )}
                        {lesson.has_test && (
                          <span className="text-[10px] px-1.5 py-0.5 bg-purple-500/20 text-purple-400 rounded font-medium">
                            Тест
                          </span>
                        )}
                        {lesson.progress?.test_score !== null && lesson.progress?.test_score !== undefined && (
                          <span className="text-[10px] px-1.5 py-0.5 bg-cyan-500/20 text-cyan-400 rounded font-medium">
                            {lesson.progress.test_score}%
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
