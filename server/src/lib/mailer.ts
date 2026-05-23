import nodemailer from 'nodemailer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { escapeHtml } from '../config.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const MAIL_USER = process.env.MAIL_USER;
const MAIL_APP_PASS = process.env.MAIL_APP_PASS;

let transporter: nodemailer.Transporter | null = null;

if (MAIL_USER && MAIL_APP_PASS) {
  transporter = nodemailer.createTransport({
    host: 'smtp.mail.ru',
    port: 465,
    secure: true,
    auth: {
      user: MAIL_USER,
      pass: MAIL_APP_PASS,
    },
  });

  transporter.verify().then(() => {
    console.log('📧 Mail transport ready (smtp.mail.ru)');
  }).catch((err) => {
    console.error('📧 Mail transport verification failed:', err.message);
    transporter = null;
  });
} else {
  console.warn('📧 MAIL_USER / MAIL_APP_PASS not set — email sending disabled');
}

// ────────────────────────────────────────────────────────────────
// HTML template
// ────────────────────────────────────────────────────────────────
function buildEmailHtml(options: {
  preheader: string;
  heading: string;
  bodyHtml: string;
  ctaText?: string;
  ctaUrl?: string;
}): string {
  const { preheader, heading, bodyHtml, ctaText, ctaUrl } = options;

  const ctaBlock = ctaText && ctaUrl
    ? `<tr>
        <td align="center" style="padding: 28px 0 0 0;">
          <a href="${ctaUrl}" target="_blank" rel="noopener noreferrer"
             style="display: inline-block; padding: 14px 36px; background: linear-gradient(135deg, #00e5ff 0%, #0097a7 100%); color: #0a0e14; font-family: 'Segoe UI', Tahoma, sans-serif; font-size: 15px; font-weight: 700; text-decoration: none; border-radius: 8px; letter-spacing: 0.5px; text-transform: uppercase;">
            ${ctaText}
          </a>
        </td>
      </tr>`
    : '';

  return `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${heading}</title>
  <!--[if mso]>
  <style>table,td{font-family:'Segoe UI',Tahoma,sans-serif;}</style>
  <![endif]-->
</head>
<body style="margin:0;padding:0;background-color:#06090f;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
  <!-- Preheader (hidden preview text) -->
  <div style="display:none;font-size:1px;color:#06090f;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">
    ${preheader}
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
         style="background-color:#06090f;padding:24px 0;">
    <tr>
      <td align="center">
        <!-- Outer wrapper -->
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0"
               style="max-width:600px;width:100%;">

          <!-- Logo row -->
          <tr>
            <td align="center" style="padding: 24px 20px 16px 20px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="font-family:'Segoe UI',Tahoma,sans-serif;font-size:20px;font-weight:900;letter-spacing:2px;text-transform:uppercase;">
                    <span style="color:#ff3399;">Технолог</span><span style="color:#00e5ff;">ИИ</span>
                    <span style="color:#ff3399;"> права</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Top accent line -->
          <tr>
            <td style="padding:0 20px;">
              <div style="height:2px;background:linear-gradient(90deg,#00e5ff 0%,rgba(0,229,255,0.15) 60%,transparent 100%);border-radius:2px;"></div>
            </td>
          </tr>

          <!-- Main card -->
          <tr>
            <td style="padding:0 20px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
                     style="background-color:#0d1117;border:1px solid rgba(0,229,255,0.15);border-radius:16px;overflow:hidden;margin-top:4px;">
                <tr>
                  <td style="padding:40px 36px;">
                    <!-- Heading -->
                    <h1 style="margin:0 0 20px 0;font-family:'Segoe UI',Tahoma,sans-serif;font-size:26px;font-weight:800;color:#ffffff;line-height:1.25;text-transform:uppercase;letter-spacing:0.5px;">
                      ${heading}
                    </h1>

                    <!-- Body -->
                    <div style="font-family:'Segoe UI',Tahoma,sans-serif;font-size:15px;line-height:1.7;color:rgba(255,255,255,0.75);">
                      ${bodyHtml}
                    </div>

                    <!-- CTA -->
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                      ${ctaBlock}
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Bottom accent line -->
          <tr>
            <td style="padding:4px 20px 0 20px;">
              <div style="height:2px;background:linear-gradient(90deg,transparent 0%,rgba(255,51,153,0.3) 40%,#ff3399 100%);border-radius:2px;"></div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding:28px 20px 32px 20px;">
              <p style="margin:0;font-family:'Segoe UI',Tahoma,sans-serif;font-size:12px;color:rgba(255,255,255,0.3);line-height:1.6;">
                &copy; ${new Date().getFullYear()} Технологии Права. Все права защищены.<br/>
                Это письмо отправлено автоматически. Пожалуйста, не отвечайте на него.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ────────────────────────────────────────────────────────────────
// Public API
// ────────────────────────────────────────────────────────────────

/**
 * Send the book PDF as an email attachment with a thank-you message,
 * cross-sell links, and a backup download link.
 *
 * @param downloadUrl - optional token-based download URL as a backup link
 */
export async function sendBookEmail(
  to: string,
  userName: string,
  bookPath: string,
  downloadUrl?: string,
): Promise<boolean> {
  if (!transporter) {
    console.warn('📧 sendBookEmail skipped — transport not configured');
    return false;
  }

  const absolutePath = path.isAbsolute(bookPath)
    ? bookPath
    : path.resolve(__dirname, '../../../public', bookPath);

  if (!fs.existsSync(absolutePath)) {
    console.error(`📧 sendBookEmail — file not found: ${absolutePath}`);
    return false;
  }

  const fileName = path.basename(absolutePath);

  const backupLinkBlock = downloadUrl
    ? `<p style="margin:0 0 16px 0;font-size:13px;color:rgba(255,255,255,0.5);">
        Если вложение не открывается —
        <a href="${downloadUrl}" target="_blank" rel="noopener noreferrer"
           style="color:#00e5ff;text-decoration:underline;">скачайте книгу по ссылке</a>
        (действует 24 часа).
      </p>`
    : '';

  const safeUserName = escapeHtml(userName);
  const html = buildEmailHtml({
    preheader: `${safeUserName}, ваша книга «Банкротство физических лиц» готова к скачиванию`,
    heading: 'Спасибо за интерес к теме банкротства!',
    bodyHtml: `
      <p style="margin:0 0 16px 0;">Здравствуйте, <strong style="color:#ffffff;">${safeUserName}</strong>!</p>
      <p style="margin:0 0 16px 0;">Книга <strong style="color:#00e5ff;">«Банкротство физических лиц»</strong> прикреплена к этому письму в формате PDF.</p>
      <p style="margin:0 0 16px 0;">Это практическое руководство — от первых признаков неплатёжеспособности до завершения дела и списания долгов. 117 страниц, 4 части, 12 глав.</p>
      ${backupLinkBlock}

      <!-- Divider -->
      <div style="margin:28px 0;height:1px;background:linear-gradient(90deg,rgba(0,229,255,0.3),rgba(255,51,153,0.2),transparent);"></div>

      <!-- Cross-sell block -->
      <p style="margin:0 0 12px 0;font-size:14px;font-weight:700;color:#ffffff;text-transform:uppercase;letter-spacing:0.5px;">Также на платформе:</p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 8px 0;">
        <tr>
          <td style="padding:8px 0;">
            <a href="https://pravotech.pro/academy" target="_blank" rel="noopener noreferrer"
               style="color:#00e5ff;text-decoration:none;font-size:14px;font-weight:600;">
              📚 Курсы Академии
            </a>
            <span style="color:rgba(255,255,255,0.5);font-size:13px;"> — углублённое обучение по банкротству и правовым технологиям</span>
          </td>
        </tr>
        <tr>
          <td style="padding:8px 0;">
            <a href="https://pravotech.pro/research" target="_blank" rel="noopener noreferrer"
               style="color:#00e5ff;text-decoration:none;font-size:14px;font-weight:600;">
              📊 Исследования
            </a>
            <span style="color:rgba(255,255,255,0.5);font-size:13px;"> — аналитика и статистика правоприменения</span>
          </td>
        </tr>
        <tr>
          <td style="padding:8px 0;">
            <a href="https://t.me/NeuroPravo_Bot" target="_blank" rel="noopener noreferrer"
               style="color:#00e5ff;text-decoration:none;font-size:14px;font-weight:600;">
              🤖 Telegram-бот
            </a>
            <span style="color:rgba(255,255,255,0.5);font-size:13px;"> — быстрые ответы на вопросы по банкротству</span>
          </td>
        </tr>
      </table>

      <p style="margin:16px 0 0 0;color:rgba(255,255,255,0.4);font-size:13px;">Если возникнут вопросы — мы всегда на связи.</p>
    `,
    ctaText: 'Перейти на платформу',
    ctaUrl: 'https://pravotech.pro',
  });

  try {
    await transporter.sendMail({
      from: `"Технологии Права" <${MAIL_USER}>`,
      to,
      subject: '📚 Ваша книга «Банкротство физических лиц» — Технологии Права',
      html,
      attachments: [
        {
          filename: fileName,
          path: absolutePath,
        },
      ],
    });
    console.log(`📧 Book email sent to ${to}`);
    return true;
  } catch (err) {
    console.error('📧 sendBookEmail failed:', (err as Error).message);
    return false;
  }
}

/**
 * Send a checklist PDF buffer as an email attachment.
 */
export async function sendChecklistEmail(
  to: string,
  userName: string,
  pdfBuffer: Buffer,
  checklistName: string,
): Promise<boolean> {
  if (!transporter) {
    console.warn('📧 sendChecklistEmail skipped — transport not configured');
    return false;
  }

  const safeUserName = escapeHtml(userName);
  const safeChecklistName = escapeHtml(checklistName);
  const html = buildEmailHtml({
    preheader: `${safeUserName}, ваш чек-лист «${safeChecklistName}» готов`,
    heading: 'Ваш чек-лист готов!',
    bodyHtml: `
      <p style="margin:0 0 16px 0;">Здравствуйте, <strong style="color:#ffffff;">${safeUserName}</strong>!</p>
      <p style="margin:0 0 16px 0;">Чек-лист <strong style="color:#00e5ff;">«${safeChecklistName}»</strong> прикреплён к этому письму в формате PDF.</p>
      <p style="margin:0 0 4px 0;color:rgba(255,255,255,0.5);font-size:13px;">Используйте его как структурированный план действий. Если возникнут вопросы — мы на связи.</p>
    `,
  });

  try {
    await transporter.sendMail({
      from: `"Технологии Права" <${MAIL_USER}>`,
      to,
      subject: `📋 Чек-лист «${checklistName}» — Технологии Права`,
      html,
      attachments: [
        {
          filename: `${checklistName.replace(/[^a-zA-Zа-яА-ЯёЁ0-9 _-]/g, '')}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ],
    });
    console.log(`📧 Checklist email sent to ${to}`);
    return true;
  } catch (err) {
    console.error('📧 sendChecklistEmail failed:', (err as Error).message);
    return false;
  }
}

