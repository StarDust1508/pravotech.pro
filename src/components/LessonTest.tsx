import { useState } from 'react';
import { api, TestResult } from '@/lib/api';
import { CheckCircle2, XCircle, Send, RotateCcw } from 'lucide-react';

interface Question {
  question: string;
  options: string[];
  correct: number;
}

interface LessonTestProps {
  lessonId: number;
  questions: Question[];
  previousScore?: number | null;
}

export default function LessonTest({ lessonId, questions, previousScore }: LessonTestProps) {
  const [answers, setAnswers] = useState<(number | null)[]>(
    new Array(questions.length).fill(null)
  );
  const [result, setResult] = useState<TestResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const allAnswered = answers.every((a) => a !== null);

  const handleSelect = (qIndex: number, oIndex: number) => {
    if (result) return; // Нельзя менять после сдачи
    setAnswers((prev) => {
      const next = [...prev];
      next[qIndex] = oIndex;
      return next;
    });
  };

  const handleSubmit = async () => {
    if (!allAnswered || submitting) return;
    setSubmitting(true);
    setError(null);

    try {
      const token = localStorage.getItem('user_token');
      if (!token) {
        setError('Для сдачи теста необходимо авторизоваться');
        setSubmitting(false);
        return;
      }

      const res = await api.lessons.submitTest(lessonId, answers as number[]);
      setResult(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка отправки');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetry = () => {
    setAnswers(new Array(questions.length).fill(null));
    setResult(null);
    setError(null);
  };

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">
          Тест по уроку
          <span className="text-gray-400 text-sm ml-2">({questions.length} вопросов)</span>
        </h3>
        {previousScore !== null && previousScore !== undefined && !result && (
          <span className="text-sm text-cyan-400">
            Предыдущий результат: {previousScore}%
          </span>
        )}
      </div>

      {/* Результат */}
      {result && (
        <div
          className={`p-4 rounded-xl border ${
            result.score >= 70
              ? 'bg-green-500/10 border-green-500/30'
              : 'bg-amber-500/10 border-amber-500/30'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-white text-lg">
                Результат: {result.score}%
              </p>
              <p className="text-sm text-gray-400 mt-1">
                Правильных ответов: {result.correct} из {result.total}
              </p>
            </div>
            <button
              onClick={handleRetry}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-800 border border-gray-700
                         rounded-lg text-gray-300 hover:text-white hover:border-gray-600 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Пройти заново
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Вопросы */}
      <div className="space-y-6">
        {questions.map((q, qIndex) => {
          const questionResult = result?.results?.[qIndex];

          return (
            <div
              key={qIndex}
              className="p-4 rounded-xl bg-gray-800/50 border border-gray-700/50 space-y-3"
            >
              <p className="font-medium text-gray-200">
                <span className="text-cyan-400 mr-2">{qIndex + 1}.</span>
                {q.question}
              </p>

              <div className="space-y-2">
                {q.options.map((option, oIndex) => {
                  const isSelected = answers[qIndex] === oIndex;
                  let borderColor = 'border-gray-700/50';
                  let bgColor = 'bg-gray-900/30';
                  let icon = null;

                  if (result && questionResult) {
                    if (oIndex === questionResult.correct_answer) {
                      borderColor = 'border-green-500/50';
                      bgColor = 'bg-green-500/10';
                      icon = <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />;
                    } else if (isSelected && !questionResult.is_correct) {
                      borderColor = 'border-red-500/50';
                      bgColor = 'bg-red-500/10';
                      icon = <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />;
                    }
                  } else if (isSelected) {
                    borderColor = 'border-cyan-500/50';
                    bgColor = 'bg-cyan-500/10';
                  }

                  return (
                    <button
                      key={oIndex}
                      onClick={() => handleSelect(qIndex, oIndex)}
                      disabled={!!result}
                      className={`w-full text-left p-3 rounded-lg border ${borderColor} ${bgColor}
                                  flex items-center gap-3 transition-all
                                  ${!result ? 'hover:border-cyan-500/40 hover:bg-cyan-500/5 cursor-pointer' : 'cursor-default'}
                                  ${isSelected && !result ? 'ring-1 ring-cyan-500/30' : ''}`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center
                                    ${isSelected ? 'border-cyan-500 bg-cyan-500' : 'border-gray-600'}`}
                      >
                        {isSelected && !result && (
                          <div className="w-2 h-2 rounded-full bg-white" />
                        )}
                      </div>
                      <span className="text-sm text-gray-300 flex-1">{option}</span>
                      {icon}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Кнопка отправки */}
      {!result && (
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={!allAnswered || submitting}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all
                        ${
                          allAnswered && !submitting
                            ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40'
                            : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                        }`}
          >
            <Send className="w-4 h-4" />
            {submitting ? 'Отправка...' : 'Проверить ответы'}
          </button>
        </div>
      )}
    </div>
  );
}
