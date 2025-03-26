import { Audio } from '../../domain/voice/Audio';
import { IVoiceUploader } from '../../interfaces/voice/IVoiceUploader';

/**
 * ユースケース: Audioをサーバーなどへ送信する
 */
export class UploadAudioUseCase {
  constructor(private sender: IVoiceUploader) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async execute(audio: Audio): Promise<any> {
    // インフラ層のsenderを通じて送信
    return await this.sender.upload(audio);
    // 失敗時はrejectされる → テストで throw を確認
  }
}
