import { type Bot, InlineKeyboard } from 'grammy';
import { query } from '../../db.js';
import { mainMenuKeyboard, SITE_URL } from '../keyboards.js';
import { escapeHtml } from '../utils.js';

/**
 * Format price for display.
 */
function formatPrice(price: string | number | null): string {
  if (!price) return 'Безоплатно';
  const num = typeof price === 'string' ? parseFloat(price) : price;
  if (isNaN(num) || num === 0) return 'Безоплатно';
  return `${num.toLocaleString('ru-RU')} руб.`;
}

export function registerCoursesCommand(bot: Bot): void {
  bot.command('courses', async (ctx) => {
    await ctx.replyWithChatAction('typing');
    await showCoursesList(ctx);
  });

  bot.callbackQuery('menu:courses', async (ctx) => {
    await ctx.answerCallbackQuery();
    await ctx.replyWithChatAction('typing');
    await showCoursesList(ctx);
  });

  bot.callbackQuery(/^course:(.+)$/, async (ctx) => {
    await ctx.answerCallbackQuery();
    await ctx.replyWithChatAction('typing');
    const slug = ctx.match[1];
    await showCourseDetail(ctx, slug);
  });
}

async function showCoursesList(ctx: { reply: Function }): Promise<void> {
  try {
    const result = await query(
      `SELECT slug, title, description, price, level, duration
       FROM courses WHERE is_published = true
       ORDER BY display_order, created_at`
    );

    if (result.rows.length === 0) {
      await ctx.reply(
        '🎓 <b>Академия «Технологии Права»</b>\n\n' +
        'Курсы сейчас готовятся к публикации.\n' +
        'Следите за обновлениями — мы сообщим о старте!',
        { parse_mode: 'HTML' as const, reply_markup: mainMenuKeyboard() }
      );
      return;
    }

    const keyboard = new InlineKeyboard();
    for (const course of result.rows) {
      keyboard.text(`🎓 ${course.title}`, `course:${course.slug}`).row();
    }
    keyboard.text('⬅️ Главное меню', 'menu:main');

    await ctx.reply(
      '🎓 <b>Академия «Технологии Права»</b>\n\n' +
      'Профессиональные курсы для юристов и специалистов ' +
      'в области банкротства физических лиц.\n\n' +
      'Выберите курс для подробностей 👇',
      { parse_mode: 'HTML' as const, reply_markup: keyboard }
    );
  } catch (err) {
    console.error('Show courses error:', err);
    await ctx.reply(
      '❌ <b>Ошибка загрузки</b>\n\n' +
      'Не удалось загрузить список курсов.\n' +
      'Попробуйте позже или нажмите /start.',
      { parse_mode: 'HTML' as const, reply_markup: mainMenuKeyboard() }
    );
  }
}

async function showCourseDetail(ctx: { reply: Function }, slug: string): Promise<void> {
  try {
    const result = await query(
      `SELECT title, description, price, level, duration, lectures_count, practice_hours, certificate
       FROM courses WHERE slug = $1 AND is_published = true LIMIT 1`,
      [slug]
    );

    if (result.rows.length === 0) {
      await ctx.reply(
        '🎓 <b>Курс не найден</b>\n\n' +
        'Этот курс не найден или снят с публикации.\n' +
        'Выберите другой из списка.',
        { parse_mode: 'HTML' as const, reply_markup: mainMenuKeyboard() }
      );
      return;
    }

    const c = result.rows[0];
    const safeTitle = escapeHtml(c.title);
    const safeDescription = c.description ? escapeHtml(c.description) : '';

    const details: string[] = [];
    if (c.level) details.push(`📌 <b>Уровень:</b> ${escapeHtml(c.level)}`);
    if (c.duration) details.push(`⏱ <b>Длительность:</b> ${escapeHtml(c.duration)}`);
    if (c.lectures_count) details.push(`📖 <b>Лекций:</b> ${c.lectures_count}`);
    if (c.practice_hours) details.push(`🛠 <b>Практика:</b> ${c.practice_hours} ч.`);
    if (c.certificate) details.push('📜 <b>Сертификат:</b> Да');
    details.push(`\n💰 <b>${formatPrice(c.price)}</b>`);

    const courseUrl = `${SITE_URL}/courses/${slug}`;
    const buyUrl = `${SITE_URL}/courses/${slug}#buy`;

    const keyboard = new InlineKeyboard()
      .url('💳 Купить курс', buyUrl)
      .row()
      .url('🌐 Подробнее', courseUrl)
      .row()
      .text('⬅️ К курсам', 'menu:courses')
      .text('🏠 Меню', 'menu:main');

    await ctx.reply(
      `🎓 <b>${safeTitle}</b>\n\n` +
      (safeDescription ? `${safeDescription}\n\n` : '') +
      (details.length > 0 ? `${details.join('\n')}\n` : '') +
      '\n\n👇 Нажмите «Купить курс» для мгновенного доступа',
      { parse_mode: 'HTML' as const, reply_markup: keyboard }
    );
  } catch (err) {
    console.error('Show course detail error:', err);
    await ctx.reply(
      '❌ <b>Ошибка загрузки</b>\n\n' +
      'Не удалось загрузить информацию о курсе.\n' +
      'Попробуйте позже или нажмите /start.',
      { parse_mode: 'HTML' as const, reply_markup: mainMenuKeyboard() }
    );
  }
}
