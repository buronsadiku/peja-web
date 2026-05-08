import "server-only";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";

const globalForDb = globalThis as unknown as {
  __pejaDbPool?: Pool;
};

const pool =
  globalForDb.__pejaDbPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 10,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.__pejaDbPool = pool;
}

export const db = drizzle(pool, { schema });
export { schema };
