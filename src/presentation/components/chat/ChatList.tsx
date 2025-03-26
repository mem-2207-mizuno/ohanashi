import { Avatar, List, Typography } from 'antd';
import { ChatMessage } from '../../../domain/chat/ChatMessage';
import { StyledListItem } from './ChatListStyle';

const { Text } = Typography;

interface Props {
  chatLogs: ChatMessage[];
}

const ChatList: React.FC<Props> = ({ chatLogs }) => {
  return (
    <List
      // locale={{ emptyText: 'aaa' }}
      dataSource={chatLogs}
      renderItem={(item) => (
        <List.Item
          actions={[
            <a key="list-loadmore-edit">Review</a>,
            <a key="list-loadmore-more">Play</a>,
          ]}
        >
          <StyledListItem talker={item.talker}>
            <Avatar
              className="chat-avatar"
              src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${
                item.talker === 'ai' ? '100' : '3'
              }`}
              style={{
                flexShrink: 0,
              }}
            />
            <div
              style={{
                flexGrow: 1,
                display: 'flex',
                flexDirection: item.talker === 'ai' ? 'row' : 'row-reverse',
              }}
            >
              <Text className="chat-text">{item.text}</Text>
            </div>

            <div style={{ width: '30px' }} />
          </StyledListItem>
        </List.Item>
      )}
    />
  );
};

export default ChatList;
