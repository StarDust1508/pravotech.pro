-- Create participants table
CREATE TABLE IF NOT EXISTS participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name VARCHAR(255) NOT NULL,
  logo_url TEXT,
  website_url VARCHAR(500),
  industry VARCHAR(255),
  description TEXT,
  display_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed: Sample participants (major companies)
INSERT INTO participants (company_name, logo_url, website_url, industry, description, display_order, is_published) VALUES
  ('Сбербанк', 'https://logos-download.com/wp-content/uploads/2016/06/Sberbank_logo.png', 'https://sberbank.ru', 'Финансовые услуги', 'Крупнейший банк России и Восточной Европы', 0, TRUE),
  ('Яндекс', 'https://logos-download.com/wp-content/uploads/2016/06/Yandex_logo.png', 'https://yandex.ru', 'IT и технологии', 'Ведущая российская интернет-компания', 1, TRUE),
  ('Газпром', 'https://logos-download.com/wp-content/uploads/2016/06/Gazprom_logo.png', 'https://gazprom.ru', 'Нефтегаз', 'Крупнейшая энергетическая компания России', 2, TRUE),
  ('Росбанк', 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/Rosbank_logo.svg/2560px-Rosbank_logo.svg.png', 'https://rosbank.ru', 'Финансовые услуги', 'Универсальный коммерческий банк', 3, TRUE),
  ('МегаФон', 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/MegaFon_logo.svg/2560px-MegaFon_logo.svg.png', 'https://megafon.ru', 'Телекоммуникации', 'Один из ведущих операторов мобильной связи', 4, TRUE),
  ('Ростелеком', 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Rostelecom_logo.svg/2560px-Rostelecom_logo.svg.png', 'https://rostelecom.ru', 'Телекоммуникации', 'Национальная телекоммуникационная компания', 5, TRUE);