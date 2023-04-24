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
import { ReactComponent as Receipt } from '../../assets/receipt.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faCheck } from '@fortawesome/free-solid-svg-icons';
import { CHANGE_LEDGER_POSITION } from '../../redux/reducers/pageControlSlice';
import { DailyLedger } from './DailyLedger';

export const Ledger: React.FC = () => {
  const { userId } = useAppSelector((state) => state.userInfo.data);
  const { number } = useAppSelector((state) => state.ledgerSingle.data.amount);
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
      // console.log(userId, 'update');
    }
  }, [userId]);

  return (
    <Wrap $state={ledgerPosition}>
      <Background />
      <MainBoard>
        <Header>
          <CrossIconWrap>
            <CrossIcon
              icon={faXmark}
              onClick={() => dispatch(CHANGE_LEDGER_POSITION('minimize'))}
            />
          </CrossIconWrap>
          <TimeBar />
        </Header>
        {ledgerPosition === 'minimize' && <DailyLedger />}
        <SecondRow>
          <Payment />
          <Amount>{`$ ${number}`}</Amount>
        </SecondRow>
        <Label />
        <Calculator />
        <ConfirmButton
          onClick={() => {
            if (labelMain === '') {
              alert('請選擇標籤');
              return;
            } else if (amount.number === 0) {
              alert('請輸入花費金額');
              return;
            }
            if (ledgerId === '') {
              dispatch(ledgerSubmit());
            } else {
              dispatch(ledgerUpdate());
            }
          }}
        >
          <CheckIcon icon={faCheck} />
        </ConfirmButton>
      </MainBoard>
      {ledgerPosition !== 'expand' && (
        <AddNewWrap onClick={() => dispatch(CHANGE_LEDGER_POSITION('expand'))}>
          <AddNewButton>+ 新紀錄</AddNewButton>
        </AddNewWrap>
      )}
    </Wrap>
  );
};

type WrapProps = { $state: 'minimize' | 'normal' | 'expand' };

const fadeOut = keyframes`
from {
  transform: translateY(0) translateX(75%);
}
to {
  transform: translateY(900px) translateX(75%);
}
`;

const showUp = keyframes`
from {
  transform: translateY(900px)  translateX(75%);
}
to {
  transform: translateY(0px)  translateX(75%);
}
`;

const Wrap = styled.div<WrapProps>`
  width 40%;
  position: absolute;
  z-index: 4;
  bottom: 0;
  height: 80vh;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  overflow: hidden;
  ${({ $state }) =>
    $state === 'minimize'
      ? css`
          // animation: ${showUp} 1s linear 1;
          transform: translateY(665px) translateX(75%);
        `
      : $state === 'normal'
      ? css`
          // animation: ${showUp} 1s linear 1;
          transform: translateY(440px) translateX(75%);
        `
      : css`
          // animation: ${fadeOut} 1s linear 1;
          transform: translateY(0px) translateX(75%);
        `}
`;

const Background = styled(Receipt)`
  overflow: clip;
  display: flex;
  justify-content: center;
`;
const MainBoard = styled.div`
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  padding-top: 15px;
`;

const Header = styled.div`
  height: 60px;
  width: 100%;
  border-bottom: 3px solid #e6e6e6;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SecondRow = styled.div`
  height: 93px;
  width: 100%;
  border-bottom: 3px solid #e6e6e6;
  display: flex;
  // justify-content: center;
  align-items: center;
`;

const CrossIconWrap = styled.div`
  position: absolute;
  left: 21px;
  height: 60px;
  display: flex;
  align-items: center;
  cursor: pointer;
`;
const CrossIcon = styled(FontAwesomeIcon)`
  height: 27px;
  color: #808080;
`;
const Amount = styled.p`
  padding-right: 25px;
  color: #808080;
  font-size: 36px;
  margin-left: auto;
`;
const ConfirmButton = styled.div`
  position: absolute;
  bottom: 0;
  right: 30px;
  padding: 20px 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const CheckIcon = styled(FontAwesomeIcon)`
  color: #dabd7a;
  font-size: 36px;
`;

const AddNewWrap = styled.div`
  position: absolute;
  z-index: 5;
  top: 198px;
  height: 100px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f7f7f7;
`;

const AddNewButton = styled.div`
  height: 44px;
  width: 250px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  border-radius: 22px;
  background-color: #ebebeb;
  color: #808080;
`;
