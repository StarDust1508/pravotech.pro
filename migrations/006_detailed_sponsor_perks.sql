-- Update sponsor tiers with detailed perks
DELETE FROM sponsor_tier_perks;
DELETE FROM sponsor_tiers;

-- Re-insert sponsor tiers
INSERT INTO sponsor_tiers (name, price, icon, display_order) VALUES
  ('Серебро', 'от 300 000 ₽', 'Star', 0),
  ('Золото', 'от 700 000 ₽', 'Gem', 1),
  ('Платина', 'от 1 500 000 ₽', 'Crown', 2);

-- Insert detailed perks for Silver tier
INSERT INTO sponsor_tier_perks (tier_id, perk_text, display_order) VALUES
  ((SELECT id FROM sponsor_tiers WHERE name = 'Серебро'), 'Размещение логотипа на официальном сайте конференции', 0),
  ((SELECT id FROM sponsor_tiers WHERE name = 'Серебро'), '2 билета на все дни мероприятия', 1),
  ((SELECT id FROM sponsor_tiers WHERE name = 'Серебро'), 'Упоминание в еженедельной email-рассылке 5000+ подписчикам', 2),
  ((SELECT id FROM sponsor_tiers WHERE name = 'Серебро'), 'Размещение в презентации «Партнеры и спонсоры»', 3),
  ((SELECT id FROM sponsor_tiers WHERE name = 'Серебро'), 'Брендирование зоны кофе-брейков (совместно с другими спонсорами)', 4),
  ((SELECT id FROM sponsor_tiers WHERE name = 'Серебро'), 'Доступ к базе контактов участников (по запросу)', 5),
  ((SELECT id FROM sponsor_tiers WHERE name = 'Серебро'), 'Сертификат партнера конференции', 6),
  ((SELECT id FROM sponsor_tiers WHERE name = 'Серебро'), 'Право использования статуса «Партнер Технологии Права 2026»', 7);

-- Insert detailed perks for Gold tier
INSERT INTO sponsor_tier_perks (tier_id, perk_text, display_order) VALUES
  ((SELECT id FROM sponsor_tiers WHERE name = 'Золото'), 'Все преимущества пакета «Серебро»', 0),
  ((SELECT id FROM sponsor_tiers WHERE name = 'Золото'), 'Выделенный стенд 3×3 м в выставочной зоне', 1),
  ((SELECT id FROM sponsor_tiers WHERE name = 'Золото'), '5 билетов на все дни мероприятия + 2 VIP билета', 2),
  ((SELECT id FROM sponsor_tiers WHERE name = 'Золото'), 'Выступление 15 минут в основной программе', 3),
  ((SELECT id FROM sponsor_tiers WHERE name = 'Золото'), 'Персональная страница спонсора на сайте с описанием услуг', 4),
  ((SELECT id FROM sponsor_tiers WHERE name = 'Золото'), 'Эксклюзивное брендирование одной из тематических зон', 5),
  ((SELECT id FROM sponsor_tiers WHERE name = 'Золото'), 'Размещение баннера 2×3 м в центральном холле', 6),
  ((SELECT id FROM sponsor_tiers WHERE name = 'Золото'), 'Промо-материалы в welcome bag каждого участника', 7),
  ((SELECT id FROM sponsor_tiers WHERE name = 'Золото'), 'Возможность проведения мастер-класса или воркшопа', 8),
  ((SELECT id FROM sponsor_tiers WHERE name = 'Золото'), 'Приоритетный доступ к спискам участников и лидс с мероприятия', 9);

-- Insert detailed perks for Platinum tier
INSERT INTO sponsor_tier_perks (tier_id, perk_text, display_order) VALUES
  ((SELECT id FROM sponsor_tiers WHERE name = 'Платина'), 'Все преимущества пакета «Золото»', 0),
  ((SELECT id FROM sponsor_tiers WHERE name = 'Платина'), 'Премиум стенд 5×5 м в лучшей локации выставки', 1),
  ((SELECT id FROM sponsor_tiers WHERE name = 'Платина'), '10 билетов + 5 VIP билетов + отдельная VIP-зона', 2),
  ((SELECT id FROM sponsor_tiers WHERE name = 'Платина'), 'Пленарный доклад 30 минут в прайм-тайм', 3),
  ((SELECT id FROM sponsor_tiers WHERE name = 'Платина'), 'Статус «Генеральный партнер» — максимальная видимость', 4),
  ((SELECT id FROM sponsor_tiers WHERE name = 'Платина'), 'Персонализированная сессия с топ-менеджментом целевых компаний', 5),
  ((SELECT id FROM sponsor_tiers WHERE name = 'Платина'), 'Эксклюзивное брендирование главной сцены и фотозоны', 6),
  ((SELECT id FROM sponsor_tiers WHERE name = 'Платина'), 'Собственный брендированный networking cocktail', 7),
  ((SELECT id FROM sponsor_tiers WHERE name = 'Платина'), 'Интеграция логотипа в дизайн бейджей всех участников', 8),
  ((SELECT id FROM sponsor_tiers WHERE name = 'Платина'), 'Пресс-релиз о партнерстве в отраслевых медиа', 9),
  ((SELECT id FROM sponsor_tiers WHERE name = 'Платина'), 'Видеопрезентация компании в рамках главной трансляции', 10),
  ((SELECT id FROM sponsor_tiers WHERE name = 'Платина'), 'Индивидуальная программа встреч с ключевыми участниками', 11);