import { Audio } from '../../domain/audio/Audio'

export interface IAudioSenderGateway {
  send(audio: Audio): Promise<string>
}

/**
 * ユースケース: Audioをサーバーなどへ送信する
 */
export class SendAudioUseCase {
  constructor(private sender: IAudioSenderGateway) { }

  public async execute(audio: Audio): Promise<void> {
    // インフラ層のsenderを通じて送信
    await this.sender.send(audio)
    // 失敗時はrejectされる → テストで throw を確認
  }
}