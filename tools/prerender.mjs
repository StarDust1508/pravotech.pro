// Пост-билд пререндер v6: мета-теги + Schema.org JSON-LD + noscript-контент
// для AI-ботов + sitemap.xml + robots.txt.
// v6: og:locale, og:site_name, og:type per page, Яндекс Нейро hints
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DIST = process.env.PRERENDER_DIST || path.join(ROOT, 'dist');
const SITE_URL = (process.env.SITE_URL || 'https://pravotech.pro').replace(/\/$/, '');
const OG_IMAGE = SITE_URL + '/og-cover.png';
const BUILD_DATE = new Date().toISOString().slice(0, 10);

const esc = (s) => String(s || '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function parseSeed(table) {
  const dir = path.join(ROOT, 'migrations');
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.sql')).sort();
  const rows = [], seen = new Set();
  for (const file of files) {
    const sql = fs.readFileSync(path.join(dir, file), 'utf8');
    let from = 0;
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

// ═══════════════════════════════════════════════════════
// Parse summaries from UPDATE statements in SQL migrations
// ═══════════════════════════════════════════════════════
function parseSummaries(table) {
  const dir = path.join(ROOT, 'migrations');
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.sql')).sort();
  const map = {};
  for (const file of files) {
    const sql = fs.readFileSync(path.join(dir, file), 'utf8');
    // Match: UPDATE <table> SET\n  summary = '...' ... WHERE slug = '...';
    const re = new RegExp(
      "UPDATE\\s+" + table + "\\s+SET\\s+summary\\s*=\\s*'([\\s\\S]*?)'(?:\\s*,|\\s+WHERE)" +
      "[\\s\\S]*?WHERE\\s+slug\\s*=\\s*'([a-z0-9-]+)'",
      'g'
    );
    let m;
    while ((m = re.exec(sql)) !== null) {
      const summary = m[1].replace(/''/g, "'").trim();
      const slug = m[2];
      map[slug] = summary;
    }
  }
  return map;
}

const reportSummaries = parseSummaries('research_reports');
const checklistSummaries = parseSummaries('checklists');

const SITE_TITLE = 'ТехнологИИ права — исследования, аналитика, конференция';
const SITE_DESC = 'Платформа об ИИ, цифровых технологиях и масштабировании юридического бизнеса в сфере банкротства физических лиц. Исследования, обучение и конференция.';
const ORG_NAME = 'ТехнологИИ права';

// ═══════════════════════════════════════════════════════
// FAQ data для Schema.org FAQPage и noscript
// ═══════════════════════════════════════════════════════
const homeFaq = [
  { q: "Что такое банкротство физических лиц?", a: "Банкротство физических лиц (БФЛ) — это законная процедура списания долгов граждан через арбитражный суд или МФЦ (внесудебное банкротство). Регулируется Федеральным законом № 127-ФЗ." },
  { q: "Кому подходит платформа «ТехнологИИ права»?", a: "Платформа создана для юристов, арбитражных управляющих, руководителей юридических компаний и всех, кто работает в сфере банкротства физических лиц." },
  { q: "Какие исследования доступны на платформе?", a: "8 аналитических исследований: рынок БФЛ 2026, сравнение игроков, влияние ИИ на юристов, цифровой путь клиента, экономика практики, технологии лидеров, автоматизация документов, AI для продаж." },
  { q: "Как получить книгу о банкротстве?", a: "Книга (117 стр., май 2026) доступна бесплатно через Telegram-бот @NeuroPravo_Bot — напишите /start." },
  { q: "Когда пройдёт конференция?", a: "25–26 сентября 2026, Москва, Технополис «Инновация». 6 потоков, 80+ спикеров, 1500+ участников." },
  { q: "Какие курсы есть в Академии?", a: "Юридические аспекты БФЛ, неосвобождение от обязательств, оспаривание сделок, эффективная команда, продажи юридических услуг. 4 уровня: Старт, Практика, Рост, Экспертный." },
  { q: "Что умеет Telegram-бот NeuroPravo?", a: "Бот бесплатно отправляет книгу, чек-листы, исследования и информацию о курсах Академии." },
];

const bookFaq = [
  { q: "Для кого написана книга?", a: "Для должников, юристов и тех, кто помогает близким. Понятный навигатор без юридического тумана." },
  { q: "Сколько стоит книга?", a: "Полностью бесплатна. Получить через Telegram-бот @NeuroPravo_Bot или по email." },
  { q: "Какие темы разобраны?", a: "Правовые основы, подготовка, судебная и внесудебная процедуры, последствия. 117 страниц, 4 части." },
  { q: "Можно ли самому пройти банкротство по книге?", a: "Книга даёт понимание процедуры. Для судебного банкротства нужен арбитражный управляющий." },
  { q: "Когда последняя редакция?", a: "Май 2026, с учётом актуальной судебной практики." },
];

const conferenceFaq = [
  { q: "Когда и где пройдёт конференция?", a: "25–26 сентября 2026 года, Москва, Технополис «Инновация»." },
  { q: "Сколько потоков и спикеров?", a: "6 тематических потоков, 80+ спикеров — эксперты индустрии банкротства и LegalTech." },
  { q: "Можно ли участвовать онлайн?", a: "Конференция проводится в смешанном формате: очно и онлайн." },
  { q: "Какие темы обсуждаются?", a: "Банкротство физлиц, AI-инструменты для юристов, масштабирование юридической практики, автоматизация." },
];

const pageFaqs = { '/': homeFaq, '/book': bookFaq, '/conference': conferenceFaq };

// OG type per page route
function getOgType(route) {
  if (route === '/book') return 'book';
  if (route.startsWith('/research/') || route.startsWith('/checklists/')) return 'article';
  return 'website';
}

// ═══════════════════════════════════════════════════════
// Schema.org JSON-LD
// ═══════════════════════════════════════════════════════
const orgSchema = {
  '@type': 'Organization', '@id': SITE_URL + '/#organization',
  name: ORG_NAME, url: SITE_URL,
  logo: { '@type': 'ImageObject', url: SITE_URL + '/favicon.svg' },
  description: 'Платформа об ИИ, цифровых технологиях и масштабировании юридического бизнеса в сфере банкротства физических лиц.',
  email: 'pravotechhub@mail.ru',
  address: { '@type': 'PostalAddress', addressLocality: 'Москва', addressCountry: 'RU' },
  sameAs: [
    'https://t.me/kredit_advokat',
    'https://t.me/NeuroPravo_Bot',
    'https://max.ru/id645211616449_biz',
  ],
};
const legalServiceSchema = {
  '@type': 'LegalService',
  '@id': SITE_URL + '/#legalservice',
  name: 'Банкротство физических лиц — ТехнологИИ права',
  description: 'Профессиональное сопровождение процедур банкротства физических лиц: от консультации до списания долгов. Арбитражное управление, подготовка заявлений, судебное и внесудебное банкротство.',
  url: SITE_URL,
  image: SITE_URL + '/og-cover.png',
  telephone: '+7-917-703-10-96',
  priceRange: 'От 0 руб. (бесплатная консультация)',
  provider: { '@id': SITE_URL + '/#organization' },
  areaServed: { '@type': 'Country', name: 'Россия' },
  geo: { '@type': 'GeoCoordinates', latitude: '55.7558', longitude: '37.6173' },
  address: { '@type': 'PostalAddress', addressLocality: 'Москва', addressCountry: 'RU' },
  serviceType: ['Банкротство физических лиц', 'Списание долгов', 'Арбитражное управление', 'Юридические консультации по банкротству'],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Услуги по банкротству',
    itemListElement: [
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Бесплатная консультация по банкротству' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Судебное банкротство физлиц' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Внесудебное банкротство через МФЦ' } },
    ]
  },
};

const personSchema = {
  '@type': 'Person', '@id': SITE_URL + '/#founder',
  name: 'Дмитрий Мартынов',
  jobTitle: 'Основатель платформы «ТехнологИИ права»',
  url: SITE_URL,
  worksFor: { '@id': SITE_URL + '/#organization' },
  knowsAbout: ['Банкротство физических лиц', 'Арбитражное управление', 'LegalTech', 'AI в юриспруденции'],
};

const websiteSchema = {
  '@type': 'WebSite', '@id': SITE_URL + '/#website',
  url: SITE_URL, name: ORG_NAME, description: SITE_DESC,
  publisher: { '@id': SITE_URL + '/#organization' }, inLanguage: 'ru-RU',
};

function buildSchemaJsonLd(page) {
  const url = SITE_URL + page.route;
  const schemas = [
    { '@context': 'https://schema.org', ...orgSchema },
    { '@context': 'https://schema.org', ...websiteSchema },
  ];

  // BreadcrumbList
  if (page.route !== '/') {
    const parts = page.route.split('/').filter(Boolean);
    const items = [{ '@type': 'ListItem', position: 1, name: 'Главная', item: SITE_URL + '/' }];
    if (parts.length === 2) {
      const sectionName = parts[0] === 'research' ? 'Исследования' : 'Чек-листы';
      items.push({ '@type': 'ListItem', position: 2, name: sectionName, item: SITE_URL + '/' + parts[0] });
      items.push({ '@type': 'ListItem', position: 3, name: page.title.replace(/ — .*$/, '') });
    } else {
      items.push({ '@type': 'ListItem', position: 2, name: page.title.replace(/ — .*$/, '') });
    }
    schemas.push({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: items });
  }

  // Page-specific schemas
  if (page.route === '/') {
    schemas.push({ '@context': 'https://schema.org', ...legalServiceSchema });
    schemas.push({ '@context': 'https://schema.org', '@type': 'WebPage', '@id': url, url, name: page.title, description: page.description, isPartOf: { '@id': SITE_URL + '/#website' }, about: { '@id': SITE_URL + '/#organization' }, datePublished: '2025-01-01', dateModified: BUILD_DATE, inLanguage: 'ru-RU', speakable: { '@type': 'SpeakableSpecification', cssSelector: ['h1', 'h2', '.text-muted-foreground', 'noscript'] } });
  } else if (page.route.startsWith('/research/')) {
    schemas.push({ '@context': 'https://schema.org', ...personSchema });
    schemas.push({ '@context': 'https://schema.org', '@type': 'Article', '@id': url, headline: page.title, description: page.description, url, image: OG_IMAGE, datePublished: '2026-01-01', dateModified: BUILD_DATE, author: { '@id': SITE_URL + '/#founder' }, publisher: { '@id': SITE_URL + '/#organization' }, mainEntityOfPage: { '@type': 'WebPage', '@id': url }, inLanguage: 'ru-RU', articleSection: 'Исследования' });
  } else if (page.route.startsWith('/checklists/')) {
    schemas.push({ '@context': 'https://schema.org', ...personSchema });
    schemas.push({ '@context': 'https://schema.org', '@type': 'Article', '@id': url, headline: page.title, description: page.description, url, image: OG_IMAGE, datePublished: '2026-01-01', dateModified: BUILD_DATE, author: { '@id': SITE_URL + '/#founder' }, publisher: { '@id': SITE_URL + '/#organization' }, mainEntityOfPage: { '@type': 'WebPage', '@id': url }, inLanguage: 'ru-RU', articleSection: 'Чек-листы' });
  } else if (page.route === '/conference') {
    schemas.push({ '@context': 'https://schema.org', '@type': 'Event', name: 'Конференция ТехнологИИ Права 2026', description: page.description, url, startDate: '2026-09-25', endDate: '2026-09-26', eventAttendanceMode: 'https://schema.org/MixedEventAttendanceMode', eventStatus: 'https://schema.org/EventScheduled', location: { '@type': 'Place', name: 'Технополис «Инновация»', address: { '@type': 'PostalAddress', addressLocality: 'Москва', addressCountry: 'RU' } }, organizer: { '@id': SITE_URL + '/#organization' }, inLanguage: 'ru-RU', image: OG_IMAGE });
  } else if (page.route === '/platform') {
    schemas.push({ '@context': 'https://schema.org', '@type': 'SoftwareApplication', name: 'Платформа тренировок — ТехнологИИ права', description: page.description, url, applicationCategory: 'EducationalApplication', operatingSystem: 'Web', offers: { '@type': 'Offer', price: '0', priceCurrency: 'RUB' }, author: { '@id': SITE_URL + '/#organization' } });
  } else if (page.route === '/book') {
    schemas.push({ '@context': 'https://schema.org', '@type': 'Book', name: 'Банкротство физических лиц — практическое руководство', description: page.description, url, author: { '@id': SITE_URL + '/#organization' }, inLanguage: 'ru-RU', numberOfPages: 117, bookEdition: 'Редакция май 2026', bookFormat: 'https://schema.org/EBook' });
  } else if (page.route === '/academy') {
    schemas.push({ '@context': 'https://schema.org', '@type': 'EducationalOrganization', name: 'Академия ТехнологИИ права', description: page.description, url, parentOrganization: { '@id': SITE_URL + '/#organization' } });
    // Course schema — курсы Академии
    const courses = [
      { name: 'Юридические аспекты БФЛ', desc: 'Правовые основы банкротства физических лиц — от первых признаков неплатёжеспособности до завершения процедуры.' },
      { name: 'Неосвобождение от обязательств', desc: 'Риски неосвобождения должника от долгов: судебная практика, типичные ошибки, стратегия защиты.' },
      { name: 'Оспаривание сделок', desc: 'Анализ сделок должника в процедуре банкротства — основания, сроки, тактика.' },
      { name: 'Эффективная команда', desc: 'Управление юридической практикой: найм, обучение, мотивация и контроль качества.' },
      { name: 'Продажи юридических услуг', desc: 'Маркетинг и продажи в сфере банкротства: воронки, скрипты, конверсия.' },
    ];
    for (const c of courses) {
      schemas.push({ '@context': 'https://schema.org', '@type': 'Course', name: c.name, description: c.desc, url, provider: { '@id': SITE_URL + '/#organization' }, inLanguage: 'ru-RU', courseMode: 'online', isAccessibleForFree: false });
    }
  } else {
    schemas.push({ '@context': 'https://schema.org', '@type': 'WebPage', '@id': url, url, name: page.title, description: page.description, isPartOf: { '@id': SITE_URL + '/#website' }, dateModified: BUILD_DATE, inLanguage: 'ru-RU' });
  }

  // FAQPage schema
  const faqItems = pageFaqs[page.route];
  if (faqItems) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqItems.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    });
  }

  return schemas.map((s) => '<script type="application/ld+json">' + JSON.stringify(s) + '</script>').join('\n    ');
}

