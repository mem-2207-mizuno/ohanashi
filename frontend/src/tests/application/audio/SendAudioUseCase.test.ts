import { describe, it, expect, vi } from 'vitest';
import { UploadAudioUseCase } from '../../../application/voice/UploadAudioUseCase';
import { Audio } from '../../../domain/voice/Audio';

// モック用のインターフェース(実際はinfrastructure層に定義しているかもしれません)
interface AudioSenderGateway {
  send(audio: Audio): Promise<void>;
}

describe('SendAudioUseCase', () => {
  it('Audioを送信する', async () => {
    // Arrange
    const sampleRate = 44100;
    const dummyBlob = new Blob(['dummy audio'], { type: 'audio/wav' });
    const audio = new Audio(dummyBlob, sampleRate, 0);

    // 送信が成功するモック
    const mockAudioSender: AudioSenderGateway = {
      send: vi.fn().mockResolvedValue(undefined), // 何も返さず成功
    };
    const useCase = new UploadAudioUseCase(mockAudioSender);

    // Act
    await useCase.execute(audio);

    // Assert
    // モックのsendが呼ばれ、Audioが引数として渡っていること
    expect(mockAudioSender.send).toHaveBeenCalledOnce();
    expect(mockAudioSender.send).toHaveBeenCalledWith(audio);
  });

  it('送信が失敗した場合は例外を投げる', async () => {
    // Arrange
    const sampleRate = 44100;
    const dummyBlob = new Blob(['dummy audio'], { type: 'audio/wav' });
    const audio = new Audio(dummyBlob, sampleRate, 0);

    // 送信が失敗するモック
    const mockAudioSender: AudioSenderGateway = {
      send: vi.fn().mockRejectedValue(new Error('Upload failed')),
    };
    const useCase = new UploadAudioUseCase(mockAudioSender);

    // Act & Assert
    // useCase.execute(audio) が rejected となることを確認
    await expect(useCase.execute(audio)).rejects.toThrowError('Upload failed');
  });
});
