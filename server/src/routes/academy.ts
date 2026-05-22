import { Router } from 'express';
import { requireAuth } from './auth.js';
import { rateLimit } from '../middleware/rate-limit.js';
import { query } from '../db.js';

// Академия использует общий пул из db.ts. search_path = "pravo, public",
// поэтому таблицы Академии (в public) и research_leads (в pravo) доступны
// через один и тот же query() — отдельный пул больше не нужен.

const router = Router();

const COURSE_EDITABLE: ReadonlySet<string> = new Set([
  'slug', 'title', 'description', 'hero_title', 'hero_subtitle',
  'price', 'level', 'display_order', 'is_published',
  'duration', 'lectures_count', 'practice_hours', 'certificate',
  'skills', 'target_audience', 'program', 'format_details',
  'hero_image_url', 'og_image_url',
]);

const TEACHER_EDITABLE: ReadonlySet<string> = new Set([
  'full_name', 'position', 'bio', 'expertise', 'experience',
  'photo_url', 'display_order', 'is_published',
]);

const REVIEW_EDITABLE: ReadonlySet<string> = new Set([
  'author_name', 'rating', 'comment',
  'author_avatar_url', 'review_image_url', 'review_video_url',
  'course_id', 'page_type', 'page_id', 'is_published',
]);

const COURSE_JSON_FIELDS: ReadonlySet<string> = new Set([
  'skills', 'target_audience', 'program', 'format_details',
]);

function pickEditable(body: Record<string, unknown>, allowed: ReadonlySet<string>) {
  const keys = Object.keys(body).filter(k => allowed.has(k));
  return { keys, values: keys.map(k => body[k]) };
}

