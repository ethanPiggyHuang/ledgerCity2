import React, { ReactNode } from 'react';
import styled from 'styled-components/macro';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { chooseTarget } from '../../redux/reducers/ledgerListSlice';

interface BarChartSetting {
  svgHeight: number;
  svgWidth: number;
  barWidth: number;
  yShrinkRatio: number;
  labelDY: number;
}

export const BarChart: React.FC = () => {
  const ledgerList = useAppSelector((state) => state.ledgerList.data);
  const dispatch = useAppDispatch();

  const barChartSetting = {
    svgHeight: 400,
    svgWidth: 600,
    barWidth: 40,
    yShrinkRatio: 0.9,
    labelDY: 20,
  };
  const colorCodes = [
    '#c23f3f',
    '#cf9741',
    '#d6d176',
    '#a9ce56',
    '#6cd4c2',
    '#7674cf',
  ];

  const rawDatas = ledgerList.map((ledger) => {
    return {
      item: ledger.item,
      label: ledger.labelMain,
      ledgerId: ledger.ledgerId,
      value: ledger.amount.number,
      year: ledger.timeYear,
      month: ledger.timeMonth,
    };
  });

  const months = [
    { xLabel: '一月', monthValue: 1 },
    { xLabel: '二月', monthValue: 2 },
    { xLabel: '三月', monthValue: 3 },
    { xLabel: '四月', monthValue: 4 },
    { xLabel: '五月', monthValue: 5 },
    { xLabel: '六月', monthValue: 6 },
    { xLabel: '七月', monthValue: 7 },
    { xLabel: '八月', monthValue: 8 },
    { xLabel: '九月', monthValue: 9 },
    { xLabel: '十月', monthValue: 10 },
    { xLabel: '十一月', monthValue: 11 },
    { xLabel: '十二月', monthValue: 12 },
  ];
  const datas = months.map((month) => {
    const { xLabel, monthValue } = month;
    const { ledgerId } = rawDatas.find(
      (ledger) => ledger.month === monthValue
    ) || { ledgerId: '' };
    const value = rawDatas
      .filter((ledger) => ledger.month === monthValue)
      .reduce((acc, cur) => acc + cur.value, 0);
    return { value, xLabel, ledgerId };
  });

  const xMax = months.length;
  const yMax = Math.max(...datas.map((data) => data.value));

  const drawBar = (
    value: number,
    ledgerId: string,
    { svgHeight, svgWidth, barWidth, yShrinkRatio }: BarChartSetting,
    colorCodes: string[],
    xMax: number,
    yMax: number,
    index: number
  ): ReactNode => {
    const startPointX = (svgWidth / xMax) * (index + 0.5) - barWidth / 2;
    const barHeight = (value / yMax) * svgHeight * yShrinkRatio;
    const barTopY = svgHeight - barHeight; //TODO: NaN 奇怪錯誤，commit 7692540 應該是沒問題

    return (
      <BarPath
        key={index}
        onClick={() => {
          dispatch(
            chooseTarget({
              targetType: 'ledgerId',
              targetValue: ledgerId,
            })
          );
        }}
        d={`M ${startPointX} ${svgHeight} V ${barTopY} H ${
          startPointX + barWidth
        } V ${svgHeight} Z`}
        fill={colorCodes[index % 6]}
      />
    );
  };

  const setXLabel = (
    text: string,
    { svgHeight, svgWidth, labelDY }: BarChartSetting,
    xMax: number,
    index: number
  ): ReactNode => {
    const labelX = (svgWidth / xMax) * (index + 0.5);
    const labelY = svgHeight + labelDY;

    return (
      <LabelX key={index} x={labelX} y={labelY}>
        {text}
      </LabelX>
    );
  };

  return (
    <Wrap>
      <ChartTitle>BarChart [四月各類別花費]</ChartTitle>
      <BarSvg>
        {datas.map(({ value, ledgerId }, index) =>
          drawBar(
            value,
            ledgerId,
            barChartSetting,
            colorCodes,
            xMax,
            yMax,
            index
          )
        )}
        {datas.map(({ xLabel }, index) =>
          setXLabel(xLabel, barChartSetting, xMax, index)
        )}
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
  height: 450px;
  width: 600px;
  // border: 1px solid lightblue;
`;
const BarPath = styled.path`
  opacity: 0.7;
  cursor: pointer;

  &: hover {
    opacity: 1;
  }
`;

const LabelX = styled.text`
  font-size: 14px;
  text-anchor: middle;
`;
