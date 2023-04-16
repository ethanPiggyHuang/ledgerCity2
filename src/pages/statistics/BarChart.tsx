import React, { ReactNode, useState } from 'react';
import styled from 'styled-components/macro';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { chooseLabel, chooseMonth } from '../../redux/reducers/ledgerListSlice';
import { mainLabels } from '../../utils/gameSettings';

interface BarChartSetting {
  svgHeight: number;
  svgWidth: number;
  barWidth: number;
  yShrinkRatio: number;
  labelDY: number;
}

export const BarChart: React.FC = () => {
  const loadingStatus = useAppSelector((state) => state.ledgerList.status);
  const ledgerList = useAppSelector((state) => state.ledgerList.data);
  const { chosenYear } = useAppSelector((state) => state.ledgerList.choices);
  const [hasCategory, setHasCategory] = useState(false);
  const [displayMonths, setDisplayMonths] = useState(12);
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const dispatch = useAppDispatch();

  const barChartSetting = {
    svgHeight: 300,
    svgWidth: 500,
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
      value: ledger.amount.number,
      year: ledger.timeYear,
      month: ledger.timeMonth,
    };
  });

  const totalMonths = [
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

  let months: { xLabel: string; monthValue: number }[];
  if (displayMonths === 12) {
    months = totalMonths;
  } else {
    console.log(displayMonths);
    months = totalMonths.slice(currentMonth - displayMonths, displayMonths + 1);
  }

  const datas = months.map((month) => {
    const { xLabel, monthValue } = month;

    const value = rawDatas
      .filter(
        (ledger) => ledger.month === monthValue && ledger.year === chosenYear
      )
      .reduce((acc, cur) => acc + cur.value, 0);
    return { value, xLabel, monthValue };
  });

  const xMax = months.length;
  const yMax = Math.max(...datas.map((data) => data.value));

  const drawBar = (
    value: number,
    monthValue: number,
    { svgHeight, svgWidth, barWidth, yShrinkRatio }: BarChartSetting,
    colorCodes: string[],
    xMax: number,
    yMax: number,
    index: number
  ): ReactNode => {
    const startPointX = (svgWidth / xMax) * (index + 0.5) - barWidth / 2;
    const barHeight = (value / yMax) * svgHeight * yShrinkRatio;
    const barTopY = svgHeight - barHeight;

    const dScript = `M ${startPointX} ${svgHeight} V ${barTopY} H ${
      startPointX + barWidth
    } V ${svgHeight} Z`;

    return (
      <BarPath
        key={index}
        onClick={() => {
          dispatch(chooseMonth(monthValue));
          dispatch(chooseLabel(''));
        }}
        d={dScript}
        fill={'grey'}
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
      <ChartTitle>{`BarChart：${chosenYear}年各月份花費`}</ChartTitle>
      {/* TODO: NaN 奇怪錯誤，應該與 initial state 無法 render 相關 */}
      {loadingStatus === 'idle' && (
        <BarSvg>
          {datas.map(({ value, monthValue }, index) =>
            drawBar(
              value,
              monthValue,
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
          <path d={`M 0 300 L 500 300 Z`} stroke="black" />
          <path d={`M 0 300 L 0 0 Z`} stroke="black" />
        </BarSvg>
      )}
      <button onClick={() => setDisplayMonths(12)}>全年</button>
      {chosenYear === currentYear && (
        <button onClick={() => setDisplayMonths(3)}>近3個月</button>
      )}
      <span>{`  `}</span>
      <button onClick={() => setHasCategory(!hasCategory)}>
        {hasCategory ? '隱藏類別' : '顯示類別'}
      </button>
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
  height: 350px;
  width: 500px;
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
