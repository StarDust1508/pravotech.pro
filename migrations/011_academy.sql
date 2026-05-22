-- Migration: таблицы Академии (courses/teachers/reviews).
-- Раньше существовали только на проде в схеме public; локально их не было,
-- из-за чего эндпоинты /api/academy/* падали. Создаём в public явно.
-- БЕЗОПАСНО ДЛЯ ПРОДА: на проде таблицы уже есть → IF NOT EXISTS пропустит.
-- Колонки выведены из реальных запросов сервера (routes/academy.ts) и типов
-- фронтенда (AcademyCourse в src/lib/api.ts).

CREATE TABLE IF NOT EXISTS public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(160) UNIQUE NOT NULL,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  hero_title TEXT,
  hero_subtitle TEXT,
  hero_description TEXT,
  hero_highlights JSONB,
  price VARCHAR(100),
  level VARCHAR(100),
  display_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT FALSE,
  duration TEXT,
  lectures_count INTEGER,
  practice_hours TEXT,
  certificate TEXT,
  skills JSONB,
  target_audience JSONB,
  program JSONB,
  format_details JSONB,
  hero_image_url TEXT,
  og_image_url TEXT,
  cover_image_url TEXT,
  lessons JSONB,
  selling_points JSONB,
  faq_items JSONB,
  team_order JSONB,
  learning_results JSONB,
  program_features JSONB,
  materials_includes JSONB,
  practice_tasks JSONB,
  program_badge TEXT,
  program_format_title TEXT,
  program_format_description TEXT,
  special_offer_title TEXT,
  special_offer_description TEXT,
  special_offer_badge TEXT,
  special_offer_button_text TEXT,
  cta_title TEXT,
  cta_description TEXT,
  cta_button_text TEXT,
  intro_title TEXT,
  intro_description TEXT,
  download_form_banner_url TEXT,
  download_form_file_url TEXT,
  download_form_title TEXT,
  download_form_description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.teachers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name VARCHAR(255) NOT NULL,
  position VARCHAR(255),
  bio TEXT,
  expertise TEXT,
  experience TEXT,
  photo_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_name VARCHAR(255),
  rating INTEGER,
  comment TEXT,
  author_avatar_url TEXT,
  review_image_url TEXT,
  review_video_url TEXT,
  course_id UUID,
  page_type VARCHAR(100),
  page_id VARCHAR(160),
  is_published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_courses_slug ON public.courses(slug);
CREATE INDEX IF NOT EXISTS idx_reviews_course ON public.reviews(course_id);
