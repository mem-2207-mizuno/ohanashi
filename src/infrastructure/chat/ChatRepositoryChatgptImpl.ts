import { ChatMessage } from '../../domain/chat/ChatMessage';
import { ChatRepository } from '../../interfaces/chat/ChatRepository';
import { config } from '../config';

export class ChatRepositoryChatgptImpl implements ChatRepository {
  public async throwChat(
    chatHistory: ChatMessage[],
    maxLength: number = 100,
  ): Promise<string> {
    const API_KEY = import.meta.env.VITE_DIFY_CHAT_API_KEY || '';
    if (!API_KEY) {
      throw new Error('APIキーが設定されていません');
    }

    const runPayload = {
      inputs: {
        chatLogs: chatHistory
          .map((ch) => `${ch.talker === 'user' ? 'Me' : 'You'}: ${ch.text}`)
          .join('\n'),
        maxLength: maxLength,
      },
      response_mode: 'blocking',
      user: 'abc-123',
    };

    const difyBaseURL = config.DIFY_BASE_URL;
    const runRes = await fetch(`${difyBaseURL}/workflows/run`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(runPayload),
    });

    if (!runRes.ok) {
      throw new Error(`Failed to upload audio: ${runRes.statusText}`);
    }

    const runJson = await runRes.json();

    return runJson['data']['outputs']['text'];
  }
}
