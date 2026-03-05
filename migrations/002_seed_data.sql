-- Seed: Потоки конференции
INSERT INTO streams (title, description, icon, display_order, is_highlighted) VALUES
  ('Банкротство физических лиц', 'Процедуры, судебная практика, автоматизация подготовки документов', 'Scale', 0, TRUE),
  ('AI в юриспруденции', 'Нейросети для анализа документов, предиктивная аналитика судебных решений', 'Brain', 1, FALSE),
  ('Кибербезопасность и право', 'Защита персональных данных, GDPR, правовое регулирование', 'Shield', 2, FALSE),
  ('Электронный документооборот', 'Цифровая подпись, смарт-контракты, блокчейн в юриспруденции', 'FileText', 3, FALSE),
  ('Онлайн-разрешение споров', 'ODR-платформы, медиация, арбитраж в цифровой среде', 'Users', 4, FALSE),
  ('Регулирование цифровых активов', 'Криптовалюты, NFT, цифровой рубль — правовые аспекты', 'Landmark', 5, FALSE);

-- Seed: Пакеты спонсорства
INSERT INTO sponsor_tiers (name, price, icon, display_order) VALUES
  ('Серебро', 'от 300 000 ₽', 'Star', 0),
  ('Золото', 'от 700 000 ₽', 'Gem', 1),
  ('Платина', 'от 1 500 000 ₽', 'Crown', 2);

INSERT INTO sponsor_tier_perks (tier_id, perk_text, display_order) VALUES
  ((SELECT id FROM sponsor_tiers WHERE name = 'Серебро'), 'Логотип на сайте', 0),
  ((SELECT id FROM sponsor_tiers WHERE name = 'Серебро'), '2 билета', 1),
  ((SELECT id FROM sponsor_tiers WHERE name = 'Серебро'), 'Упоминание в рассылке', 2),
  ((SELECT id FROM sponsor_tiers WHERE name = 'Золото'), 'Стенд 9 м²', 0),
  ((SELECT id FROM sponsor_tiers WHERE name = 'Золото'), '5 билетов', 1),
  ((SELECT id FROM sponsor_tiers WHERE name = 'Золото'), 'Выступление 15 мин', 2),
  ((SELECT id FROM sponsor_tiers WHERE name = 'Платина'), 'Стенд 25 м²', 0),
  ((SELECT id FROM sponsor_tiers WHERE name = 'Платина'), '10 билетов', 1),
  ((SELECT id FROM sponsor_tiers WHERE name = 'Платина'), 'Пленарный доклад', 2);

-- Seed: Настройки сайта
INSERT INTO site_settings (setting_key, setting_value) VALUES
  ('hero_title', 'Технологии ПРАВА'),
  ('hero_date', '24–25 ИЮНЯ 2026'),
  ('hero_location', 'Москва, Технограм'),
  ('hero_description', 'Крупнейшая конференция и выставка, посвящённая технологиям в юриспруденции. Особый фокус — банкротство физических лиц.');