// ═══════════════════════════════════════════════════════
// Noscript-контент для AI-ботов
// ═══════════════════════════════════════════════════════
function buildNoscript(page) {
  const nav = '<nav><a href="/">Главная</a> · <a href="/research">Исследования</a> · <a href="/checklists">Чек-листы</a> · <a href="/conference">Конференция</a> · <a href="/platform">Платформа</a> · <a href="/book">Книга</a> · <a href="/academy">Академия</a></nav>';
  const footer = '<footer>\n<p>© ТехнологИИ права, 2026. Платформа об ИИ и цифровых технологиях в юриспруденции.</p>\n<p>Email: <a href="mailto:pravotechhub@mail.ru">pravotechhub@mail.ru</a> · Москва, Россия</p>\n<p>Telegram: <a href="https://t.me/kredit_advokat">@kredit_advokat</a> · Бот: <a href="https://t.me/NeuroPravo_Bot">@NeuroPravo_Bot</a></p>\n</footer>';
  let main = '';

  if (page.route === '/') {
    const researchLinks = reports.map((r) => '<li><a href="/research/' + r.slug + '">' + r.title + '</a> — ' + r.description + '</li>').join('');
    const checklistLinks = checklists.map((c) => '<li><a href="/checklists/' + c.slug + '">' + c.title + '</a> — ' + c.description + '</li>').join('');
    main = '<h1>ТехнологИИ права — исследования, аналитика, конференция</h1>\n<p>Платформа об искусственном интеллекте, цифровых технологиях и масштабировании юридического бизнеса в сфере банкротства физических лиц.</p>\n<h2>О проекте</h2>\n<p>ТехнологИИ права — экосистема для юристов, арбитражных управляющих и руководителей юридических компаний в сфере БФЛ. Мы объединяем исследования рынка, образовательные программы, отраслевую конференцию и цифровые инструменты.</p>\n<h2>Что мы делаем</h2>\n<ul>\n<li><strong>Исследования рынка</strong> — глубокая аналитика рынка БФЛ, трендов автоматизации и внедрения ИИ в юридическую практику</li>\n<li><strong>Академия</strong> — онлайн-курсы по банкротству физлиц: юридические аспекты, неосвобождение от обязательств, оспаривание сделок, эффективная команда, продажи юридических услуг</li>\n<li><strong>Конференция</strong> — 25–26 сентября 2026, Москва, Технополис «Инновация». 6 тематических потоков, 80+ спикеров, 1500+ участников</li>\n<li><strong>Платформа тренировок</strong> — тренажёр для команды юристов: диалоговые тренировки с AI, экзамены, аналитика прогресса</li>\n<li><strong>Книга «Банкротство физических лиц»</strong> — практическое руководство, 117 страниц, безоплатная</li>\n</ul>\n<h2>Арбитражное управление</h2>\n<p>Профессиональное арбитражное управление и сопровождение процедур банкротства физических лиц — от подготовки заявления до завершения дела и списания долгов.</p>\n<ol><li>Бесплатная консультация</li><li>Анализ ситуации и документов</li><li>Подача заявления в суд</li><li>Сопровождение процедуры</li><li>Списание долгов</li></ol>\n<h2>Исследования</h2><ul>' + researchLinks + '</ul>\n<h2>Чек-листы</h2><ul>' + checklistLinks + '</ul>\n<h2>Telegram-бот NeuroPravo</h2>\n<p><a href="https://t.me/NeuroPravo_Bot">@NeuroPravo_Bot</a> — бесплатная книга о банкротстве, чек-листы для юристов, аналитические исследования и курсы Академии — прямо в Telegram.</p>\n<h2>Контакты</h2>\n<p>Email: <a href="mailto:pravotechhub@mail.ru">pravotechhub@mail.ru</a></p>\n<p>Telegram-канал: <a href="https://t.me/kredit_advokat">@kredit_advokat</a> — разборы дел, изменения в законодательстве о банкротстве, чек-листы и кейсы</p>\n<p>Москва, Россия</p>';
  } else if (page.route === '/conference') {
    main = '<h1>Конференция ТехнологИИ Права 2026</h1>\n<p>Крупнейшая конференция и выставка о технологиях в юриспруденции: банкротство физических лиц, AI-инструменты и масштабирование юридической практики.</p>\n<h2>Дата и место</h2>\n<p>25–26 сентября 2026 года, Москва, Технополис «Инновация».</p>\n<h2>Что ждёт участников</h2>\n<ul><li>6 тематических потоков</li><li>80+ спикеров — эксперты индустрии</li><li>Выставка технологий для юристов</li><li>Нетворкинг и партнёрские сессии</li><li>1500+ участников</li></ul>\n<p><a href="/">← На главную</a></p>';
  } else if (page.route === '/platform') {
    main = '<h1>Платформа тренировок и тестов</h1>\n<p>' + page.description + '</p>\n<h2>Возможности</h2>\n<ul><li>Диалоговые тренировки с AI</li><li>Экзамены и тесты по банкротству</li><li>Аналитика прогресса команды</li><li>Библиотека скриптов и кейсов</li></ul>\n<p><a href="/">← На главную</a></p>';
  } else if (page.route === '/book') {
    main = '<h1>Банкротство физических лиц — практическое руководство</h1>\n<p>' + page.description + '</p>\n<h2>Содержание книги</h2>\n<ul><li>Правовые основы банкротства физических лиц</li><li>Подготовка к процедуре</li><li>Судебная процедура банкротства</li><li>Внесудебная процедура через МФЦ</li><li>Последствия банкротства</li></ul>\n<p>117 страниц, редакция май 2026. Скачать бесплатно через <a href="https://t.me/NeuroPravo_Bot?start=book">Telegram-бот</a>.</p>\n<p><a href="/">← На главную</a></p>';
  } else if (page.route === '/academy') {
    main = '<h1>Академия ТехнологИИ права</h1>\n<p>' + page.description + '</p>\n<h2>Курсы</h2>\n<ul>\n<li><strong>Юридические аспекты БФЛ</strong> — правовые основы банкротства физических лиц</li>\n<li><strong>Неосвобождение от обязательств</strong> — риски и практика</li>\n<li><strong>Оспаривание сделок</strong> — анализ сделок должника</li>\n<li><strong>Эффективная команда</strong> — управление юридической практикой</li>\n<li><strong>Продажи юридических услуг</strong> — маркетинг и продажи в сфере БФЛ</li>\n</ul>\n<p>Уровни обучения: Старт → Практика → Рост → Экспертный</p>\n<p><a href="/">← На главную</a></p>';
  } else if (page.route.startsWith('/research/')) {
    const slug = page.route.replace('/research/', '').replace(/\/$/, '');
    const summary = reportSummaries[slug];
    const summaryHtml = summary
      ? summary.split('\n\n').map((p) => '<p>' + p.replace(/\n/g, ' ') + '</p>').join('\n')
      : '';
    main = '<h1>' + page.title + '</h1>\n<p><em>' + page.description + '</em></p>\n' +
      (summaryHtml ? '<article>\n' + summaryHtml + '\n</article>\n' : '') +
      '<p>Автор: Дмитрий Мартынов, основатель платформы «ТехнологИИ права».</p>\n' +
      '<p><a href="/">← На главную</a> · <a href="/research">Все исследования</a></p>';
  } else if (page.route.startsWith('/checklists/')) {
    const slug = page.route.replace('/checklists/', '').replace(/\/$/, '');
    const summary = checklistSummaries[slug];
    const summaryHtml = summary
      ? summary.split('\n\n').map((p) => '<p>' + p.replace(/\n/g, ' ') + '</p>').join('\n')
      : '';
    main = '<h1>' + page.title + '</h1>\n<p><em>' + page.description + '</em></p>\n' +
      (summaryHtml ? '<article>\n' + summaryHtml + '\n</article>\n' : '') +
      '<p><a href="/">← На главную</a> · <a href="/checklists">Все чек-листы</a></p>';
  } else {
    main = '<h1>' + page.title + '</h1><p>' + page.description + '</p><p><a href="/">← На главную</a></p>';
  }

  // FAQ in noscript
  const faqItems = pageFaqs[page.route];
  if (faqItems) {
    main += '<h2>Частые вопросы</h2><dl>';
    for (const f of faqItems) {
      main += '<dt><strong>' + f.q + '</strong></dt><dd>' + f.a + '</dd>';
    }
    main += '</dl>';
  }

  return '<noscript><div style="max-width:800px;margin:0 auto;padding:2rem;font-family:system-ui,sans-serif;line-height:1.6">' + nav + '<main>' + main + '</main>' + footer + '</div></noscript>';
}

