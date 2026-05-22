import { Router, Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { rateLimit } from '../middleware/rate-limit.js';

const router = Router();

// In-memory session store (token → expiry timestamp)
const sessions = new Map<string, number>();

const SESSION_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

// Cleanup expired sessions every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [token, expiry] of sessions) {
    if (now > expiry) sessions.delete(token);
  }
}, 10 * 60 * 1000);

function createSession(): string {
  const token = crypto.randomBytes(32).toString('hex');
  sessions.set(token, Date.now() + SESSION_TTL_MS);
  return token;
}

// POST /auth/login — 5 попыток в минуту на IP
router.post('/login', rateLimit(5, 60_000), (req: Request, res: Response) => {
  const { password } = req.body;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return res.status(500).json({ error: 'Admin password not configured' });
  }

  if (!password || typeof password !== 'string') {
    return res.status(401).json({ error: 'Invalid password' });
  }

  const a = Buffer.from(password, 'utf8');
  const b = Buffer.from(adminPassword, 'utf8');
  const match = a.length === b.length && crypto.timingSafeEqual(a, b);

  if (!match) {
    return res.status(401).json({ error: 'Invalid password' });
  }

  const token = createSession();
  res.json({ token });
});

// GET /auth/verify
router.get('/verify', (req: Request, res: Response) => {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token || !sessions.has(token)) {
    return res.status(401).json({ valid: false });
  }

  const expiry = sessions.get(token)!;
  if (Date.now() > expiry) {
    sessions.delete(token);
    return res.status(401).json({ valid: false });
  }

  // Refresh session on activity
  sessions.set(token, Date.now() + SESSION_TTL_MS);
  res.json({ valid: true });
});

// POST /auth/logout
router.post('/logout', (req: Request, res: Response) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (token) sessions.delete(token);
  res.json({ success: true });
});

// Middleware for protecting admin routes
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token || !sessions.has(token)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const expiry = sessions.get(token)!;
  if (Date.now() > expiry) {
    sessions.delete(token);
    return res.status(401).json({ error: 'Session expired' });
  }

  sessions.set(token, Date.now() + SESSION_TTL_MS);
  next();
}

export default router;
