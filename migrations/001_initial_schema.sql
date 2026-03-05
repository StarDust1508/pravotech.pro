-- Speakers (подтверждённые спикеры для отображения на сайте)
CREATE TABLE speakers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name VARCHAR(255) NOT NULL,
  position VARCHAR(255),
  company VARCHAR(255),
  bio TEXT,
  photo_url TEXT,
  stream VARCHAR(100),
  talk_title VARCHAR(500),
  talk_description TEXT,
  display_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Streams (потоки конференции)
CREATE TABLE streams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  icon VARCHAR(100),
  display_order INTEGER DEFAULT 0,
  is_highlighted BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sponsors (подтверждённые спонсоры для отображения)
CREATE TABLE sponsors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name VARCHAR(255) NOT NULL,
  logo_url TEXT,
  website_url VARCHAR(500),
  tier VARCHAR(50) NOT NULL DEFAULT 'silver',
  display_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sponsor tiers (пакеты спонсорства)
CREATE TABLE sponsor_tiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  price VARCHAR(100),
  icon VARCHAR(100),
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sponsor tier perks
CREATE TABLE sponsor_tier_perks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tier_id UUID REFERENCES sponsor_tiers(id) ON DELETE CASCADE,
  perk_text VARCHAR(500) NOT NULL,
  display_order INTEGER DEFAULT 0
);

-- Exhibition leads (заявки на стенд)
CREATE TABLE exhibition_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name VARCHAR(255) NOT NULL,
  contact_person VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  stand_size VARCHAR(50),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Speaker leads (заявки стать спикером)
CREATE TABLE speaker_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name VARCHAR(255) NOT NULL,
  position VARCHAR(255),
  company VARCHAR(255),
  email VARCHAR(255) NOT NULL,
  stream VARCHAR(100),
  talk_title VARCHAR(500),
  talk_description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sponsor leads (заявки на спонсорство)
CREATE TABLE sponsor_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name VARCHAR(255) NOT NULL,
  contact_person VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  tier VARCHAR(50),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Site settings (настройки сайта)
CREATE TABLE site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key VARCHAR(255) UNIQUE NOT NULL,
  setting_value TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Media (загруженные файлы)
CREATE TABLE media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_name VARCHAR(255) NOT NULL,
  file_url TEXT NOT NULL,
  file_type VARCHAR(50),
  file_size INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Migration tracking
CREATE TABLE IF NOT EXISTS _migrations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL,
  executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_speakers_order ON speakers(display_order);
CREATE INDEX idx_speakers_published ON speakers(is_published);
CREATE INDEX idx_streams_order ON streams(display_order);
CREATE INDEX idx_sponsors_order ON sponsors(display_order);
CREATE INDEX idx_sponsors_tier ON sponsors(tier);
CREATE INDEX idx_exhibition_leads_created ON exhibition_leads(created_at);
CREATE INDEX idx_speaker_leads_created ON speaker_leads(created_at);
CREATE INDEX idx_sponsor_leads_created ON sponsor_leads(created_at);
