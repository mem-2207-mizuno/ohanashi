import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Audio } from '../../../domain/voice/Audio';
import { AudioUploaderGatewayImpl } from '../../../infrastructure/voice/VoiceUploaderGateway';

import type { Mock } from 'vitest';

describe('AudioSenderGateway', () => {
  beforeEach(() => {
    // fetchをモック
    globalThis.fetch = vi.fn();
  });

  it('音声をアップロードできる', async () => {
    // Arrange
    (globalThis.fetch as Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
    });
    const gateway = new AudioUploaderGatewayImpl('/api/upload');
    const audio = new Audio(new Blob(['test audio']), 44100, 1.2);

    // Act
    await gateway.upload(audio);

    // Assert
    expect(fetch).toHaveBeenCalledOnce();
    const [url, options] = (fetch as Mock).mock.calls[0];
    expect(url).toBe('/api/upload');
    expect(options.method).toBe('POST');
    expect(options.body).toBeInstanceOf(FormData);
  });

  it('サーバーがエラーを返した場合は例外を投げる', async () => {
    // Arrange
    (globalThis.fetch as Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Server Error',
    });
    const gateway = new AudioUploaderGatewayImpl('/api/upload');
    const audio = new Audio(new Blob(['fail audio']), 44100, 1.2);

    // Act & Assert
    await expect(gateway.upload(audio)).rejects.toThrowError(
      'Failed to upload audio: Server Error',
    );
  });

  it('fetch自体が失敗した場合も例外を投げる', async () => {
    // Arrange
    (globalThis.fetch as Mock).mockRejectedValueOnce(
      new Error('Network Error'),
    );
    const gateway = new AudioUploaderGatewayImpl('/api/upload');
    const audio = new Audio(new Blob(['fail audio']), 44100, 1.2);

    // Act & Assert
    await expect(gateway.upload(audio)).rejects.toThrowError('Network Error');
  });
});
