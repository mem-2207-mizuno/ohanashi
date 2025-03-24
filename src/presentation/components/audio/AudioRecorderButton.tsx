import React, { useRef, useState } from 'react';
import { Button, message } from 'antd';
import { AudioRecorder } from '../../../domain/audio/AudioRecorder';
import { StopRecordingUseCase } from '../../../application/audio/StopRecordingUseCase';
import { Audio } from '../../../domain/audio/Audio';
import { StartRecordingUseCase } from '../../../application/audio/StartRecordingUseCase';
import { AudioRecorderGateway } from '../../../infrastructure/audio/AudioRecorderGateway';
import { useVoiceVisualizer, VoiceVisualizer } from 'react-voice-visualizer';
import { theme } from 'antd';
import { VoiceVisualizerWrapper } from './AudioRecorderButtonStyle';

type Props = {
  onStop?: (audio: Audio) => void;
};

export const AudioRecorderButton: React.FC<Props> = ({ onStop }) => {
  const [recording, setRecording] = useState(false);

  const recorderRef = useRef(new AudioRecorder());
  const gatewayRef = useRef(new AudioRecorderGateway());

  const recorderControls = useVoiceVisualizer();

  const { token } = theme.useToken();

  const handleRecordToggle = async () => {
    if (!recording) {
      try {
        const recordUseCase = new StartRecordingUseCase(
          recorderRef.current,
          gatewayRef.current
        );
        recordUseCase.execute();

        recorderControls.startRecording();
        setRecording(true);
      } catch (error) {
        message.error(`録音開始に失敗しました: ${error}`);
      }
    } else {
      try {
        const stopUseCase = new StopRecordingUseCase(
          recorderRef.current,
          gatewayRef.current
        );
        const audioData = await stopUseCase.execute();
        recorderControls.stopRecording();
        setRecording(false);
        message.success(`録音停止。duration=${audioData.duration}秒`);

        onStop?.(audioData);
      } catch (error) {
        message.error(`録音停止に失敗しました: ${error}`);
      }
    }
  };

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <Button
        type={recording ? 'primary' : 'default'}
        onClick={handleRecordToggle}
        style={{ marginBottom: '1rem' }}
      >
        {recording ? '停止' : '録音開始'}
      </Button>

      {/* 録音中のみ表示 */}
      {recording && (
        <VoiceVisualizerWrapper>
          <VoiceVisualizer
            controls={recorderControls}
            backgroundColor='transparent'
            barWidth={5}
            gap={1}
            speed={1}
            rounded={5}
            onlyRecording
            isControlPanelShown={false}
            mainBarColor={token.colorTextSecondary}
            secondaryBarColor={token.colorTextTertiary}
            defaultMicrophoneIconColor={token.colorText}
          />
        </VoiceVisualizerWrapper>
      )}
    </div>
  );
};
