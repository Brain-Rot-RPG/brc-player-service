import dotenv from 'dotenv';
import { Pool } from 'pg';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

console.log('🔧 Database configuration:', {
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT,
});

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: Number(process.env.PGPORT),
});

async function verifyConnection(): Promise<void> {
  try {
    const client = await pool.connect();
    console.log('✅ Connected to PostgreSQL database');
    client.release();
  } catch (error) {
    console.error('❌ Error connecting to the database:', error);
  }
}

verifyConnection();

export default pool;