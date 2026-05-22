import { Router } from 'express';
import { requireAuth } from './auth.js';
import { query } from '../db.js';

const router = Router();

// GET all settings
router.get('/', async (_req, res) => {
  try {
    const result = await query('SELECT * FROM site_settings ORDER BY setting_key');
    const settings: Record<string, string> = {};
    result.rows.forEach((row: any) => {
      settings[row.setting_key] = row.setting_value;
    });
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// PUT upsert setting
router.put('/:key', requireAuth, async (req, res) => {
  try {
    const { value } = req.body;
    const result = await query(
      `INSERT INTO site_settings (setting_key, setting_value, updated_at)
       VALUES ($1, $2, CURRENT_TIMESTAMP)
       ON CONFLICT (setting_key) DO UPDATE SET setting_value=$2, updated_at=CURRENT_TIMESTAMP
       RETURNING *`,
      [req.params.key, value]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update setting' });
  }
});

export default router;
