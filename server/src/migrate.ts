import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { query } from './db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const migrationsDir = path.resolve(__dirname, '../../migrations');

async function ensureMigrationsTable() {
  await query(`
    CREATE TABLE IF NOT EXISTS _migrations (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) UNIQUE NOT NULL,
      executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

async function getExecutedMigrations(): Promise<string[]> {
  const result = await query('SELECT name FROM _migrations ORDER BY id');
  return result.rows.map((r: { name: string }) => r.name);
}

async function ensureSchema() {
  // Создаём целевую схему, чтобы таблицы не уехали в public на чистой БД.
  const schema = (process.env.DATABASE_SCHEMA || 'pravo').replace(/[^a-zA-Z0-9_]/g, '');
  await query(`CREATE SCHEMA IF NOT EXISTS ${schema}`);
}

async function runMigrations(includeSeed: boolean) {
  await ensureSchema();
  await ensureMigrationsTable();
  const executed = await getExecutedMigrations();

  const files = fs.readdirSync(migrationsDir)
    .filter(f => f.endsWith('.sql'))
    .filter(f => includeSeed || !f.includes('seed'))
    .sort();

  for (const file of files) {
    if (executed.includes(file)) {
      console.log(`⏭ Skipping ${file} (already executed)`);
      continue;
    }

    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf-8');
    console.log(`▶ Running ${file}...`);
    await query(sql);
    await query('INSERT INTO _migrations (name) VALUES ($1)', [file]);
    console.log(`✅ ${file} executed`);
  }

  console.log('🎉 Migrations complete!');
}

const includeSeed = process.argv.includes('--seed');
runMigrations(includeSeed).catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
