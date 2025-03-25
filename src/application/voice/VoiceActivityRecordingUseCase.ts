import { Audio } from '../../domain/voice/Audio';
import { IVoiceUploader } from '../../interfaces/voice/IVoiceUploader';
import { IVoiceRecorderGateway } from '../../interfaces/voice/IVoiceRecorderGateway';
import { IVoiceActivityDetector } from '../../interfaces/voice/IVoiceActivityDetector';
import { v4 as uuid } from 'uuid';
import { UploadedChunk } from '../../presentation/types/uploadedChunk';

/**
 * 音声が一定閾値を超えたら録音をstart、
 * 無音が続いたら録音をstopして、Blobを確定する例。
 */
export class VoiceActivityRecordingUseCase {
  // しきい値など
  private volumeThreshold = 0.01;
  private silenceDuration = 1000; // ms
  private lastActiveTime = 0;
  private isRecording = false;

  private uploadedChunks: UploadedChunk[] = [];
  private onUploaded?: (id: string, chunk: UploadedChunk) => void;
  private onAddedChunk?: (id: string) => void;

  constructor(
    private detector: IVoiceActivityDetector,
    private recorderGateway: IVoiceRecorderGateway,
    private audioUploader: IVoiceUploader,
  ) {}

  public async start(): Promise<void> {
    // 1) 音量検出スタート
    await this.detector.startDetecting();

    // 2) volumeCallbackで判定
    this.detector.onVolume(({ rms, timestamp }) => {
      if (rms > this.volumeThreshold) {
        // 音あり
        this.lastActiveTime = timestamp;
        if (!this.isRecording) {
          // 録音開始
          console.log('Start recording due to voice activity');
          // MediaRecorderにマイクを流用
          const stream = this.getCurrentStream();
          this.recorderGateway.startRecording(stream);
          this.isRecording = true;
        }
      } else {
        // 無音
        if (this.isRecording) {
          const silenceTime = timestamp - this.lastActiveTime;
          if (silenceTime > this.silenceDuration) {
            // stop
            console.log('Stop recording due to silence');
            this.handleStopAndUpload();
            this.isRecording = false;
          }
        }
      }
    });
  }

  /**
   * UseCase終了: Detector/Recorderの終了処理
   */
  public async stopAll(): Promise<void> {
    // まだ録音中ならstopRecording()しておく
    if (this.isRecording) {
      await this.handleStopAndUpload();
      this.isRecording = false;
    }
    this.detector.stopAll();
  }

  /**
   * 生成済みのアップロード結果を取得
   * UIなどで表示可能
   */
  public getUploadedChunks(): UploadedChunk[] {
    return this.uploadedChunks;
  }

  public setOnAddedChunk(cb: (id: string) => void) {
    this.onAddedChunk = cb;
  }

  public setOnUploaded(cb: (id: string, chunk: UploadedChunk) => void) {
    this.onUploaded = cb;
  }

  // ------------------- private methods -------------------

  /**
   * 録音停止し、Blobを取得して即アップロード
   */
  private async handleStopAndUpload(): Promise<void> {
    if (this.isRecording) {
      const blob = await this.recorderGateway.stopRecording();
      console.log('Recorded blob', blob);

      if (blob === null) {
        return;
      }

      // DomainレイヤーでAudio生成 (サンプル)
      const audio = new Audio(blob, 44100, 0); // durationは後で計算してもOK

      // IDを先行発行
      const id = uuid();

      // 自動アップロード
      try {
        // コールバック呼び出し
        if (this.onAddedChunk) {
          this.onAddedChunk(id);
        }

        const response = await this.audioUploader.upload(audio);
        console.log('Uploaded response', response);

        const chunk: UploadedChunk = {
          id,
          status: 'success',
          applicationData: {
            audio: blob,
            outputText: response.output,
            errorMessage: response.error,
          },
        };

        // 結果を保持
        this.uploadedChunks.push(chunk);

        // コールバック呼び出し
        if (this.onUploaded) {
          this.onUploaded(id, chunk);
        }
      } catch (err) {
        console.error('Upload failed', err);
        // エラー時の処理
        const failed: UploadedChunk = {
          id: id,
          status: 'failed',
        };
        this.uploadedChunks.push(failed);
        // ここで onUploaded で "failed" 通知してもよい
        if (this.onUploaded) {
          this.onUploaded(id, failed);
        }
      }
    }
  }

  private getCurrentStream(): MediaStream {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const stream = (this.detector as any).mediaStream;
    if (!stream) {
      throw new Error('No MediaStream available in VoiceActivityDetector');
    }
    return stream;
  }
}
