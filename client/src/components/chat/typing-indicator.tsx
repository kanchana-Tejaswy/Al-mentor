import { motion } from "framer-motion";

export function TypingIndicator() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="flex items-center gap-4 max-w-[80%] mr-auto">
      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/20 to-orange-500/20 border border-primary/30 flex items-center justify-center flex-shrink-0 font-bold">
        <span className="text-xs font-bold text-primary">AI</span>
      </div>
      <div className="bg-card border border-border rounded-2xl rounded-tl-sm px-5 py-4 flex gap-2 transition-colors duration-300 shadow-[0_0_15px_rgba(255,122,24,0.15)]">
        <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-b from-primary to-orange-500 typing-dot" />
        <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-b from-primary to-orange-500 typing-dot" />
        <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-b from-primary to-orange-500 typing-dot" />
      </div>
    </motion.div>
  );
}
