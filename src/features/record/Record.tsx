import React, { useEffect } from 'react';
import { useAppDispatch } from '../../app/hooks';
import styled from 'styled-components';
// import { City } from './City';
// import { getCityInfo } from './gameMapSlice';

export const Record: React.FC = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    //TODO: onSnapshot
    // dispatch(getCityInfo());
  }, []);

  return (
    <Wrap>
      <ModeOptions>
        <ModeOption>a</ModeOption>
        <ModeOption>b</ModeOption>
        <ModeOption>c</ModeOption>
      </ModeOptions>
      <MainBoard>
        <DateBar>
          <DateSwitch></DateSwitch>
          <Date></Date>
          <DateSwitch></DateSwitch>
        </DateBar>
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
`;

const MainBoard = styled.div`
  height: 400px;
  width: 100%;
  border: 1px solid lightblue;
`;
const DateBar = styled.div`
  height: 50px;
  width: 100%;
  display: flex;
  border: 1px solid lightblue;
`;
const DateSwitch = styled.div`
  width: 10%;
  border: 1px solid lightblue;
`;
const Date = styled.div`
  width: 100%;
  border: 1px solid lightblue;
`;
