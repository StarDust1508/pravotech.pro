-- Migration: telegram_feedback table for user feedback collection
CREATE TABLE IF NOT EXISTS telegram_feedback (
  id SERIAL PRIMARY KEY,
  telegram_id BIGINT NOT NULL,
  username VARCHAR(255),
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_telegram_feedback_tg_id ON telegram_feedback(telegram_id);
