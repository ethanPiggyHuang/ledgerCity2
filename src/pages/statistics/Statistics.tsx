import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components/macro';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { PieChart } from './PieChart';
import { BarChart } from './BarChart';
import { LedgerDetail } from './LedgerDetail';
import { getLedgerList } from '../../redux/reducers/ledgerListSlice';

export const Statistics: React.FC = () => {
  const { choices } = useAppSelector((state) => state.ledgerList);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getLedgerList(2023));
  }, [dispatch]);

  return (
    <Wrap>
      <Header>
        <Select
          onChange={(e) => dispatch(getLedgerList(Number(e.target.value)))}
        >
          <Option value={2023}>2023</Option>
          <Option value={2022}>2022</Option>
        </Select>
      </Header>

      <ChartWrap>
        {/* TODO: need switch mechanism */}
        <PieChart></PieChart>
        {/* <BarChart></BarChart> */}
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
  flex-wrap: wrap;
  border: 1px solid lightblue;
  flex-wrap: wrap;
  gap: 10px;
`;
const Header = styled.div`
  width: 100%;
`;
const Select = styled.select``;
const Option = styled.option``;
const ChartWrap = styled.div`
  height: 90%;
  width: 48%;
  display: flex;
  border: 1px solid lightblue;
  gap: 10px;
`;
const LedgerWarp = styled(ChartWrap)``;