// ═══════════════════════════════════════════════════════
// Pages
// ═══════════════════════════════════════════════════════
const pages = [
  { route: '/', title: SITE_TITLE, description: SITE_DESC },
  { route: '/conference', title: 'Конференция ТехнологИИ Права — БФЛ, AI, масштабирование практики', description: 'Крупнейшая конференция и выставка о технологиях в юриспруденции: банкротство физлиц, AI-инструменты и масштабирование практики. 25–26 сентября 2026, Москва.' },
  { route: '/platform', title: 'Обучение и тренировки — ТехнологИИ права', description: 'Тренажёр для команды юристов по банкротству: диалоговые тренировки с AI, экзамены, слабые темы, кейсы, скрипты и аналитика прогресса для руководителя.' },
  { route: '/book', title: 'Банкротство физических лиц — практическое руководство', description: 'Книга-руководство для должника и специалиста: правовые основы, подготовка, судебная и внесудебная процедуры, последствия. 117 страниц, редакция май 2026.' },
  { route: '/academy', title: 'Академия ТехнологИИ права — курсы по банкротству', description: 'Онлайн-курсы для юристов по банкротству физлиц: юридические аспекты, неосвобождение, оспаривание сделок, управление командой, продажи. Уровни: Старт, Практика, Рост, Экспертный.' },
  { route: '/research', title: 'Исследования рынка БФЛ — аналитика и тренды', description: 'Аналитические исследования рынка банкротства физических лиц: сравнение игроков, влияние ИИ, цифровой путь клиента, экономика практики, автоматизация документов.' },
  { route: '/checklists', title: 'Чек-листы по банкротству физических лиц', description: 'Интерактивные чек-листы для юристов и должников: подготовка заявления, взаимодействие с АУ, внесудебное банкротство, анализ сделок, защита жилья, опись имущества.' },
  { route: '/articles', title: 'Статьи по банкротству физических лиц — экспертные материалы', description: 'Пошаговые инструкции, анализ последствий, выбор юриста, оспаривание сделок — экспертные статьи для должников и юристов по БФЛ.' },
  { route: '/products', title: 'Наши продукты — инструменты для юристов по банкротству', description: 'Курсы, исследования, чек-листы, тренажёры, боты — всё для роста юридической практики в сфере БФЛ.' },
  ...reports.map((r) => ({ route: '/research/' + r.slug, title: r.title + ' — Исследование БФЛ', description: r.description })),
  ...checklists.map((c) => ({ route: '/checklists/' + c.slug, title: c.title + ' — Чек-лист', description: c.description })),
];

