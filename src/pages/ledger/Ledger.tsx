import React, { useEffect } from 'react';
import { Link, redirect } from 'react-router-dom';
import styled, { keyframes, css } from 'styled-components/macro';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import {
  ledgerSubmit,
  ledgerUpdate,
} from '../../redux/reducers/ledgerSingleSlice';
import { getCityInfo } from '../../redux/reducers/cityBasicInfoSlice';
import { TimeBar } from './TimeBar';
import { Label } from './Label';
import { Payment } from './Payment';
import { Calculator } from './Calculator';
import { updateLocation } from '../../redux/api/userAPI';
import { NavBar } from '../gameMap/NavBar';

export const Ledger: React.FC = () => {
  const { userId } = useAppSelector((state) => state.userInfo.data);
  const { ledgerId } = useAppSelector((state) => state.ledgerSingle);
  const { item, labelMain, amount } = useAppSelector(
    (state) => state.ledgerSingle.data
  );
  const { ledgerPosition } = useAppSelector((state) => state.pageControl);

  const dispatch = useAppDispatch();

  // 監聽使用者進入頁面 -> 送到 db
  useEffect(() => {
    if (userId) {
      updateLocation(userId, 'ledger');
      console.log(userId, 'update');
    }
  }, [userId]);

  return (
    <Wrap $state={ledgerPosition}>
      <MainBoard>
        <TimeBar />
        <Section>
          <Label />
          <Payment />
        </Section>
        <Section>
          <Calculator />
        </Section>
        <BoardFooter>
          <RecordPerson>{`記錄者：`}</RecordPerson>
          <ConfirmButton
            onClick={() => {
              if (labelMain === '') {
                alert('請選擇一個主要標籤');
                return;
              } else if (amount.number === 0) {
                alert('請輸入花費金額');
                return;
              } else if (item === '') {
                alert('請填入帳目品項');
                return;
              }
              if (ledgerId === '') {
                dispatch(ledgerSubmit());
              } else {
                dispatch(ledgerUpdate());
              }
            }}
          >
            確認
          </ConfirmButton>
        </BoardFooter>
      </MainBoard>
      <br />
    </Wrap>
  );
};

type WrapProps = { $state: 'minimize' | 'normal' | 'expand' };

const fadeOut = keyframes`
from {
  transform: translateY(0);
}
to {
  transform: translateY(300px);
}
`;

const showUp = keyframes`
from {
  transform: translateY(300px);
}
to {
  transform: translateY(0px);
}
`;

const Wrap = styled.div<WrapProps>`
  padding: 20px;
  position: absolute;
  bottom: 0;
  max-height: 50vh;
  overflow: scroll;
  display: flex;
  border: 1px solid lightblue;
  flex-wrap: wrap;
  gap: 20px;
  ${({ $state }) =>
    $state === 'normal'
      ? css`
          animation: ${fadeOut} 1s linear 1;
          transform: translateY(300px);
        `
      : css`
          animation: ${showUp} 1s linear 1;
          transform: translateY(0px);
        `}
`;

const ModeOptions = styled.div`
  height: 50px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  border: 1px solid lightblue;
`;

const ModeOption = styled.div`
  width: 30%;
  border: 1px solid lightblue;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const MainBoard = styled.div`
  width: 100%;
  border: 1px solid lightblue;
  display: flex;
  flex-wrap: wrap;
`;
const Section = styled.div`
  height: 450px;
  width: 50%;
  border: 1px solid lightblue;
  // display: flex;
  // justify-content: center;
  // align-items: center;
  // gap: 20px;
`;
const BoardFooter = styled.div`
  height: 80px;
  width: 100%;
  border: 1px solid lightblue;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const RecordPerson = styled.div`
  height: 80%;
  width: 20%;
  border: 1px solid lightblue;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const ConfirmButton = styled.div`
  height: 80%;
  width: 75%;
  border: 1px solid lightblue;
  font-size: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;
