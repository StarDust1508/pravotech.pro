import { type Bot, InlineKeyboard } from 'grammy';
import { query } from '../../db.js';
import { mainMenuKeyboard } from '../keyboards.js';
import { escapeHtml } from '../utils.js';

export function registerMyCommand(bot: Bot): void {
  bot.command('my', async (ctx) => {
    await ctx.replyWithChatAction('typing');
    await showMyMaterials(ctx);
  });

  bot.callbackQuery('menu:my', async (ctx) => {
    await ctx.answerCallbackQuery();
    await ctx.replyWithChatAction('typing');
    await showMyMaterials(ctx);
  });
}

async function showMyMaterials(ctx: { from?: { id: number }; reply: Function }): Promise<void> {
  const telegramId = ctx.from?.id;
  if (!telegramId) {
    await ctx.reply(
      '❌ Не удалось определить вашего пользователя. Попробуйте /start.',
      { parse_mode: 'HTML' as const, reply_markup: mainMenuKeyboard() }
    );
    return;
  }

  try {
    // Load user's received materials
    const userResult = await query(
      'SELECT received_materials FROM telegram_users WHERE telegram_id = $1 LIMIT 1',
      [telegramId]
    );

    const received: string[] = userResult.rows.length > 0 && userResult.rows[0].received_materials
      ? userResult.rows[0].received_materials
      : [];

    // Load available checklists
    const checklistsResult = await query(
      'SELECT slug, title FROM checklists WHERE is_published = true ORDER BY display_order, created_at'
    );

    // Load available research reports
    const researchResult = await query(
      'SELECT slug, title FROM research_reports WHERE is_published = true ORDER BY display_order, created_at'
    );

    // Build the message
    const lines: string[] = [];
    lines.push('📁 <b>Мои материалы</b>\n');

    // Book status
    const bookReceived = received.includes('book');
    lines.push(`\n📕 <b>Книга о банкротстве</b>`);
    lines.push(bookReceived ? '  ✅ Получена' : '  ❌ Не получена — /book');

    // Checklists
    lines.push('\n📋 <b>Чек-листы</b>');
    if (checklistsResult.rows.length === 0) {
      lines.push('  <i>Чек-листы готовятся к публикации</i>');
    } else {
      for (const cl of checklistsResult.rows) {
        const isReceived = received.includes(`checklist:${cl.slug}`);
        const status = isReceived ? '✅' : '❌';
        lines.push(`  ${status} ${escapeHtml(cl.title)}`);
      }
    }

    // Research reports
    lines.push('\n📊 <b>Исследования</b>');
    if (researchResult.rows.length === 0) {
      lines.push('  <i>Исследования готовятся к публикации</i>');
    } else {
      for (const rr of researchResult.rows) {
        const isReceived = received.includes(`research:${rr.slug}`);
        const status = isReceived ? '✅' : '❌';
        lines.push(`  ${status} ${escapeHtml(rr.title)}`);
      }
    }

    // Count stats
    const totalAvailable = 1 + checklistsResult.rows.length + researchResult.rows.length;
    const totalReceived = received.length;
    lines.push(`\n📈 <b>Получено:</b> ${totalReceived} из ${totalAvailable} материалов`);

    // Build keyboard with shortcuts to missing items
    const keyboard = new InlineKeyboard();
    if (!bookReceived) {
      keyboard.text('📕 Получить книгу', 'menu:book').row();
    }
    if (checklistsResult.rows.length > 0 && !checklistsResult.rows.every(cl => received.includes(`checklist:${cl.slug}`))) {
      keyboard.text('📋 Чек-листы', 'menu:checklists').row();
    }
    if (researchResult.rows.length > 0 && !researchResult.rows.every(rr => received.includes(`research:${rr.slug}`))) {
      keyboard.text('📊 Исследования', 'menu:research').row();
    }
    keyboard.text('⬅️ Главное меню', 'menu:main');

    await ctx.reply(lines.join('\n'), {
      parse_mode: 'HTML' as const,
      reply_markup: keyboard,
    });
  } catch (err) {
    console.error('Show my materials error:', err);
    await ctx.reply(
      '❌ <b>Ошибка загрузки</b>\n\n' +
      'Не удалось загрузить ваши материалы.\n' +
      'Попробуйте позже или нажмите /start.',
      { parse_mode: 'HTML' as const, reply_markup: mainMenuKeyboard() }
    );
  }
}

/**
 * Record that a user has received a material.
 * Call this from other commands after successfully sending content.
 * @param telegramId - user's Telegram ID
 * @param materialKey - e.g. 'book', 'checklist:slug', 'research:slug'
 */
export async function trackReceivedMaterial(telegramId: number, materialKey: string): Promise<void> {
  try {
    await query(
      `UPDATE telegram_users
       SET received_materials = CASE
         WHEN received_materials IS NULL THEN $2::jsonb
         WHEN NOT (received_materials @> $2::jsonb) THEN received_materials || $2::jsonb
         ELSE received_materials
       END,
       updated_at = NOW()
       WHERE telegram_id = $1`,
      [telegramId, JSON.stringify([materialKey])]
    );
  } catch (err) {
    console.error('Failed to track received material:', err);
  }
}
