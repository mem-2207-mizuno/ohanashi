import { useMemo } from 'react';
import { ChatUseCase } from '../ChatUseCase';
import { ChatRepositoryDifyImpl } from '../../../infrastructure/chat/ChatRepositoryDifyImpl';

/**
 * ユースケースのインスタンス生成をカプセル化するカスタムフック
 */
export const useChatDifyUseCase = (): ChatUseCase =>
  useMemo(() => {
    // ここで依存性を生成する
    const chatRepository = new ChatRepositoryDifyImpl();
    return new ChatUseCase(chatRepository);
  }, []);
