import fs from 'fs';
import path from 'path';
import { Pool } from 'pg';

const migrationFile = path.join(process.cwd(), 'src', 'database', 'migrations', 'create_users_table.sql');
const sql = fs.readFileSync(migrationFile, 'utf8');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'healthcare',
  user: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres'
});

async function runMigration() {
  try {
    await pool.query(sql);
    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Error running migration:', error);
  } finally {
    await pool.end();
  }
}

runMigration();