const indexHtml = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8');

function buildHtml(base, page) {
  const url = SITE_URL + page.route;
  const ogType = getOgType(page.route);
  let html = base;

  // Title
  html = html.replace(/<title>[\s\S]*?<\/title>/, '<title>' + esc(page.title) + '</title>');

  // Replace existing meta tags
  const setMeta = (attr, key, val) => {
    const re = new RegExp('(<meta\\s+' + attr + '="' + key + '"\\s+content=")[^"]*(")', 'i');
    if (re.test(html)) html = html.replace(re, '$1' + esc(val) + '$2');
  };
  setMeta('name', 'description', page.description);
  setMeta('property', 'og:title', page.title);
  setMeta('property', 'og:description', page.description);
  setMeta('property', 'og:image', OG_IMAGE);
  setMeta('property', 'og:type', ogType);
  setMeta('name', 'twitter:title', page.title);
  setMeta('name', 'twitter:description', page.description);
  setMeta('name', 'twitter:image', OG_IMAGE);

  // Inject new meta tags + canonical + schema before </head>
  const headInject = [
    '    <link rel="canonical" href="' + esc(url) + '" />',
    '    <meta property="og:url" content="' + esc(url) + '" />',
    '    <meta property="og:locale" content="ru_RU" />',
    '    <meta property="og:site_name" content="' + esc(ORG_NAME) + '" />',
    '    <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large" />',
    '    ' + buildSchemaJsonLd(page),
    '  </head>',
  ].join('\n');
  html = html.replace('</head>', headInject);

  // Noscript before </body>
  const noscript = buildNoscript(page);
  html = html.replace('</body>', '    ' + noscript + '\n  </body>');

  return html;
}

