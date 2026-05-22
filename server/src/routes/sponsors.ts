import { Router } from 'express';
import { requireAuth } from './auth.js';
import { query } from '../db.js';

const router = Router();

// GET all sponsors
router.get('/', async (req, res) => {
  try {
    const published = req.query.published;
    let sql = 'SELECT * FROM sponsors';
    if (published === 'true') {
      sql += ' WHERE is_published = true';
    }
    sql += ' ORDER BY display_order ASC';
    const result = await query(sql);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch sponsors' });
  }
});

// GET sponsor tiers with perks
router.get('/tiers', async (_req, res) => {
  try {
    const tiers = await query('SELECT * FROM sponsor_tiers ORDER BY display_order ASC');
    const perks = await query('SELECT * FROM sponsor_tier_perks ORDER BY display_order ASC');
    const result = tiers.rows.map((tier: any) => ({
      ...tier,
      perks: perks.rows.filter((p: any) => p.tier_id === tier.id).map((p: any) => p.perk_text),
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tiers' });
  }
});

// POST create sponsor
router.post('/', requireAuth, async (req, res) => {
  try {
    const { company_name, logo_url, website_url, tier, display_order, is_published } = req.body;
    const result = await query(
      `INSERT INTO sponsors (company_name, logo_url, website_url, tier, display_order, is_published)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [company_name, logo_url, website_url, tier ?? 'silver', display_order ?? 0, is_published ?? true]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create sponsor' });
  }
});

// PUT update sponsor
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const { company_name, logo_url, website_url, tier, display_order, is_published } = req.body;
    const result = await query(
      `UPDATE sponsors SET company_name=$1, logo_url=$2, website_url=$3, tier=$4,
       display_order=$5, is_published=$6, updated_at=CURRENT_TIMESTAMP
       WHERE id=$7 RETURNING *`,
      [company_name, logo_url, website_url, tier, display_order, is_published, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Sponsor not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update sponsor' });
  }
});

// PUT update tier
router.put('/tiers/:id', requireAuth, async (req, res) => {
  try {
    const { name, price, icon, perks } = req.body;
    const result = await query(
      `UPDATE sponsor_tiers SET name=$1, price=$2, icon=$3, updated_at=CURRENT_TIMESTAMP WHERE id=$4 RETURNING *`,
      [name, price, icon, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Tier not found' });

    // Update perks
    if (Array.isArray(perks)) {
      await query('DELETE FROM sponsor_tier_perks WHERE tier_id=$1', [req.params.id]);
      for (let i = 0; i < perks.length; i++) {
        await query(
          'INSERT INTO sponsor_tier_perks (tier_id, perk_text, display_order) VALUES ($1, $2, $3)',
          [req.params.id, perks[i], i]
        );
      }
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update tier' });
  }
});

// DELETE sponsor
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const result = await query('DELETE FROM sponsors WHERE id=$1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Sponsor not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete sponsor' });
  }
});

export default router;
