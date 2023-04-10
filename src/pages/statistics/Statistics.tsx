import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components/macro';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { Charts } from './Charts';
import { LedgerDetail } from './LedgerDetail';
import { getLedgerList } from '../../redux/reducers/ledgerListSlice';

export const Statistics: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getLedgerList());
  }, []);

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
  height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
  border: 1px solid lightblue;
  flex-wrap: wrap;
  gap: 10px;
`;
