import { useMemo } from 'react';
import { ChatUseCase } from '../ChatUseCase';
// import { ChatRepositoryDifyImpl } from '../../../infrastructure/chat/ChatRepositoryDifyImpl';
import { ChatRepositoryChatgptImpl } from '../../../infrastructure/chat/ChatRepositoryChatgptImpl';

/**
 * ユースケースのインスタンス生成をカプセル化するカスタムフック
 */
export const useChatDifyUseCase = (): ChatUseCase =>
  useMemo(() => {
    // ここで依存性を生成する
    // const chatRepository = new ChatRepositoryDifyImpl();
    const chatRepository = new ChatRepositoryChatgptImpl();
    return new ChatUseCase(chatRepository);
  }, []);
