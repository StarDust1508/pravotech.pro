-- 012: Telegram posts cache table — fallback when t.me/s/ scraping is blocked
CREATE TABLE IF NOT EXISTS telegram_posts (
  id SERIAL PRIMARY KEY,
  channel VARCHAR(100) NOT NULL DEFAULT 'kredit_advokat',
  post_id INTEGER NOT NULL,
  link TEXT NOT NULL,
  text TEXT,
  date TIMESTAMPTZ,
  photo TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_tg_posts_channel_post ON telegram_posts (channel, post_id);

-- Seed with sample posts for kredit_advokat
INSERT INTO telegram_posts (channel, post_id, link, text, date, photo) VALUES
  ('kredit_advokat', 1001, 'https://t.me/kredit_advokat/1001',
   'Верховный суд РФ разъяснил порядок исключения единственного жилья из конкурсной массы. Теперь суды обязаны оценивать разумность площади жилья и состав семьи должника.',
   '2026-05-20T10:00:00Z', NULL),
  ('kredit_advokat', 1002, 'https://t.me/kredit_advokat/1002',
   'Чек-лист: 7 документов, которые нужно собрать перед подачей заявления на банкротство. Сохраняйте, пригодится каждому практикующему юристу.',
   '2026-05-18T14:30:00Z', NULL),
  ('kredit_advokat', 1003, 'https://t.me/kredit_advokat/1003',
   'Как ИИ помогает анализировать выписки по счетам должников? Рассказываем о нашем опыте внедрения LLM в подготовку финансовых анализов.',
   '2026-05-15T09:00:00Z', NULL),
  ('kredit_advokat', 1004, 'https://t.me/kredit_advokat/1004',
   'Конференция «Технологии права» — 24–25 июня 2026, Москва. 80+ спикеров, 6 тематических потоков, AI-воркшопы. Ранние билеты уже доступны!',
   '2026-05-12T12:00:00Z', NULL);
