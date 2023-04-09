import React, { useEffect } from 'react';
import styled from 'styled-components/macro';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { getLedgerList } from './statisticsSlice';

export const LedgerDetail: React.FC = () => {
  const { housesPosition } = useAppSelector((state) => state.cityArrangement);

  const dispatch = useAppDispatch();

  return (
    <Wrap>
      <button onClick={() => dispatch(getLedgerList())}>fetch</button>
    </Wrap>
  );
};

const Wrap = styled.div`
  padding: 20px;
  position: relative;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  height: 40vh;
  width: 100vw;
  border: 1px solid lightblue;
`;
