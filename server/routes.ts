// express and http types are intentionally `any` so that the project
// compiles without external @types packages.
import { api } from "@shared/routes";
import { z } from "zod";
import { db } from "./db";
import { chats } from "@shared/schema";
import { storage } from "./storage";

const LYZER_API_URL = process.env.LYZER_API_URL || "https://agent-prod.studio.lyzr.ai/v3/inference/chat/";
const LYZER_API_KEY = process.env.LYZER_API_KEY || "sk-default-ZpmsmRk4lj8vmpme6G9Q7tpsRnZKit2A";
const LYZER_AGENT_ID = process.env.LYZER_AGENT_ID || "69ad5a416cc24db68fc34132";
const API_TIMEOUT_MS = 30000;

export async function registerRoutes(
  httpServer: any,
  app: any,
): Promise<any> {
  
  // --- chat proxy endpoint (stores conversation if database is available) ---
  app.post(api.chat.send.path, async (req: Express.Request, res: Express.Response) => {
    try {
      const input = api.chat.send.input.parse(req.body as unknown);
      
      const payload = {
        user_id: process.env.USER_ID || "default-user",
        agent_id: LYZER_AGENT_ID,
        session_id: input.sessionId || `${LYZER_AGENT_ID}-default-session`,
        message: input.message,
      };

      console.log("Sending to Lyzer API:", payload);

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

      const lyzerResponse = await fetch(LYZER_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": LYZER_API_KEY
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      }).finally(() => clearTimeout(timeout));

      if (!lyzerResponse.ok) {
        const errorText = await lyzerResponse.text();
        console.error("Lyzer API error response:", errorText);
        throw new Error(`Lyzer API error: ${lyzerResponse.status} - ${errorText}`);
      }

      const data = await lyzerResponse.json() as any;
      console.log("Lyzer API response:", data);
      
      // persist chat using storage abstraction
      try {
        await storage.logChat({
          user_id: payload.user_id,
          session_id: payload.session_id,
          message: payload.message,
          response: data.response || "",
        });
      } catch (dbErr) {
        console.error("Failed to log chat", dbErr);
      }

      res.json({
        response: data.response || "No response received from Lyzer API"
      });
      
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
          code: "VALIDATION_ERROR",
        });
      }
      
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error("Chat proxy error:", err);
      
      if (errorMessage.includes("AbortError") || errorMessage.includes("timeout")) {
        return res.status(504).json({ 
          message: "AI Mentor is taking too long. Please try again.",
          code: "TIMEOUT_ERROR",
        });
      }
      
      if (errorMessage.includes("Lyzer API error")) {
        return res.status(502).json({ 
          message: "AI service temporarily unavailable. Please try again.",
          code: "EXTERNAL_API_ERROR",
        });
      }
      
      res.status(500).json({ 
        message: "Something went wrong. Please try again.",
        code: "INTERNAL_SERVER_ERROR",
      });
    }
  });


  // simple user registration/login for demonstration
  app.post("/api/users/register", async (req: any, res: any) => {
    const schema = z.object({ username: z.string().min(3), password: z.string().min(6) });
    try {
      const { username, password } = schema.parse(req.body as unknown);
      // in a real app you would hash the password
      await storage.createUser(username, password);
      res.status(201).json({ message: "user created" });
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message, field: err.errors[0].path.join('.') });
      }
      if ((err as any).code === '23505') { // unique violation
        return res.status(409).json({ message: 'username already taken' });
      }
      console.error(err);
      res.status(500).json({ message: 'internal error' });
    }
  });

  app.post("/api/users/login", async (req: any, res: any) => {
    const schema = z.object({ username: z.string(), password: z.string() });
    try {
      const { username, password } = schema.parse(req.body as unknown);
      const user = await storage.findUserByUsername(username);
      if (!user || (user as any).password !== password) {
        return res.status(401).json({ message: 'invalid credentials' });
      }
      res.json({ message: 'ok' });
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      console.error(err);
      res.status(500).json({ message: 'internal error' });
    }
  });

  return httpServer;
}
