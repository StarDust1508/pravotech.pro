import { Router } from 'express';
import { query } from '../db.js';

const router = Router();

// GET all speakers
router.get('/', async (req, res) => {
  try {
    const published = req.query.published;
    let sql = 'SELECT * FROM speakers';
    const params: unknown[] = [];
    if (published === 'true') {
      sql += ' WHERE is_published = true';
    }
    sql += ' ORDER BY display_order ASC, created_at DESC';
    const result = await query(sql, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch speakers' });
  }
});

// GET speaker by id
router.get('/:id', async (req, res) => {
  try {
    const result = await query('SELECT * FROM speakers WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Speaker not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch speaker' });
  }
});

// POST create speaker
router.post('/', async (req, res) => {
  try {
    const { full_name, position, company, bio, photo_url, stream, talk_title, talk_description, display_order, is_published } = req.body;
    const result = await query(
      `INSERT INTO speakers (full_name, position, company, bio, photo_url, stream, talk_title, talk_description, display_order, is_published)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [full_name, position, company, bio, photo_url, stream, talk_title, talk_description, display_order ?? 0, is_published ?? true]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create speaker' });
  }
});

// PUT update speaker
router.put('/:id', async (req, res) => {
  try {
    const { full_name, position, company, bio, photo_url, stream, talk_title, talk_description, display_order, is_published } = req.body;
    const result = await query(
      `UPDATE speakers SET full_name=$1, position=$2, company=$3, bio=$4, photo_url=$5, stream=$6,
       talk_title=$7, talk_description=$8, display_order=$9, is_published=$10, updated_at=CURRENT_TIMESTAMP
       WHERE id=$11 RETURNING *`,
      [full_name, position, company, bio, photo_url, stream, talk_title, talk_description, display_order, is_published, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Speaker not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update speaker' });
  }
});

// PATCH toggle publish
router.patch('/:id/publish', async (req, res) => {
  try {
    const { is_published } = req.body;
    const result = await query(
      'UPDATE speakers SET is_published=$1, updated_at=CURRENT_TIMESTAMP WHERE id=$2 RETURNING *',
      [is_published, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Speaker not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update speaker' });
  }
});

// DELETE speaker
router.delete('/:id', async (req, res) => {
  try {
    const result = await query('DELETE FROM speakers WHERE id=$1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Speaker not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete speaker' });
  }
});

export default router;
