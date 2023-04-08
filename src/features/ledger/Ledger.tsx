import React, { useEffect } from 'react';
import styled from 'styled-components/macro';
import { useAppDispatch } from '../../app/hooks';
import { ledgerSubmit } from './ledgerSlice';
import { TimeBar } from './TimeBar';
import { Label } from './Label';
import { Payment } from './Payment';
import { Calculator } from './Calculator';
import { Link } from 'react-router-dom';

export const Ledger: React.FC = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    // console.log('loading');
  }, []);
  // const time: DateConstructor = new Date();

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
              dispatch(ledgerSubmit());
            }}
          >
            確認
          </ConfirmButton>
        </BoardFooter>
      </MainBoard>
      <br />
      <Link to="../">city</Link>
    </Wrap>
  );
};

// type HouseProps = {
//   $zoomRatio: number;
//   $type: number;
// };

const Wrap = styled.div`
  padding: 20px;
  position: relative;
  display: flex;
  border: 1px solid lightblue;
  flex-wrap: wrap;
  gap: 20px;
`;

const ModeOptions = styled.div`
  height: 80px;
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
