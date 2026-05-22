import { Bot } from 'grammy';
import { registerStartCommand } from './commands/start.js';
import { registerBookCommand } from './commands/book.js';
import { registerChecklistsCommand } from './commands/checklists.js';
import { registerResearchCommand } from './commands/research.js';
import { registerCoursesCommand } from './commands/courses.js';
import { registerHelpCommand } from './commands/help.js';
import { registerAboutCommand } from './commands/about.js';
import { registerMyCommand } from './commands/my.js';
import { registerFeedbackCommand, isAwaitingFeedback, handleFeedbackText } from './commands/feedback.js';
import { mainMenuKeyboard } from './keyboards.js';

let bot: Bot | null = null;

/**
 * Initialize and return the grammY Bot instance.
 * If TELEGRAM_BOT_TOKEN is not set, logs a warning and returns null (graceful degradation).
 */
export function createBot(): Bot | null {
  const token = process.env.TELEGRAM_BOT_TOKEN;

  if (!token) {
    console.warn('\u{1F916} TELEGRAM_BOT_TOKEN not set — Telegram bot disabled');
    return null;
  }

  bot = new Bot(token);

  // Register all command handlers
  registerStartCommand(bot);
  registerBookCommand(bot);
  registerChecklistsCommand(bot);
  registerResearchCommand(bot);
  registerCoursesCommand(bot);
  registerMyCommand(bot);
  registerFeedbackCommand(bot);
  registerAboutCommand(bot);
  registerHelpCommand(bot);

  // Register commands with Telegram (shows in the menu button)
  bot.api.setMyCommands([
    { command: 'start', description: 'Главное меню' },
    { command: 'book', description: '📕 Бесплатная книга о банкротстве' },
    { command: 'checklists', description: '📋 Чек-листы' },
    { command: 'research', description: '📊 Исследования' },
    { command: 'courses', description: '🎓 Курсы' },
    { command: 'my', description: '📁 Мои материалы' },
    { command: 'feedback', description: '💬 Обратная связь' },
    { command: 'about', description: 'ℹ️ О платформе' },
    { command: 'help', description: '❓ Справка' },
  ]).catch((err) => {
    console.error('\u{1F916} Failed to set bot commands:', err);
  });

  // Handle "back to main menu" callback
  bot.callbackQuery('menu:main', async (ctx) => {
    await ctx.answerCallbackQuery();
    await ctx.reply(
      '🏛 <b>Главное меню</b>\n\n' +
      'Выберите интересующий раздел 👇',
      { parse_mode: 'HTML', reply_markup: mainMenuKeyboard() }
    );
  });

  // Fallback for unknown callback queries — answer silently to avoid "loading" spinners
  bot.on('callback_query:data', async (ctx) => {
    await ctx.answerCallbackQuery({ text: 'Неизвестная команда' });
  });

  // Intercept text messages from users awaiting feedback BEFORE the generic fallback
  bot.on('message:text', async (ctx, next) => {
    const telegramId = ctx.from?.id;
    if (telegramId && isAwaitingFeedback(telegramId)) {
      const handled = await handleFeedbackText(ctx);
      if (handled) return;
    }
    await next();
  });

  // Fallback for unknown text messages — friendly redirect to menu
  bot.on('message:text', async (ctx) => {
    await ctx.reply(
      '🤔 <b>Не совсем понял вас</b>\n\n' +
      'Я работаю через кнопки и команды.\n' +
      'Нажмите на кнопку ниже или отправьте /start, ' +
      'чтобы открыть главное меню.',
      { parse_mode: 'HTML', reply_markup: mainMenuKeyboard() }
    );
  });

  // Fallback for any other message types (photos, stickers, etc.)
  bot.on('message', async (ctx) => {
    await ctx.reply(
      '💡 Я понимаю только текстовые команды и кнопки.\n' +
      'Нажмите /start для главного меню.',
      { parse_mode: 'HTML', reply_markup: mainMenuKeyboard() }
    );
  });

  // Global error handler
  bot.catch((err) => {
    console.error('\u{1F916} Bot error:', err.message || err);
  });

  return bot;
}

/**
 * Start bot in long polling mode (for development).
 */
export async function startPolling(): Promise<void> {
  if (!bot) {
    console.warn('\u{1F916} Cannot start polling — bot not initialized');
    return;
  }

  try {
    // Delete any existing webhook so polling works
    await bot.api.deleteWebhook();
    console.log('\u{1F916} Telegram bot starting in long polling mode...');
    bot.start({
      onStart: () => {
        console.log('\u{1F916} Telegram bot is running (long polling)');
      },
    });
  } catch (err) {
    console.error('\u{1F916} Failed to start bot polling:', (err as Error).message);
  }
}

/**
 * Stop the bot gracefully.
 */
export async function stopBot(): Promise<void> {
  if (bot) {
    await bot.stop();
    console.log('\u{1F916} Telegram bot stopped');
  }
}

/**
 * Get the bot instance (for webhook handler).
 */
export function getBot(): Bot | null {
  return bot;
}
