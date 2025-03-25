/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * AudioWorkletProcessor for calculating RMS (volume).
 * We'll register it as "volume-processor".
 */
class VolumeProcessor extends AudioWorkletProcessor {
  private rmsThreshold = 0.01

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(options?: any) {
    super()
    // options.processorOptions などからパラメータ受け取り可
    this.port.onmessage = (event) => {
      if (event.data?.rmsThreshold !== undefined) {
        this.rmsThreshold = event.data.rmsThreshold
      }
    }
  }

  process(inputs: Float32Array[][], outputs: Float32Array[][], parameters: Record<string, Float32Array>): boolean {
    const input = inputs[0]
    if (!input || input.length === 0) {
      return true
    }

    const channelData = input[0]
    if (!channelData) {
      return true
    }

    // RMS計算
    let sum = 0
    for (let i = 0; i < channelData.length; i++) {
      const val = channelData[i]
      sum += val * val
    }
    const rms = Math.sqrt(sum / channelData.length)

    // メインスレッドに送信
    this.port.postMessage({ rms })

    return true
  }
}

registerProcessor('volume-processor', VolumeProcessor)