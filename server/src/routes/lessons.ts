import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { query } from '../db.js';
import { requireUser, AuthRequest } from './user-auth.js';
import { JWT_SECRET } from '../config.js';

const router = Router();
const VIDEO_TOKEN_EXPIRES = '4h';

function signVideoToken(userId: number, lessonId: number, videoFilename: string): string {
  return jwt.sign(
    { userId, lessonId, videoFilename, type: 'video' },
    JWT_SECRET,
    { expiresIn: VIDEO_TOKEN_EXPIRES }
  );
}

// Проверяет, имеет ли пользователь доступ к курсу (оплата или бесплатный урок)
async function hasAccess(userId: number | null, courseId: string, lessonId: number): Promise<boolean> {
  // Проверяем, бесплатный ли урок
  const lessonResult = await query(
    'SELECT is_free FROM lessons WHERE id = $1 AND course_id = $2',
    [lessonId, courseId]
  );
  if (lessonResult.rows.length > 0 && lessonResult.rows[0].is_free) {
    return true;
  }

  if (!userId) return false;

  // Проверяем оплату
  const purchaseResult = await query(
    "SELECT id FROM purchases WHERE user_id = $1 AND course_id = $2 AND status = 'paid'",
    [userId, courseId]
  );
  return purchaseResult.rows.length > 0;
}

