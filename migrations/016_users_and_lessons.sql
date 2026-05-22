-- Migration 016: users, lessons, lesson_progress, purchases
-- Система пользователей и уроков для курсов с видео

-- Пользователи (студенты / обычные пользователи)
CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  email         VARCHAR(320) NOT NULL UNIQUE,
  password_hash VARCHAR(128) NOT NULL,
  name          VARCHAR(200) DEFAULT '',
  phone         VARCHAR(30) DEFAULT '',
  role          VARCHAR(20) NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Уроки курса
CREATE TABLE IF NOT EXISTS lessons (
  id              SERIAL PRIMARY KEY,
  course_id       UUID NOT NULL,
  title           VARCHAR(500) NOT NULL,
  description     TEXT DEFAULT '',
  video_filename  VARCHAR(500),
  presentation_url VARCHAR(500),
  test_data       JSONB,
  duration_minutes INTEGER DEFAULT 0,
  display_order   INTEGER NOT NULL DEFAULT 0,
  is_free         BOOLEAN DEFAULT false,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_lessons_course ON lessons(course_id);

-- Прогресс пользователя
CREATE TABLE IF NOT EXISTS lesson_progress (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  lesson_id   INTEGER NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  completed   BOOLEAN DEFAULT false,
  test_score  INTEGER,
  test_answers JSONB,
  watched_seconds INTEGER DEFAULT 0,
  updated_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

-- Покупки (заглушка для оплаты)
CREATE TABLE IF NOT EXISTS purchases (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id   UUID NOT NULL,
  status      VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'refunded')),
  amount      INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);
