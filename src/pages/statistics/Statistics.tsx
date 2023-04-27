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
import { ClosingButton } from '../../component/ClosingButton';

export const Statistics: React.FC = () => {
  const { chosenYear } = useAppSelector((state) => state.ledgerList.choices);
  const { userId } = useAppSelector((state) => state.userInfo.data);
  const { chartType } = useAppSelector((state) => state.pageControl);
  const { pageActivity } = useAppSelector((state) => state.pageControl);

  const dispatch = useAppDispatch();
  const auth = getAuth();

  // useEffect(() => {
  //   dispatch(getLedgerList());
  // }, [dispatch]);

  return (
    <Wrap $isShown={pageActivity === 'statistics'}>
      <Header>
        <Title>分析圖表</Title>
        <ClosingButton size={60} />
      </Header>
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
    </Wrap>
  );
};

type WrapProps = {
  $isShown: boolean;
};

const Wrap = styled.div<WrapProps>`
  border: #ffffff 3px solid;
  background-color: #ebebeb;
  border-radius: 20px;
  color: #808080;

  width: ${({ $isShown }) => ($isShown ? '100%' : '40%')};
  height: calc(100vh - 80px);
  position: absolute;
  left: 0;
  z-index: 6;
  overflow: hidden;
  bottom: ${({ $isShown }) => ($isShown ? '80px' : '-100%')};
  transition: bottom 1s ease, width 1.5s ease;
`;
const Header = styled.div`
  height: 60px;
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

const ChartTypes = styled.div`
  top: 60px;
  display: flex;
  width: 100%;
  height: 60px;
  justify-content: center;
  align-items: center;
`;

const ChartType = styled.div`
  font-size: 24px;
  width: 20%;
  height: 80%;
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
