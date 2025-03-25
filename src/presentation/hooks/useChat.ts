import { useChatDifyUseCase } from '../../application/chat/hooks/useChatDifyUseCase';
import { useChatStore } from '../stores/chatStore';

export const useChat = () => {
  const chatLogs = useChatStore((State) => State.chatLogs);
  const chatUseCase = useChatDifyUseCase();
  const addChat = useChatStore((state) => state.addChat);

  const throwChat = async () => {
    const result = await chatUseCase.throwChat(chatLogs);

    addChat({
      id: '',
      talker: 'ai',
      audioChunks: [],
      text: result,
      createdAt: new Date(),
    });
    return result;
  };

  return {
    throwChat,
  };
};
