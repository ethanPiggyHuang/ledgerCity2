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

interface Ledger {
  label: string;
  ledgerId: string;
  value: number;
  year: number;
  month: number;
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
      label: ledger.item,
      ledgerId: ledger.ledgerId,
      value: ledger.amount.number,
      year: ledger.timeYear,
      month: ledger.timeMonth,
    };
  });

  const months = [
    { ch: '一月', value: 1 },
    { ch: '二月', value: 2 },
    { ch: '三月', value: 3 },
    { ch: '四月', value: 4 },
    { ch: '五月', value: 5 },
    { ch: '六月', value: 6 },
    { ch: '七月', value: 7 },
    { ch: '八月', value: 8 },
    { ch: '九月', value: 9 },
    { ch: '十月', value: 10 },
    { ch: '十一月', value: 11 },
    { ch: '十二月', value: 12 },
  ];
  const datas = months.map((month) =>
    rawDatas.reduce(
      (acc, cur) => {
        if (cur.month === month.value) {
          acc.value += cur.value;
          acc.ledgerId = cur.ledgerId;
        }
        return acc;
      },
      { value: 0, label: month.ch, ledgerId: '' }
    )
  );
  console.log('datas2', datas);

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
        d={`M ${startPointX} ${svgHeight} V ${svgHeight - barHeight} H ${
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
        {datas.map(({ label }, index) =>
          setXLabel(label, barChartSetting, xMax, index)
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
