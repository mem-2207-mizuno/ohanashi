import React, { useRef, useState } from 'react'
import { Button, message } from 'antd'
import { AudioRecorder } from '../../domain/audio/AudioRecorder'
import { StopRecordingUseCase } from '../../application/audio/StopRecordingUseCase'
import { Audio } from '../../domain/audio/Audio'
import { StartRecordingUseCase } from '../../application/audio/StartRecordingUseCase'
import { AudioRecorderGateway } from '../../infrastructure/audio/AudioRecorderGateway'

type Props = {
  onStop?: (audio: Audio) => void
}

/**
 * 単一ボタンで録音開始/停止をトグルするコンポーネント
 */
export const AudioRecorderButton: React.FC<Props> = ({ onStop }) => {
  const [recording, setRecording] = useState(false)

  // DomainレイヤーのAudioRecorderを1つだけ作り、再レンダリングされても同じインスタンスを使うため useRef に保持
  const recorderRef = useRef(new AudioRecorder())

  // InfrastructureレイヤーのAudioRecorderGateway
  const gatewayRef = useRef(new AudioRecorderGateway())

  const handleRecordToggle = async () => {
    if (!recording) {
      // 録音開始
      try {
        const recordUseCase = new StartRecordingUseCase(
          recorderRef.current,
          gatewayRef.current
        )
        recordUseCase.execute()
        setRecording(true)
      } catch (error) {
        message.error(`録音開始に失敗しました: ${error}`)
      }
    } else {
      // 録音停止
      try {
        const stopUseCase = new StopRecordingUseCase(
          recorderRef.current,
          gatewayRef.current
        )
        const audioData = await stopUseCase.execute()
        setRecording(false)
        message.success(`録音停止。duration=${audioData.duration}秒`)

        onStop?.(audioData)
      } catch (error) {
        message.error(`録音停止に失敗しました: ${error}`)
      }
    }
  }

  return (
    <Button onClick={handleRecordToggle}>
      {recording ? '停止' : '録音開始'}
    </Button>
  )
}