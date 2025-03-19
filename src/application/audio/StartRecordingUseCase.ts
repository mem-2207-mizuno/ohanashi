import { AudioRecorder } from '../../domain/audio/AudioRecorder'
import { AudioRecorderGateway } from '../../infrastructure/audio/AudioRecorderGateway'

export class StartRecordingUseCase {
  constructor(
    private domainRecorder: AudioRecorder,
    private infraGateway: AudioRecorderGateway
  ) { }

  public async execute(): Promise<void> {
    // 1) Domain上の状態を "recording" にする
    //    - すでにrecordingならエラーを投げるなどはDomain側が管理
    this.domainRecorder.start()

    // 2) 実際の録音を開始 (Infrastructure)
    await this.infraGateway.startRecording()
  }
}