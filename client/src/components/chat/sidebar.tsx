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
    <div className="w-72 border-r border-white/5 bg-[#050505] flex flex-col h-full flex-shrink-0">
      <div className="p-4 flex-shrink-0">
        <button
          onClick={onNew}
          className="w-full py-3 px-4 rounded-xl flex items-center justify-center gap-2 font-medium 
                     bg-white/[0.03] border border-white/[0.05] text-white hover:bg-white/[0.08] hover:border-orange-500/30
                     hover:text-orange-500 transition-all duration-300 group hover:shadow-[0_0_15px_rgba(255,122,24,0.1)]"
        >
          <Plus className="w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-colors" />
          <span>New Chat</span>
        </button>
      </div>

      <div className="px-4 pb-2 pt-1 flex-shrink-0">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest pl-2">
          Recent History
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-2 space-y-1">
        <AnimatePresence initial={false}>
          {conversations.map((conv) => {
            const isActive = activeId === conv.id;
            return (
              <motion.div
                key={conv.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div
                  onClick={() => onSelect(conv.id)}
                  className={cn(
                    "w-full group flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 border",
                    isActive 
                      ? "bg-orange-500/10 border-orange-500/20 text-orange-50 text-glow" 
                      : "bg-transparent border-transparent hover:bg-white/[0.03] text-gray-400 hover:text-gray-200"
                  )}
                >
                  <MessageSquare className={cn(
                    "w-4 h-4 flex-shrink-0",
                    isActive ? "text-orange-500" : "text-gray-500 group-hover:text-gray-300"
                  )} />
                  
                  <div className="flex-1 min-w-0 overflow-hidden text-left">
                    <div className="truncate text-sm font-medium">{conv.title}</div>
                    <div className="text-[10px] text-gray-600 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      {format(conv.updatedAt, "MMM d, h:mm a")}
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(conv.id);
                    }}
                    className={cn(
                      "p-1.5 rounded-lg opacity-0 hover:bg-red-500/20 hover:text-red-400 transition-all",
                      "group-hover:opacity-100 focus:opacity-100"
                    )}
                    aria-label="Delete conversation"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {conversations.length === 0 && (
          <div className="text-center px-4 py-8 text-sm text-gray-600">
            No previous conversations.
          </div>
        )}
      </div>
    </div>
  );
}
