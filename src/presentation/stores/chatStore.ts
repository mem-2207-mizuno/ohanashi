import { create } from 'zustand';
import { ChatMessage } from '../../domain/chat/ChatMessage';

interface ChatState {
  chatLogs: ChatMessage[];

  addChat: (msg: ChatMessage) => void;
  clear: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  chatLogs: [],
  addChat: (msg) =>
    set((state) => ({
      chatLogs: [...state.chatLogs, msg],
    })),
  clear: () =>
    set(() => ({
      chatLogs: [],
    })),
}));
