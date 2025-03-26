import { AudioChunk } from '../../application/voice/types/audioChunk';

export type Talker = 'user' | 'ai';

/**
 * 1つのチャット発話を表す
 */
export class ChatMessage {
  public readonly id: string;
  public readonly talker: Talker;
  public readonly audioChunks: AudioChunk[]; // Domain側の音声データ
  public readonly text: string;
  public readonly createdAt: Date;

  constructor(params: {
    id: string;
    talker: Talker;
    audioChunks: AudioChunk[];
    text: string;
    createdAt?: Date;
  }) {
    this.id = params.id;
    this.talker = params.talker;
    this.audioChunks = params.audioChunks;
    this.text = params.text;
    this.createdAt = params.createdAt ?? new Date();
  }

  // ビジネスロジックがあるならここで追加
}
