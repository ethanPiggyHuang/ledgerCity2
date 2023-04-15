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
      {/* <div> */}
      <Link to="../">city</Link>
      <br />
      <Link to="../ledger">ledger</Link>
      <br />

      <button
        onClick={() => {
          signOut(auth);
        }}
      >
        Sign out
      </button>
      {/* </div> */}
    </Wrap>
  );
};

const Wrap = styled.div`
  padding: 20px;
  // height: 95vh;
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
  width: 49%;
  display: flex;
  flex-direction: column;
  border: 1px solid lightblue;
  gap: 10px;
`;
const LedgerWarp = styled(ChartWrap)``;
