import React, { useState } from 'react'
import { AudioRecorderButton } from '../components/AudioRecorderButton'
import { AudioSendButton } from '../components/AudioSendButton'
import { Audio } from '../../domain/audio/Audio'

export const HomePage: React.FC = () => {
  const [recordedAudio, setRecordedAudio] = useState<Audio | null>(null)

  const handleStop = (audio: Audio) => {
    // 録音が停止したら受け取ったAudioをstateに保存
    setRecordedAudio(audio)
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>音声録音デモ</h1>
      <p>録音ボタンを押して、録音後にアップロードができます。</p>

      <AudioRecorderButton onStop={handleStop} />
      <AudioSendButton audio={recordedAudio} />
    </div>
  )
}