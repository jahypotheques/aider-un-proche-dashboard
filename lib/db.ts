import { Pool, PoolConfig } from 'pg';

let pool: Pool | null = null;

export function getPool() {
  if (!pool) {
    const config: PoolConfig = {
      connectionString: process.env.DATABASE_URL,
      connectionTimeoutMillis: 30000, // 30 seconds
      idleTimeoutMillis: 30000,
      max: 10, // maximum pool size
    };

    // SSL: controlled explicitly via DB_SSL env var rather than URL sniffing.
    // Set DB_SSL=true in Vercel (and any environment connecting to RDS).
    // Leave it unset locally if your local DB doesn't require SSL.
    const sslEnabled = process.env.DB_SSL === 'true';
    console.log('Database connection config:');
    console.log('- SSL enabled:', sslEnabled);
    console.log('- Connection timeout:', config.connectionTimeoutMillis);

    if (sslEnabled) {
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
