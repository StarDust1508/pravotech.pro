import { Router, Request, Response } from 'express';
import { randomUUID } from 'crypto';
import { query } from '../db.js';
import { requireUser, AuthRequest } from './user-auth.js';

const router = Router();

const YOOKASSA_SHOP_ID = process.env.YOOKASSA_SHOP_ID || 'test_shop';
const YOOKASSA_SECRET_KEY = process.env.YOOKASSA_SECRET_KEY || 'test_secret';
const YOOKASSA_API_URL = 'https://api.yookassa.ru/v3/payments';
const SITE_URL = process.env.SITE_URL || 'https://pravotech.pro';

// YooKassa IP ranges for webhook validation
// https://yookassa.ru/developers/using-api/webhooks#ip
const YOOKASSA_ALLOWED_CIDRS = [
  { base: ipToNum('185.71.76.0'), mask: 27 },
  { base: ipToNum('185.71.77.0'), mask: 27 },
  { base: ipToNum('77.75.153.0'), mask: 25 },
  { base: ipToNum('77.75.154.128'), mask: 25 },
  { base: ipToNum('77.75.156.11'), mask: 32 },
  { base: ipToNum('77.75.156.35'), mask: 32 },
];

function ipToNum(ip: string): number {
  const parts = ip.split('.').map(Number);
  return ((parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3]) >>> 0;
}

function isYookassaIp(ip: string): boolean {
  // Skip validation in test/dev mode
  if (YOOKASSA_SHOP_ID === 'test_shop') {
    return true;
  }

  // Handle IPv6-mapped IPv4 (e.g. ::ffff:185.71.76.1)
  const cleanIp = ip.replace(/^::ffff:/, '');

  // Skip IPv6 addresses (YooKassa uses IPv4 only in their docs)
  if (cleanIp.includes(':')) {
    return false;
  }

  const num = ipToNum(cleanIp);

  for (const cidr of YOOKASSA_ALLOWED_CIDRS) {
    const maskBits = (0xffffffff << (32 - cidr.mask)) >>> 0;
    if ((num & maskBits) === (cidr.base & maskBits)) {
      return true;
    }
  }

  return false;
}

