import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required. Set it in .env');
}

export const JWT_SECRET: string = process.env.JWT_SECRET;
export const JWT_EXPIRES_IN = '30d';

export const DOWNLOAD_SECRET: string = process.env.DOWNLOAD_SECRET || process.env.ADMIN_PASSWORD || (() => {
  throw new Error('DOWNLOAD_SECRET or ADMIN_PASSWORD environment variable is required');
})();

export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

export function sanitizeSchemaName(name: string): string {
  const sanitized = name.replace(/[^a-zA-Z0-9_]/g, '');
  if (!sanitized) throw new Error('DATABASE_SCHEMA cannot be empty');
  return sanitized;
}
