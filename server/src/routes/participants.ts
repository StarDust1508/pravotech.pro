import { Router } from 'express';
import { requireAuth } from './auth.js';
import { query } from '../db.js';

const router = Router();

// GET all participants
router.get('/', async (req, res) => {
  try {
    const published = req.query.published;
    let sql = 'SELECT * FROM participants';
    const params: unknown[] = [];
    if (published === 'true') {
      sql += ' WHERE is_published = true';
    }
    sql += ' ORDER BY display_order ASC, created_at DESC';
    const result = await query(sql, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch participants' });
  }
});

// GET participant by id
router.get('/:id', async (req, res) => {
  try {
    const result = await query('SELECT * FROM participants WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Participant not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch participant' });
  }
});

// POST create participant
router.post('/', requireAuth, async (req, res) => {
  try {
    const { company_name, logo_url, website_url, industry, description, display_order, is_published } = req.body;
    const result = await query(
      `INSERT INTO participants (company_name, logo_url, website_url, industry, description, display_order, is_published)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [company_name, logo_url, website_url, industry, description, display_order ?? 0, is_published ?? true]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create participant' });
  }
});

// PUT update participant
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const { company_name, logo_url, website_url, industry, description, display_order, is_published } = req.body;
    const result = await query(
      `UPDATE participants SET company_name=$1, logo_url=$2, website_url=$3, industry=$4, description=$5,
       display_order=$6, is_published=$7, updated_at=CURRENT_TIMESTAMP
       WHERE id=$8 RETURNING *`,
      [company_name, logo_url, website_url, industry, description, display_order, is_published, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Participant not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update participant' });
  }
});

// PATCH toggle publish
router.patch('/:id/publish', requireAuth, async (req, res) => {
  try {
    const { is_published } = req.body;
    const result = await query(
      'UPDATE participants SET is_published=$1, updated_at=CURRENT_TIMESTAMP WHERE id=$2 RETURNING *',
      [is_published, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Participant not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update participant' });
  }
});

// DELETE participant
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const result = await query('DELETE FROM participants WHERE id=$1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Participant not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete participant' });
  }
});

export default router;