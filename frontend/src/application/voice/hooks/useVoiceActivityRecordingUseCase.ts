import { useMemo } from 'react';
import { VoiceActivityRecordingUseCase } from '../VoiceActivityRecordingUseCase';
import { VoiceActivityDetectorImpl } from '../../../infrastructure/voice/VoiceActivityDetector';
import { MediaRecorderGatewayImpl } from '../../../infrastructure/voice/VoiceRecorderGateway';
import { AudioUploaderGatewayImpl } from '../../../infrastructure/voice/VoiceUploaderGateway';

/**
 * ユースケースのインスタンス生成をカプセル化するカスタムフック
 */
export const useVoiceActivityRecordingUseCase =
  (): VoiceActivityRecordingUseCase =>
    useMemo(() => {
      // ここで依存性（検出器、録音ゲートウェイ、アップローダー）を生成する
      const detector = new VoiceActivityDetectorImpl();
      const recorderGateway = new MediaRecorderGatewayImpl();
      const uploaderGateway = new AudioUploaderGatewayImpl();
      return new VoiceActivityRecordingUseCase(
        detector,
        recorderGateway,
        uploaderGateway,
      );
    }, []);
