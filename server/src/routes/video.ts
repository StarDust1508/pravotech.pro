import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import { JWT_SECRET } from '../config.js';

const router = Router();
const VIDEO_DIR = process.env.VIDEO_DIR || '';

// GET /video/:token — стриминг видео с Range headers
router.get('/:token', async (req: Request, res: Response) => {
  try {
    const token = String(req.params.token);

    // Проверяем JWT токен
    let decoded: jwt.JwtPayload;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
    } catch {
      return res.status(403).json({ error: 'Недействительный или просроченный токен доступа' });
    }

    if (decoded.type !== 'video' || !decoded.videoFilename) {
      return res.status(403).json({ error: 'Невалидный токен видео' });
    }

    const filename = decoded.videoFilename as string;

    // Защита от path traversal
    const sanitized = path.basename(filename);
    if (sanitized !== filename || filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return res.status(400).json({ error: 'Некорректное имя файла' });
    }

    if (!VIDEO_DIR) {
      return res.status(500).json({ error: 'VIDEO_DIR не настроен' });
    }

    const filePath = path.join(VIDEO_DIR, sanitized);

    // Проверяем, что файл существует и не выходит за пределы VIDEO_DIR
    const realVideoDir = fs.realpathSync(VIDEO_DIR);
    let realFilePath: string;
    try {
      realFilePath = fs.realpathSync(filePath);
    } catch {
      return res.status(404).json({ error: 'Видео файл не найден' });
    }

    if (!realFilePath.startsWith(realVideoDir)) {
      return res.status(403).json({ error: 'Доступ запрещён' });
    }

    const stat = fs.statSync(realFilePath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      // Парсим Range header
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

      if (start >= fileSize || end >= fileSize || start > end) {
        res.status(416).set({
          'Content-Range': `bytes */${fileSize}`,
        });
        return res.end();
      }

      const chunkSize = end - start + 1;

      res.status(206).set({
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': String(chunkSize),
        'Content-Type': 'video/mp4',
        'Cache-Control': 'private, max-age=3600',
      });

      const stream = fs.createReadStream(realFilePath, { start, end });
      stream.pipe(res);

      stream.on('error', (err) => {
        console.error('Stream error:', err);
        if (!res.headersSent) {
          res.status(500).json({ error: 'Ошибка чтения файла' });
        }
      });
    } else {
      // Без Range — отдаём целый файл
      res.set({
        'Content-Length': String(fileSize),
        'Content-Type': 'video/mp4',
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'private, max-age=3600',
      });

      const stream = fs.createReadStream(realFilePath);
      stream.pipe(res);

      stream.on('error', (err) => {
        console.error('Stream error:', err);
        if (!res.headersSent) {
          res.status(500).json({ error: 'Ошибка чтения файла' });
        }
      });
    }
  } catch (err) {
    console.error('Video streaming error:', err);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Ошибка сервера' });
    }
  }
});

export default router;
