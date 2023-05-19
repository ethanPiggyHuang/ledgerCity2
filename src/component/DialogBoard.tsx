import React from 'react';
import styled from 'styled-components/macro';

export const DialogBoard: React.FC = () => {
  return (
    <Curtain $isLogin={false}>
      <BlackCurtain></BlackCurtain>
      <DialogBox></DialogBox>
    </Curtain>
  );
};

type CurtainProps = {
  $isLogin: boolean;
};

const Curtain = styled.div<CurtainProps>`
  width: 100vw;
  height: 100vh;
  position: absolute;
  z-index: 4;
  display: ${({ $isLogin }) => ($isLogin ? 'none' : 'flex')};
  justify-content: center;
  align-items: center;
`;

const BlackCurtain = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: black;
  opacity: 0.8;
  position: absolute;
  z-index: 4;
`;
const DialogBox = styled.div`
  background-color: white;
  opacity: 1;
  position: absolute;
  z-index: 5;
  border: 5px brown solid;
`;
