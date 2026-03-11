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
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.6, ease: "easeOut" }} className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary via-secondary to-primary p-[2px] shadow-[0_0_40px_var(--primary-glow,rgba(139,92,246,0.3))] mb-8">
        <div className="w-full h-full bg-background rounded-[22px] flex items-center justify-center transition-colors duration-300">
          <Bot className="w-12 h-12 text-primary" />
        </div>
      </motion.div>
      <motion.h1 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1, duration: 0.5 }} className="text-4xl md:text-5xl font-black font-display text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary mb-4">
        UiPath AI Mentor
      </motion.h1>
      <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2, duration: 0.5 }} className="text-lg text-muted-foreground max-w-lg mb-12">
        Your premium co-pilot for RPA development. Ask anything about automation, scripting, or orchestrator management.
      </motion.p>
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3, duration: 0.5 }} className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl">
        {features.map((f, i) => (
          <div key={i} className="bg-card border border-border rounded-2xl p-6 flex flex-col items-center gap-3 text-center hover:border-primary/30 hover:bg-primary/5 transition-all duration-300">
            <div className="w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center">
              <f.icon className="w-6 h-6 text-primary" />
            </div>
            <span className="text-sm font-semibold text-foreground">{f.text}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
