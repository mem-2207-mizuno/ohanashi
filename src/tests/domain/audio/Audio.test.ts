import { describe, it, expect } from 'vitest'
import { Audio } from '../../../domain/audio/Audio' // 実装ファイル(未完成)をimport

describe('Audio Entity', () => {
  it('音声データを正しく保持できること', () => {
    // Arrange
    const sampleRate = 44100
    const duration = 3.5 // 3.5秒
    const raw = new Blob(['dummy PCM data'], { type: 'audio/wav' })

    // Act
    const audio = new Audio(raw, sampleRate, duration)

    // Assert
    // Audioインスタンスに正しく値がセットされているかを検証
    expect(audio.rawData).toBe(raw)
    expect(audio.sampleRate).toBe(sampleRate)
    expect(audio.duration).toBe(duration)
  })

  it('不正なデータが与えられた場合は例外を投げる', () => {
    // rawDataがnullの場合を想定
    expect(() => {
      new Audio(null as unknown as Blob, 44100, 3.5)
    }).toThrowError()

    // sampleRateが0や負の場合
    expect(() => {
      new Audio(new Blob(), 0, 3.5)
    }).toThrowError()
    expect(() => {
      new Audio(new Blob(), -1, 3.5)
    }).toThrowError()

    // durationが負の場合
    expect(() => {
      new Audio(new Blob(), 44100, -1)
    }).toThrowError()
  })
})