import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required for database access");
}

// create a connection pool that can be shared across the app
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// drizzle wrapper
export const db = drizzle(pool);
