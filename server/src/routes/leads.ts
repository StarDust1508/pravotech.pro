import { Router } from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { requireAuth } from './auth.js';
import { rateLimit } from '../middleware/rate-limit.js';
import { query } from '../db.js';
import { sendBookEmail } from '../lib/mailer.js';
import { DOWNLOAD_SECRET } from '../config.js';

const router = Router();

/**
 * Generate a JWT download token for a given file and lead.
 */
function generateDownloadToken(file: string, leadId: number | string): string {
  return jwt.sign(
    { file, leadId: typeof leadId === 'string' ? parseInt(leadId, 10) : leadId },
    DOWNLOAD_SECRET,
    { expiresIn: '24h' },
  );
}

// Лимит на публичные формы: 10 отправок в минуту с одного IP на эндпоинт.
const formLimit = rateLimit(10, 60_000);

// Simple email validation
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// GET all leads by type
router.get('/exhibition', requireAuth, async (_req, res) => {
  try {
    const result = await query('SELECT * FROM exhibition_leads ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch exhibition leads' });
  }
});

router.get('/speakers', requireAuth, async (_req, res) => {
  try {
    const result = await query('SELECT * FROM speaker_leads ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch speaker leads' });
  }
});

router.get('/sponsors', requireAuth, async (_req, res) => {
  try {
    const result = await query('SELECT * FROM sponsor_leads ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch sponsor leads' });
  }
});

router.get('/tickets', requireAuth, async (_req, res) => {
  try {
    const result = await query('SELECT * FROM ticket_leads ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch ticket leads' });
  }
});

function truncate(val: unknown, max = 500): string {
  if (typeof val !== 'string') return '';
  return val.slice(0, max).trim();
}

