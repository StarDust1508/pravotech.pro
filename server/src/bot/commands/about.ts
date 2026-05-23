import { type Bot } from 'grammy';
import { mainMenuKeyboard, SITE_URL } from '../keyboards.js';

export function registerAboutCommand(bot: Bot): void {
  bot.command('about', async (ctx) => {
    await ctx.replyWithChatAction('typing');
    await showAbout(ctx);
  });

  bot.callbackQuery('menu:about', async (ctx) => {
    await ctx.answerCallbackQuery();
    await ctx.replyWithChatAction('typing');
    await showAbout(ctx);
  });
}

async function showAbout(ctx: { reply: Function }): Promise<void> {
  await ctx.reply(
    '🏛 <b>О платформе «Технологии Права»</b>\n\n' +
    'Мы — экспертная платформа в области банкротства ' +
    'физических лиц. Наша миссия — сделать процедуру банкротства ' +
    'понятной, доступной и эффективной.\n\n' +
    '<b>Что мы предлагаем:</b>\n' +
    '📚 Безоплатные образовательные материалы\n' +
    '📋 Практические чек-листы для работы\n' +
    '📊 Аналитические исследования рынка\n' +
    '🎓 Профессиональные курсы для юристов\n' +
    '🤝 Ежегодную конференцию по БФЛ\n\n' +
    `🌐 <b>Сайт:</b> <a href="${SITE_URL}">${SITE_URL}</a>\n` +
    '📩 <b>Контакт:</b> pravotechhub@mail.ru\n\n' +
    'Присоединяйтесь к сообществу профессионалов!',
    { parse_mode: 'HTML' as const, reply_markup: mainMenuKeyboard() }
  );
}
