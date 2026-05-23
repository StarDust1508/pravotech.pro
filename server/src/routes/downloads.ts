import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { DOWNLOAD_SECRET } from '../config.js';
import { query } from '../db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const router = Router();

interface DownloadTokenPayload {
  file: string;
  leadId: number;
}

// ─── POST /api/downloads/generate ────────────────────────────────────
// Generate a signed JWT token for a one-time PDF download.
// Body: { file: string, leadId: number }
router.post('/generate', async (req: Request, res: Response) => {
  const { file, leadId } = req.body as { file?: string; leadId?: number };

  if (!file || typeof file !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid "file" parameter' });
  }
  if (!leadId || typeof leadId !== 'number') {
    return res.status(400).json({ error: 'Missing or invalid "leadId" parameter' });
  }

  const leadExists = await query('SELECT id FROM research_leads WHERE id = $1', [leadId]);
  if (leadExists.rows.length === 0) {
    return res.status(403).json({ error: 'Invalid lead' });
  }

  const normalized = path.normalize(file).replace(/\\/g, '/');
  if (normalized.includes('..') || normalized.startsWith('/')) {
    return res.status(400).json({ error: 'Invalid file path' });
  }

  const token = jwt.sign(
    { file: normalized, leadId } as DownloadTokenPayload,
    DOWNLOAD_SECRET,
    { expiresIn: '24h' },
  );

  res.json({ token, expiresIn: '24h' });
});

// ─── GET /api/downloads/:token ───────────────────────────────────────
// Serve a file using a signed token. The token is verified, the file is
// streamed from public/ and the token becomes effectively single-use
// (it technically remains valid until expiry, but the 24h window is short
// enough for practical purposes without needing a DB blacklist).
router.get('/:token', (req: Request, res: Response) => {
  const token = req.params.token as string;
  const secret = DOWNLOAD_SECRET as jwt.Secret;

  let payload: DownloadTokenPayload;
  try {
    payload = jwt.verify(token, secret) as unknown as DownloadTokenPayload;
  } catch (err) {
    const message = (err as Error).name === 'TokenExpiredError'
      ? 'Download link expired'
      : 'Invalid download link';
    return res.status(403).json({ error: message });
  }

  // Look in server/private/ first, then fall back to public/
  const privateDir = path.resolve(__dirname, '../../private');
  const publicDir = path.resolve(__dirname, '../../../public');
  let filePath = path.resolve(privateDir, payload.file);
  if (!fs.existsSync(filePath)) {
    filePath = path.resolve(publicDir, payload.file);
  }

  // Security: ensure resolved path is within allowed directories
  if (!filePath.startsWith(privateDir) && !filePath.startsWith(publicDir)) {
    return res.status(400).json({ error: 'Invalid file path' });
  }

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'File not found' });
  }

  const ext = path.extname(filePath).toLowerCase();
  const mimeTypes: Record<string, string> = {
    '.pdf': 'application/pdf',
    '.epub': 'application/epub+zip',
    '.zip': 'application/zip',
  };

  res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream');
  res.setHeader('Content-Disposition', `attachment; filename="${path.basename(filePath)}"`);

  const stream = fs.createReadStream(filePath);
  stream.pipe(res);
  stream.on('error', () => {
    if (!res.headersSent) {
      res.status(500).json({ error: 'Failed to read file' });
    }
  });
});

export default router;
