import { motion } from "framer-motion";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import type { Message } from "@/hooks/use-chat-store";
import { User } from "lucide-react";

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
      className={cn(
        "flex gap-4 max-w-[85%]",
        isUser ? "ml-auto flex-row-reverse" : "mr-auto"
      )}
    >
      {/* Avatar */}
      <div className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-lg",
        isUser 
          ? "bg-gradient-to-br from-orange-400 to-orange-600 shadow-orange-500/20" 
          : "bg-white/5 border border-white/10"
      )}>
        {isUser ? (
          <User className="w-4 h-4 text-white" />
        ) : (
          <span className="text-xs font-bold text-orange-500">AI</span>
        )}
      </div>

      {/* Bubble */}
      <div className={cn(
        "flex flex-col gap-1.5",
        isUser ? "items-end" : "items-start"
      )}>
        <div className={cn(
          "px-5 py-3.5 text-[0.95rem] leading-relaxed relative group",
          isUser 
            ? "bg-gradient-to-br from-[#ff7a18] to-[#d65f0e] text-white rounded-2xl rounded-tr-sm box-glow"
            : "bg-[#111113] border border-white/5 text-gray-200 rounded-2xl rounded-tl-sm"
        )}>
          {/* Markdown rendering could go here in the future, for now using whitespace pre-wrap */}
          <div className="whitespace-pre-wrap font-sans">{message.content}</div>
        </div>
        <span className="text-[10px] text-muted-foreground/60 px-1 font-medium tracking-wider uppercase">
          {format(message.createdAt, "h:mm a")}
        </span>
      </div>
    </motion.div>
  );
}
