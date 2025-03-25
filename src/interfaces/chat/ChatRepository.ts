import { ChatMessage } from '../../domain/chat/ChatMessage';

export interface ChatRepository {
  throwChat(chatHistory: ChatMessage[], maxLength?: number): Promise<string>;
}