// POST /payments/create — create a YooKassa payment for a course purchase
router.post('/create', requireUser, async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user!.id;
    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({ error: 'courseId обязателен' });
    }

    // Look up course in public.courses
    const courseResult = await query(
      'SELECT id, title, slug, price FROM public.courses WHERE id = $1::uuid',
      [courseId]
    );

    if (courseResult.rows.length === 0) {
      return res.status(404).json({ error: 'Курс не найден' });
    }

    const course = courseResult.rows[0];

    // Parse price: "15000", "14 900 ₽", "14900" etc.
    const priceStr = String(course.price || '0').replace(/[^\d]/g, '');
    const priceRub = parseInt(priceStr, 10);

    if (!priceRub || priceRub <= 0) {
      return res.status(400).json({ error: 'У курса не указана цена' });
    }

    // Find existing pending purchase or create new one
    let purchaseId: number;

    const existing = await query(
      `SELECT id, status FROM purchases
       WHERE user_id = $1 AND course_id = $2::uuid`,
      [userId, courseId]
    );

    if (existing.rows.length > 0) {
      const purchase = existing.rows[0];
      if (purchase.status === 'paid') {
        return res.status(409).json({ error: 'Курс уже оплачен' });
      }
      purchaseId = purchase.id;
      // Update amount in case price changed
      await query(
        'UPDATE purchases SET amount = $1, updated_at = NOW() WHERE id = $2',
        [priceRub, purchaseId]
      );
    } else {
      const insertResult = await query(
        `INSERT INTO purchases (user_id, course_id, status, amount)
         VALUES ($1, $2::uuid, 'pending', $3)
         RETURNING id`,
        [userId, courseId, priceRub]
      );
      purchaseId = insertResult.rows[0].id;
    }

    // Build return URL using course slug
    const slug = course.slug || courseId;
    const returnUrl = `${SITE_URL}/courses/${slug}/learn?payment=success`;

    // Create YooKassa payment via API
    const idempotencyKey = randomUUID();

    const paymentBody = {
      amount: {
        value: `${priceRub}.00`,
        currency: 'RUB',
      },
      confirmation: {
        type: 'redirect',
        return_url: returnUrl,
      },
      capture: true,
      description: course.title || `Курс #${courseId}`,
      metadata: {
        purchaseId: String(purchaseId),
        userId: String(userId),
        courseId: String(courseId),
      },
    };

    const authHeader = Buffer.from(`${YOOKASSA_SHOP_ID}:${YOOKASSA_SECRET_KEY}`).toString('base64');

    const yooResponse = await fetch(YOOKASSA_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${authHeader}`,
        'Idempotence-Key': idempotencyKey,
      },
      body: JSON.stringify(paymentBody),
    });

    if (!yooResponse.ok) {
      const errorBody = await yooResponse.text();
      console.error('YooKassa create payment error:', yooResponse.status, errorBody);
      return res.status(502).json({ error: 'Ошибка создания платежа в YooKassa' });
    }

    const yooPayment = await yooResponse.json() as {
      id: string;
      confirmation?: { confirmation_url?: string };
    };

    // Store YooKassa payment ID in purchases
    await query(
      `UPDATE purchases
       SET yookassa_payment_id = $1, payment_id = $2, updated_at = NOW()
       WHERE id = $3`,
      [yooPayment.id, idempotencyKey, purchaseId]
    );

    const confirmationUrl = yooPayment.confirmation?.confirmation_url;

    if (!confirmationUrl) {
      console.error('YooKassa response missing confirmation_url:', JSON.stringify(yooPayment));
      return res.status(502).json({ error: 'Не удалось получить ссылку для оплаты' });
    }

    res.json({
      confirmationUrl,
      paymentId: yooPayment.id,
      purchaseId,
    });
  } catch (err) {
    console.error('Create payment error:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// POST /payments/webhook — YooKassa webhook notifications
router.post('/webhook', async (req: Request, res: Response) => {
  try {
    // Validate source IP
    const clientIp = req.ip || req.socket.remoteAddress || '';
    if (!isYookassaIp(clientIp)) {
      console.warn('Payment webhook from untrusted IP:', clientIp);
      return res.status(403).json({ error: 'Forbidden' });
    }

    const { event, object: payment } = req.body;

    if (!event || !payment) {
      return res.status(400).json({ error: 'Invalid webhook payload' });
    }

    const yookassaPaymentId: string = payment.id;
    const metadata = payment.metadata || {};
    const purchaseId = metadata.purchaseId ? parseInt(metadata.purchaseId, 10) : null;

    if (!yookassaPaymentId) {
      return res.status(400).json({ error: 'Missing payment id' });
    }

    if (event === 'payment.succeeded') {
      // Update purchase to paid
      if (purchaseId) {
        await query(
          `UPDATE purchases
           SET status = 'paid',
               yookassa_payment_id = $1,
               updated_at = NOW()
           WHERE id = $2`,
          [yookassaPaymentId, purchaseId]
        );
      } else {
        // Fallback: find by yookassa_payment_id
        await query(
          `UPDATE purchases
           SET status = 'paid', updated_at = NOW()
           WHERE yookassa_payment_id = $1`,
          [yookassaPaymentId]
        );
      }

      console.log(`Payment succeeded: yookassa_id=${yookassaPaymentId}, purchase_id=${purchaseId}`);
    } else if (event === 'payment.canceled') {
      if (purchaseId) {
        await query(
          `UPDATE purchases
           SET status = 'cancelled', updated_at = NOW()
           WHERE id = $1`,
          [purchaseId]
        );
      } else {
        await query(
          `UPDATE purchases
           SET status = 'cancelled', updated_at = NOW()
           WHERE yookassa_payment_id = $1`,
          [yookassaPaymentId]
        );
      }

      console.log(`Payment canceled: yookassa_id=${yookassaPaymentId}, purchase_id=${purchaseId}`);
    } else if (event === 'payment.waiting_for_capture') {
      console.log(`Payment waiting for capture: yookassa_id=${yookassaPaymentId}`);
    } else {
      console.log(`Unhandled webhook event: ${event}`);
    }

    // Always respond 200 to acknowledge receipt
    res.status(200).json({ status: 'ok' });
  } catch (err) {
    console.error('Webhook processing error:', err);
    // Still respond 200 to prevent YooKassa from retrying endlessly
    res.status(200).json({ status: 'ok' });
  }
});

// GET /payments/status/:purchaseId — get purchase status
router.get('/status/:purchaseId', requireUser, async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user!.id;
    const purchaseId = parseInt(String(req.params.purchaseId), 10);

    if (isNaN(purchaseId)) {
      return res.status(400).json({ error: 'Некорректный ID покупки' });
    }

    const result = await query(
      `SELECT p.id, p.user_id, p.course_id, p.status, p.amount,
              p.payment_id, p.yookassa_payment_id,
              p.created_at, p.updated_at,
              c.title AS course_title, c.slug AS course_slug
       FROM purchases p
       LEFT JOIN public.courses c ON c.id = p.course_id
       WHERE p.id = $1 AND p.user_id = $2`,
      [purchaseId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Покупка не найдена' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Payment status error:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

export default router;
