// Пост-билд пререндер: для каждой публичной страницы создаёт статический
// HTML с индивидуальными мета-тегами (title/description/OG/canonical) +
// sitemap.xml и robots.txt. Источник динамических маршрутов — SQL-миграции
// (единый источник правды, без дублирования контента).
//
// Запуск: node tools/prerender.mjs
// Переменные: SITE_URL (домен, по умолчанию плейсхолдер), PRERENDER_DIST (папка сборки).
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DIST = process.env.PRERENDER_DIST || path.join(ROOT, 'dist');
// TODO: заменить на реальный домен (или задать SITE_URL при сборке).
const SITE_URL = (process.env.SITE_URL || 'https://example.com').replace(/\/$/, '');
const OG_IMAGE = SITE_URL + '/og-cover.png';

const esc = (s) => String(s || '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// --- Извлечение slug/title/description из всех INSERT-блоков по таблице ---
// Сканируются все файлы миграций (новые миграции подхватываются автоматически).
function parseSeed(table) {
  const dir = path.join(ROOT, 'migrations');
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.sql')).sort();
  const rows = [];
  const seen = new Set();
  for (const file of files) {
    const sql = fs.readFileSync(path.join(dir, file), 'utf8');
    let from = 0;
    // в одном файле может быть несколько INSERT INTO <table>
    while (true) {
      const start = sql.indexOf('INSERT INTO ' + table, from);
      if (start === -1) break;
      const end = sql.indexOf('ON CONFLICT', start);
      const block = sql.slice(start, end === -1 ? sql.length : end);
      const re = /\('([a-z0-9-]{3,})',\s*'([^']+)',\s*'([^']+)'/g;
      let m;
      while ((m = re.exec(block)) !== null) {
        if (seen.has(m[1])) continue;
        seen.add(m[1]);
        rows.push({ slug: m[1], title: m[2].trim(), description: m[3].trim() });
      }
      from = end === -1 ? sql.length : end + 1;
    }
  }
  return rows;
}

const reports = parseSeed('research_reports');
const checklists = parseSeed('checklists');

const SITE_TITLE = 'ТехнологИИ права — исследования, аналитика, конференция';
const SITE_DESC = 'Платформа об ИИ, цифровых технологиях и масштабировании юридического бизнеса в сфере банкротства физических лиц. Исследования, обучение и конференция.';

const pages = [
  { route: '/', title: SITE_TITLE, description: SITE_DESC },
  { route: '/conference', title: 'Конференция ТехнологИИ Права — БФЛ, AI, масштабирование практики', description: 'Крупнейшая конференция и выставка о технологиях в юриспруденции: банкротство физлиц, AI-инструменты и масштабирование практики.' },
  { route: '/platform', title: 'Платформа тренировок и тестов — ТехнологИИ права', description: 'Тренажёр для команды юристов по банкротству: диалоговые тренировки, экзамены, слабые темы, кейсы, скрипты и аналитика прогресса для руководителя.' },
  { route: '/book', title: 'Банкротство физических лиц — практическое руководство', description: 'Книга-руководство для должника и специалиста: правовые основы, подготовка, судебная и внесудебная процедуры, последствия. 117 страниц, редакция май 2026.' },
  ...reports.map((r) => ({ route: `/research/${r.slug}`, title: `${r.title} — Исследование БФЛ`, description: r.description })),
  ...checklists.map((c) => ({ route: `/checklists/${c.slug}`, title: `${c.title} — Чек-лист`, description: c.description })),
];

const indexHtml = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8');

function buildHtml(base, { route, title, description }) {
  const url = SITE_URL + route;
  let html = base;
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`);
  const setMeta = (attr, key, val) => {
    const re = new RegExp(`(<meta ${attr}="${key}" content=")[^"]*(">)`);
    if (re.test(html)) html = html.replace(re, `$1${esc(val)}$2`);
  };
  setMeta('name', 'description', description);
  setMeta('property', 'og:title', title);
  setMeta('name', 'twitter:title', title);
  setMeta('property', 'og:description', description);
  setMeta('name', 'twitter:description', description);
  setMeta('property', 'og:image', OG_IMAGE);
  setMeta('name', 'twitter:image', OG_IMAGE);
  // canonical + og:url добавляем перед </head>
  const inject = `    <link rel="canonical" href="${esc(url)}" />\n    <meta property="og:url" content="${esc(url)}" />\n  </head>`;
  html = html.replace('</head>', inject);
  return html;
}

let written = 0;
for (const p of pages) {
  const html = buildHtml(indexHtml, p);
  const outPath = p.route === '/'
    ? path.join(DIST, 'index.html')
    : path.join(DIST, p.route, 'index.html');
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, html);
  written++;
}

// --- sitemap.xml ---
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  pages.map((p) => `  <url><loc>${SITE_URL}${p.route}</loc><changefreq>weekly</changefreq></url>`).join('\n') +
  `\n</urlset>\n`;
fs.writeFileSync(path.join(DIST, 'sitemap.xml'), sitemap);

// --- robots.txt ---
const robots = `User-agent: *\nAllow: /\nDisallow: /admin\n\nSitemap: ${SITE_URL}/sitemap.xml\n`;
fs.writeFileSync(path.join(DIST, 'robots.txt'), robots);

console.log(`prerender: ${written} страниц (reports=${reports.length}, checklists=${checklists.length}), sitemap+robots → ${DIST}`);
if (SITE_URL.includes('example.com')) console.log('NB: SITE_URL = плейсхолдер. Задайте реальный домен через переменную SITE_URL при сборке.');
