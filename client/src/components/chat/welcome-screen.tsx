import { motion } from "framer-motion";
import { Bot, Zap, Shield, Sparkles, ArrowRight } from "lucide-react";

export function WelcomeScreen() {
  const features = [
    { 
      icon: Zap, 
      title: "Instant Answers",
      text: "Get real-time guidance on UiPath best practices, workflow optimization, and RPA strategies",
      color: "from-orange-500/20 to-orange-500/10"
    },
    { 
      icon: Shield, 
      title: "Secure Architecture",
      text: "Receive expert recommendations for secure application design, data protection, and system architecture",
      color: "from-primary/20 to-primary/10"
    },
    { 
      icon: Sparkles, 
      title: "Workflow Automation",
      text: "Master automation strategies, process design patterns, and orchestrator management best practices",
      color: "from-amber-500/20 to-amber-500/10"
    }
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-8 lg:p-12 text-center h-full w-full overflow-y-auto">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0, y: -20 }} 
        animate={{ scale: 1, opacity: 1, y: 0 }} 
        transition={{ duration: 0.7, ease: "easeOut" }} 
        className="w-24 sm:w-28 h-24 sm:h-28 rounded-[24px] sm:rounded-[28px] bg-gradient-to-br from-primary via-secondary to-primary p-[3px] shadow-[0_0_60px_rgba(255,122,24,0.4)] mb-6 sm:mb-8 shine-effect flex-shrink-0"
      >
        <div className="w-full h-full bg-background rounded-[22px] sm:rounded-[24px] flex items-center justify-center transition-colors duration-300">
          <Bot className="w-12 sm:w-14 h-12 sm:h-14 text-primary animate-pulse" />
        </div>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ delay: 0.05, duration: 0.5 }}
        className="text-center mb-2"
      >
        <h3 className="text-sm font-semibold text-primary uppercase tracking-widest opacity-80">AI-Powered RPA Assistant</h3>
      </motion.div>

      <motion.h1 
        initial={{ y: 30, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }} 
        transition={{ delay: 0.15, duration: 0.6 }} 
        className="text-4xl sm:text-5xl lg:text-6xl font-black font-display text-transparent bg-clip-text bg-gradient-to-r from-primary via-orange-500 to-primary mb-2 sm:mb-4 drop-shadow-lg"
      >
        UiPath AI Mentor
      </motion.h1>
      
      <motion.p 
        initial={{ y: 30, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }} 
        transition={{ delay: 0.25, duration: 0.6 }} 
        className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-xl sm:max-w-2xl mb-12 sm:mb-16 leading-relaxed px-4"
      >
        Your premium co-pilot for RPA development. Ask anything about automation, scripting, or orchestrator management.
      </motion.p>

      <motion.div 
        initial={{ y: 30, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }} 
        transition={{ delay: 0.35, duration: 0.6 }} 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 w-full px-4 sm:px-0 sm:max-w-3xl lg:max-w-5xl"
      >
        {features.map((f, i) => (
          <motion.div 
            key={i} 
            whileHover={{ y: -6, boxShadow: "0 20px 40px rgba(255,122,24,0.2)" }} 
            className={`bg-card border border-border rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-8 flex flex-col items-start gap-3 sm:gap-4 text-left hover:border-primary/50 bg-gradient-to-b from-background ${f.color} transition-all duration-300 backdrop-blur-sm h-full`}
          >
            <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br ${f.color} flex items-center justify-center flex-shrink-0`}>
              <f.icon className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-base sm:text-lg font-bold text-foreground mb-2">{f.title}</h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{f.text}</p>
            </div>
            <motion.div 
              whileHover={{ x: 4 }} 
              className="text-primary font-semibold text-sm flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              Learn More <ArrowRight className="w-4 h-4" />
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
