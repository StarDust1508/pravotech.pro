import { Router } from 'express';
import { rateLimit } from '../middleware/rate-limit.js';
import { query } from '../db.js';

const router = Router();

// Лента публичного Telegram-канала без API-ключей: серверный фетч страницы
// предпросмотра t.me/s/<channel> и парсинг последних постов. Кэш на 5 минут.
// Требует доступа сервера в интернет (на проде/локально — есть).

interface TgPost {
  id: number;
  link: string;
  text: string;
  date: string;
  photo: string | null;
}

const CACHE_TTL = 5 * 60 * 1000;
const cache = new Map<string, { at: number; posts: TgPost[] }>();

function decodeEntities(s: string): string {
  return s
    .replace(/<br\s*\/?>(?=)/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .trim();
}

function parsePosts(html: string, channel: string, limit: number): TgPost[] {
  const posts: TgPost[] = [];
  // Каждый пост — блок с data-post="channel/ID"
  const blockRe = /<div class="tgme_widget_message[^"]*"[^>]*data-post="([^"]+\/(\d+))"[\s\S]*?(?=<div class="tgme_widget_message |<\/section>|$)/g;
  let m: RegExpExecArray | null;
  while ((m = blockRe.exec(html)) !== null) {
    const block = m[0];
    const id = Number(m[2]);
    const textMatch = block.match(/<div class="tgme_widget_message_text[^"]*"[^>]*>([\s\S]*?)<\/div>/);
    const text = textMatch ? decodeEntities(textMatch[1]) : '';
    const dateMatch = block.match(/<time[^>]*datetime="([^"]+)"/);
    const date = dateMatch ? dateMatch[1] : '';
    const photoMatch = block.match(/tgme_widget_message_photo_wrap[^"]*"[^>]*style="[^"]*background-image:url\('([^']+)'\)/);
    const photo = photoMatch ? photoMatch[1] : null;
    if (text || photo) {
      posts.push({ id, link: `https://t.me/${channel}/${id}`, text, date, photo });
    }
  }
  // последние посты — в конце страницы; берём limit самых новых
  return posts.slice(-limit).reverse();
}

async function loadFromDb(channel: string, limit: number): Promise<TgPost[]> {
  const result = await query(
    'SELECT post_id, link, text, date, photo FROM telegram_posts WHERE channel = $1 ORDER BY post_id DESC LIMIT $2',
    [channel, limit]
  );
  return result.rows.map((r: any) => ({
    id: r.post_id,
    link: r.link,
    text: r.text || '',
    date: r.date ? new Date(r.date).toISOString() : '',
    photo: r.photo || null,
  }));
}

router.get('/feed', rateLimit(30, 60_000), async (req, res) => {
  try {
    const raw = String(req.query.channel || 'kredit_advokat');
    const channel = raw.replace(/^@/, '').replace(/[^a-zA-Z0-9_]/g, '');
    const limit = Math.min(Math.max(parseInt(String(req.query.limit || '5'), 10) || 5, 1), 10);
    if (!channel) return res.json({ channel: '', posts: [] });

    const cached = cache.get(channel);
    if (cached && Date.now() - cached.at < CACHE_TTL) {
      return res.json({ channel, posts: cached.posts.slice(0, limit), cached: true });
    }

    const resp = await fetch(`https://t.me/s/${channel}`, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; PravoTechBot/1.0)' },
      signal: AbortSignal.timeout(8000),
    });
    if (!resp.ok) {
      return res.json({ channel, posts: [], error: 'fetch_failed' });
    }
    const html = await resp.text();
    const posts = parsePosts(html, channel, 10);
    if (posts.length > 0) {
      cache.set(channel, { at: Date.now(), posts });
      return res.json({ channel, posts: posts.slice(0, limit) });
    }

    // Scraping returned 0 posts (channel may block /s/ preview) — fall back to DB
    const dbPosts = await loadFromDb(channel, limit);
    if (dbPosts.length > 0) {
      cache.set(channel, { at: Date.now(), posts: dbPosts });
    }
    res.json({ channel, posts: dbPosts.slice(0, limit), source: 'db' });
  } catch (err) {
    // Деградация: попробуем БД, если и она пуста — фронт покажет блок подписки.
    try {
      const dbPosts = await loadFromDb(
        String(req.query.channel || 'kredit_advokat').replace(/^@/, '').replace(/[^a-zA-Z0-9_]/g, ''),
        Math.min(Math.max(parseInt(String(req.query.limit || '5'), 10) || 5, 1), 10)
      );
      return res.json({ channel: req.query.channel || 'kredit_advokat', posts: dbPosts, source: 'db' });
    } catch {
      // ignore
    }
    res.json({ channel: '', posts: [], error: 'unavailable' });
  }
});

export default router;
