import { type Bot, type Context, InlineKeyboard, InputFile } from 'grammy';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { query } from '../../db.js';
import { mainMenuKeyboard, afterBookKeyboard, afterChecklistKeyboard } from '../keyboards.js';
import { escapeHtml } from '../utils.js';
import { trackReceivedMaterial } from './my.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const BOOK_PATH = path.resolve(__dirname, '../../../../public/book/bankrotstvo-fizlic.pdf');

/**
 * Save or update telegram user in the database.
 * Returns true if the user is NEW (just inserted), false if updated.
 */
async function upsertUser(ctx: Context): Promise<boolean> {
  const from = ctx.from;
  if (!from) return false;

  try {
    const result = await query(
      `INSERT INTO telegram_users (telegram_id, username, first_name, last_name)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (telegram_id) DO UPDATE SET
         username = EXCLUDED.username,
         first_name = EXCLUDED.first_name,
         last_name = EXCLUDED.last_name,
         is_active = true,
         updated_at = NOW()
       RETURNING (xmax = 0) AS is_new`,
      [from.id, from.username || null, from.first_name || null, from.last_name || null]
    );
    return result.rows.length > 0 && result.rows[0].is_new === true;
  } catch (err) {
    console.error('Failed to upsert telegram user:', err);
    return false;
  }
}

