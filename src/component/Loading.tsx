import {
  faPlane,
  faPlaneArrival,
  faPlaneDeparture,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import styled, { keyframes } from 'styled-components/macro';

const Loading: React.FC = () => {
  return (
    <LoadingMessage>
      <LoadingText>前往城市中...</LoadingText>
      <LoadingIconDeparture icon={faPlaneDeparture} />
      <LoadingIconFlying icon={faPlane} />
      <LoadingIconLanding icon={faPlaneArrival} />
    </LoadingMessage>
  );
};

export default Loading;

const LoadingMessage = styled.div`
  min-height: 80vh;

  margin: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #cc8159;
`;

const LoadingText = styled.p`
  font-size: 60px;
`;

const departure = keyframes`
  0%{
    opacity: 1;
  }
  17%{
    opacity: 1;
  }
  33%{
    opacity: 0;
  }
  100%{
    opacity: 0;
  }
`;

const flying = keyframes`
  0%{
    opacity: 0;
  }
  17%{
    opacity: 0;
  }
  33%{
    opacity: 1;
  }
  50%{
    opacity: 1;
  }
  66%{
    opacity: 0;
  }
  100%{
    opacity: 0;
  }

`;

const landing = keyframes`
  0%{
    opacity: 0;
  }
  50%{
    opacity: 0;
  }
  66%{
    opacity: 1;
  }
  83%{
    opacity: 1;
  }
  100%{
    opacity: 0;
  }
`;

const LoadingIconFlying = styled(FontAwesomeIcon)`
  font-size: 48px;
  padding: 20px 20px 60px;
  animation: ${flying} 3s infinite;
`;

const LoadingIconDeparture = styled(FontAwesomeIcon)`
  font-size: 48px;
  animation: ${departure} 3s infinite;
`;

const LoadingIconLanding = styled(FontAwesomeIcon)`
  font-size: 48px;
  animation: ${landing} 3s infinite;
`;
