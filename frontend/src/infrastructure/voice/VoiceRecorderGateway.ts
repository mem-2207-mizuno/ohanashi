import { IVoiceRecorderGateway } from '../../interfaces/voice/IVoiceRecorderGateway';

export class MediaRecorderGatewayImpl implements IVoiceRecorderGateway {
  private mediaStream: MediaStream | null = null;
  private mediaRecorder: MediaRecorder | null = null;
  private chunks: BlobPart[] = [];

  constructor() {
    // 必要に応じて依存注入
  }

  /**
   * 録音開始
   * ※ 事前に getUserMedia を呼ぶか、外部からMediaStreamを注入するか決定
   */
  public startRecording(stream: MediaStream): void {
    this.mediaStream = stream;
    this.mediaRecorder = new MediaRecorder(this.mediaStream);

    this.chunks = [];
    this.mediaRecorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) {
        this.chunks.push(e.data);
      }
    };

    this.mediaRecorder.start();
  }

  /**
   * 録音停止 → Blobを返す
   */
  public async stopRecording(): Promise<Blob | null> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        // return reject(
        //   new Error('No active mediaRecorder. startRecording() first.')
        // );

        // エラーではなく null を返す
        return resolve(null);
      }
      this.mediaRecorder.onstop = () => {
        const blob = new Blob(this.chunks, { type: 'audio/webm' });
        this.cleanup();
        resolve(blob);
      };
      this.mediaRecorder.onerror = (err) => {
        reject(err);
      };
      this.mediaRecorder.stop();
    });
  }

  private cleanup() {
    this.mediaRecorder = null;
    this.mediaStream = null;
    this.chunks = [];
  }
}