let written = 0;
for (const p of pages) {
  const html = buildHtml(indexHtml, p);
  const outPath = p.route === '/' ? path.join(DIST, 'index.html') : path.join(DIST, p.route, 'index.html');
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, html);
  written++;
}

// --- sitemap.xml ---
const sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  pages.map((p) => {
    const pri = p.route === '/' ? '1.0' : p.route.split('/').filter(Boolean).length > 1 ? '0.7' : '0.8';
    return '  <url>\n    <loc>' + SITE_URL + (p.route === '/' ? '/' : p.route + '/') + '</loc>\n    <lastmod>' + BUILD_DATE + '</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>' + pri + '</priority>\n  </url>';
  }).join('\n') + '\n</urlset>\n';
fs.writeFileSync(path.join(DIST, 'sitemap.xml'), sitemap);

// --- robots.txt ---
const robots = 'User-agent: *\nAllow: /\nDisallow: /admin\n\n# AI Search Bots\nUser-agent: OAI-SearchBot\nAllow: /\n\nUser-agent: ChatGPT-User\nAllow: /\n\nUser-agent: PerplexityBot\nAllow: /\n\nUser-agent: ClaudeBot\nAllow: /\n\nUser-agent: Applebot-Extended\nAllow: /\n\nUser-agent: GoogleOther\nAllow: /\n\nUser-agent: YandexBot\nAllow: /\n\n# AI Training Bots -- disallow\nUser-agent: GPTBot\nDisallow: /\n\nUser-agent: Google-Extended\nDisallow: /\n\nUser-agent: CCBot\nDisallow: /\n\nUser-agent: anthropic-ai\nDisallow: /\n\nSitemap: ' + SITE_URL + '/sitemap.xml\n';
fs.writeFileSync(path.join(DIST, 'robots.txt'), robots);

console.log('prerender v6: ' + written + ' pages, schema+noscript+sitemap+robots → ' + DIST);
if (SITE_URL.includes('example.com')) console.log('⚠ SITE_URL = placeholder!');
