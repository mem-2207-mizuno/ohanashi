export class AudioRecorderGateway {
  private mediaStream: MediaStream | null = null
  private mediaRecorder: MediaRecorder | null = null
  private chunks: BlobPart[] = []

  /**
   * 録音開始
   */
  public async startRecording(): Promise<void> {
    // 音声トラックを取得 (マイク)
    this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true })

    // MediaRecorderを使って録音
    this.mediaRecorder = new MediaRecorder(this.mediaStream)

    // データが来るたびに chunks に追加
    this.mediaRecorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) {
        this.chunks.push(e.data)
      }
    }

    // 録音開始
    this.mediaRecorder.start()
  }

  /**
   * 録音停止
   */
  public async stopRecording(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        return reject(new Error('No active mediaRecorder. Did you call startRecording()?'))
      }

      // onstopイベントでBlobをまとめて返却する
      this.mediaRecorder.onstop = () => {
        const blob = new Blob(this.chunks, { type: 'audio/webm' })
        // 使い終わったらリソース解放
        this.cleanup()
        resolve(blob)
      }

      this.mediaRecorder.onerror = (e) => {
        reject(e)
      }

      // 停止
      this.mediaRecorder.stop()
    })
  }

  private cleanup(): void {
    // MediaStreamのトラックを停止
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop())
    }
    // 初期化
    this.mediaRecorder = null
    this.mediaStream = null
    this.chunks = []
  }
}
