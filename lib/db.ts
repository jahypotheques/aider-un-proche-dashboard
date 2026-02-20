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

    // AWS RDS requires SSL connections
    // Enable SSL for any RDS connection (detected by amazonaws.com in URL)
    const isAWSRDS = process.env.DATABASE_URL?.includes('amazonaws.com');
    console.log('Database connection config:');
    console.log('- Is AWS RDS:', isAWSRDS);
    console.log('- Connection timeout:', config.connectionTimeoutMillis);

    if (isAWSRDS) {
      config.ssl = {
        rejectUnauthorized: false,
      };
      console.log('- SSL enabled: true');
    } else {
      console.log('- SSL enabled: false');
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