/**
 * Send a research report PDF buffer as an email attachment.
 */
export async function sendResearchEmail(
  to: string,
  userName: string,
  pdfBuffer: Buffer,
  researchTitle: string,
): Promise<boolean> {
  if (!transporter) {
    console.warn('📧 sendResearchEmail skipped — transport not configured');
    return false;
  }

  const safeUserName = escapeHtml(userName);
  const safeResearchTitle = escapeHtml(researchTitle);
  const html = buildEmailHtml({
    preheader: `${safeUserName}, исследование «${safeResearchTitle}» готово`,
    heading: 'Ваше исследование готово!',
    bodyHtml: `
      <p style="margin:0 0 16px 0;">Здравствуйте, <strong style="color:#ffffff;">${safeUserName}</strong>!</p>
      <p style="margin:0 0 16px 0;">Исследование <strong style="color:#00e5ff;">«${safeResearchTitle}»</strong> прикреплено к этому письму в формате PDF.</p>
      <p style="margin:0 0 4px 0;color:rgba(255,255,255,0.5);font-size:13px;">Мы регулярно публикуем аналитику — следите за обновлениями на платформе.</p>
    `,
  });

  try {
    await transporter.sendMail({
      from: `"Технологии Права" <${MAIL_USER}>`,
      to,
      subject: `📊 Исследование «${researchTitle}» — Технологии Права`,
      html,
      attachments: [
        {
          filename: `${researchTitle.replace(/[^a-zA-Zа-яА-ЯёЁ0-9 _-]/g, '')}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ],
    });
    console.log(`📧 Research email sent to ${to}`);
    return true;
  } catch (err) {
    console.error('📧 sendResearchEmail failed:', (err as Error).message);
    return false;
  }
}

/**
 * Send a general thank-you email (no attachment).
 */
export async function sendThankYouEmail(
  to: string,
  userName: string,
): Promise<boolean> {
  if (!transporter) {
    console.warn('📧 sendThankYouEmail skipped — transport not configured');
    return false;
  }

  const safeUserName = escapeHtml(userName);
  const html = buildEmailHtml({
    preheader: `${safeUserName}, спасибо за обращение в Технологии Права`,
    heading: 'Спасибо за обращение!',
    bodyHtml: `
      <p style="margin:0 0 16px 0;">Здравствуйте, <strong style="color:#ffffff;">${safeUserName}</strong>!</p>
      <p style="margin:0 0 16px 0;">Благодарим за интерес к платформе <strong style="color:#00e5ff;">Технологии Права</strong>. Мы получили вашу заявку и свяжемся с вами в ближайшее время.</p>
      <p style="margin:0 0 4px 0;color:rgba(255,255,255,0.5);font-size:13px;">Если у вас есть срочный вопрос — напишите нам в Telegram.</p>
    `,
    ctaText: 'Перейти на платформу',
    ctaUrl: 'https://pravotech.pro',
  });

  try {
    await transporter.sendMail({
      from: `"Технологии Права" <${MAIL_USER}>`,
      to,
      subject: '💼 Спасибо за обращение — Технологии Права',
      html,
    });
    console.log(`📧 Thank-you email sent to ${to}`);
    return true;
  } catch (err) {
    console.error('📧 sendThankYouEmail failed:', (err as Error).message);
    return false;
  }
}
