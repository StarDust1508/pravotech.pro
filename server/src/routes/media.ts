import { Router } from 'express';
import { requireAuth } from './auth.js';
import multer from 'multer';
import { query } from '../db.js';

const allowedMimes = [
  'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'image/avif',
  // Документы отчётов (PDF). Раздаются через /api/media/file/:id.
  'application/pdf',
];

// Memory storage — файл остаётся в буфере, затем сохраняется в PostgreSQL
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760') },
  fileFilter: (_req, file, cb) => {
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Unsupported file type'));
    }
  },
});

const router = Router();

// GET all media (без бинарных данных — только метаданные)
router.get('/', async (_req, res) => {
  try {
    const result = await query(
      'SELECT id, file_name, file_url, file_type, file_size, created_at FROM media ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch media' });
  }
});

// GET file binary by id — отдаёт файл из PostgreSQL
router.get('/file/:id', async (req, res) => {
  try {
    const result = await query(
      'SELECT file_name, file_type, file_data FROM media WHERE id = $1',
      [req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'File not found' });

    const { file_name, file_type, file_data } = result.rows[0];
    if (!file_data) return res.status(404).json({ error: 'File data not available' });

    res.set({
      'Content-Type': file_type || 'application/octet-stream',
      'Content-Disposition': `inline; filename="${encodeURIComponent(file_name)}"`,
      'Cache-Control': 'public, max-age=31536000, immutable',
      'X-Content-Type-Options': 'nosniff',
    });
    res.send(file_data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to serve file' });
  }
});

// POST upload file — сохраняет в PostgreSQL
router.post('/upload', requireAuth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file provided' });

    const result = await query(
      `INSERT INTO media (file_name, file_url, file_type, file_size, file_data)
       VALUES ($1, '', $2, $3, $4) RETURNING id, file_name, file_url, file_type, file_size, created_at`,
      [req.file.originalname, req.file.mimetype, req.file.size, req.file.buffer]
    );

    const row = result.rows[0];
    // Ставим URL, указывающий на serve-эндпоинт
    const fileUrl = `/api/media/file/${row.id}`;
    await query('UPDATE media SET file_url = $1 WHERE id = $2', [fileUrl, row.id]);
    row.file_url = fileUrl;

    res.status(201).json(row);
  } catch (err) {
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

// POST upload to path (simpler response) — тоже через PostgreSQL
router.post('/upload-to-path', requireAuth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file provided' });

    const result = await query(
      `INSERT INTO media (file_name, file_url, file_type, file_size, file_data)
       VALUES ($1, '', $2, $3, $4) RETURNING id`,
      [req.file.originalname, req.file.mimetype, req.file.size, req.file.buffer]
    );

    const id = result.rows[0].id;
    const publicUrl = `/api/media/file/${id}`;
    await query('UPDATE media SET file_url = $1 WHERE id = $2', [publicUrl, id]);

    res.json({ publicUrl, filename: req.file.originalname });
  } catch (err) {
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

// DELETE media (удаляет запись из БД, файл хранится в БД — удалится вместе с записью)
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const result = await query('DELETE FROM media WHERE id=$1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Media not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete media' });
  }
});

export default router;
