import { ChatMessage } from '../../domain/chat/ChatMessage';
import { ChatRepository } from '../../interfaces/chat/ChatRepository';

export class ChatUseCase {
  constructor(private chat: ChatRepository) {}

  public async throwChat(chatHistory: ChatMessage[]) {
    const aiResponse = await this.chat.throwChat(chatHistory);

    return aiResponse;
  }
}
