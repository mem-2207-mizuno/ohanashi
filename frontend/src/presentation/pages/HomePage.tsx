import React, { useEffect } from 'react';

import { Avatar, theme } from 'antd';
import { VoiceActivityRecordButton } from '../components/audio/VoiceActivityRecordButton';
import {
  HomeMain,
  HomePageContainer,
  TalkerWrapper,
  VoiceControllerWrapper,
} from './HomePageStyle';
import { useChatStore } from '../stores/chatStore';
import { useChat } from '../hooks/useChat';
import ChatList from '../components/chat/chatList';

export const HomePage: React.FC = () => {
  const chatLogs = useChatStore((state) => state.chatLogs);
  const { throwChat } = useChat();

  const { token } = theme.useToken();

  useEffect(() => {
    if (chatLogs.length > 0 && chatLogs.slice(-1)[0].talker === 'user') {
      throwChat();
    }
  }, [chatLogs, throwChat]);

  return (
    <HomePageContainer>
      <HomeMain>
        <TalkerWrapper backgroundColor={token.colorText}>
          <Avatar
            src={`https://api.dicebear.com/7.x/miniavs/svg?seed=100`}
            size="large"
          />
        </TalkerWrapper>

        <div
          style={{
            overflow: 'scroll',
            height: '100%',
            width: '50vw',
            backgroundColor: token.colorFill,
          }}
        >
          <ChatList chatLogs={chatLogs} />
        </div>
      </HomeMain>
      <VoiceControllerWrapper>
        <VoiceActivityRecordButton />
      </VoiceControllerWrapper>
    </HomePageContainer>
  );
};
