import { Audio } from '../../domain/voice/Audio';
import { AudioUploadResponse } from '../../domain/voice/types/AudioUploadResponse';

export interface IVoiceUploader {
  upload(audio: Audio): Promise<AudioUploadResponse>;
}
