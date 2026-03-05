import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const DB_HOST = process.env.DATABASE_HOST || '5.42.110.182';
const DB_PORT = parseInt(process.env.DATABASE_PORT || '5432');
const DB_NAME = process.env.DATABASE_NAME || 'bankruptcy_academy';
const DB_USER = process.env.DATABASE_USER || 'ba_app';
const DB_PASS = process.env.DATABASE_PASSWORD || '';
const SCHEMA = process.env.DATABASE_SCHEMA || 'pravo';

async function setupDatabase() {
  console.log(`🔌 Connecting to ${DB_NAME} on ${DB_HOST} as ${DB_USER}...`);

  const pool = new pg.Pool({
    host: DB_HOST,
    port: DB_PORT,
    database: DB_NAME,
    user: DB_USER,
    password: DB_PASS,
    max: 2,
    connectionTimeoutMillis: 10000,
  });

  try {
    const client = await pool.connect();
    console.log('✅ Connected to PostgreSQL');

    // Step 1: Create schema
    console.log(`\n📂 Creating schema "${SCHEMA}"...`);
    await client.query(`CREATE SCHEMA IF NOT EXISTS ${SCHEMA}`);
    console.log(`✅ Schema "${SCHEMA}" ready`);

    // Set search_path
    await client.query(`SET search_path TO ${SCHEMA}, public`);

    // Step 2: Ensure migrations table
    await client.query(`
      CREATE TABLE IF NOT EXISTS ${SCHEMA}._migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Step 3: Get already executed migrations
    const executed = await client.query(`SELECT name FROM ${SCHEMA}._migrations ORDER BY id`);
    const executedNames = executed.rows.map(r => r.name);

    // Step 4: Read and run migration files
    const migrationsDir = path.resolve(__dirname, '../../migrations');
    const files = fs.readdirSync(migrationsDir)
      .filter(f => f.endsWith('.sql'))
      .sort();

    for (const file of files) {
      if (executedNames.includes(file)) {
        console.log(`⏭  Skipping ${file} (already executed)`);
        continue;
      }

      let sql = fs.readFileSync(path.join(migrationsDir, file), 'utf-8');

      // Skip _migrations table creation in SQL (we already created it above)
      sql = sql.replace(/CREATE TABLE IF NOT EXISTS _migrations[\s\S]*?\);/g, '');

      console.log(`▶  Running ${file}...`);

      try {
        await client.query(sql);
        await client.query(`INSERT INTO ${SCHEMA}._migrations (name) VALUES ($1)`, [file]);
        console.log(`✅ ${file} executed successfully`);
      } catch (migErr) {
        console.error(`❌ Error in ${file}:`, migErr.message);
        throw migErr;
      }
    }

    console.log('\n🎉 All migrations complete!');

    // Step 5: Verify tables
    const tables = await client.query(`
      SELECT table_name FROM information_schema.tables
      WHERE table_schema = $1 ORDER BY table_name
    `, [SCHEMA]);
    console.log(`\n📋 Tables in schema "${SCHEMA}":`);
    tables.rows.forEach(r => console.log(`   • ${r.table_name}`));

    client.release();
    await pool.end();
  } catch (err) {
    console.error('❌ Error:', err.message);
    await pool.end();
    throw err;
  }
}

setupDatabase().then(() => {
  console.log('\n✨ Setup complete!');
  process.exit(0);
}).catch(err => {
  console.error('\n💥 Failed:', err.message);
  process.exit(1);
});
