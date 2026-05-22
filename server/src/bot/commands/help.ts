import { type Bot } from 'grammy';
import { mainMenuKeyboard } from '../keyboards.js';

export function registerHelpCommand(bot: Bot): void {
  bot.command('help', async (ctx) => {
    await ctx.replyWithChatAction('typing');
    await showHelp(ctx);
  });

  bot.callbackQuery('menu:help', async (ctx) => {
    await ctx.answerCallbackQuery();
    await ctx.replyWithChatAction('typing');
    await showHelp(ctx);
  });
}

async function showHelp(ctx: { reply: Function }): Promise<void> {
  await ctx.reply(
    '❓ <b>Справка по боту</b>\n\n' +
    'Я — бот платформы «Технологии Права». ' +
    'Вот что я умею:\n\n' +
    '<b>Команды:</b>\n' +
    '/start — Главное меню\n' +
    '/book — Получить книгу по банкротству\n' +
    '/checklists — Практические чек-листы\n' +
    '/research — Аналитические исследования\n' +
    '/courses — Курсы Академии\n' +
    '/my — Мои полученные материалы\n' +
    '/feedback — Обратная связь\n' +
    '/about — О платформе\n' +
    '/help — Эта справка\n\n' +
    '💡 <b>Совет:</b> вы также можете использовать ' +
    'кнопки меню ниже — это удобнее!\n\n' +
    'Если что-то не работает, напишите /start ' +
    'для перезапуска бота.',
    { parse_mode: 'HTML' as const, reply_markup: mainMenuKeyboard() }
  );
}
