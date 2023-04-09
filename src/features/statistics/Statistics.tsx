import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components/macro';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { Charts } from './Charts';
import { LedgerDetail } from './LedgerDetail';

export const Statistics: React.FC = () => {
  const { housesPosition } = useAppSelector((state) => state.cityArrangement);

  const dispatch = useAppDispatch();

  return (
    <Wrap>
      Statistics
      <Charts />
      <LedgerDetail />
      <br />
      <Link to="../">city</Link>
      <Link to="../ledger">ledger</Link>
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