import { Router } from 'express';
import { query } from '../db.js';

const router = Router();

// GET all leads by type
router.get('/exhibition', async (_req, res) => {
  try {
    const result = await query('SELECT * FROM exhibition_leads ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch exhibition leads' });
  }
});

router.get('/speakers', async (_req, res) => {
  try {
    const result = await query('SELECT * FROM speaker_leads ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch speaker leads' });
  }
});

router.get('/sponsors', async (_req, res) => {
  try {
    const result = await query('SELECT * FROM sponsor_leads ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch sponsor leads' });
  }
});

router.get('/tickets', async (_req, res) => {
  try {
    const result = await query('SELECT * FROM ticket_leads ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch ticket leads' });
  }
});

// POST exhibition lead
router.post('/exhibition', async (req, res) => {
  try {
    const { company_name, contact_person, email, phone, stand_size, notes } = req.body;
    const result = await query(
      `INSERT INTO exhibition_leads (company_name, contact_person, email, phone, stand_size, notes)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [company_name, contact_person, email, phone, stand_size, notes]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create exhibition lead' });
  }
});

// POST speaker lead
router.post('/speakers', async (req, res) => {
  try {
    const { full_name, position, company, email, stream, talk_title, talk_description } = req.body;
    const result = await query(
      `INSERT INTO speaker_leads (full_name, position, company, email, stream, talk_title, talk_description)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [full_name, position, company, email, stream, talk_title, talk_description]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create speaker lead' });
  }
});

// POST sponsor lead
router.post('/sponsors', async (req, res) => {
  try {
    const { company_name, contact_person, email, tier, notes } = req.body;
    const result = await query(
      `INSERT INTO sponsor_leads (company_name, contact_person, email, tier, notes)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [company_name, contact_person, email, tier, notes]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create sponsor lead' });
  }
});

// POST ticket lead
router.post('/tickets', async (req, res) => {
  try {
    const { full_name, email, phone, ticket_type, ticket_price, payment_method } = req.body;
    const result = await query(
      `INSERT INTO ticket_leads (full_name, email, phone, ticket_type, ticket_price, payment_method)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [full_name, email, phone, ticket_type, ticket_price, payment_method]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create ticket lead' });
  }
});

// GET stats for dashboard
router.get('/stats', async (_req, res) => {
  try {
    const exhibition = await query('SELECT COUNT(*) as count FROM exhibition_leads');
    const speakers = await query('SELECT COUNT(*) as count FROM speaker_leads');
    const sponsors = await query('SELECT COUNT(*) as count FROM sponsor_leads');
    const tickets = await query('SELECT COUNT(*) as count FROM ticket_leads');
    res.json({
      exhibition: parseInt(exhibition.rows[0].count),
      speakers: parseInt(speakers.rows[0].count),
      sponsors: parseInt(sponsors.rows[0].count),
      tickets: parseInt(tickets.rows[0].count),
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

export default router;