export function registerStartCommand(bot: Bot): void {
  bot.command('start', async (ctx) => {
    await ctx.replyWithChatAction('typing');

    const isNewUser = await upsertUser(ctx);
    const payload = ctx.match?.trim();

    // /start book  — send the book PDF directly
    if (payload === 'book') {
      await ctx.replyWithChatAction('upload_document');
      if (!fs.existsSync(BOOK_PATH)) {
        await ctx.reply(
          '😔 <b>Файл временно недоступен</b>\n\n' +
          'К сожалению, книга сейчас недоступна для скачивания. ' +
          'Пожалуйста, попробуйте позже или напишите /start для возврата в меню.',
          { parse_mode: 'HTML', reply_markup: mainMenuKeyboard() }
        );
        return;
      }
      try {
        await ctx.replyWithDocument(new InputFile(BOOK_PATH, 'Банкротство физических лиц.pdf'), {
          caption:
            '📚 <b>Книга «Банкротство физических лиц»</b>\n\n' +
            'Практическое руководство по банкротству граждан — от первых признаков ' +
            'неплатёжеспособности до завершения дела и списания долгов.\n\n' +
            '✅ Книга отправлена! Приятного чтения 🙏',
          parse_mode: 'HTML',
          reply_markup: afterBookKeyboard(),
        });
        if (ctx.from?.id) {
          await trackReceivedMaterial(ctx.from.id, 'book');
        }
      } catch (err) {
        console.error('Start book send error:', err);
        await ctx.reply(
          '❌ <b>Ошибка отправки</b>\n\nНе удалось отправить книгу. Попробуйте команду /book.',
          { parse_mode: 'HTML', reply_markup: mainMenuKeyboard() }
        );
      }
      return;
    }

    // /start book_LEADID  — deep link for book delivery from website
    if (payload && payload.startsWith('book_')) {
      const leadId = payload.replace('book_', '');
      await ctx.replyWithChatAction('upload_document');

      try {
        // Look up the lead
        const leadResult = await query(
          'SELECT id, name FROM research_leads WHERE id = $1 LIMIT 1',
          [leadId]
        );

        if (leadResult.rows.length === 0) {
          // Lead not found, but still send the book as a fallback
          if (fs.existsSync(BOOK_PATH)) {
            await ctx.replyWithDocument(new InputFile(BOOK_PATH, 'Банкротство физических лиц.pdf'), {
              caption:
                '📚 <b>Книга «Банкротство физических лиц»</b>\n\n' +
                '✅ Книга отправлена! Приятного чтения 🙏',
              parse_mode: 'HTML',
              reply_markup: afterBookKeyboard(),
            });
            if (ctx.from?.id) {
              await trackReceivedMaterial(ctx.from.id, 'book');
            }
          } else {
            await ctx.reply(
              '😔 <b>Файл временно недоступен</b>\n\nПопробуйте позже или напишите /book.',
              { parse_mode: 'HTML', reply_markup: mainMenuKeyboard() }
            );
          }
          return;
        }

        // Update lead with delivery confirmation
        await query(
          `UPDATE research_leads SET delivery_channel = 'telegram' WHERE id = $1`,
          [leadId]
        );

        // Send the book
        if (!fs.existsSync(BOOK_PATH)) {
          await ctx.reply(
            '😔 <b>Файл временно недоступен</b>\n\n' +
            'К сожалению, книга сейчас недоступна. Попробуйте позже.',
            { parse_mode: 'HTML', reply_markup: mainMenuKeyboard() }
          );
          return;
        }

        const leadName = leadResult.rows[0].name;
        const safeName = escapeHtml(leadName);

        await ctx.replyWithDocument(new InputFile(BOOK_PATH, 'Банкротство физических лиц.pdf'), {
          caption:
            `📚 <b>Книга «Банкротство физических лиц»</b>\n\n` +
            `${safeName}, спасибо за интерес к нашим материалам!\n\n` +
            'Практическое руководство по банкротству граждан — от первых признаков ' +
            'неплатёжеспособности до завершения дела и списания долгов.\n\n' +
            '✅ Книга отправлена! Приятного чтения 🙏',
          parse_mode: 'HTML',
          reply_markup: afterBookKeyboard(),
        });
        if (ctx.from?.id) {
          await trackReceivedMaterial(ctx.from.id, 'book');
        }
      } catch (err) {
        console.error('Start book_LEADID error:', err);
        // Fallback: try to send book without lead tracking
        if (fs.existsSync(BOOK_PATH)) {
          try {
            await ctx.replyWithDocument(new InputFile(BOOK_PATH, 'Банкротство физических лиц.pdf'), {
              caption:
                '📚 <b>Книга «Банкротство физических лиц»</b>\n\n' +
                '✅ Книга отправлена! Приятного чтения 🙏',
              parse_mode: 'HTML',
              reply_markup: afterBookKeyboard(),
            });
            if (ctx.from?.id) {
              await trackReceivedMaterial(ctx.from.id, 'book');
            }
          } catch (sendErr) {
            console.error('Fallback book send error:', sendErr);
            await ctx.reply(
              '❌ <b>Ошибка отправки</b>\n\nНе удалось отправить книгу. Попробуйте /book.',
              { parse_mode: 'HTML', reply_markup: mainMenuKeyboard() }
            );
          }
        } else {
          await ctx.reply(
            '😔 <b>Файл временно недоступен</b>\n\nПопробуйте позже.',
            { parse_mode: 'HTML', reply_markup: mainMenuKeyboard() }
          );
        }
      }
      return;
    }

    // /start checklist_SLUG  — send checklist PDF
    if (payload && payload.startsWith('checklist_')) {
      await ctx.replyWithChatAction('upload_document');
      const slug = payload.replace('checklist_', '');
      try {
        const result = await query(
          'SELECT title, pdf_url FROM checklists WHERE slug = $1 AND is_published = true LIMIT 1',
          [slug]
        );
        if (result.rows.length === 0) {
          await ctx.reply(
            '📋 <b>Чек-лист не найден</b>\n\n' +
            'Этот чек-лист не найден или снят с публикации.\n' +
            'Посмотрите доступные чек-листы в меню.',
            { parse_mode: 'HTML', reply_markup: mainMenuKeyboard() }
          );
          return;
        }
        const { title, pdf_url } = result.rows[0];
        if (!pdf_url) {
          await ctx.reply(
            '📋 <b>PDF ещё не загружен</b>\n\n' +
            'Файл для этого чек-листа пока готовится. Попробуйте позже.',
            { parse_mode: 'HTML', reply_markup: mainMenuKeyboard() }
          );
          return;
        }

        const safeTitle = escapeHtml(title);

        // pdf_url can be /api/media/<id> or an absolute URL
        if (pdf_url.startsWith('/api/media/')) {
          const mediaId = pdf_url.replace('/api/media/', '');
          const mediaResult = await query(
            'SELECT data, filename, mime_type FROM media WHERE id = $1 LIMIT 1',
            [mediaId]
          );
          if (mediaResult.rows.length === 0) {
            await ctx.reply(
              '❌ <b>Файл не найден</b>\n\nФайл чек-листа не найден в хранилище.',
              { parse_mode: 'HTML', reply_markup: mainMenuKeyboard() }
            );
            return;
          }
          const media = mediaResult.rows[0];
          const buffer = Buffer.isBuffer(media.data) ? media.data : Buffer.from(media.data);
          await ctx.replyWithDocument(new InputFile(buffer, media.filename || `${slug}.pdf`), {
            caption:
              `📋 <b>${safeTitle}</b>\n\n` +
              '✅ Чек-лист отправлен! Используйте его как план действий.',
            parse_mode: 'HTML',
            reply_markup: afterChecklistKeyboard(),
          });
          if (ctx.from?.id) {
            await trackReceivedMaterial(ctx.from.id, `checklist:${slug}`);
          }
        } else {
          // External URL or local file path
          const filePath = path.resolve(__dirname, '../../../../public', pdf_url.replace(/^\//, ''));
          if (fs.existsSync(filePath)) {
            await ctx.replyWithDocument(new InputFile(filePath, `${slug}.pdf`), {
              caption:
                `📋 <b>${safeTitle}</b>\n\n` +
                '✅ Чек-лист отправлен! Используйте его как план действий.',
              parse_mode: 'HTML',
              reply_markup: afterChecklistKeyboard(),
            });
            if (ctx.from?.id) {
              await trackReceivedMaterial(ctx.from.id, `checklist:${slug}`);
            }
          } else {
            await ctx.reply(
              '😔 <b>Файл временно недоступен</b>\n\nФайл чек-листа сейчас недоступен. Попробуйте позже.',
              { parse_mode: 'HTML', reply_markup: mainMenuKeyboard() }
            );
          }
        }
      } catch (err) {
        console.error('Start checklist error:', err);
        await ctx.reply(
          '❌ <b>Произошла ошибка</b>\n\nНе удалось отправить чек-лист. Попробуйте /start для возврата в меню.',
          { parse_mode: 'HTML', reply_markup: mainMenuKeyboard() }
        );
      }
      return;
    }

    // Default /start behavior
    const firstName = ctx.from?.first_name || '';

    if (isNewUser) {
      // NEW user onboarding
      const greeting = firstName ? `, ${escapeHtml(firstName)}` : '';
      const onboardingKeyboard = new InlineKeyboard()
        .text('📕 Получить книгу', 'menu:book')
        .text('📋 Чек-листы', 'menu:checklists')
        .row()
        .text('🏛 Главное меню', 'menu:main');

      await ctx.reply(
        `🎉 <b>Добро пожаловать в НейроПраво${greeting}!</b>\n\n` +
        'Мы — платформа «ТехнологИИ права» о цифровых технологиях ' +
        'и ИИ в банкротстве физических лиц.\n\n' +
        '<b>Что я могу для вас:</b>\n' +
        '📕 Отправить бесплатную книгу о банкротстве\n' +
        '📋 Поделиться чек-листами для юристов\n' +
        '📊 Прислать аналитические исследования\n' +
        '🎓 Рассказать о курсах повышения квалификации\n\n' +
        'Начните с книги — она бесплатная! 👇',
        {
          parse_mode: 'HTML',
          reply_markup: onboardingKeyboard,
        }
      );
    } else {
      // RETURNING user — regular main menu
      const greeting = firstName ? `С возвращением, ${escapeHtml(firstName)}!` : 'С возвращением!';

      await ctx.reply(
        `🏛 <b>Технологии Права</b>\n\n` +
        `${greeting} Я — ваш помощник в мире банкротства физических лиц.\n\n` +
        `<b>Что я умею:</b>\n` +
        `📚 Отправлю книгу по БФЛ бесплатно\n` +
        `📋 Пришлю чек-листы для практики\n` +
        `📊 Поделюсь актуальными исследованиями\n` +
        `🎓 Расскажу о курсах Академии\n\n` +
        `Выберите, что вас интересует 👇`,
        {
          parse_mode: 'HTML',
          reply_markup: mainMenuKeyboard(),
        }
      );
    }
  });
}
