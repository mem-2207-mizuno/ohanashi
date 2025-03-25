import React, { useEffect } from 'react';

import { Avatar, List, theme } from 'antd';
import { VoiceActivityRecordButton } from '../components/audio/VoiceActivityRecordButton';
import {
  HomeMain,
  HomePageContainer,
  TalkerWrapper,
  VoiceControllerWrapper,
} from './HomePageStyle';
import Item from 'antd/es/descriptions/Item';
import { useChatStore } from '../stores/chatStore';
import { useChat } from '../hooks/useChat';

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
          <List>
            {chatLogs.map((chat, i) => {
              return (
                <Item key={i}>
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${
                          chat.talker === 'ai' ? '100' : '3'
                        }`}
                      />
                    }
                    title={chat.text}
                  />
                </Item>
              );
            })}
          </List>
        </div>
      </HomeMain>
      <VoiceControllerWrapper>
        <VoiceActivityRecordButton />
      </VoiceControllerWrapper>
    </HomePageContainer>
  );
};
