import { db } from "../server/db";
import { users, chats } from "@shared/schema";
import { sql } from "drizzle-orm";

async function main() {
  console.log("Running initialization script...");
  // ensure pgcrypto for gen_random_uuid
  await db.execute(sql`CREATE EXTENSION IF NOT EXISTS pgcrypto;` as any);

  // create tables if they don't exist using raw SQL
  await db.execute(
    `
    CREATE TABLE IF NOT EXISTS users (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      username text NOT NULL UNIQUE,
      password text NOT NULL
    );
    `,
  );

  await db.execute(
    `
    CREATE TABLE IF NOT EXISTS chats (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id uuid NOT NULL REFERENCES users(id),
      session_id text NOT NULL,
      message text NOT NULL,
      response text NOT NULL
    );
    `,
  );

  console.log("Database initialization complete.");
  process.exit(0);
}

main().catch((err) => {
  console.error("Failed to initialize database", err);
  process.exit(1);
});
