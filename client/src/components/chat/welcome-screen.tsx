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
      <motion.div initial={{ scale: 0.8, opacity: 0, y: -20 }} animate={{ scale: 1, opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: "easeOut" }} className="w-28 h-28 rounded-[28px] bg-gradient-to-br from-primary via-secondary to-primary p-[3px] shadow-[0_0_60px_rgba(255,122,24,0.4)] mb-8 shine-effect">
        <div className="w-full h-full bg-background rounded-[24px] flex items-center justify-center transition-colors duration-300">
          <Bot className="w-14 h-14 text-primary animate-pulse" />
        </div>
      </motion.div>
      <motion.h1 initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15, duration: 0.6 }} className="text-5xl md:text-6xl font-black font-display text-transparent bg-clip-text bg-gradient-to-r from-primary via-orange-500 to-primary mb-4 drop-shadow-lg">
        UiPath AI Mentor
      </motion.h1>
      <motion.p initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.25, duration: 0.6 }} className="text-xl text-muted-foreground max-w-2xl mb-16 leading-relaxed">
        Your premium co-pilot for RPA development. Ask anything about automation, scripting, or orchestrator management.
      </motion.p>
      <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.35, duration: 0.6 }} className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        {features.map((f, i) => (
          <motion.div key={i} whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(255,122,24,0.2)" }} className="bg-card border border-border rounded-3xl p-8 flex flex-col items-center gap-4 text-center hover:border-primary/50 bg-gradient-to-b from-background to-primary/5 transition-all duration-300 backdrop-blur-sm">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
              <f.icon className="w-7 h-7 text-primary" />
            </div>
            <span className="text-base font-semibold text-foreground">{f.text}</span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
