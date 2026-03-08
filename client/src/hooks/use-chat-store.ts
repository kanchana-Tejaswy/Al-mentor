import { useState, useEffect, useCallback } from 'react';
import { nanoid } from 'nanoid';

export interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  createdAt: number;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  updatedAt: number;
}

const STORAGE_KEY = 'uipath-ai-mentor-conversations';

export function useChatStore() {
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (err) {
      console.error('Failed to parse conversations from local storage', err);
      return [];
    }
  });

  const [activeId, setActiveId] = useState<string | null>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}-active`);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Persist to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}-active`, JSON.stringify(activeId));
  }, [activeId]);

  const createConversation = useCallback(() => {
    const newId = nanoid();
    const newConv: Conversation = {
      id: newId,
      title: 'New Conversation',
      messages: [],
      updatedAt: Date.now(),
    };
    setConversations((prev) => [newConv, ...prev]);
    setActiveId(newId);
    return newId;
  }, []);

  const deleteConversation = useCallback((id: string) => {
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (activeId === id) {
      setActiveId(null);
    }
  }, [activeId]);

  const addMessage = useCallback((convId: string, role: 'user' | 'ai', content: string) => {
    const newMessage: Message = {
      id: nanoid(),
      role,
      content,
      createdAt: Date.now(),
    };

    setConversations((prev) => {
      return prev.map((conv) => {
        if (conv.id === convId) {
          // Auto-generate title from first user message if it's currently "New Conversation"
          let title = conv.title;
          if (title === 'New Conversation' && role === 'user') {
            title = content.length > 30 ? content.slice(0, 30) + '...' : content;
          }
          return {
            ...conv,
            title,
            messages: [...conv.messages, newMessage],
            updatedAt: Date.now(),
          };
        }
        return conv;
      }).sort((a, b) => b.updatedAt - a.updatedAt); // Keep most recent at top
    });
  }, []);

  const activeConversation = conversations.find((c) => c.id === activeId) || null;

  return {
    conversations,
    activeId,
    activeConversation,
    setActiveId,
    createConversation,
    deleteConversation,
    addMessage,
  };
}
