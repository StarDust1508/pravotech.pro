import { Router } from 'express';
import { query } from '../db.js';

const router = Router();

// GET all streams
router.get('/', async (req, res) => {
  try {
    const published = req.query.published;
    let sql = 'SELECT * FROM streams';
    if (published === 'true') {
      sql += ' WHERE is_published = true';
    }
    sql += ' ORDER BY display_order ASC';
    const result = await query(sql);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch streams' });
  }
});

// POST create stream
router.post('/', async (req, res) => {
  try {
    const { title, description, icon, display_order, is_highlighted, is_published } = req.body;
    const result = await query(
      `INSERT INTO streams (title, description, icon, display_order, is_highlighted, is_published)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [title, description, icon, display_order ?? 0, is_highlighted ?? false, is_published ?? true]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create stream' });
  }
});

// PUT update stream
router.put('/:id', async (req, res) => {
  try {
    const { title, description, icon, display_order, is_highlighted, is_published } = req.body;
    const result = await query(
      `UPDATE streams SET title=$1, description=$2, icon=$3, display_order=$4,
       is_highlighted=$5, is_published=$6, updated_at=CURRENT_TIMESTAMP
       WHERE id=$7 RETURNING *`,
      [title, description, icon, display_order, is_highlighted, is_published, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Stream not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update stream' });
  }
});

// DELETE stream
router.delete('/:id', async (req, res) => {
  try {
    const result = await query('DELETE FROM streams WHERE id=$1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Stream not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete stream' });
  }
});

export default router;
