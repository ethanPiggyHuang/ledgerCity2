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

  const datas = ledgerList.map((ledger) => {
    return {
      label: ledger.item,
      ledgerId: ledger.ledgerId,
      value: ledger.amount.number,
    };
  });

  const xMax = datas.length;
  const yMax = Math.max(...datas.map((data) => data.value));

  const colorCodes = [
    '#c23f3f',
    '#cf9741',
    '#d6d176',
    '#a9ce56',
    '#6cd4c2',
    '#7674cf',
  ];

  const drawBar = (
    value: number,
    ledgerId: string,
    { svgHeight, svgWidth, barWidth, yShrinkRatio }: BarChartSetting,
    colorCodes: string[],
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
          drawBar(value, ledgerId, barChartSetting, colorCodes, index)
        )}
        {datas.map((data, index) =>
          setXLabel(data.label, barChartSetting, index)
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
  font-size: 16px;
  text-anchor: middle;
`;
