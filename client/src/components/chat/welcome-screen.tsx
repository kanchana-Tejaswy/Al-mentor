import { motion } from "framer-motion";
import { Bot, Zap, Shield, Sparkles } from "lucide-react";

export function WelcomeScreen() {
  const features = [
    { icon: Zap, text: "Instant answers on UiPath best practices" },
    { icon: Shield, text: "Secure architecture recommendations" },
    { icon: Sparkles, text: "Workflow automation strategies" }
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center h-full max-h-[80vh]">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-24 h-24 rounded-3xl bg-gradient-to-br from-orange-400 to-orange-600 p-[2px] shadow-[0_0_40px_rgba(255,122,24,0.3)] mb-8"
      >
        <div className="w-full h-full bg-[#0a0a0a] rounded-[22px] flex items-center justify-center">
          <Bot className="w-12 h-12 text-orange-500" />
        </div>
      </motion.div>

      <motion.h1 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="text-4xl md:text-5xl font-bold font-display text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 mb-4"
      >
        UiPath AI Mentor
      </motion.h1>

      <motion.p 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-lg text-gray-400 max-w-lg mb-12"
      >
        Your premium co-pilot for RPA development. Ask anything about automation, scripting, or orchestrator management.
      </motion.p>

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl"
      >
        {features.map((f, i) => (
          <div key={i} className="glass-panel p-5 rounded-2xl flex flex-col items-center gap-3 text-center">
            <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center">
              <f.icon className="w-5 h-5 text-orange-500" />
            </div>
            <span className="text-sm font-medium text-gray-300">{f.text}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
