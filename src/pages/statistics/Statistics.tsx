import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components/macro';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { PieChart } from './PieChart';
import { BarChart } from './BarChart';
import { LedgerDetail } from './LedgerDetail';
import { getLedgerList } from '../../redux/reducers/ledgerListSlice';

export const Statistics: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getLedgerList());
  }, []);

  return (
    <Wrap>
      <ChartWrap>
        {/* TODO: need switch mechanism */}
        {/* <PieChart></PieChart> */}
        <BarChart></BarChart>
      </ChartWrap>
      <LedgerWarp>
        <LedgerDetail />
      </LedgerWarp>
      <br />
      <Link to="../">city</Link>
      <Link to="../ledger">ledger</Link>
    </Wrap>
  );
};

const Wrap = styled.div`
  padding: 20px;
  height: 95vh;
  position: relative;
  display: flex;
  border: 1px solid lightblue;
  flex-wrap: wrap;
  gap: 10px;
`;
const ChartWrap = styled.div`
  height: 100%;
  width: 48%;
  display: flex;
  border: 1px solid lightblue;
  gap: 10px;
`;
const LedgerWarp = styled(ChartWrap)``;
