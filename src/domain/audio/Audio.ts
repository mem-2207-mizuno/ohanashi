export class Audio {
  public readonly rawData: Blob
  public readonly sampleRate: number
  public readonly duration: number

  constructor(rawData: Blob, sampleRate: number, duration: number) {
    if (!rawData) {
      throw new Error('rawData is required')
    }
    if (sampleRate <= 0) {
      throw new Error('sampleRate must be a positive number')
    }
    if (duration < 0) {
      throw new Error('duration must be >= 0')
    }

    this.rawData = rawData
    this.sampleRate = sampleRate
    this.duration = duration
  }
}