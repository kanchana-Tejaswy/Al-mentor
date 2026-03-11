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
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }} className={cn("flex gap-4 max-w-[85%]", isUser ? "ml-auto flex-row-reverse" : "mr-auto")}>
      <div className={cn("w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-lg font-bold", isUser ? "bg-gradient-to-br from-primary to-orange-500 shadow-[0_0_15px_rgba(255,122,24,0.4)] text-white" : "bg-muted border border-border")}>
        {isUser ? <User className="w-4 h-4 text-primary-foreground" /> : <span className="text-xs font-bold text-primary">AI</span>}
      </div>
      <div className={cn("flex flex-col gap-1.5", isUser ? "items-end" : "items-start")}>
        <div className={cn("px-5 py-3.5 text-[0.95rem] leading-relaxed relative group", isUser ? "bg-gradient-to-br from-primary to-orange-500 text-white rounded-[20px] rounded-tr-sm shadow-[0_0_20px_rgba(255,122,24,0.35)]" : "bg-card border border-border text-foreground rounded-[20px] rounded-tl-sm")}>
          <div className={cn("prose max-w-none text-sm [&_h1]:text-lg [&_h2]:text-base [&_h3]:text-sm [&_strong]:font-bold [&_em]:italic [&_ul]:list-disc [&_ol]:list-decimal [&_li]:ml-4 [&_li]:my-0.5 [&_p]:my-1", isUser ? "prose-invert [&_code]:bg-white/20 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_blockquote]:border-l-2 [&_blockquote]:border-primary/50 [&_blockquote]:pl-3 [&_blockquote]:italic" : "dark:prose-invert [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-primary [&_blockquote]:border-l-2 [&_blockquote]:border-primary/50 [&_blockquote]:pl-3 [&_blockquote]:italic")}>
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        </div>
        <span className="text-[10px] text-muted-foreground/60 px-1 font-medium tracking-wider uppercase">{format(message.createdAt, "h:mm a")}</span>
      </div>
    </motion.div>
  );
}
