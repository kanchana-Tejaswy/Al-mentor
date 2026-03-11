import { motion } from "framer-motion";

export function TypingIndicator() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="flex items-center gap-4 max-w-[80%] mr-auto">
      <div className="w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center flex-shrink-0">
        <span className="text-xs font-bold text-primary">AI</span>
      </div>
      <div className="bg-card border border-border rounded-2xl rounded-tl-sm px-5 py-4 flex gap-1.5 w-20 transition-colors duration-300">
        <div className="w-2 h-2 rounded-full bg-primary/60 typing-dot" />
        <div className="w-2 h-2 rounded-full bg-primary/60 typing-dot" />
        <div className="w-2 h-2 rounded-full bg-primary/60 typing-dot" />
      </div>
    </motion.div>
  );
}
