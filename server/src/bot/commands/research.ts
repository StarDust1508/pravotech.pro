import { type Bot, type Context, InlineKeyboard, InputFile } from 'grammy';
import { query } from '../../db.js';
import { mainMenuKeyboard, afterResearchKeyboard } from '../keyboards.js';
import { escapeHtml } from '../utils.js';
import { trackReceivedMaterial } from './my.js';

export function registerResearchCommand(bot: Bot): void {
  bot.command('research', async (ctx) => {
    await ctx.replyWithChatAction('typing');
    await showResearchList(ctx);
  });

  bot.callbackQuery('menu:research', async (ctx) => {
    await ctx.answerCallbackQuery();
    await ctx.replyWithChatAction('typing');
    await showResearchList(ctx);
  });

  bot.callbackQuery(/^research:(.+)$/, async (ctx) => {
    await ctx.answerCallbackQuery();
    await ctx.replyWithChatAction('upload_document');
    const slug = ctx.match[1];
    await sendResearch(ctx, slug);
  });
}

async function showResearchList(ctx: { reply: Function }): Promise<void> {
  try {
    const result = await query(
      'SELECT slug, title FROM research_reports WHERE is_published = true ORDER BY display_order, created_at'
    );

    if (result.rows.length === 0) {
      await ctx.reply(
        '📊 <b>Исследования</b>\n\n' +
        'Аналитические исследования сейчас готовятся к публикации.\n' +
        'Следите за обновлениями — мы сообщим, когда они появятся!',
        { parse_mode: 'HTML' as const, reply_markup: mainMenuKeyboard() }
      );
      return;
    }

    const keyboard = new InlineKeyboard();
    for (const row of result.rows) {
      keyboard.text(`📊 ${row.title}`, `research:${row.slug}`).row();
    }
    keyboard.text('⬅️ Главное меню', 'menu:main');

    await ctx.reply(
      '📊 <b>Аналитические исследования</b>\n\n' +
      'Актуальные исследования рынка банкротства физических лиц ' +
      'от экспертов платформы.\n\n' +
      'Выберите исследование 👇',
      { parse_mode: 'HTML' as const, reply_markup: keyboard }
    );
  } catch (err) {
    console.error('Show research error:', err);
    await ctx.reply(
      '❌ <b>Ошибка загрузки</b>\n\n' +
      'Не удалось загрузить список исследований.\n' +
      'Попробуйте позже или нажмите /start.',
      { parse_mode: 'HTML' as const, reply_markup: mainMenuKeyboard() }
    );
  }
}

async function sendResearch(ctx: Context, slug: string): Promise<void> {
  try {
    const result = await query(
      'SELECT title, pdf_url, pdf_media_id FROM research_reports WHERE slug = $1 AND is_published = true LIMIT 1',
      [slug]
    );

    if (result.rows.length === 0) {
      await ctx.reply(
        '📊 <b>Исследование не найдено</b>\n\n' +
        'Это исследование не найдено или снято с публикации.\n' +
        'Выберите другое из списка.',
        { parse_mode: 'HTML' as const, reply_markup: mainMenuKeyboard() }
      );
      return;
    }

    const { title, pdf_url, pdf_media_id } = result.rows[0];
    const safeTitle = escapeHtml(title);

    // Try pdf_media_id first (direct media reference), then pdf_url
    const mediaId = pdf_media_id || (pdf_url?.startsWith('/api/media/') ? pdf_url.replace('/api/media/', '') : null);

    if (mediaId) {
      const mediaResult = await query(
        'SELECT data, filename, mime_type FROM media WHERE id = $1 LIMIT 1',
        [mediaId]
      );
      if (mediaResult.rows.length === 0) {
        await ctx.reply(
          '❌ <b>Файл не найден</b>\n\nФайл исследования не найден в хранилище.',
          { parse_mode: 'HTML' as const, reply_markup: mainMenuKeyboard() }
        );
        return;
      }
      const media = mediaResult.rows[0];
      const buffer = Buffer.isBuffer(media.data) ? media.data : Buffer.from(media.data);
      await ctx.replyWithDocument(
        new InputFile(buffer, media.filename || `${slug}.pdf`),
        {
          caption:
            `📊 <b>${safeTitle}</b>\n\n` +
            '✅ Исследование отправлено!\n' +
            'Аналитический отчёт от платформы «Технологии Права».\n\n' +
            '<i>Рекомендуем также:</i>',
          parse_mode: 'HTML' as const,
          reply_markup: afterResearchKeyboard(),
        }
      );
      if (ctx.from?.id) {
        await trackReceivedMaterial(ctx.from.id, `research:${slug}`);
      }
    } else if (pdf_url) {
      await ctx.reply(
        `📊 <b>${safeTitle}</b>\n\n` +
        `📎 <a href="${pdf_url}">Скачать PDF</a>\n\n` +
        '<i>Рекомендуем также:</i>',
        { parse_mode: 'HTML' as const, reply_markup: afterResearchKeyboard() }
      );
      if (ctx.from?.id) {
        await trackReceivedMaterial(ctx.from.id, `research:${slug}`);
      }
    } else {
      await ctx.reply(
        `📊 <b>${safeTitle}</b>\n\n` +
        'PDF-файл для этого исследования пока готовится.\n' +
        'Попробуйте позже.',
        { parse_mode: 'HTML' as const, reply_markup: mainMenuKeyboard() }
      );
    }
  } catch (err) {
    console.error('Send research error:', err);
    await ctx.reply(
      '❌ <b>Ошибка отправки</b>\n\n' +
      'Не удалось отправить исследование. Попробуйте позже или нажмите /start.',
      { parse_mode: 'HTML' as const, reply_markup: mainMenuKeyboard() }
    );
  }
}
