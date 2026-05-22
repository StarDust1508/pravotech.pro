import { type Bot, type Context } from 'grammy';
import { query } from '../../db.js';
import { mainMenuKeyboard } from '../keyboards.js';

/**
 * In-memory set of telegram_ids currently awaiting feedback text.
 * Simple approach — survives within one process lifetime.
 */
const awaitingFeedback = new Set<number>();

/**
 * Check if a user is currently in feedback mode.
 */
export function isAwaitingFeedback(telegramId: number): boolean {
  return awaitingFeedback.has(telegramId);
}

/**
 * Handle incoming text from a user in feedback mode.
 * Returns true if the message was consumed (user was in feedback mode).
 */
export async function handleFeedbackText(ctx: Context): Promise<boolean> {
  const telegramId = ctx.from?.id;
  if (!telegramId || !awaitingFeedback.has(telegramId)) {
    return false;
  }

  const text = ctx.message?.text?.trim();
  if (!text) {
    return false;
  }

  // Remove from waiting set
  awaitingFeedback.delete(telegramId);

  try {
    await query(
      `INSERT INTO telegram_feedback (telegram_id, username, message)
       VALUES ($1, $2, $3)`,
      [telegramId, ctx.from?.username || null, text]
    );

    await ctx.reply(
      '🙏 <b>Спасибо за обратную связь!</b>\n\n' +
      'Мы обязательно учтём ваше мнение. ' +
      'Ваш отзыв помогает нам становиться лучше!',
      { parse_mode: 'HTML', reply_markup: mainMenuKeyboard() }
    );
  } catch (err) {
    console.error('Save feedback error:', err);
    await ctx.reply(
      '❌ <b>Ошибка сохранения</b>\n\n' +
      'Не удалось сохранить вашу обратную связь. Пожалуйста, попробуйте позже.',
      { parse_mode: 'HTML', reply_markup: mainMenuKeyboard() }
    );
  }

  return true;
}

export function registerFeedbackCommand(bot: Bot): void {
  bot.command('feedback', async (ctx) => {
    await ctx.replyWithChatAction('typing');
    await promptFeedback(ctx);
  });

  bot.callbackQuery('menu:feedback', async (ctx) => {
    await ctx.answerCallbackQuery();
    await ctx.replyWithChatAction('typing');
    await promptFeedback(ctx);
  });
}

async function promptFeedback(ctx: Context): Promise<void> {
  const telegramId = ctx.from?.id;
  if (!telegramId) {
    await ctx.reply(
      '❌ Не удалось определить вашего пользователя. Попробуйте /start.',
      { parse_mode: 'HTML', reply_markup: mainMenuKeyboard() }
    );
    return;
  }

  awaitingFeedback.add(telegramId);

  await ctx.reply(
    '💬 <b>Обратная связь</b>\n\n' +
    'Мы ценим ваше мнение! Напишите свой вопрос, ' +
    'предложение или замечание в следующем сообщении.\n\n' +
    '<i>Просто напишите текст и отправьте — я всё передам команде.</i>',
    { parse_mode: 'HTML' }
  );
}
