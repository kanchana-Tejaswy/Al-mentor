import { sql } from "drizzle-orm";
import { pgTable, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = unknown; // placeholder until zod types are available
export type User = typeof users.$inferSelect;

export const chatRequestSchema = z.object({
  message: z.string().min(1, "Message cannot be empty").trim(),
  sessionId: z.string().optional(),
});

export type ChatRequest = unknown; // placeholder until zod types are available

export interface ChatResponse {
  response: string;
}

// store each chat exchange for analysis/history
export const chats = pgTable("chats", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  user_id: varchar("user_id")
    .notNull()
    .references(() => users.id),
  session_id: varchar("session_id").notNull(),
  message: text("message").notNull(),
  response: text("response").notNull(),
  // optional created timestamp if you need it later
});

export type Chat = typeof chats.$inferSelect;
export type InsertChat = typeof chats.$inferInsert;
