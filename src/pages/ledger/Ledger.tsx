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
import { faXmark } from '@fortawesome/free-solid-svg-icons';

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
      {/* <MainBoard>
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
      </MainBoard> */}
      <Background />
      <MainBoard>
        <Header>
          <CrossIconWrap>
            <CrossIcon icon={faXmark} />
          </CrossIconWrap>
          <TimeBar />
        </Header>
        <SecondRow>
          <Payment />
          <Amount>{`$ ${number}`}</Amount>
        </SecondRow>
      </MainBoard>
    </Wrap>
  );
};

type WrapProps = { $state: 'minimize' | 'normal' | 'expand' };

const fadeOut = keyframes`
from {
  transform: translateY(0);
}
to {
  transform: translateY(800px);
}
`;

const showUp = keyframes`
from {
  transform: translateY(800px)  translateX(75%);
}
to {
  transform: translateY(0px)  translateX(75%);
}
`;

const Wrap = styled.div<WrapProps>`
  width 40%;
  position: absolute;
  z-index: 3;
  bottom: 0;
  // max-height: 80vh;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  overflow: hidden;
  // background-image: url('../../assets/receipt.svg');
  ${({ $state }) =>
    $state === 'normal'
      ? css`
          // animation: ${showUp} 1s linear 1;
          transform: translateY(0px) translateX(75%);
        `
      : css`
          // animation: ${fadeOut} 1s linear 1;
          transform: translateY(800px);
        `}
`;

const Background = styled(Receipt)`
  overflow: clip;
  display: flex;
  justify-content: center;
  // position: absolute;
  // z-index: 3;
`;
const MainBoard = styled.div`
  position: absolute;
  top: 0;
  width: 100%;
  padding-top: 15px;
  // background-color: white;
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
const PaymentMethod = styled.div`
  width: 72px;
  height: 108px;
  background-color: #ebebeb;
  display: flex;
  justify-content: center;
  align-items: center;
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
