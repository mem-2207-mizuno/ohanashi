import { describe, it, expect } from 'vitest'
import { AudioRecorder } from '../../../domain/audio/AudioRecorder'
import { StartRecordingUseCase } from '../../../application/audio/StartRecordingUseCase'
import { AudioRecorderGateway } from '../../../infrastructure/audio/AudioRecorderGateway'

describe('StartRecordingUseCase', () => {
  it('録音を開始できる（AudioRecorderのstartを呼ぶ）', () => {
    // Arrange
    // DomainのAudioRecorderを用意
    const recorder = new AudioRecorder()
    // あるいはテスト用のMockを注入する場合もあるが、
    // ここではDomainの実装をそのまま使う例にしておく
    const gateway = new AudioRecorderGateway()

    // ApplicationレイヤーのUseCaseを生成し、recorderをDI(依存注入)する
    const useCase = new StartRecordingUseCase(
      recorder,
      gateway
    )

    // Act
    useCase.execute()

    // Assert
    // ドメインオブジェクトの状態が "recording" になったらOK
    expect(recorder.getState()).toBe('recording')
  })

  it('すでに録音中の場合はエラーを投げる', () => {
    // Arrange
    const recorder = new AudioRecorder()
    const gateway = new AudioRecorderGateway()
    const useCase = new StartRecordingUseCase(
      recorder,
      gateway
    )
    recorder.start() // 既にrecording中にする

    // Act & Assert
    // UseCaseを実行すると、Domainがエラーを投げるはず
    expect(() => {
      useCase.execute()
    }).toThrowError()
  })
})