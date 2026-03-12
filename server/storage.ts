import { db } from "./db";
import { users, chats } from "@shared/schema";

export interface IStorage {
  createUser: (username: string, hashedPassword: string) => Promise<void>;
  findUserByUsername: (username: string) => Promise<any | null>;
  logChat: (chat: { user_id: string; session_id: string; message: string; response: string; }) => Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Record<string, { username: string; password: string }> = {};
  async createUser(username: string, hashedPassword: string) {
    this.users[username] = { username, password: hashedPassword };
  }
  async findUserByUsername(username: string) {
    return this.users[username] || null;
  }
  async logChat(chat: { user_id: string; session_id: string; message: string; response: string; }) {
    // no-op in memory version
    console.log("memstore logChat", chat);
  }
}

export class PostgresStorage implements IStorage {
  async createUser(username: string, hashedPassword: string) {
    await db.insert(users).values({ username, password: hashedPassword });
  }

  async findUserByUsername(username: string) {
    const [row] = await db
      .select()
      .from(users)
      .where(users.username.eq(username));
    return row || null;
  }

  async logChat(chat: { user_id: string; session_id: string; message: string; response: string; }) {
    await db.insert(chats).values(chat);
  }
}

// choose storage implementation based on env
export const storage: IStorage =
  process.env.DATABASE_URL && process.env.NODE_ENV === "production"
    ? new PostgresStorage()
    : new MemStorage();
