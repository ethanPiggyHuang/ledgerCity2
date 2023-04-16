import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components/macro';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { PieChart } from './PieChart';
import { BarChart } from './BarChart';
import { LedgerDetail } from './LedgerDetail';
import {
  getLedgerList,
  chooseYear,
  chooseMonth,
} from '../../redux/reducers/ledgerListSlice';
import { getAuth, signOut } from 'firebase/auth';
import { updateLocation } from '../../redux/api/userAPI';
import { NavBar } from '../gameMap/NavBar';

export const Statistics: React.FC = () => {
  const { chosenYear } = useAppSelector((state) => state.ledgerList.choices);
  const { userId } = useAppSelector((state) => state.userInfo.data.user);

  const dispatch = useAppDispatch();
  const auth = getAuth();

  // 監聽使用者進入頁面 -> 送到 db
  useEffect(() => {
    if (userId) updateLocation(userId, 'statistics');
  }, [userId]);

  useEffect(() => {
    dispatch(getLedgerList());
  }, [dispatch]);

  return (
    <Wrap>
      <Header>
        <Select
          value={chosenYear}
          onChange={(e) => {
            dispatch(chooseYear(Number(e.target.value)));
            // 可以考量更換年份之後，要不要重設月份？(default 0)
            dispatch(chooseMonth(0));
          }}
        >
          <Option value={2023}>2023</Option>
          <Option value={2022}>2022</Option>
        </Select>
      </Header>

      <ChartWrap>
        {/* TODO: need switch mechanism */}
        <BarChart></BarChart>
        <PieChart></PieChart>
      </ChartWrap>
      <LedgerWarp>
        <LedgerDetail />
      </LedgerWarp>
      <br />
      <NavBar />
    </Wrap>
  );
};

const Wrap = styled.div`
  padding: 20px;
  height: 100vh;
  position: relative;
  display: flex;
  flex-wrap: wrap;
  border: 1px solid lightblue;
  flex-wrap: wrap;
`;
const Header = styled.div`
  width: 100%;
`;
const Select = styled.select``;
const Option = styled.option``;
const ChartWrap = styled.div`
  max-height: 90%;
  overflow: hidden;
  width: 49%;
  display: flex;
  flex-direction: column;
`;
const LedgerWarp = styled(ChartWrap)``;
