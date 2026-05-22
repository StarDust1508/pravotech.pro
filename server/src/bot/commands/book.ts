import { type Bot, type Context, InputFile } from 'grammy';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { mainMenuKeyboard, afterBookKeyboard } from '../keyboards.js';
import { trackReceivedMaterial } from './my.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const BOOK_PATH = path.resolve(__dirname, '../../../../public/book/bankrotstvo-fizlic.pdf');

export function registerBookCommand(bot: Bot): void {
  bot.command('book', async (ctx) => {
    await ctx.replyWithChatAction('upload_document');
    await sendBook(ctx);
  });

  bot.callbackQuery('menu:book', async (ctx) => {
    await ctx.answerCallbackQuery();
    await ctx.replyWithChatAction('upload_document');
    await sendBook(ctx);
  });
}

async function sendBook(ctx: Context): Promise<void> {
  if (!fs.existsSync(BOOK_PATH)) {
    await ctx.reply(
      '😔 <b>Файл временно недоступен</b>\n\n' +
      'К сожалению, книга сейчас недоступна для скачивания.\n' +
      'Попробуйте позже или выберите другой раздел.',
      { parse_mode: 'HTML', reply_markup: mainMenuKeyboard() }
    );
    return;
  }

  try {
    await ctx.replyWithDocument(
      new InputFile(BOOK_PATH, 'Банкротство физических лиц.pdf'),
      {
        caption:
          '📚 <b>Книга «Банкротство физических лиц»</b>\n\n' +
          'Практическое руководство по банкротству граждан — от первых ' +
          'признаков неплатёжеспособности до завершения дела и списания долгов.\n\n' +
          '✅ Книга отправлена! Приятного чтения 🙏\n\n' +
          '<i>Вам также может быть полезно:</i>',
        parse_mode: 'HTML',
        reply_markup: afterBookKeyboard(),
      }
    );
    if (ctx.from?.id) {
      await trackReceivedMaterial(ctx.from.id, 'book');
    }
  } catch (err) {
    console.error('Send book error:', err);
    await ctx.reply(
      '❌ <b>Ошибка отправки</b>\n\n' +
      'Не удалось отправить книгу. Пожалуйста, попробуйте ещё раз позже.',
      { parse_mode: 'HTML', reply_markup: mainMenuKeyboard() }
    );
  }
}
