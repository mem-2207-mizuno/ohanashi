export interface IVoiceRecorderGateway {
  startRecording(stream: MediaStream): void;
  stopRecording(): Promise<Blob | null>;
}
