import React, { useEffect } from 'react';
import styled from 'styled-components/macro';
import { useAppSelector, useAppDispatch } from '../../app/hooks';

export const Date: React.FC = () => {
  const ledgerDateStamp = useAppSelector(
    (state) => state.ledgerSingle.ledgerDate
  );
  const dispatch = useAppDispatch();
  useEffect(() => {
    //TODO: onSnapshot
    // dispatch(getCityInfo());
  }, []);
  // const time: DateConstructor = new Date();
  const ledgerDate = ledgerDateStamp.toLocaleString();

  return (
    <Wrapper>
      <DateSwitch>{'<'}</DateSwitch>
      <DateChosen>
        {ledgerDate.substring(0, ledgerDate.indexOf(' '))}
      </DateChosen>
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
