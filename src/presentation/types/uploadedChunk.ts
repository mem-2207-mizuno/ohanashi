import { AudioChunk } from '../../application/voice/types/audioChunk';

export type UploadStatus = 'loading' | 'success' | 'failed';

export interface UploadedChunk {
  id: string;
  status: UploadStatus;
  applicationData?: AudioChunk;
}
