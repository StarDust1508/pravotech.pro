import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const pool = new pg.Pool({
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  database: process.env.DATABASE_NAME || 'bankruptcy_academy',
  user: process.env.DATABASE_USER || 'ba_app',
  password: process.env.DATABASE_PASSWORD || '',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

const SCHEMA = process.env.DATABASE_SCHEMA || 'pravo';

// Set search_path on every connection
pool.on('connect', (client) => {
  client.query(`SET search_path TO ${SCHEMA}, public`);
});

export async function query(text: string, params?: unknown[]) {
  const client = await pool.connect();
  try {
    await client.query(`SET search_path TO ${SCHEMA}, public`);
    return await client.query(text, params);
  } finally {
    client.release();
  }
}

export async function testConnection(): Promise<boolean> {
  try {
    await query('SELECT 1');
    return true;
  } catch {
    return false;
  }
}

export default pool;
