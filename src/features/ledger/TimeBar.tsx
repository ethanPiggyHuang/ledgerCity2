import React, { useEffect } from 'react';
import styled from 'styled-components/macro';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { timeUpdate } from './ledgerSlice';

export const TimeBar: React.FC = () => {
  const ledgerTime = useAppSelector((state) => state.ledgerSingle.ledgerTime);
  const dispatch = useAppDispatch();
  const time = new Date();
  const dateInSecond = time.getTime();

  useEffect(() => {
    dispatch(timeUpdate(dateInSecond));
  }, []);

  const timeDisplay = new Date(ledgerTime).toLocaleString();

  return (
    <Wrapper>
      <DateSwitch>{'<'}</DateSwitch>
      <DateChosen>{timeDisplay}</DateChosen>
      <DateSwitch>{'>'}</DateSwitch>
    </Wrapper>
  );
};

// type HouseProps = {
//   $zoomRatio: number;
//   $type: number;
// };

const Wrapper = styled.div`
  height: 50px;
  width: 100%;
  display: flex;
  border: 1px solid lightblue;
`;
const DateSwitch = styled.div`
  width: 10%;
  border: 1px solid lightblue;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const DateChosen = styled.div`
  width: 100%;
  border: 1px solid lightblue;
  font-size: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
