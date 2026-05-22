import { Router } from 'express';
import { rateLimit } from '../middleware/rate-limit.js';
import { query } from '../db.js';

const router = Router();

// Public rate limit: 20 requests per minute per IP
const profileLimit = rateLimit(20, 60_000);

// GET profile by device_id
router.get('/', profileLimit, async (req, res) => {
  const deviceId = req.query.device_id;
  if (!deviceId || typeof deviceId !== 'string') {
    return res.status(400).json({ error: 'device_id required' });
  }

  // Validate UUID format
  const uuidRe = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRe.test(deviceId)) {
    return res.status(400).json({ error: 'Invalid device_id format' });
  }

  try {
    const result = await query(
      'SELECT name, email, phone FROM user_profiles WHERE device_id = $1',
      [deviceId]
    );
    if (result.rows.length === 0) {
      return res.json({ name: '', email: '', phone: '' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Failed to fetch user profile:', err);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// POST — create or update profile (upsert)
router.post('/', profileLimit, async (req, res) => {
  const { device_id, name, email, phone } = req.body;

  if (!device_id || typeof device_id !== 'string') {
    return res.status(400).json({ error: 'device_id required' });
  }

  const uuidRe = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRe.test(device_id)) {
    return res.status(400).json({ error: 'Invalid device_id format' });
  }

  // Sanitize inputs
  const safeName = (typeof name === 'string' ? name : '').trim().slice(0, 200);
  const safeEmail = (typeof email === 'string' ? email : '').trim().slice(0, 320);
  const safePhone = (typeof phone === 'string' ? phone : '').trim().slice(0, 30);

  try {
    const result = await query(
      `INSERT INTO user_profiles (device_id, name, email, phone, updated_at)
       VALUES ($1, $2, $3, $4, NOW())
       ON CONFLICT (device_id)
       DO UPDATE SET name = $2, email = $3, phone = $4, updated_at = NOW()
       RETURNING name, email, phone`,
      [device_id, safeName, safeEmail, safePhone]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Failed to save user profile:', err);
    res.status(500).json({ error: 'Failed to save profile' });
  }
});

export default router;
