import React, { useState } from 'react'
import { Button, message } from 'antd'
import { AudioSenderGateway } from '../../infrastructure/audio/AudioSenderGateway'
import { Audio } from '../../domain/audio/Audio'
import { SendAudioUseCase } from '../../application/audio/SendAudioUseCase'

type Props = {
  audio: Audio | null
}

export const AudioSendButton: React.FC<Props> = ({ audio }) => {
  const [sending, setSending] = useState(false)

  const handleSend = async () => {
    if (!audio) {
      message.warning('音声データがありません')
      return
    }
    setSending(true)

    // Infrastructureインスタンスを生成（ここでは直書き）
    const senderGateway = new AudioSenderGateway()
    const sendUseCase = new SendAudioUseCase(senderGateway)

    try {
      await sendUseCase.execute(audio)
      message.success('音声データの送信に成功')
    } catch (error) {
      console.error(error)
      message.error('送信に失敗しました')
    } finally {
      setSending(false)
    }
  }

  return (
    <Button onClick={handleSend} loading={sending}>
      アップロード
    </Button>
  )
}