// GET /lessons/courses/:courseId/lessons — список уроков курса
router.get('/courses/:courseId/lessons', async (req: Request, res: Response) => {
  try {
    const courseId = req.params.courseId as string;

    // courseId может быть UUID или slug — резолвим
    let resolvedCourseId = courseId;
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(courseId)) {
      const courseResult = await query(
        'SELECT id FROM public.courses WHERE slug = $1',
        [courseId]
      );
      if (courseResult.rows.length === 0) {
        res.status(404).json({ error: 'Курс не найден' });
        return;
      }
      resolvedCourseId = courseResult.rows[0].id;
    }

    // Определяем пользователя (опционально)
    let userId: number | null = null;
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      try {
        const decoded = jwt.verify(authHeader.slice(7), JWT_SECRET) as jwt.JwtPayload;
        userId = decoded.id;
      } catch {
        // Без авторизации — просто анонимный просмотр
      }
    }

    // Проверяем, оплачен ли курс
    let hasPurchase = false;
    if (userId) {
      const purchaseResult = await query(
        "SELECT id FROM purchases WHERE user_id = $1 AND course_id = $2 AND status = 'paid'",
        [userId, resolvedCourseId]
      );
      hasPurchase = purchaseResult.rows.length > 0;
    }

    const result = await query(
      `SELECT id, course_id, title, description, duration_minutes, display_order, is_free,
              presentation_url, test_data IS NOT NULL AS has_test
       FROM lessons
       WHERE course_id = $1
       ORDER BY display_order`,
      [resolvedCourseId]
    );

    // Batch-загрузка прогресса одним запросом (вместо N+1)
    const lessonIds = result.rows.map((l: Record<string, unknown>) => l.id);
    let progressMap: Record<number, Record<string, unknown>> = {};
    if (userId && lessonIds.length > 0) {
      const progressResult = await query(
        'SELECT lesson_id, completed, test_score, watched_seconds FROM lesson_progress WHERE user_id = $1 AND lesson_id = ANY($2::int[])',
        [userId, lessonIds]
      );
      for (const p of progressResult.rows) {
        progressMap[p.lesson_id as number] = p;
      }
    }

    const lessons = result.rows.map((lesson: Record<string, unknown>) => {
      const accessible = lesson.is_free || hasPurchase;
      const progress = progressMap[lesson.id as number] || null;

      return {
        id: lesson.id,
        course_id: lesson.course_id,
        title: lesson.title,
        description: lesson.description,
        duration_minutes: lesson.duration_minutes,
        display_order: lesson.display_order,
        is_free: lesson.is_free,
        has_test: lesson.has_test,
        accessible,
        progress,
      };
    });

    res.json(lessons);
  } catch (err) {
    console.error('List lessons error:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// GET /lessons/:id — детали урока
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const lessonId = parseInt(String(req.params.id), 10);
    if (isNaN(lessonId)) {
      return res.status(400).json({ error: 'Некорректный ID урока' });
    }

    const result = await query(
      `SELECT id, course_id, title, description, video_filename, presentation_url,
              test_data, duration_minutes, display_order, is_free
       FROM lessons WHERE id = $1`,
      [lessonId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Урок не найден' });
    }

    const lesson = result.rows[0];

    // Определяем пользователя
    let userId: number | null = null;
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      try {
        const decoded = jwt.verify(authHeader.slice(7), JWT_SECRET) as jwt.JwtPayload;
        userId = decoded.id;
      } catch {
        // anonymous
      }
    }

    const accessible = await hasAccess(userId, lesson.course_id, lessonId);

    // Загружаем прогресс
    let progress = null;
    if (userId) {
      const progressResult = await query(
        'SELECT completed, test_score, test_answers, watched_seconds FROM lesson_progress WHERE user_id = $1 AND lesson_id = $2',
        [userId, lessonId]
      );
      if (progressResult.rows.length > 0) {
        progress = progressResult.rows[0];
      }
    }

    // Генерируем video token если есть доступ
    let videoToken: string | null = null;
    if (accessible && lesson.video_filename && userId) {
      videoToken = signVideoToken(userId, lessonId, lesson.video_filename);
    } else if (accessible && lesson.video_filename && lesson.is_free) {
      // Для бесплатных уроков — токен без userId
      videoToken = signVideoToken(0, lessonId, lesson.video_filename);
    }

    res.json({
      id: lesson.id,
      course_id: lesson.course_id,
      title: lesson.title,
      description: lesson.description,
      presentation_url: accessible ? lesson.presentation_url : null,
      test_data: accessible ? lesson.test_data : null,
      duration_minutes: lesson.duration_minutes,
      display_order: lesson.display_order,
      is_free: lesson.is_free,
      accessible,
      video_token: videoToken,
      progress,
    });
  } catch (err) {
    console.error('Get lesson error:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// POST /lessons/:id/progress — обновить прогресс (просмотр видео)
router.post('/:id/progress', requireUser, async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user!.id;
    const lessonId = parseInt(String(req.params.id), 10);

    if (isNaN(lessonId)) {
      return res.status(400).json({ error: 'Некорректный ID урока' });
    }

    const { watched_seconds, completed } = req.body;

    const result = await query(
      `INSERT INTO lesson_progress (user_id, lesson_id, watched_seconds, completed, updated_at)
       VALUES ($1, $2, $3, $4, NOW())
       ON CONFLICT (user_id, lesson_id)
       DO UPDATE SET
         watched_seconds = GREATEST(lesson_progress.watched_seconds, EXCLUDED.watched_seconds),
         completed = CASE WHEN EXCLUDED.completed THEN true ELSE lesson_progress.completed END,
         updated_at = NOW()
       RETURNING *`,
      [userId, lessonId, watched_seconds || 0, completed || false]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Progress error:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// POST /lessons/:id/test — сдать тест
router.post('/:id/test', requireUser, async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user!.id;
    const lessonId = parseInt(String(req.params.id), 10);

    if (isNaN(lessonId)) {
      return res.status(400).json({ error: 'Некорректный ID урока' });
    }

    const { answers } = req.body;
    if (!Array.isArray(answers)) {
      return res.status(400).json({ error: 'Ответы должны быть массивом' });
    }

    // Загружаем тест
    const lessonResult = await query(
      'SELECT course_id, test_data FROM lessons WHERE id = $1',
      [lessonId]
    );

    if (lessonResult.rows.length === 0) {
      return res.status(404).json({ error: 'Урок не найден' });
    }

    const lesson = lessonResult.rows[0];

    // Проверяем доступ
    const accessible = await hasAccess(userId, lesson.course_id, lessonId);
    if (!accessible) {
      return res.status(403).json({ error: 'Нет доступа к этому уроку' });
    }

    if (!lesson.test_data || !lesson.test_data.questions) {
      return res.status(400).json({ error: 'У этого урока нет теста' });
    }

    const questions = lesson.test_data.questions;
    let correct = 0;
    const results = questions.map((q: { correct: number }, i: number) => {
      const userAnswer = answers[i] ?? -1;
      const isCorrect = userAnswer === q.correct;
      if (isCorrect) correct++;
      return { question_index: i, user_answer: userAnswer, correct_answer: q.correct, is_correct: isCorrect };
    });

    const score = Math.round((correct / questions.length) * 100);

    // Сохраняем результат (порог 70% для "завершено")
    const passed = score >= 70;
    await query(
      `INSERT INTO lesson_progress (user_id, lesson_id, test_score, test_answers, completed, updated_at)
       VALUES ($1, $2, $3, $4, $5, NOW())
       ON CONFLICT (user_id, lesson_id)
       DO UPDATE SET
         test_score = EXCLUDED.test_score,
         test_answers = EXCLUDED.test_answers,
         completed = CASE WHEN EXCLUDED.test_score >= 70 THEN true ELSE lesson_progress.completed END,
         updated_at = NOW()
       RETURNING *`,
      [userId, lessonId, score, JSON.stringify(results), passed]
    );

    res.json({
      score,
      total: questions.length,
      correct,
      results,
    });
  } catch (err) {
    console.error('Test submission error:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

export default router;
