import React, { ReactNode } from 'react';
import styled from 'styled-components/macro';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { chooseTarget } from '../../redux/reducers/ledgerListSlice';

export const BarChart: React.FC = () => {
  const ledgerList = useAppSelector((state) => state.ledgerList.data);
  const dispatch = useAppDispatch();

  const items = ledgerList.map((ledger) => ledger.item);
  const ledgerId = ledgerList.map((ledger) => ledger.ledgerId);

  const amounts = ledgerList.map((ledger) => ledger.amount.number);

  const xMax = amounts.length;
  const yMax = Math.max(...amounts);

  // TODO: 這邊的 code 要好好整理一下
  const colorCodes = [
    '#c23f3f',
    '#cf9741',
    '#d6d176',
    '#a9ce56',
    '#6cd4c2',
    '#7674cf',
  ];

  const drawBar = (value: number, index: number): ReactNode => {
    const barWidth = 40;
    const svgHeight = 400;
    const svgWidth = 600;
    const yShrinkRatio = 0.9;
    const startPointX = (svgWidth / xMax) * (index + 0.5) - barWidth / 2;
    const barHeight = (value / yMax) * svgHeight * yShrinkRatio;

    return (
      <PiePath
        key={index}
        onClick={() => {
          dispatch(
            chooseTarget({
              targetType: 'ledgerId',
              targetValue: ledgerId[index],
            })
          );
          // alert(items[index]);
        }} // TODO: fix global variable
        d={`M ${startPointX} ${svgHeight} V ${svgHeight - barHeight} H ${
          startPointX + barWidth
        } V ${svgHeight} Z`}
        fill={colorCodes[index % 6]} // TODO: fix global variable
      />
    );
  };

  return (
    <Wrap>
      <ChartTitle>BarChart [四月各項花費]</ChartTitle>
      <BarSvg>
        {amounts.map((data, index) => drawBar(data, index))}
        <path d={`M 0 400 L 600 400 Z`} stroke="black" />
        <path d={`M 0 400 L 0 0 Z`} stroke="black" />
      </BarSvg>
    </Wrap>
  );
};

// type PiePathProps = {
//   $backgroundColor: string;
// };

const Wrap = styled.div`
  padding: 10px;
  width: 100%;
  position: relative;
  border: 1px solid lightblue;
`;
const ChartTitle = styled.p`
  width: 100%;
`;
const BarSvg = styled.svg`
  height: 400px;
  width: 600px;
  // border: 1px solid lightblue;
`;
const PiePath = styled.path`
  opacity: 0.7;
  cursor: pointer;

  &: hover {
    opacity: 1;
  }
`;
