import { useMutation } from "@tanstack/react-query";
import { api } from "@shared/routes";

export function useChatApi() {
  return useMutation({
    mutationFn: async ({ message, sessionId }: { message: string; sessionId?: string }) => {
      const res = await fetch(api.chat.send.path, {
        method: api.chat.send.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, sessionId }),
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.message || "Failed to communicate with AI Mentor");
      }
      
      return api.chat.send.responses[200].parse(await res.json());
    },
  });
}
