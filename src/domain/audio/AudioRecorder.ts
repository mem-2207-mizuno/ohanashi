import { Audio } from './Audio'

type RecorderState = 'idle' | 'recording' | 'stopped'

export class AudioRecorder {
  private state: RecorderState = 'idle'
  private audio: Audio | null = null
  private startTime: number | null = null

  /**
   * 録音を開始する
   * すでに録音中の場合はエラー
   */
  public start(): void {
    if (this.state === 'recording') {
      throw new Error('Already recording')
    }
    // 状態を recording に変更
    this.state = 'recording'
    this.startTime = Date.now()

    // Domainではロジックを最小限に留める。
    // 本来ならInfrastructureでMediaRecorderを開始などするが、
    // Domainではそこまで踏み込まず、「録音開始状態」という情報のみ持つ。
  }

  // 既存のstop()とは別に、外部からBlobを受け取って停止するメソッド
  public stopWithBlob(blob: Blob): void {
    if (this.state === 'stopped') {
      // テストの期待通り、stopped状態ならエラーにしない
      return
    }
    // 状態を stopped にして、録音結果（Audio）を生成
    this.state = 'stopped'

    // 実際の録音時間(秒)
    let durationSec = 0
    if (this.startTime) {
      const endTime = Date.now()
      durationSec = (endTime - this.startTime) / 1000
    }

    // blobをDomain側のAudioオブジェクトに包む
    // sampleRateやdurationは追加で計算してもいいし、固定値でもいい
    this.audio = new Audio(blob, 44100, durationSec)
  }

  /**
   * 現在の状態を返す
   */
  public getState(): RecorderState {
    return this.state
  }

  /**
   * 音声データ(Audio)を返す
   */
  public getAudio(): Audio {
    if (!this.audio) {
      // まだ録音停止してない場合は audio が存在しない想定
      throw new Error('No audio data available yet')
    }
    return this.audio
  }
}