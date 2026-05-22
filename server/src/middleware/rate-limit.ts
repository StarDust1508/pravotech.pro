import type { Request, Response, NextFunction } from 'express';

// Простой in-memory rate-limit по IP для публичных эндпоинтов (защита форм от спама).
// Достаточно для одного инстанса; при горизонтальном масштабировании заменить на Redis.

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

// Периодическая очистка устаревших корзин.
setInterval(() => {
  const now = Date.now();
  for (const [key, b] of buckets) {
    if (now > b.resetAt) buckets.delete(key);
  }
}, 60_000).unref?.();

function clientIp(req: Request): string {
  // req.ip учитывает 'trust proxy' (см. index.ts) и корректно достаёт
  // клиентский IP из X-Forwarded-For за доверенным прокси.
  return req.ip || req.socket.remoteAddress || 'unknown';
}

/**
 * Ограничение частоты запросов.
 * @param max     максимум запросов в окне
 * @param windowMs длительность окна в миллисекундах
 */
export function rateLimit(max = 10, windowMs = 60_000) {
  return (req: Request, res: Response, next: NextFunction) => {
    const key = `${clientIp(req)}:${req.baseUrl}${req.path}`;
    const now = Date.now();
    const bucket = buckets.get(key);

    if (!bucket || now > bucket.resetAt) {
      buckets.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }

    if (bucket.count >= max) {
      const retryAfter = Math.ceil((bucket.resetAt - now) / 1000);
      res.set('Retry-After', String(retryAfter));
      return res.status(429).json({ error: 'Слишком много запросов. Попробуйте позже.' });
    }

    bucket.count += 1;
    next();
  };
}
