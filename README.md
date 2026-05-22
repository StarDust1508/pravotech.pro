# ТехнологИИ права

Legal-Tech платформа о банкротстве физических лиц (БФЛ): аналитические исследования, чек-листы по арбитражному управлению, академия (курсы) и отраслевая конференция.

## Стек

- Фронтенд: React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui, TanStack Query, React Router, framer-motion, recharts
- Бэкенд: Node.js, Express, PostgreSQL (node-postgres)
- Аналитические отчёты в PDF готовятся отдельным скриптом-генератором (matplotlib + reportlab)

## Структура

- `src/` — фронтенд (страницы в `src/pages`, секции и UI в `src/components`, API-клиент в `src/lib/api.ts`)
- `server/` — Express API (роуты в `server/src/routes`)
- `migrations/` — SQL-миграции (накатываются по порядку, отслеживаются в таблице `_migrations`)
- `public/reports/` — PDF-файлы аналитических отчётов

## Локальный запуск

Требуется Node.js 18+ и PostgreSQL. Локально проще всего поднять БД через Docker.

Локальный запуск НЕ требует прод-сервера и SSH-туннеля — используйте `*:local` команды.

```sh
# 1. зависимости (включая server/)
npm install

# 2. локальный PostgreSQL в Docker (логин/пароль/БД заданы в команде)
npm run db:local:up

# 3. применить миграции к локальной БД
npm run migrate:local

# 4. запуск фронта + API локально (без туннеля)
npm run dev:local
```

Открыть: **http://localhost:8080**. API — `:3001` (фронт проксирует `/api`). Админка — `/admin`, пароль `admin`.

Остановить БД: `npm run db:local:down`.

> Команды `db:local:up`, `migrate:local`, `dev:local` подставляют локальные параметры БД сами — `.env` для локального запуска править не нужно. Нужен установленный Docker. Без Docker — поднимите свой PostgreSQL и пропишите `DATABASE_*` в `.env` (см. `.env.example`).
>
> Дефолтный `npm run dev` (с SSH-туннелем к удалённой БД) — для прод-окружения, локально он не нужен.

## Полезные команды

```sh
npm run build                   # сборка фронтенда + SEO-пререндер (tools/prerender.mjs)
SITE_URL=https://домен npm run build   # сборка с реальным доменом для sitemap/OG
npm run lint                    # ESLint
npm run test                    # unit-тесты (Vitest)
npm --prefix server run build   # сборка сервера
```

## Конфигурация

Переменные окружения задаются в `.env` (см. `.env.example`): подключение к PostgreSQL (`DATABASE_*`), `DATABASE_SCHEMA` (по умолчанию `pravo`), `ADMIN_PASSWORD` для входа в `/admin`, `API_PORT`, `SITE_URL` для SEO-пререндера.

## SEO

`npm run build` после сборки запускает `tools/prerender.mjs`: генерирует статические HTML с индивидуальными мета-тегами/OG для главной, конференции, лендингов и всех отчётов/чек-листов (slug'и берутся из миграций), плюс `sitemap.xml` и `robots.txt`. Домен берётся из `SITE_URL`.

## Контент через админку

Раздел `/admin` (вход по паролю из `ADMIN_PASSWORD`) управляет спикерами, потоками, спонсорами, участниками, заявками, медиа, курсами академии, аналитическими отчётами и чек-листами.
