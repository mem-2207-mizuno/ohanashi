import { describe, it, expect } from 'vitest'
import { AudioRecorder } from '../../../domain/audio/AudioRecorder'
import { Audio } from '../../../domain/audio/Audio'
import { StopRecordingUseCase } from '../../../application/audio/StopRecordingUseCase'

describe('StopRecordingUseCase', () => {
  it('録音を停止してAudioを取得できる', () => {
    // Arrange
    const recorder = new AudioRecorder()
    recorder.start() // 先に録音を開始
    const useCase = new StopRecordingUseCase(recorder)

    // Act
    const audio = useCase.execute()

    // Assert
    // recorder が stopped 状態
    expect(recorder.getState()).toBe('stopped')
    // 戻り値として Audio インスタンスが得られる
    expect(audio).toBeInstanceOf(Audio)
  })

  it('録音が開始されていない状態でstopしてもエラーにならない(仕様次第)', () => {
    // Arrange
    const recorder = new AudioRecorder() // idle状態のまま
    const useCase = new StopRecordingUseCase(recorder)

    // Act & Assert
    expect(() => {
      useCase.execute()
    }).not.toThrow()
    // stateは stopped になる想定
    expect(recorder.getState()).toBe('stopped')
  })
})