import { Router, Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../db.js';
import { rateLimit } from '../middleware/rate-limit.js';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config.js';

const router = Router();

export interface AuthUser {
  id: number;
  email: string;
  name: string;
  phone: string;
  role: string;
}

// Расширяем Request для аутентифицированных маршрутов
export interface AuthRequest extends Request {
  user?: AuthUser;
}

function signToken(user: AuthUser): string {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

// POST /user-auth/register — регистрация
router.post('/register', rateLimit(10, 60_000), async (req: Request, res: Response) => {
  try {
    const { email, password, name, phone } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email и пароль обязательны' });
    }

    if (typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ error: 'Некорректные данные' });
    }

    const emailLower = email.toLowerCase().trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailLower)) {
      return res.status(400).json({ error: 'Некорректный email' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Пароль должен быть не менее 6 символов' });
    }

    // Проверяем, что email не занят
    const existing = await query('SELECT id FROM users WHERE email = $1', [emailLower]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'Пользователь с таким email уже существует' });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const result = await query(
      `INSERT INTO users (email, password_hash, name, phone)
       VALUES ($1, $2, $3, $4)
       RETURNING id, email, name, phone, role`,
      [emailLower, passwordHash, name || '', phone || '']
    );

    const user: AuthUser = result.rows[0];
    const token = signToken(user);

    res.status(201).json({ token, user });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// POST /user-auth/login — вход
router.post('/login', rateLimit(10, 60_000), async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email и пароль обязательны' });
    }

    const emailLower = (email as string).toLowerCase().trim();

    const result = await query(
      'SELECT id, email, name, phone, role, password_hash FROM users WHERE email = $1',
      [emailLower]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Неверный email или пароль' });
    }

    const row = result.rows[0];
    const valid = await bcrypt.compare(password, row.password_hash);

    if (!valid) {
      return res.status(401).json({ error: 'Неверный email или пароль' });
    }

    const user: AuthUser = {
      id: row.id,
      email: row.email,
      name: row.name,
      phone: row.phone,
      role: row.role,
    };

    const token = signToken(user);
    res.json({ token, user });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// GET /user-auth/me — данные текущего пользователя
router.get('/me', async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Не авторизован' });
    }

    const token = authHeader.slice(7);
    let decoded: jwt.JwtPayload;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
    } catch {
      return res.status(401).json({ error: 'Невалидный токен' });
    }

    const result = await query(
      'SELECT id, email, name, phone, role, created_at FROM users WHERE id = $1',
      [decoded.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Me error:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// PUT /user-auth/me — обновить профиль текущего пользователя
router.put('/me', async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Не авторизован' });
    }

    const token = authHeader.slice(7);
    let decoded: jwt.JwtPayload;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
    } catch {
      return res.status(401).json({ error: 'Невалидный токен' });
    }

    const { name, phone } = req.body;
    const safeName = (typeof name === 'string' ? name : '').trim().slice(0, 200);
    const safePhone = (typeof phone === 'string' ? phone : '').trim().slice(0, 30);

    const result = await query(
      `UPDATE users SET name = $1, phone = $2 WHERE id = $3
       RETURNING id, email, name, phone, role, created_at`,
      [safeName, safePhone, decoded.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Update me error:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// POST /user-auth/link-device — привязать device_id к аккаунту
router.post('/link-device', async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Не авторизован' });
    }

    const token = authHeader.slice(7);
    let decoded: jwt.JwtPayload;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
    } catch {
      return res.status(401).json({ error: 'Невалидный токен' });
    }

    const { device_id } = req.body;
    if (!device_id || typeof device_id !== 'string') {
      return res.json({ ok: true }); // nothing to link
    }

    const uuidRe = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRe.test(device_id)) {
      return res.json({ ok: true });
    }

    // Update the user_profiles table to associate this device with the user
    await query(
      `UPDATE user_profiles SET user_id = $1 WHERE device_id = $2 AND (user_id IS NULL OR user_id = $1)`,
      [decoded.id, device_id]
    ).catch(() => {
      // user_id column may not exist yet — that's ok, non-critical
    });

    res.json({ ok: true });
  } catch (err) {
    console.error('Link device error:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Middleware для защиты маршрутов пользователей
export function requireUser(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Не авторизован' });
  }

  const token = authHeader.slice(7);
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
    (req as AuthRequest).user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
      name: '',
      phone: '',
    };
    next();
  } catch {
    return res.status(401).json({ error: 'Невалидный токен' });
  }
}

export default router;
