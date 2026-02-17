import { Pool, PoolConfig } from 'pg';

let pool: Pool | null = null;

export function getPool() {
  if (!pool) {
    const config: PoolConfig = {
      connectionString: process.env.DATABASE_URL,
    };

    // Only add SSL if we're in production and not explicitly disabled
    if (process.env.NODE_ENV === 'production' && process.env.DATABASE_URL?.includes('ssl=true')) {
      config.ssl = {
        rejectUnauthorized: false,
      };
    }

    pool = new Pool(config);
  }
  return pool;
}

export async function query(text: string, params?: any[]) {
  const pool = getPool();
  const result = await pool.query(text, params);
  return result;
}
