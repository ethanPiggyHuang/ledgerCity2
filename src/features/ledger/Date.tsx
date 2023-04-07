import React, { useEffect } from 'react';
import { useAppDispatch } from '../../app/hooks';
import styled from 'styled-components/macro';

export const Date: React.FC = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    //TODO: onSnapshot
    // dispatch(getCityInfo());
  }, []);
  // const time: DateConstructor = new Date();

  return (
    <Wrapper>
      <DateSwitch>{'<'}</DateSwitch>
      <DateChosen>{'2023.04.10'}</DateChosen>
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
