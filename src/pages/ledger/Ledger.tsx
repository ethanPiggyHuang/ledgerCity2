import React, { useEffect } from 'react';
import { Link, redirect } from 'react-router-dom';
import styled from 'styled-components/macro';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { ledgerSubmit } from '../../redux/reducers/ledgerSingleSlice';
import { getCityInfo } from '../../redux/reducers/cityBasicInfoSlice';
import { TimeBar } from './TimeBar';
import { Label } from './Label';
import { Payment } from './Payment';
import { Calculator } from './Calculator';
import { updateLocation } from '../../redux/api/userAPI';

export const Ledger: React.FC = () => {
  const { housesPosition } = useAppSelector((state) => state.cityArrangement);
  const { item, labelMain, amount } = useAppSelector(
    (state) => state.ledgerSingle
  );
  const { userId } = useAppSelector((state) => state.userInfo.data.user);

  const dispatch = useAppDispatch();

  // 監聽使用者進入頁面 -> 送到 db
  useEffect(() => {
    if (userId) updateLocation(userId, 'ledger');
  }, [userId]);

  //TODO: ???
  const unsubscribe = onSnapshot(
    doc(db, 'cities', 'YFbhq5M8vFBIUMMWZhqo'),
    (doc) => {
      const source = doc.metadata.hasPendingWrites ? 'Local' : 'Server';
      if (source === 'Local') {
        console.log('need redirect'); //TODO: how to redirect???
      }
    }
  );

  return (
    <Wrap>
      <ModeOptions>
        <ModeOption>手動輸入</ModeOption>
        <ModeOption>待開發</ModeOption>
        <ModeOption>待開發</ModeOption>
      </ModeOptions>
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
          <RecordPerson>{`記錄者：${'Ethan'}`}</RecordPerson>
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
              console.log('fff');
              dispatch(ledgerSubmit());
            }}
          >
            確認
          </ConfirmButton>
        </BoardFooter>
      </MainBoard>
      <br />
      <Link to="../">city</Link>
      <Link to="/statistics">statistics</Link>
      {/* <button
        onClick={() => {
          redirect('./index.html');
        }}
      >
        test redirect
      </button> */}
    </Wrap>
  );
};

const Wrap = styled.div`
  padding: 20px;
  position: relative;
  display: flex;
  border: 1px solid lightblue;
  flex-wrap: wrap;
  gap: 20px;
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
