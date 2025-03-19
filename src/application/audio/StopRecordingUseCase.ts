import { AudioRecorder } from '../../domain/audio/AudioRecorder'
import { AudioRecorderGateway } from '../../infrastructure/audio/AudioRecorderGateway'
import { Audio } from '../../domain/audio/Audio'

export class StopRecordingUseCase {
  constructor(
    private domainRecorder: AudioRecorder,
    private infraGateway: AudioRecorderGateway
  ) { }

  public async execute(): Promise<Audio> {
    // 1) 実録音停止 → Blobを受け取る
    const blob = await this.infraGateway.stopRecording()

    // 2) Domain側で "stopped" にして、生成したBlobを使ってAudioをセット
    //    - DomainRecorderのstop()ではダミーのAudioを作っていたが、
    //      今回はその代わりに “本物のblob” を使ってAudioを生成する。
    this.domainRecorder.stopWithBlob(blob)

    // 3) 生成されたAudioを返す
    return this.domainRecorder.getAudio()
  }
}