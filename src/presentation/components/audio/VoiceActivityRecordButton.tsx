// src/presentation/components/VoiceActivityRecordButton.tsx

import React, { useState } from 'react';
import { Button, theme } from 'antd';
import { useRecordingStore } from '../../stores/recordingStore';
import { useVoiceActivityRecordingUseCase } from '../../../application/voice/hooks/useVoiceActivityRecordingUseCase';
import { VoiceVisualizerWrapper } from './VoiceVisualizerStyle';
import { useVoiceVisualizer, VoiceVisualizer } from 'react-voice-visualizer';
import { AudioOutlined, AudioMutedOutlined } from '@ant-design/icons';
import { useChatStore } from '../../stores/chatStore';
import { AudioChunk } from '../../../application/voice/types/audioChunk';
import { Typography } from 'antd';
import { UploadedChunk } from '../../types/uploadedChunk';

const { Text } = Typography;

const getChunkText = (chunks: UploadedChunk[]) =>
  chunks
    .filter((ch) => ch.status === 'success' && ch.applicationData !== undefined)
    .map((ch) => ch.applicationData?.outputText)
    .join(' ');

export const VoiceActivityRecordButton: React.FC = () => {
  const [recording, setRecording] = useState(false);

  const voiceRecordingUseCase = useVoiceActivityRecordingUseCase();

  const uploadedChunks = useRecordingStore((state) => state.uploadedChunks);
  const addRecord = useRecordingStore((state) => state.addUploadedChunk);
  const updateRecord = useRecordingStore((state) => state.updateUploadedChunk);
  const clearChunks = useRecordingStore((state) => state.clearChunks);

  const addChat = useChatStore((state) => state.addChat);

  const recorderControls = useVoiceVisualizer();

  const { token } = theme.useToken();

  const handleClick = async () => {
    if (!recording) {
      await voiceRecordingUseCase.start();

      voiceRecordingUseCase.setOnAddedChunk((id) => {
        addRecord(id);
      });

      voiceRecordingUseCase.setOnUploaded((id, chunk) => {
        updateRecord(id, chunk);
      });

      recorderControls.startRecording();
      setRecording(true);
    } else {
      // stopAll
      await voiceRecordingUseCase.stopAll();

      recorderControls.stopRecording();
      setRecording(false);

      addChat({
        id: '',
        talker: 'user',
        audioChunks: uploadedChunks.reduce((acc: AudioChunk[], ch) => {
          if (ch.status !== 'success' || !ch.applicationData) {
            return acc;
          }

          acc.push({
            audio: ch.applicationData?.audio,
            outputText: ch.applicationData?.outputText,
            errorMessage: ch.applicationData.errorMessage,
          });

          return acc;
        }, []),
        text: getChunkText(uploadedChunks),
        createdAt: new Date(),
      });

      clearChunks();
    }
  };

  return (
    <div>
      <div
        style={{
          display: 'flex',
          // flexDirection: 'column',
          alignItems: 'center',
          height: '100px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100px',
            flexShrink: 0,
          }}
        >
          <Button
            icon={recording ? <AudioMutedOutlined /> : <AudioOutlined />}
            shape="circle"
            size="large"
            type={recording ? 'primary' : 'default'}
            onClick={handleClick}
            style={{ marginBottom: '0' }}
          >
            {/* {recording ? '停止' : '録音開始'} */}
          </Button>
        </div>

        <div
          style={{
            flexGrow: 1,
          }}
        >
          {/* 録音中のみ表示 */}
          {recording && (
            <VoiceVisualizerWrapper>
              <VoiceVisualizer
                controls={recorderControls}
                backgroundColor="transparent"
                barWidth={5}
                gap={1}
                speed={1}
                rounded={5}
                height={100}
                onlyRecording
                isControlPanelShown={false}
                mainBarColor={token.colorTextSecondary}
                secondaryBarColor={token.colorTextTertiary}
                defaultMicrophoneIconColor={token.colorText}
              />
            </VoiceVisualizerWrapper>
          )}
        </div>
      </div>
      <Text>{getChunkText(uploadedChunks)}</Text>
    </div>
  );
};
