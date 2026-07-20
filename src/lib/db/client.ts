import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

const databaseUrl = process.env.DATABASE_URL ?? 'postgresql://visionseek:visionseek_password@localhost:5432/visionseek_os';

declare global {
  var visionSeekPool: Pool | undefined;
}

const pool = globalThis.visionSeekPool ?? new Pool({ connectionString: databaseUrl });

if (process.env.NODE_ENV !== 'production') {
  globalThis.visionSeekPool = pool;
}

export const db = drizzle({ client: pool, schema });
