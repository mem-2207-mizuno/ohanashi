import { describe, it, expect } from 'vitest';
import { AudioRecorder } from '../../../domain/voice/AudioRecorder';
import { Audio } from '../../../domain/voice/Audio';

describe('AudioRecorder Domain Service', () => {
  it('録音を開始したら recording 状態になる', () => {
    // Arrange
    const recorder = new AudioRecorder();

    // Act
    recorder.start();

    // Assert
    expect(recorder.getState()).toBe('recording');
  });

  it('録音を停止すると stopped 状態になり、Audioインスタンスを取得できる', () => {
    // Arrange
    const recorder = new AudioRecorder();
    recorder.start(); // 録音中

    // Act
    const dummyBlob = new Blob(['dummy audio data'], { type: 'audio/wav' });
    recorder.stopWithBlob(dummyBlob);

    // Assert
    expect(recorder.getState()).toBe('stopped');

    // 停止後に音声データ（Audio）が取得できる想定
    const audio = recorder.getAudio();
    expect(audio).toBeInstanceOf(Audio);
    // Audioのプロパティが正しい形で設定されているか（モック想定でOK）
    // 今回はとりあえずサンプルレートだけ確認
    expect(audio.sampleRate).toBe(44100);
    expect(audio.duration).toBeGreaterThanOrEqual(0);
  });

  it('recording 中に start() を呼び出すとエラーを投げる', () => {
    // Arrange
    const recorder = new AudioRecorder();
    recorder.start();

    // Act & Assert
    expect(() => {
      recorder.start();
    }).toThrowError();
  });

  it('stopped 状態になっている場合に stop() を呼んでもエラーにならない（単に無視する）', () => {
    const recorder = new AudioRecorder();
    recorder.start();
    recorder.stopWithBlob(new Blob(['dummy audio'], { type: 'audio/wav' }));

    // stopped状態で再度 stop() を呼んでもエラーにはしないポリシー
    expect(() => {
      recorder.stopWithBlob(new Blob(['another data'], { type: 'audio/wav' }));
    }).not.toThrow();

    // 状態は依然 stopped
    expect(recorder.getState()).toBe('stopped');
  });
});
