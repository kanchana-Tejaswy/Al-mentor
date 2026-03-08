import { useState, useRef, useEffect } from "react";
import { Send, CornerDownLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Sidebar } from "@/components/chat/sidebar";
import { MessageBubble } from "@/components/chat/message-bubble";
import { TypingIndicator } from "@/components/chat/typing-indicator";
import { WelcomeScreen } from "@/components/chat/welcome-screen";
import { useChatStore } from "@/hooks/use-chat-store";
import { useChatApi } from "@/hooks/use-chat";

export function Chat() {
  const store = useChatStore();
  const { mutateAsync: sendMessage, isPending } = useChatApi();
  
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [store.activeConversation?.messages, isPending]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isPending) return;

    const messageText = input.trim();
    setInput("");

    // Ensure we have an active conversation before sending
    let currentConvId = store.activeId;
    if (!currentConvId) {
      currentConvId = store.createConversation();
    }

    // Instantly add user message to local state
    store.addMessage(currentConvId, 'user', messageText);

    try {
      // Call API
      const response = await sendMessage({
        message: messageText,
        sessionId: currentConvId,
      });

      // Add AI response to local state
      store.addMessage(currentConvId, 'ai', response.response);
    } catch (err) {
      console.error(err);
      store.addMessage(currentConvId, 'ai', "⚠️ I'm sorry, I encountered an error while processing your request. Please try again.");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#000000] text-foreground overflow-hidden font-sans">
      <Sidebar 
        conversations={store.conversations}
        activeId={store.activeId}
        onSelect={store.setActiveId}
        onNew={store.createConversation}
        onDelete={store.deleteConversation}
      />

      <div className="flex-1 flex flex-col relative min-w-0">
        {/* Header */}
        <header className="h-14 flex-shrink-0 flex items-center px-6 relative z-10">
          <div className="absolute inset-0 bg-[#000000]/80 backdrop-blur-xl border-b border-white/5"></div>
          <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-orange-500/20 to-transparent"></div>
          
          <h2 className="relative z-10 font-display font-semibold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-orange-500 box-glow inline-block" />
            UiPath AI Mentor
          </h2>
        </header>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto no-scrollbar relative scroll-smooth">
          <div className="max-w-4xl mx-auto p-4 md:p-6 lg:p-8 flex flex-col justify-end min-h-full">
            {!store.activeConversation || store.activeConversation.messages.length === 0 ? (
              <WelcomeScreen />
            ) : (
              <div className="space-y-8 pb-32">
                {store.activeConversation.messages.map((msg) => (
                  <MessageBubble key={msg.id} message={msg} />
                ))}
                <AnimatePresence>
                  {isPending && <TypingIndicator />}
                </AnimatePresence>
                <div ref={messagesEndRef} className="h-4" />
              </div>
            )}
          </div>
        </div>

        {/* Input Area */}
        <div className="absolute bottom-0 left-0 w-full p-4 md:p-6 bg-gradient-to-t from-[#000000] via-[#000000]/90 to-transparent pt-12">
          <div className="max-w-4xl mx-auto relative group">
            <form onSubmit={handleSubmit} className="relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything about UiPath automation..."
                className="w-full bg-[#111113]/80 backdrop-blur-md border border-white/10 rounded-2xl pl-5 pr-14 py-4 text-base 
                           text-white placeholder:text-gray-500 resize-none h-[60px] max-h-[200px] 
                           focus:outline-none focus:ring-1 focus:ring-orange-500/50 focus:border-orange-500/50 
                           transition-all shadow-lg shadow-black/50 hover:border-white/20 no-scrollbar"
                rows={1}
              />
              <div className="absolute right-2 top-2 flex items-center gap-2">
                <button
                  type="submit"
                  disabled={!input.trim() || isPending}
                  className="w-[44px] h-[44px] rounded-xl flex items-center justify-center bg-orange-500 text-white 
                             shadow-[0_0_15px_rgba(255,122,24,0.3)] hover:shadow-[0_0_25px_rgba(255,122,24,0.5)] 
                             hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:hover:shadow-[0_0_15px_rgba(255,122,24,0.3)]
                             disabled:hover:translate-y-0 transition-all duration-200"
                >
                  <Send className="w-5 h-5 ml-[-2px]" />
                </button>
              </div>
            </form>
            <div className="text-center mt-2 flex items-center justify-center gap-1.5 text-xs text-muted-foreground/60">
              <span>Press</span>
              <kbd className="px-1.5 py-0.5 rounded-md bg-white/5 border border-white/10 font-sans text-[10px] flex items-center gap-1">
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
