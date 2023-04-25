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
import { updateActivity } from '../../redux/api/userAPI';
import { NavBar } from '../gameMap/NavBar';
import {
  CHANGE_CHART_TYPE,
  SWITCH_PAGE,
} from '../../redux/reducers/pageControlSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

export const Statistics: React.FC = () => {
  const { chosenYear } = useAppSelector((state) => state.ledgerList.choices);
  const { userId } = useAppSelector((state) => state.userInfo.data);
  const { chartType } = useAppSelector((state) => state.pageControl);

  const dispatch = useAppDispatch();
  const auth = getAuth();

  // useEffect(() => {
  //   dispatch(getLedgerList());
  // }, [dispatch]);

  return (
    <Wrap>
      <Header>
        <Title>分析圖表</Title>
        <CrossIconWrap
          onClick={() =>
            dispatch(SWITCH_PAGE({ userId, pageActivity: 'city' }))
          }
        >
          <CrossIcon icon={faXmark} />
        </CrossIconWrap>
      </Header>
      <Main>
        {chartType === 'oneMonth' && <PieChart></PieChart>}
        {chartType === 'monthly' && (
          <>
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
            <BarChart></BarChart>
          </>
        )}
        {/* <Select
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
        <ChartWrap> */}
        {/* TODO: need switch mechanism */}
        {/* <BarChart></BarChart>
          <PieChart></PieChart>
        </ChartWrap>
        <LedgerWarp>
          <LedgerDetail />
        </LedgerWarp>
        <br />
        <NavBar /> */}
      </Main>
      <ChartTypes>
        <ChartType onClick={() => dispatch(CHANGE_CHART_TYPE('oneMonth'))}>
          當月分析
        </ChartType>
        <ChartType onClick={() => dispatch(CHANGE_CHART_TYPE('monthly'))}>
          每月變化
        </ChartType>
        <ChartType onClick={() => dispatch(CHANGE_CHART_TYPE('split'))}>
          分帳結算
        </ChartType>
      </ChartTypes>
    </Wrap>
  );
};

const Wrap = styled.div`
  height: 70vh;
  width: 40vw;
  // transform: translateX(75%);
  position: absolute;
  bottom: 100px;
  z-index: 4;
  border: #ffffff 3px solid;
  background-color: #f7f7f7;

  border-radius: 20px 20px 0 0;
`;
const Header = styled.div`
  height: 95px;
  width: 100%;
  border-bottom: 3px solid #e6e6e6;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Title = styled.p`
  color: #808080;
  font-size: 32px;
`;
const Main = styled.div``;
const Select = styled.select``;
const Option = styled.option``;
const ChartWrap = styled.div`
  max-height: 90%;
  overflow: hidden;
  width: 49%;
  display: flex;
  flex-direction: column;
`;
const LedgerWarp = styled(ChartWrap)`
  overflow: scroll;
`;
const ChartTypes = styled.div`
  position: absolute;
  bottom: 20px;
  display: flex;
  width: 100%;
  justify-content: space-around;
`;

const ChartType = styled.div`
  height: 66px;
  font-size: 24px;
  width: 27%;
  background-color: #ebebeb;
  color: #808080;
  border-radius: 33px;
  display: flex;
  justify-content: center;
  align-items: center;
  &:hover {
    cursor: pointer;
    background-color: #c3c3c3;
  }
`;
const CrossIconWrap = styled.div`
  position: absolute;
  left: 21px;
  height: 60px;
  display: flex;
  align-items: center;
  cursor: pointer;
`;
const CrossIcon = styled(FontAwesomeIcon)`
  height: 27px;
  color: #808080;
`;
