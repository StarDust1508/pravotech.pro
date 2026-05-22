import { Router } from 'express';
import { query } from '../db.js';
import { requireAuth } from './auth.js';

const router = Router();

// Белый список колонок (имена не берутся из произвольных ключей запроса —
// защита от SQL-инъекции через имя поля).
const EDITABLE_COLUMNS = [
  'slug',
  'title',
  'description',
  'category',
  'icon',
  'accent',
  'intro',
  'items',
  'pdf_url',
  'display_order',
  'is_published',
] as const;

type EditableColumn = (typeof EDITABLE_COLUMNS)[number];

// JSONB-колонки: объект сериализуем перед записью.
const JSON_COLUMNS: EditableColumn[] = ['items'];

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

// ---------- PUBLIC ----------

router.get('/', async (req, res) => {
  try {
    const showAll = req.query.all === 'true';
    const whereClause = showAll ? '' : 'WHERE is_published = true';
    const result = await query(
      `SELECT id, slug, title, description, category, icon, accent,
              intro, items, pdf_url, display_order, is_published, created_at, updated_at
       FROM checklists ${whereClause}
       ORDER BY display_order, created_at`
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Checklists error:', err);
    res.status(500).json({ error: 'Failed to fetch checklists' });
  }
});

router.get('/:slug', async (req, res) => {
  try {
    const result = await query(
      `SELECT * FROM checklists WHERE slug = $1 AND is_published = true LIMIT 1`,
      [req.params.slug]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Checklist not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Checklist error:', err);
    res.status(500).json({ error: 'Failed to fetch checklist' });
  }
});

// ---------- ADMIN (protected) ----------

router.post('/', requireAuth, async (req, res) => {
  try {
    const data = pickEditable(req.body || {});
    if (!data.slug || !data.title) {
      return res.status(400).json({ error: 'slug and title are required' });
    }
    const cols = Object.keys(data) as EditableColumn[];
    const placeholders = cols.map((_, i) => `$${i + 1}`);
    const values = cols.map((c) => data[c]);
    const result = await query(
      `INSERT INTO checklists (${cols.join(', ')}) VALUES (${placeholders.join(', ')}) RETURNING *`,
      values
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Create checklist error:', err);
    res.status(500).json({ error: 'Failed to create checklist' });
  }
});

router.put('/:id', requireAuth, async (req, res) => {
  try {
    const data = pickEditable(req.body || {});
    const cols = Object.keys(data) as EditableColumn[];
    if (cols.length === 0) {
      return res.status(400).json({ error: 'No editable fields to update' });
    }
    const setClauses = cols.map((col, i) => `${col} = $${i + 1}`);
    const values = cols.map((col) => data[col]);
    const result = await query(
      `UPDATE checklists SET ${setClauses.join(', ')}, updated_at = NOW()
       WHERE id = $${cols.length + 1} RETURNING *`,
      [...values, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Checklist not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Update checklist error:', err);
    res.status(500).json({ error: 'Failed to update checklist' });
  }
});

router.patch('/:id/publish', requireAuth, async (req, res) => {
  try {
    const { is_published } = req.body;
    if (typeof is_published !== 'boolean') {
      return res.status(400).json({ error: 'is_published must be a boolean' });
    }
    const result = await query(
      `UPDATE checklists SET is_published = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
      [is_published, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Checklist not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Toggle checklist publish error:', err);
    res.status(500).json({ error: 'Failed to toggle publish' });
  }
});

router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const result = await query('DELETE FROM checklists WHERE id = $1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Checklist not found' });
    }
    res.json({ success: true, id: result.rows[0].id });
  } catch (err) {
    console.error('Delete checklist error:', err);
    res.status(500).json({ error: 'Failed to delete checklist' });
  }
});

export default router;
