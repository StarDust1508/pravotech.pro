CREATE TABLE IF NOT EXISTS telegram_users (
  id            SERIAL PRIMARY KEY,
  telegram_id   BIGINT UNIQUE NOT NULL,
  username      VARCHAR(255),
  first_name    VARCHAR(255),
  last_name     VARCHAR(255),
  user_id       INTEGER,  -- будущая связь с users таблицей
  is_active     BOOLEAN DEFAULT true,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_telegram_users_tg_id ON telegram_users(telegram_id);
