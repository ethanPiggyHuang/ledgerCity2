import React, { useEffect, useState } from 'react';
import styled from 'styled-components/macro';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { displayCity } from '../redux/reducers/cityArrangementSlice';

export const DialogBoard: React.FC = () => {
  const cityBasicInfo = useAppSelector((state) => state.cityBasicInfo);
  const dispatch = useAppDispatch();
  const [info, setInfo] = useState('aa');

  useEffect(() => {}, []);

  return (
    <Curtain $isLogin={false}>
      <BlackCurtain></BlackCurtain>
      <DialogBox>
        <LoginPanel>
          <Title>註冊</Title>
          <Button>FB登入</Button>
          <Info>{info}</Info>
        </LoginPanel>
      </DialogBox>
    </Curtain>
  );
};

type CurtainProps = {
  $isLogin: boolean;
  // $isDialog: boolean;
};

const Curtain = styled.div<CurtainProps>`
  width: 100vw;
  height: 100vh;
  position: absolute;
  z-index: 1;
  display: ${({ $isLogin }) => ($isLogin ? 'none' : 'flex')};
  justify-content: center;
  align-items: center;
`;

const BlackCurtain = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: black;
  opacity: 0.5;
  position: absolute;
  z-index: 1;
`;
const DialogBox = styled.div`
  background-color: white;
  opacity: 1;
  position: absolute;
  z-index: 2;
  border: 5px brown solid;
`;
const LoginPanel = styled.div`
  width: 50vw;
  height: 70vh;
  display: flex;
  padding: 20px;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;
const Title = styled.p`
  font-size: 32px;
`;
const Button = styled.button`
  font-size: 32px;
`;
const Info = styled.p`
  font-size: 32px;
`;
