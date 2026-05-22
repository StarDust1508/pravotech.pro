import { type Bot, type Context, InlineKeyboard, InputFile } from 'grammy';
import { query } from '../../db.js';
import { mainMenuKeyboard, afterChecklistKeyboard } from '../keyboards.js';
import { escapeHtml } from '../utils.js';
import { trackReceivedMaterial } from './my.js';

export function registerChecklistsCommand(bot: Bot): void {
  bot.command('checklists', async (ctx) => {
    await ctx.replyWithChatAction('typing');
    await showChecklistsList(ctx);
  });

  bot.callbackQuery('menu:checklists', async (ctx) => {
    await ctx.answerCallbackQuery();
    await ctx.replyWithChatAction('typing');
    await showChecklistsList(ctx);
  });

  bot.callbackQuery(/^checklist:(.+)$/, async (ctx) => {
    await ctx.answerCallbackQuery();
    await ctx.replyWithChatAction('upload_document');
    const slug = ctx.match[1];
    await sendChecklist(ctx, slug);
  });
}

async function showChecklistsList(ctx: { reply: Function }): Promise<void> {
  try {
    const result = await query(
      'SELECT slug, title FROM checklists WHERE is_published = true ORDER BY display_order, created_at'
    );

    if (result.rows.length === 0) {
      await ctx.reply(
        '📋 <b>Чек-листы</b>\n\n' +
        'Чек-листы сейчас готовятся к публикации.\n' +
        'Следите за обновлениями — мы сообщим, когда они появятся!',
        { parse_mode: 'HTML' as const, reply_markup: mainMenuKeyboard() }
      );
      return;
    }

    const keyboard = new InlineKeyboard();
    for (const row of result.rows) {
      keyboard.text(`📋 ${row.title}`, `checklist:${row.slug}`).row();
    }
    keyboard.text('⬅️ Главное меню', 'menu:main');

    await ctx.reply(
      '📋 <b>Чек-листы для практики</b>\n\n' +
      'Готовые чек-листы помогут вам структурировать работу ' +
      'и не упустить важные детали.\n\n' +
      'Выберите нужный чек-лист 👇',
      { parse_mode: 'HTML' as const, reply_markup: keyboard }
    );
  } catch (err) {
    console.error('Show checklists error:', err);
    await ctx.reply(
      '❌ <b>Ошибка загрузки</b>\n\n' +
      'Не удалось загрузить список чек-листов.\n' +
      'Попробуйте позже или нажмите /start.',
      { parse_mode: 'HTML' as const, reply_markup: mainMenuKeyboard() }
    );
  }
}

async function sendChecklist(ctx: Context, slug: string): Promise<void> {
  try {
    const result = await query(
      'SELECT title, pdf_url FROM checklists WHERE slug = $1 AND is_published = true LIMIT 1',
      [slug]
    );

    if (result.rows.length === 0) {
      await ctx.reply(
        '📋 <b>Чек-лист не найден</b>\n\n' +
        'Этот чек-лист не найден или снят с публикации.\n' +
        'Выберите другой из списка.',
        { parse_mode: 'HTML' as const, reply_markup: mainMenuKeyboard() }
      );
      return;
    }

    const { title, pdf_url } = result.rows[0];
    const safeTitle = escapeHtml(title);

    if (!pdf_url) {
      await ctx.reply(
        `📋 <b>${safeTitle}</b>\n\n` +
        'PDF-файл для этого чек-листа пока готовится.\n' +
        'Попробуйте позже.',
        { parse_mode: 'HTML' as const, reply_markup: mainMenuKeyboard() }
      );
      return;
    }

    // pdf_url is /api/media/<id> for files stored in PostgreSQL
    if (pdf_url.startsWith('/api/media/')) {
      const mediaId = pdf_url.replace('/api/media/', '');
      const mediaResult = await query(
        'SELECT data, filename, mime_type FROM media WHERE id = $1 LIMIT 1',
        [mediaId]
      );
      if (mediaResult.rows.length === 0) {
        await ctx.reply(
          '❌ <b>Файл не найден</b>\n\nФайл чек-листа не найден в хранилище.',
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
            `📋 <b>${safeTitle}</b>\n\n` +
            '✅ Чек-лист отправлен!\n' +
            'Используйте его как структурированный план действий.\n\n' +
            '<i>Рекомендуем также:</i>',
          parse_mode: 'HTML' as const,
          reply_markup: afterChecklistKeyboard(),
        }
      );
      if (ctx.from?.id) {
        await trackReceivedMaterial(ctx.from.id, `checklist:${slug}`);
      }
    } else {
      // Treat as external URL — send as a link
      await ctx.reply(
        `📋 <b>${safeTitle}</b>\n\n` +
        `📎 <a href="${pdf_url}">Скачать PDF</a>\n\n` +
        '<i>Рекомендуем также:</i>',
        { parse_mode: 'HTML' as const, reply_markup: afterChecklistKeyboard() }
      );
      if (ctx.from?.id) {
        await trackReceivedMaterial(ctx.from.id, `checklist:${slug}`);
      }
    }
  } catch (err) {
    console.error('Send checklist error:', err);
    await ctx.reply(
      '❌ <b>Ошибка отправки</b>\n\n' +
      'Не удалось отправить чек-лист. Попробуйте позже или нажмите /start.',
      { parse_mode: 'HTML' as const, reply_markup: mainMenuKeyboard() }
    );
  }
}