// GET courses (published by default, all with ?all=true)
router.get('/courses', async (req, res) => {
  try {
    const showAll = req.query.all === 'true';
    const whereClause = showAll ? '' : 'WHERE is_published = true';
    const result = await query(
      `SELECT id, slug, title, description, hero_title, hero_subtitle, price, level, display_order, is_published
       FROM courses ${whereClause} ORDER BY display_order, created_at`
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Academy courses error:', err);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

// GET single course by slug (full data)
router.get('/courses/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const result = await query(
      `SELECT * FROM courses WHERE slug = $1 AND is_published = true LIMIT 1`,
      [slug]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Academy course error:', err);
    res.status(500).json({ error: 'Failed to fetch course' });
  }
});

// GET teachers (published by default, all with ?all=true)
router.get('/teachers', async (req, res) => {
  try {
    const showAll = req.query.all === 'true';
    const whereClause = showAll ? '' : 'WHERE is_published = true';
    const result = await query(
      `SELECT id, full_name, position, bio, expertise, experience, photo_url, display_order, is_published
       FROM teachers ${whereClause} ORDER BY display_order`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch teachers' });
  }
});

// GET reviews (published by default, all with ?all=true; optionally by course_id)
router.get('/reviews', async (req, res) => {
  try {
    const { course_id } = req.query;
    const showAll = req.query.all === 'true';
    let sql = 'SELECT * FROM reviews';
    const conditions: string[] = [];
    const params: unknown[] = [];
    if (!showAll) {
      conditions.push('is_published = true');
    }
    if (course_id) {
      params.push(course_id);
      conditions.push(`course_id = $${params.length}`);
    }
    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }
    sql += ' ORDER BY created_at DESC';
    const result = await query(sql, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// POST course registration lead
router.post('/register', rateLimit(10, 60_000), async (req, res) => {
  try {
    const { name, phone, email, course_id, course_title } = req.body;
    // research_leads в схеме pravo — доступна через общий пул (search_path pravo, public)
    const result = await query(
      `INSERT INTO research_leads (name, email, phone, research_id, research_title, source_form)
       VALUES ($1, $2, $3, $4, $5, 'academy_course') RETURNING *`,
      [name, email, phone, course_id || 'general', course_title || 'Курс Академии']
    );
    return res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Academy register error:', err);
    res.status(500).json({ error: 'Failed to register' });
  }
});

// =============================================
// ADMIN CRUD: Courses
// =============================================

// POST create course
router.post('/courses', requireAuth, async (req, res) => {
  try {
    const {
      slug, title, description, hero_title, hero_subtitle,
      price, level, display_order, is_published,
      duration, lectures_count, practice_hours, certificate,
      skills, target_audience, program, format_details,
      hero_image_url, og_image_url
    } = req.body;

    const result = await query(
      `INSERT INTO courses (
        slug, title, description, hero_title, hero_subtitle,
        price, level, display_order, is_published,
        duration, lectures_count, practice_hours, certificate,
        skills, target_audience, program, format_details,
        hero_image_url, og_image_url
      ) VALUES (
        $1, $2, $3, $4, $5,
        $6, $7, $8, $9,
        $10, $11, $12, $13,
        $14, $15, $16, $17,
        $18, $19
      ) RETURNING *`,
      [
        slug, title, description, hero_title, hero_subtitle,
        price, level, display_order ?? 0, is_published ?? false,
        duration, lectures_count, practice_hours, certificate,
        skills ? JSON.stringify(skills) : null,
        target_audience ? JSON.stringify(target_audience) : null,
        program ? JSON.stringify(program) : null,
        format_details ? JSON.stringify(format_details) : null,
        hero_image_url, og_image_url
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Create course error:', err);
    res.status(500).json({ error: 'Failed to create course' });
  }
});

// PUT update course
router.put('/courses/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { keys, values } = pickEditable(req.body, COURSE_EDITABLE);

    if (keys.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    const setClauses = keys.map((key, i) => `${key} = $${i + 1}`);
    const serialized = values.map((v, i) =>
      COURSE_JSON_FIELDS.has(keys[i]) && typeof v === 'object'
        ? JSON.stringify(v)
        : v
    );

    const result = await query(
      `UPDATE courses SET ${setClauses.join(', ')}, updated_at = NOW()
       WHERE id = $${keys.length + 1} RETURNING *`,
      [...serialized, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Update course error:', err);
    res.status(500).json({ error: 'Failed to update course' });
  }
});

// DELETE course
router.delete('/courses/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query(
      'DELETE FROM courses WHERE id = $1 RETURNING id',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.json({ success: true, id: result.rows[0].id });
  } catch (err) {
    console.error('Delete course error:', err);
    res.status(500).json({ error: 'Failed to delete course' });
  }
});

// PATCH toggle course publish
router.patch('/courses/:id/publish', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { is_published } = req.body;

    if (typeof is_published !== 'boolean') {
      return res.status(400).json({ error: 'is_published must be a boolean' });
    }

    const result = await query(
      `UPDATE courses SET is_published = $1, updated_at = NOW()
       WHERE id = $2 RETURNING *`,
      [is_published, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Toggle course publish error:', err);
    res.status(500).json({ error: 'Failed to toggle course publish' });
  }
});

// =============================================
// ADMIN CRUD: Teachers
// =============================================

// POST create teacher
router.post('/teachers', requireAuth, async (req, res) => {
  try {
    const {
      full_name, position, bio, expertise, experience,
      photo_url, display_order, is_published
    } = req.body;

    const result = await query(
      `INSERT INTO teachers (
        full_name, position, bio, expertise, experience,
        photo_url, display_order, is_published
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *`,
      [
        full_name, position, bio, expertise, experience,
        photo_url, display_order ?? 0, is_published ?? false
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Create teacher error:', err);
    res.status(500).json({ error: 'Failed to create teacher' });
  }
});

// PUT update teacher
router.put('/teachers/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { keys, values } = pickEditable(req.body, TEACHER_EDITABLE);

    if (keys.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    const setClauses = keys.map((key, i) => `${key} = $${i + 1}`);

    const result = await query(
      `UPDATE teachers SET ${setClauses.join(', ')}
       WHERE id = $${keys.length + 1} RETURNING *`,
      [...values, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Teacher not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Update teacher error:', err);
    res.status(500).json({ error: 'Failed to update teacher' });
  }
});

// DELETE teacher
router.delete('/teachers/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query(
      'DELETE FROM teachers WHERE id = $1 RETURNING id',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Teacher not found' });
    }
    res.json({ success: true, id: result.rows[0].id });
  } catch (err) {
    console.error('Delete teacher error:', err);
    res.status(500).json({ error: 'Failed to delete teacher' });
  }
});

// PATCH toggle teacher publish
router.patch('/teachers/:id/publish', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { is_published } = req.body;

    if (typeof is_published !== 'boolean') {
      return res.status(400).json({ error: 'is_published must be a boolean' });
    }

    const result = await query(
      `UPDATE teachers SET is_published = $1
       WHERE id = $2 RETURNING *`,
      [is_published, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Teacher not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Toggle teacher publish error:', err);
    res.status(500).json({ error: 'Failed to toggle teacher publish' });
  }
});

// =============================================
// ADMIN CRUD: Reviews
// =============================================

// POST create review
router.post('/reviews', requireAuth, async (req, res) => {
  try {
    const {
      author_name, rating, comment,
      author_avatar_url, review_image_url, review_video_url,
      course_id, page_type, page_id, is_published
    } = req.body;

    const result = await query(
      `INSERT INTO reviews (
        author_name, rating, comment,
        author_avatar_url, review_image_url, review_video_url,
        course_id, page_type, page_id, is_published
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *`,
      [
        author_name, rating, comment,
        author_avatar_url, review_image_url, review_video_url,
        course_id, page_type, page_id, is_published ?? false
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Create review error:', err);
    res.status(500).json({ error: 'Failed to create review' });
  }
});

// PUT update review
router.put('/reviews/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { keys, values } = pickEditable(req.body, REVIEW_EDITABLE);

    if (keys.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    const setClauses = keys.map((key, i) => `${key} = $${i + 1}`);

    const result = await query(
      `UPDATE reviews SET ${setClauses.join(', ')}
       WHERE id = $${keys.length + 1} RETURNING *`,
      [...values, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Review not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Update review error:', err);
    res.status(500).json({ error: 'Failed to update review' });
  }
});

// DELETE review
router.delete('/reviews/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query(
      'DELETE FROM reviews WHERE id = $1 RETURNING id',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Review not found' });
    }
    res.json({ success: true, id: result.rows[0].id });
  } catch (err) {
    console.error('Delete review error:', err);
    res.status(500).json({ error: 'Failed to delete review' });
  }
});

// PATCH toggle review publish
router.patch('/reviews/:id/publish', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { is_published } = req.body;

    if (typeof is_published !== 'boolean') {
      return res.status(400).json({ error: 'is_published must be a boolean' });
    }

    const result = await query(
      `UPDATE reviews SET is_published = $1
       WHERE id = $2 RETURNING *`,
      [is_published, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Review not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Toggle review publish error:', err);
    res.status(500).json({ error: 'Failed to toggle review publish' });
  }
});

export default router;
