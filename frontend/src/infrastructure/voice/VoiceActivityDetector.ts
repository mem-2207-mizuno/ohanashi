import { IVoiceActivityDetector } from '../../interfaces/voice/IVoiceActivityDetector.ts';

// ここでworkletファイルをimportし、URLを生成
// ※ Vite等で動く書き方
const volumeWorkletUrl = new URL(
  './worklets/volumeProcessor.worklet.ts',
  import.meta.url,
).href;

interface VolumeData {
  rms: number;
  timestamp: number;
}

export class VoiceActivityDetectorImpl implements IVoiceActivityDetector {
  private audioContext: AudioContext | null = null;
  private workletNode: AudioWorkletNode | null = null;
  private mediaStream: MediaStream | null = null;

  private volumeCallback: ((data: VolumeData) => void) | null = null;

  public async startDetecting(): Promise<void> {
    if (this.audioContext) {
      return;
    }
    this.mediaStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });
    this.audioContext = new AudioContext();

    // AudioWorkletのモジュールを読み込み (TSで書いたものがJSにビルドされる)
    await this.audioContext.audioWorklet.addModule(volumeWorkletUrl);

    this.workletNode = new AudioWorkletNode(
      this.audioContext,
      'volume-processor',
    );
    const source = this.audioContext.createMediaStreamSource(this.mediaStream);
    source.connect(this.workletNode);
    this.workletNode.connect(this.audioContext.destination);

    this.workletNode.port.onmessage = (event) => {
      if (!this.volumeCallback) return;
      const { rms } = event.data;
      const data = { rms, timestamp: performance.now() };
      this.volumeCallback(data);
    };
  }

  /**
   * 音量通知を受け取るコールバックを登録
   */
  public onVolume(cb: (data: VolumeData) => void) {
    this.volumeCallback = cb;
  }

  /**
   * 終了処理
   */
  public stopAll() {
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop());
      this.mediaStream = null;
    }
    this.workletNode = null;
  }
}
