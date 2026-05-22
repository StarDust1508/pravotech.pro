import { Router, Request, Response } from 'express';
import { query } from '../db.js';
import { requireUser, AuthRequest } from './user-auth.js';

const router = Router();

// POST /purchases — создать заявку на покупку курса
router.post('/', requireUser, async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user!.id;
    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({ error: 'courseId обязателен' });
    }

    // Проверяем, существует ли курс (в public.courses)
    const courseResult = await query(
      'SELECT id, price, slug FROM public.courses WHERE id = $1::uuid',
      [courseId]
    );
    if (courseResult.rows.length === 0) {
      return res.status(404).json({ error: 'Курс не найден' });
    }

    const course = courseResult.rows[0];

    // price is VARCHAR like "14 900 ₽" — extract numeric part
    const priceStr = String(course.price || '0').replace(/[^\d]/g, '');
    const coursePrice = parseInt(priceStr, 10) || 0;

    // Проверяем, нет ли уже покупки
    const existing = await query(
      'SELECT id, status FROM purchases WHERE user_id = $1 AND course_id = $2::uuid',
      [userId, courseId]
    );

    if (existing.rows.length > 0) {
      const purchase = existing.rows[0];
      if (purchase.status === 'paid') {
        return res.status(409).json({ error: 'Курс уже оплачен', purchase });
      }
      // Если pending — возвращаем существующую заявку с slug
      return res.json({ ...purchase, course_slug: course.slug });
    }

    // Создаём новую покупку
    const result = await query(
      `INSERT INTO purchases (user_id, course_id, status, amount)
       VALUES ($1, $2::uuid, 'pending', $3)
       RETURNING *`,
      [userId, courseId, coursePrice]
    );

    res.status(201).json({ ...result.rows[0], course_slug: course.slug });
  } catch (err) {
    console.error('Create purchase error:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// GET /purchases/my — список покупок текущего пользователя
router.get('/my', requireUser, async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user!.id;

    const result = await query(
      `SELECT p.*, ac.title AS course_title, ac.slug AS course_slug
       FROM purchases p
       LEFT JOIN public.courses ac ON ac.id = p.course_id
       WHERE p.user_id = $1
       ORDER BY p.created_at DESC`,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('List purchases error:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// POST /purchases/:id/confirm — подтвердить оплату (только admin)
router.post('/:id/confirm', requireUser, async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    if (authReq.user!.role !== 'admin') {
      return res.status(403).json({ error: 'Доступ запрещён' });
    }

    const purchaseId = parseInt(String(req.params.id), 10);
    if (isNaN(purchaseId)) {
      return res.status(400).json({ error: 'Некорректный ID покупки' });
    }

    const result = await query(
      `UPDATE purchases SET status = 'paid'
       WHERE id = $1 AND status = 'pending'
       RETURNING *`,
      [purchaseId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Покупка не найдена или уже подтверждена' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Confirm purchase error:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

export default router;
