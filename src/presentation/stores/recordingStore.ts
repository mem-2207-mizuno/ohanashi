import { create } from 'zustand';
import { UploadedChunk } from '../types/uploadedChunk';

interface RecordingState {
  uploadedChunks: UploadedChunk[];
  addUploadedChunk: (id: string) => void;
  updateUploadedChunk: (id: string, partial: Partial<UploadedChunk>) => void;
  clearChunks: () => void;
}

export const useRecordingStore = create<RecordingState>((set) => ({
  uploadedChunks: [],

  addUploadedChunk: (id) =>
    set((state) => ({
      uploadedChunks: [
        ...state.uploadedChunks,
        {
          id,
          status: 'loading', // まだblobやresponseはない状態
        },
      ],
    })),

  updateUploadedChunk: (id, partial) =>
    set((state) => {
      const nextChunks = state.uploadedChunks.map((chunk) => {
        if (chunk.id === id) {
          return { ...chunk, ...partial };
        }
        return chunk;
      });
      return { uploadedChunks: nextChunks };
    }),
  clearChunks: () =>
    set(() => ({
      uploadedChunks: [],
    })),
}));
