import { motion, AnimatePresence } from "framer-motion";
import { Plus, MessageSquare, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Conversation } from "@/hooks/use-chat-store";
import { format } from "date-fns";

interface SidebarProps {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
}

export function Sidebar({ conversations, activeId, onSelect, onNew, onDelete }: SidebarProps) {
  return (
    <div className="w-72 border-r border-border bg-card flex flex-col h-full flex-shrink-0 transition-colors duration-300">
      <div className="p-4 flex-shrink-0">
        <button onClick={onNew} className="w-full py-3 px-4 rounded-xl flex items-center justify-center gap-2 font-semibold bg-gradient-to-r from-primary/20 to-orange-500/20 border border-primary/40 text-primary hover:from-primary/30 hover:to-orange-500/30 hover:border-primary/60 transition-all duration-300 group hover:shadow-[0_0_20px_rgba(255,122,24,0.25)]">
          <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span>New Chat</span>
        </button>
      </div>
      <div className="px-4 pb-2 pt-1 flex-shrink-0">
        <h3 className="text-xs font-bold text-primary uppercase tracking-widest pl-2 opacity-80">Recent History</h3>
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar p-2 space-y-1">
        <AnimatePresence initial={false}>
          {conversations.map((conv) => {
            const isActive = activeId === conv.id;
            return (
              <motion.div key={conv.id} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}>
                <div onClick={() => onSelect(conv.id)} className={cn("w-full group flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 border", isActive ? "bg-primary/15 border-primary/30 text-primary" : "bg-transparent border-transparent hover:bg-muted/50 text-muted-foreground hover:text-foreground")}>
                  <MessageSquare className={cn("w-4 h-4 flex-shrink-0", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                  <div className="flex-1 min-w-0 overflow-hidden text-left">
                    <div className="truncate text-sm font-medium">{conv.title}</div>
                    <div className="text-[10px] text-gray-600 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">{format(conv.updatedAt, "MMM d, h:mm a")}</div>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); onDelete(conv.id); }} className={cn("p-1.5 rounded-lg opacity-0 hover:bg-destructive/20 hover:text-destructive transition-all", "group-hover:opacity-100 focus:opacity-100")} aria-label="Delete conversation">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        {conversations.length === 0 && <div className="text-center px-4 py-8 text-sm text-muted-foreground">No previous conversations.</div>}
      </div>
    </div>
  );
}
