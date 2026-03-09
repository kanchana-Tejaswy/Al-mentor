import { motion } from "framer-motion";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import type { Message } from "@/hooks/use-chat-store";
import { User } from "lucide-react";
import ReactMarkdown from "react-markdown";

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
          <div className="prose prose-invert max-w-none text-sm [&_h1]:text-lg [&_h2]:text-base [&_h3]:text-sm [&_strong]:font-bold [&_em]:italic [&_code]:bg-white/10 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-orange-300 [&_ul]:list-disc [&_ol]:list-decimal [&_li]:ml-4 [&_li]:my-0.5 [&_p]:my-1 [&_blockquote]:border-l-2 [&_blockquote]:border-orange-500/50 [&_blockquote]:pl-3 [&_blockquote]:italic">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        </div>
        <span className="text-[10px] text-muted-foreground/60 px-1 font-medium tracking-wider uppercase">
          {format(message.createdAt, "h:mm a")}
        </span>
      </div>
    </motion.div>
  );
}
