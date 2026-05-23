import { type Bot, type Context, InlineKeyboard, InputFile } from 'grammy';
import { query } from '../../db.js';
import { mainMenuKeyboard, afterChecklistKeyboard } from '../keyboards.js';
import { escapeHtml } from '../utils.js';
import { trackReceivedMaterial } from './my.js';

interface ChecklistItem {
  text: string;
  group?: string;
}

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
    await ctx.replyWithChatAction('typing');
    const slug = ctx.match[1];
    await sendChecklist(ctx, slug);
  });
}

async function showChecklistsList(ctx: { reply: Function }): Promise<void> {
  try {
    const result = await query(
      `SELECT slug, title, description
       FROM checklists WHERE is_published = true
       ORDER BY display_order, created_at`
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
      `Доступно <b>${result.rows.length}</b> чек-листов для юристов ` +
      'и специалистов по банкротству.\n\n' +
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

/**
 * Render checklist items as a formatted Telegram message grouped by category.
 */
function renderChecklistItems(items: ChecklistItem[]): string {
  const grouped = new Map<string, string[]>();
  for (const item of items) {
    const group = item.group || 'Общее';
    if (!grouped.has(group)) {
      grouped.set(group, []);
    }
    grouped.get(group)!.push(item.text);
  }

  const lines: string[] = [];
  for (const [group, texts] of grouped) {
    lines.push(`\n<b>${escapeHtml(group)}:</b>`);
    for (const text of texts) {
      lines.push(`  ☐ ${escapeHtml(text)}`);
    }
  }
  return lines.join('\n');
}

async function sendChecklist(ctx: Context, slug: string): Promise<void> {
  try {
    const result = await query(
      'SELECT title, description, intro, items, pdf_url FROM checklists WHERE slug = $1 AND is_published = true LIMIT 1',
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

    const { title, description, intro, items, pdf_url } = result.rows[0];
    const safeTitle = escapeHtml(title);

    // If there's a PDF — send the file
    if (pdf_url) {
      if (pdf_url.startsWith('/api/media/')) {
        const mediaId = pdf_url.replace('/api/media/', '');
        const mediaResult = await query(
          'SELECT data, filename, mime_type FROM media WHERE id = $1 LIMIT 1',
          [mediaId]
        );
        if (mediaResult.rows.length > 0) {
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
          return;
        }
      } else {
        await ctx.reply(
          `📋 <b>${safeTitle}</b>\n\n` +
          `📎 <a href="${pdf_url}">Скачать PDF</a>\n\n` +
          '<i>Рекомендуем также:</i>',
          { parse_mode: 'HTML' as const, reply_markup: afterChecklistKeyboard() }
        );
        if (ctx.from?.id) {
          await trackReceivedMaterial(ctx.from.id, `checklist:${slug}`);
        }
        return;
      }
    }

    // No PDF — render items as text message
    const checklistItems: ChecklistItem[] = Array.isArray(items) ? items : [];

    if (checklistItems.length === 0) {
      await ctx.reply(
        `📋 <b>${safeTitle}</b>\n\n` +
        (description ? `${escapeHtml(description)}\n\n` : '') +
        'Содержимое чек-листа готовится. Попробуйте позже.',
        { parse_mode: 'HTML' as const, reply_markup: mainMenuKeyboard() }
      );
      return;
    }

    // Build message with intro + grouped items
    const introText = intro ? `<i>${escapeHtml(intro)}</i>\n` : '';
    const itemsText = renderChecklistItems(checklistItems);

    const message =
      `📋 <b>${safeTitle}</b>\n\n` +
      introText +
      itemsText +
      `\n\n📊 Всего пунктов: <b>${checklistItems.length}</b>\n\n` +
      '✅ Сохраните это сообщение — используйте как план действий!';

    // Telegram message limit is 4096 chars — split if needed
    if (message.length <= 4096) {
      await ctx.reply(message, {
        parse_mode: 'HTML' as const,
        reply_markup: afterChecklistKeyboard(),
      });
    } else {
      // Send intro first, then items
      await ctx.reply(
        `📋 <b>${safeTitle}</b>\n\n` + introText,
        { parse_mode: 'HTML' as const }
      );
      await ctx.reply(
        itemsText + `\n\n📊 Всего пунктов: <b>${checklistItems.length}</b>`,
        { parse_mode: 'HTML' as const, reply_markup: afterChecklistKeyboard() }
      );
    }

    if (ctx.from?.id) {
      await trackReceivedMaterial(ctx.from.id, `checklist:${slug}`);
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
