import type { Express } from "express";
import type { Server } from "http";
import { api } from "@shared/routes";
import { z } from "zod";

// IMPORTANT EDITABLE SECTIONS
// You can edit these values below to point to a different agent or update keys
const PASTE_LYZER_AGENT_LINK_HERE = "https://agent-prod.studio.lyzr.ai/v3/inference/chat/";
const PASTE_API_KEY_HERE = "sk-default-ZpmsmRk4lj8vmpme6G9Q7tpsRnZKit2A";
const PASTE_LYZER_AGENT_CODE_HERE = "69ad5a416cc24db68fc34132"; // Agent ID

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.post(api.chat.send.path, async (req, res) => {
    try {
      const input = api.chat.send.input.parse(req.body);
      
      const payload = {
        user_id: "mail2tejaswy@gmail.com", 
        agent_id: PASTE_LYZER_AGENT_CODE_HERE,
        session_id: input.sessionId || `${PASTE_LYZER_AGENT_CODE_HERE}-default-session`,
        message: input.message
      };

      console.log("Sending to Lyzer API:", payload);

      const lyzerResponse = await fetch(PASTE_LYZER_AGENT_LINK_HERE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": PASTE_API_KEY_HERE
        },
        body: JSON.stringify(payload)
      });

      if (!lyzerResponse.ok) {
        const errorText = await lyzerResponse.text();
        console.error("Lyzer API error response:", errorText);
        throw new Error(`Lyzer API error: ${lyzerResponse.status} - ${errorText}`);
      }

      const data = await lyzerResponse.json() as any;
      console.log("Lyzer API response:", data);
      
      // Lyzer usually returns the AI message in a 'response' field
      res.json({
        response: data.response || "No response received from Lyzer API"
      });
      
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      console.error("Chat proxy error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  return httpServer;
}
