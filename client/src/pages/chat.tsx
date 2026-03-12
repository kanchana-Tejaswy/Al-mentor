import { useState, useRef, useEffect } from "react";
import { Send, CornerDownLeft, Menu, X, Moon, Sun } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Sidebar } from "@/components/chat/sidebar";
import { MessageBubble } from "@/components/chat/message-bubble";
import { TypingIndicator } from "@/components/chat/typing-indicator";
import { WelcomeScreen } from "@/components/chat/welcome-screen";
import { useChatStore } from "@/hooks/use-chat-store";
import { useChatApi } from "@/hooks/use-chat";
import { useTheme } from "@/hooks/use-theme";
import { useIsMobile } from "@/hooks/use-mobile";

export function Chat() {
  const store = useChatStore();
  const { mutateAsync: sendMessage, isPending } = useChatApi();
  const { theme, toggleTheme } = useTheme();
  const isMobile = useIsMobile();
  
  const [input, setInput] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const messagesEndRef = useRef(null as HTMLDivElement | null);

  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [store.activeConversation?.messages, isPending]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const trimmedInput = input.trim();
    if (!trimmedInput || isPending) return;

    const messageText = trimmedInput;
    setInput("");

    if (messageText.length > 5000) {
      alert("Message is too long. Please keep it under 5000 characters.");
      setInput(messageText);
      return;
    }

    let currentConvId = store.activeId;
    if (!currentConvId) {
      currentConvId = store.createConversation();
    }

    store.addMessage(currentConvId, 'user', messageText);

    try {
      const response = await sendMessage({
        message: messageText,
        sessionId: currentConvId,
      });

      store.addMessage(currentConvId, 'ai', response.response);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      console.error("Error sending message:", err);
      
      let userMessage = "⚠️ I'm sorry, something went wrong. Please try again.";
      
      if (errorMessage.includes("timeout") || errorMessage.includes("taking too long")) {
        userMessage = "⏱️ The AI Mentor is taking too long to respond. Please try a shorter question.";
      } else if (errorMessage.includes("temporarily unavailable")) {
        userMessage = "🔄 The AI service is temporarily unavailable. Please try again in a moment.";
      } else if (errorMessage.includes("empty")) {
        userMessage = "📝 Please enter a message before sending.";
      }
      
      store.addMessage(currentConvId, 'ai', userMessage);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex h-screen w-full bg-background text-foreground overflow-hidden font-sans transition-colors duration-300">
      <AnimatePresence>
        {sidebarOpen && isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 md:hidden"
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={false}
        animate={{ x: isMobile && !sidebarOpen ? -300 : 0 }}
        transition={{ duration: 0.3 }}
        className={`${
          isMobile ? "fixed left-0 top-0 h-full z-40 w-72" : "relative w-72"
        }`}
      >
        <Sidebar 
          conversations={store.conversations}
          activeId={store.activeId}
          onSelect={(id: string) => {
            store.setActiveId(id);
            if (isMobile) setSidebarOpen(false);
          }}
          onNew={() => {
            store.createConversation();
            if (isMobile) setSidebarOpen(false);
          }}
          onDelete={store.deleteConversation}
        />
      </motion.div>

      <div className="flex-1 flex flex-col relative min-w-0">
        <header className="h-14 flex-shrink-0 flex items-center justify-between px-3 md:px-6 relative z-10">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-xl border-b border-border transition-colors duration-300"></div>
          <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
          
          <div className="flex items-center gap-2 relative z-10">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 hover:bg-primary/10 rounded-lg transition-colors text-primary"
              aria-label="Toggle sidebar"
              data-testid="button-toggle-sidebar"
            >
              {sidebarOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
            
            <h2 className="font-display font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary flex items-center gap-2 ml-1 md:ml-0 whitespace-nowrap">
              <span className="w-2 h-2 rounded-full bg-primary inline-block flex-shrink-0" />
              <span className="hidden sm:inline">UiPath AI Mentor</span>
              <span className="sm:hidden text-sm font-bold">UiPath</span>
            </h2>
          </div>

          <button
            onClick={toggleTheme}
            className="relative z-10 p-2 hover:bg-primary/10 rounded-lg transition-all duration-300 text-primary"
            aria-label="Toggle theme"
            data-testid="button-toggle-theme"
          >
            <motion.div
              initial={false}
              animate={{ rotate: theme === 'dark' ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </motion.div>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto no-scrollbar relative scroll-smooth">
          <div className="max-w-4xl mx-auto p-4 md:p-6 lg:p-8 flex flex-col justify-end min-h-full">
            {!store.activeConversation || store.activeConversation.messages.length === 0 ? (
              <WelcomeScreen />
            ) : (
              <div className="space-y-8 pb-32">
                {store.activeConversation.messages.map((msg: any) => (
                  <MessageBubble message={msg} key={msg.id} />
                ))}
                <AnimatePresence>
                  {isPending && <TypingIndicator />}
                </AnimatePresence>
                <div ref={messagesEndRef} className="h-4" />
              </div>
            )}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full p-3 md:p-6 bg-gradient-to-t from-background via-background/95 to-transparent pt-8 md:pt-12 transition-colors duration-300">
          <div className="max-w-4xl mx-auto relative group">
            <form onSubmit={handleSubmit} className="relative">
              <textarea
                value={input}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything about UiPath..."
                className="w-full bg-input/60 backdrop-blur-md border border-border rounded-2xl pl-4 md:pl-5 pr-12 md:pr-14 py-3 md:py-4 text-sm md:text-base 
                           text-foreground placeholder:text-muted-foreground/50 resize-none h-[50px] md:h-[60px] max-h-[200px] 
                           focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 
                           transition-all shadow-lg shadow-primary/5 hover:border-border/70 no-scrollbar"
                rows={1}
                data-testid="input-message"
              />
              <div className="absolute right-2 top-1.5 md:top-2 flex items-center gap-2">
                <button
                  type="submit"
                  disabled={!input.trim() || isPending}
                  className="w-10 h-10 md:w-[48px] md:h-[48px] rounded-lg flex items-center justify-center bg-gradient-to-br from-primary via-orange-500 to-primary text-white 
                             shadow-[0_0_25px_rgba(255,122,24,0.4)] hover:shadow-[0_0_35px_rgba(255,122,24,0.6)] 
                             hover:-translate-y-1 active:translate-y-0 disabled:opacity-40 disabled:hover:shadow-[0_0_25px_rgba(255,122,24,0.4)]
                             disabled:hover:translate-y-0 transition-all duration-200 font-bold"
                  data-testid="button-send"
                >
                  <Send className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              </div>
            </form>
            <div className="text-center mt-2 flex items-center justify-center gap-1.5 text-xs text-muted-foreground/60 hidden sm:flex">
              <span>Press</span>
              <kbd className="px-1.5 py-0.5 rounded-md bg-muted/40 border border-border font-sans text-[10px] flex items-center gap-1 transition-colors duration-300">
                Enter <CornerDownLeft className="w-3 h-3" />
              </kbd>
              <span>to send</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
