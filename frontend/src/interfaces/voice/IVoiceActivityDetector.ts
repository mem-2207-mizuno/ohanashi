export interface IVoiceActivityDetector {
  startDetecting(): Promise<void>;
  stopAll(): void;
  onVolume(callback: (data: { rms: number; timestamp: number }) => void): void;
}
