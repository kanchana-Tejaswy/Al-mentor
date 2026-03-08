import { motion } from "framer-motion";

export function TypingIndicator() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="flex items-center gap-4 max-w-[80%] mr-auto"
    >
      <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
        <span className="text-xs font-bold text-orange-500">AI</span>
      </div>
      
      <div className="bg-[#111113] border border-white/5 rounded-2xl rounded-tl-sm px-5 py-4 flex gap-1.5 w-20">
        <div className="w-2 h-2 rounded-full bg-orange-500/60 typing-dot" />
        <div className="w-2 h-2 rounded-full bg-orange-500/60 typing-dot" />
        <div className="w-2 h-2 rounded-full bg-orange-500/60 typing-dot" />
      </div>
    </motion.div>
  );
}
