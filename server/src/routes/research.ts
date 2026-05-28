import { Router } from 'express';
import { query } from '../db.js';
import { requireAuth } from './auth.js';

const router = Router();

// Белый список колонок, которые можно создавать/менять.
// Имена колонок НЕ берутся из произвольных ключей запроса —
// это защищает от SQL-инъекции через имя поля.
const EDITABLE_COLUMNS = [
  'slug',
  'title',
  'description',
  'category',
  'icon',
  'accent',
  'summary',
  'cover_image_url',
  'pdf_url',
  'pdf_media_id',
  'charts',
  'is_free',
  'price',
  'rating',
  'rating_count',
  'display_order',
  'is_published',
] as const;

type EditableColumn = (typeof EDITABLE_COLUMNS)[number];

// Колонки с типом JSONB — объект нужно сериализовать перед записью (node-pg
// не делает это автоматически).
const JSON_COLUMNS: EditableColumn[] = ['charts'];

function pickEditable(body: Record<string, unknown>): Record<EditableColumn, unknown> {
  const out = {} as Record<EditableColumn, unknown>;
  for (const key of EDITABLE_COLUMNS) {
    if (key in body) {
      const value = body[key];
      out[key] =
        JSON_COLUMNS.includes(key) && value !== null && typeof value === 'object'
          ? JSON.stringify(value)
          : value;
    }
  }
  return out;
}

// =============================================
// PUBLIC
// =============================================

// GET reports (published by default, all with ?all=true)
router.get('/reports', async (req, res) => {
  try {
    const showAll = req.query.all === 'true';
    const whereClause = showAll ? '' : 'WHERE is_published = true';
    const result = await query(
      `SELECT id, slug, title, description, category, icon, accent,
              summary, cover_image_url, pdf_url, pdf_media_id,
              is_free, price, rating, rating_count,
              display_order, is_published, created_at, updated_at
       FROM research_reports ${whereClause}
       ORDER BY display_order, created_at`
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Research reports error:', err);
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
});

// GET single report by slug (published only)
router.get('/reports/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const result = await query(
      `SELECT * FROM research_reports WHERE slug = $1 AND is_published = true LIMIT 1`,
      [slug]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Report not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Research report error:', err);
    res.status(500).json({ error: 'Failed to fetch report' });
  }
});

// =============================================
// ADMIN CRUD (protected)
// =============================================

// POST create report
router.post('/reports', requireAuth, async (req, res) => {
  try {
    const data = pickEditable(req.body || {});
    if (!data.slug || !data.title) {
      return res.status(400).json({ error: 'slug and title are required' });
    }
    const cols = Object.keys(data) as EditableColumn[];
    const placeholders = cols.map((_, i) => `$${i + 1}`);
    const values = cols.map((c) => data[c]);

    const result = await query(
      `INSERT INTO research_reports (${cols.join(', ')})
       VALUES (${placeholders.join(', ')})
       RETURNING *`,
      values
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Create report error:', err);
    res.status(500).json({ error: 'Failed to create report' });
  }
});

// PUT update report
router.put('/reports/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const data = pickEditable(req.body || {});
    const cols = Object.keys(data) as EditableColumn[];

    if (cols.length === 0) {
      return res.status(400).json({ error: 'No editable fields to update' });
    }

    const setClauses = cols.map((col, i) => `${col} = $${i + 1}`);
    const values = cols.map((col) => data[col]);

    const result = await query(
      `UPDATE research_reports SET ${setClauses.join(', ')}, updated_at = NOW()
       WHERE id = $${cols.length + 1} RETURNING *`,
      [...values, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Report not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Update report error:', err);
    res.status(500).json({ error: 'Failed to update report' });
  }
});

// PATCH toggle publish
router.patch('/reports/:id/publish', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { is_published } = req.body;

    if (typeof is_published !== 'boolean') {
      return res.status(400).json({ error: 'is_published must be a boolean' });
    }

    const result = await query(
      `UPDATE research_reports SET is_published = $1, updated_at = NOW()
       WHERE id = $2 RETURNING *`,
      [is_published, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Report not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Toggle report publish error:', err);
    res.status(500).json({ error: 'Failed to toggle report publish' });
  }
});

// DELETE report
router.delete('/reports/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query(
      'DELETE FROM research_reports WHERE id = $1 RETURNING id',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Report not found' });
    }
    res.json({ success: true, id: result.rows[0].id });
  } catch (err) {
    console.error('Delete report error:', err);
    res.status(500).json({ error: 'Failed to delete report' });
  }
});

export default router;
