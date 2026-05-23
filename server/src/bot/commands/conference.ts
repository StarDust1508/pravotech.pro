import { type Bot } from 'grammy';
import { InlineKeyboard } from 'grammy';
import { SITE_URL } from '../keyboards.js';

export function registerConferenceCommand(bot: Bot): void {
  bot.command('conference', async (ctx) => {
    await ctx.replyWithChatAction('typing');
    await showConference(ctx);
  });

  bot.callbackQuery('menu:conference', async (ctx) => {
    await ctx.answerCallbackQuery();
    await ctx.replyWithChatAction('typing');
    await showConference(ctx);
  });
}

async function showConference(ctx: { reply: Function }): Promise<void> {
  const keyboard = new InlineKeyboard()
    .url('🎟 Зарегистрироваться', `${SITE_URL}/conference#ticket`)
    .row()
    .url('🎤 Стать спикером', `${SITE_URL}/conference#speaker`)
    .row()
    .url('🤝 Стать спонсором', `${SITE_URL}/conference#sponsor`)
    .row()
    .url('🌐 Подробнее на сайте', `${SITE_URL}/conference`)
    .row()
    .text('⬅️ Главное меню', 'menu:main');

  await ctx.reply(
    '🏛 <b>Конференция «ТехнологИИ права» 2026</b>\n\n' +
    '📅 <b>Осень 2026</b> · Москва\n\n' +
    'Крупнейшее мероприятие по Legal Tech и банкротству физических лиц в России.\n\n' +
    '<b>Что ожидает участников:</b>\n' +
    '🎤 60+ спикеров — практики, регуляторы, разработчики\n' +
    '👥 1 200+ участников из всех регионов\n' +
    '📡 3 тематических потока\n' +
    '⏱ 2 дня насыщенной программы\n\n' +
    '<b>Потоки:</b>\n' +
    '🧠 AI & Legal Tech — промышленные внедрения ИИ\n' +
    '⚖️ Практика БФЛ — законодательные изменения и кейсы\n' +
    '🤝 Нетворкинг & Бизнес — партнёрские сессии\n\n' +
    '<b>Ключевые моменты:</b>\n' +
    '• Дискуссия с представителями ФНС\n' +
    '• Демо промышленных ИИ-ассистентов\n' +
    '• Награждение лучших БФЛ-практик года\n' +
    '• AI-хакатон: Legal Tech решения за 4 часа\n\n' +
    'Регистрация уже открыта! 👇',
    { parse_mode: 'HTML' as const, reply_markup: keyboard }
  );
}
