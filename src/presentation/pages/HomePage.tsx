import React, { useState } from 'react';
import { AudioRecorderButton } from '../components/audio/AudioRecorderButton';
import { AudioSendButton } from '../components/audio/AudioSendButton';
import { Audio } from '../../domain/audio/Audio';
import { ThemeSwitcher } from '../components/theme/ThemeSwitcher';

import { Typography } from 'antd';
import Paragraph from 'antd/es/typography/Paragraph';
const { Title } = Typography;

export const HomePage: React.FC = () => {
  const [recordedAudio, setRecordedAudio] = useState<Audio | null>(null);

  const handleStop = (audio: Audio) => {
    // 録音が停止したら受け取ったAudioをstateに保存
    setRecordedAudio(audio);
  };

  return (
    <div style={{ padding: 24 }}>
      <ThemeSwitcher />
      <Title>音声録音デモ</Title>
      <Paragraph>
        録音ボタンを押して、録音後にアップロードができます。
      </Paragraph>

      <AudioRecorderButton onStop={handleStop} />
      <AudioSendButton audio={recordedAudio} />
    </div>
  );
};
