import styled from '@emotion/styled';
import { Talker } from '../../../domain/chat/ChatMessage';

interface StyledListItemProps {
  talker: Talker;
}
export const StyledListItem = styled.div<StyledListItemProps>`
  display: flex;
  flex-direction: ${(props) => (props.talker === 'ai' ? 'row' : 'row-reverse')};
  width: 100%;
  padding: 0.5em;

  gap: 1em;

  .chat-avatar {
    flex-shrink: 0;
  }
`;