// POST exhibition lead
router.post('/exhibition', formLimit, async (req, res) => {
  try {
    const { company_name, contact_person, email, phone, stand_size, notes } = req.body;
    if (!company_name || typeof company_name !== 'string') {
      return res.status(400).json({ error: 'company_name обязательно' });
    }
    if (!email || typeof email !== 'string' || !isValidEmail(email)) {
      return res.status(400).json({ error: 'Некорректный email' });
    }
    const result = await query(
      `INSERT INTO exhibition_leads (company_name, contact_person, email, phone, stand_size, notes)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [truncate(company_name, 200), truncate(contact_person, 200), truncate(email, 254), truncate(phone, 30), truncate(stand_size, 50), truncate(notes, 1000)]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create exhibition lead' });
  }
});

// POST speaker lead
router.post('/speakers', formLimit, async (req, res) => {
  try {
    const { full_name, position, company, email, stream, talk_title, talk_description } = req.body;
    if (!full_name || typeof full_name !== 'string') {
      return res.status(400).json({ error: 'full_name обязательно' });
    }
    if (!email || typeof email !== 'string' || !isValidEmail(email)) {
      return res.status(400).json({ error: 'Некорректный email' });
    }
    const result = await query(
      `INSERT INTO speaker_leads (full_name, position, company, email, stream, talk_title, talk_description)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [truncate(full_name, 200), truncate(position, 200), truncate(company, 200), truncate(email, 254), truncate(stream, 100), truncate(talk_title, 300), truncate(talk_description, 2000)]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create speaker lead' });
  }
});

// POST sponsor lead
router.post('/sponsors', formLimit, async (req, res) => {
  try {
    const { company_name, contact_person, email, tier, notes } = req.body;
    if (!company_name || typeof company_name !== 'string') {
      return res.status(400).json({ error: 'company_name обязательно' });
    }
    if (!email || typeof email !== 'string' || !isValidEmail(email)) {
      return res.status(400).json({ error: 'Некорректный email' });
    }
    const result = await query(
      `INSERT INTO sponsor_leads (company_name, contact_person, email, tier, notes)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [truncate(company_name, 200), truncate(contact_person, 200), truncate(email, 254), truncate(tier, 50), truncate(notes, 1000)]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create sponsor lead' });
  }
});

// POST ticket lead
router.post('/tickets', formLimit, async (req, res) => {
  try {
    const { full_name, email, phone, ticket_type, ticket_price, payment_method } = req.body;
    if (!full_name || typeof full_name !== 'string') {
      return res.status(400).json({ error: 'full_name обязательно' });
    }
    if (!email || typeof email !== 'string' || !isValidEmail(email)) {
      return res.status(400).json({ error: 'Некорректный email' });
    }
    const result = await query(
      `INSERT INTO ticket_leads (full_name, email, phone, ticket_type, ticket_price, payment_method)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [truncate(full_name, 200), truncate(email, 254), truncate(phone, 30), truncate(ticket_type, 50), truncate(ticket_price, 20), truncate(payment_method, 50)]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create ticket lead' });
  }
});

// GET research leads
router.get('/research', requireAuth, async (_req, res) => {
  try {
    const result = await query('SELECT * FROM research_leads ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch research leads' });
  }
});

// POST research lead
router.post('/research', formLimit, async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      telegram,
      company,
      position,
      research_id,
      research_title,
      source_form,
      delivery_channel,
    } = req.body;

    // ── Server-side validation ──────────────────────────────────
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({ error: 'Имя обязательно' });
    }
    if (!email || typeof email !== 'string' || !isValidEmail(email)) {
      return res.status(400).json({ error: 'Некорректный email' });
    }
    if (!phone || typeof phone !== 'string' || phone.trim().length < 5) {
      return res.status(400).json({ error: 'Телефон обязателен' });
    }
    if (!research_id || typeof research_id !== 'string') {
      return res.status(400).json({ error: 'research_id обязателен' });
    }

    // ── Duplicate check (same email + research_id) ──────────────
    const existing = await query(
      'SELECT id FROM research_leads WHERE email = $1 AND research_id = $2 LIMIT 1',
      [email.trim().toLowerCase(), research_id],
    );
    if (existing.rows.length > 0) {
      const existingLead = existing.rows[0];
      const response: Record<string, unknown> = {
        ...existingLead,
        duplicate: true,
        message: 'Заявка уже была отправлена ранее',
      };

      // Re-generate download token so the user can still download
      if (source_form === 'book') {
        const downloadToken = generateDownloadToken('bankrotstvo-fizlic.pdf', existingLead.id);
        response.downloadToken = downloadToken;

        if (delivery_channel === 'telegram') {
          response.telegramLink = `https://t.me/NeuroPravo_Bot?start=book_${existingLead.id}`;
        }
      }

      return res.status(200).json(response);
    }

    // ── Sanitise delivery_channel ───────────────────────────────
    const channel = delivery_channel === 'telegram' ? 'telegram' : 'email';

    const result = await query(
      `INSERT INTO research_leads
         (name, email, phone, telegram, company, position, research_id, research_title, source_form, delivery_channel)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [
        truncate(name, 200),
        truncate(email, 254).toLowerCase(),
        truncate(phone, 30),
        telegram ? truncate(telegram, 100) : null,
        company ? truncate(company, 200) : null,
        position ? truncate(position, 200) : null,
        truncate(research_id, 100),
        research_title ? truncate(research_title, 300) : null,
        truncate(source_form || 'research_card', 50),
        channel,
      ],
    );

    const lead = result.rows[0];
    const response: Record<string, unknown> = { ...lead };

    // ── Book delivery logic ────────────────────────────────────
    if (source_form === 'book') {
      // Generate a download token so user can always download via /api/downloads/:token
      const downloadToken = generateDownloadToken('bankrotstvo-fizlic.pdf', lead.id);
      response.downloadToken = downloadToken;

      if (channel === 'email') {
        // Build a backup download URL for the email
        const baseUrl = process.env.PUBLIC_URL || 'https://pravotech.pro';
        const emailDownloadUrl = `${baseUrl}/api/downloads/${downloadToken}`;

        // Send email synchronously so we can report success/failure to the frontend
        try {
          const emailSent = await sendBookEmail(
            email.trim().toLowerCase(),
            name.trim(),
            'bankrotstvo-fizlic.pdf',
            emailDownloadUrl,
          );
          response.emailSent = emailSent;
        } catch (err) {
          console.error('📧 Book email failed:', err);
          response.emailSent = false;
        }
      } else if (channel === 'telegram') {
        // Generate a unique deep-link token and save it to the DB
        const telegramToken = crypto.randomBytes(16).toString('hex');
        await query(
          'UPDATE research_leads SET telegram_delivery_token = $1 WHERE id = $2',
          [telegramToken, lead.id],
        ).catch((err: unknown) => console.error('Failed to save telegram token:', err));

        response.telegramLink = `https://t.me/NeuroPravo_Bot?start=book_${lead.id}`;
        response.telegramDeliveryToken = telegramToken;
      }
    } else {
      // Non-book research leads: fire-and-forget email as before
      if (channel === 'email') {
        sendBookEmail(email.trim().toLowerCase(), name.trim(), 'bankrotstvo-fizlic.pdf').catch(
          (err) => console.error('📧 Background email failed:', err),
        );
      }
    }

    res.status(201).json(response);
  } catch (err) {
    console.error('POST /leads/research error:', err);
    res.status(500).json({ error: 'Failed to create research lead' });
  }
});

// GET stats for dashboard
router.get('/stats', requireAuth, async (_req, res) => {
  try {
    const exhibition = await query('SELECT COUNT(*) as count FROM exhibition_leads');
    const speakers = await query('SELECT COUNT(*) as count FROM speaker_leads');
    const sponsors = await query('SELECT COUNT(*) as count FROM sponsor_leads');
    const tickets = await query('SELECT COUNT(*) as count FROM ticket_leads');
    const research = await query('SELECT COUNT(*) as count FROM research_leads');
    res.json({
      exhibition: parseInt(exhibition.rows[0].count),
      speakers: parseInt(speakers.rows[0].count),
      sponsors: parseInt(sponsors.rows[0].count),
      tickets: parseInt(tickets.rows[0].count),
      research: parseInt(research.rows[0].count),
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

export default router;
