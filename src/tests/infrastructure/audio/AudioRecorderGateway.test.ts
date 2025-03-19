import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest'
import { AudioRecorderGateway } from '../../../infrastructure/audio/AudioRecorderGateway'

import type { Mock } from 'vitest'

class MockMediaRecorder {
  ondataavailable: ((e: { data: Blob }) => void) | null = null
  onstop: (() => void) | null = null
  onerror: ((e: Error) => void) | null = null

  constructor(stream: MediaStream) {
    // 特に何もしないが、必要に応じてstreamを保持
    console.log(stream);
  }

  start() {
    // ダミー実装
  }

  stop() {
    // stopが呼ばれたらonstopイベントを呼ぶ
    if (this.onstop) {
      this.onstop()
    }
  }
}

describe('AudioRecorderGateway', () => {
  beforeAll(() => {
    // グローバルにMockMediaRecorderを差し替え
    Object.defineProperty(globalThis, 'MediaRecorder', {
      writable: true,
      configurable: true,
      value: MockMediaRecorder,
    })

    // あるいは簡易的に:
    // globalThis.MediaRecorder = MockMediaRecorder as unknown as typeof MediaRecorder
  })

  // グローバル環境のMock設定
  beforeEach(() => {
    // navigator.mediaDevices.getUserMediaをモック
    const mockGetUserMedia = vi.fn()

    Object.defineProperty(globalThis.navigator, 'mediaDevices', {
      configurable: true,
      writable: true,
      value: {
        getUserMedia: mockGetUserMedia,
      },
    })
  })

  it('録音を開始するとgetUserMediaが呼ばれる', async () => {
    // Arrange
    (navigator.mediaDevices.getUserMedia as Mock).mockResolvedValueOnce({
      // 返却するMediaStreamのモック
      getTracks: () => [],
    })

    const gateway = new AudioRecorderGateway()

    // Act
    await gateway.startRecording()

    // Assert
    expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalledOnce()
    expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalledWith({
      audio: true,
    })
  })

  it('録音を停止するとBlobを取得できる', async () => {
    // Arrange
    // getUserMediaのモック
    (navigator.mediaDevices.getUserMedia as Mock).mockResolvedValueOnce({
      getTracks: () => [],
    })

    const gateway = new AudioRecorderGateway()
    await gateway.startRecording()

    // MediaRecorder自体のモックで、データイベント発火をシミュレート
    // ただ、Infrastructure内でMediaRecorderを使う場合、イベント処理をどうテストするかは工夫が必要
    // ここでは最小限、stopRecording()呼び出し時にBlobを返すようにダミー実装する予定

    // Act
    const blob = await gateway.stopRecording()

    // Assert
    expect(blob).toBeInstanceOf(Blob)
    // 生成されたBlobの中身まではモック次第
  })

  it('ユーザーがマイク使用を拒否した場合はエラーを投げる', async () => {
    // Arrange
    (navigator.mediaDevices.getUserMedia as Mock).mockRejectedValueOnce(
      new Error('Permission denied')
    )
    const gateway = new AudioRecorderGateway()

    // Act & Assert
    await expect(gateway.startRecording()).rejects.toThrowError('Permission denied')
  })
})
