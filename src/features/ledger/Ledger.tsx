import React, { useEffect } from 'react';
import { useAppDispatch } from '../../app/hooks';
import styled from 'styled-components/macro';
import { Date } from './Date';
import { Label } from './Label';
import { Payment } from './Payment';
import { Calculator } from './Calculator';

export const Ledger: React.FC = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    //TODO: onSnapshot
    // dispatch(getCityInfo());
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
        <Date />
        <Section>
          <Label />
          <Payment />
        </Section>
        <Section>
          <Calculator />
        </Section>
        <BoardFooter>
          <RecordPerson>{`記錄者：${'Ethan'}`}</RecordPerson>
          <ConfirmButton>確認</ConfirmButton>
        </BoardFooter>
      </MainBoard>
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
  display: flex;
  justify-content: center;
  align-items: center;
`;
