import styled from '@emotion/styled';

export const HomePageContainer = styled.div`
  height: calc(100% - 100px);
`;

interface TalkerWrapperProps {
  backgroundColor: string;
}
export const TalkerWrapper = styled.div<TalkerWrapperProps>`
  background-color: ${(props) => props.backgroundColor};

  width: 50vw;

  display: flex;
  align-items: center;
  justify-content: center;

  span {
    width: 200px;
    height: 200px;

    border-radius: 100%;
    background-color: rgba(255, 255, 255, 0.25);
  }
`;

export const HomeMain = styled.div`
  display: flex;
  /* padding: 24px; */
  height: 100%;
`;

export const VoiceControllerWrapper = styled.div`
  position: fixed;
  left: 0;
  bottom: 0;
`;
