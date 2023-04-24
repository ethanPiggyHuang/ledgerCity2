import React, { ReactNode, useState } from 'react';
import styled from 'styled-components/macro';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { chooseLabel, chooseMonth } from '../../redux/reducers/ledgerListSlice';
import { mainLabels, labelColorCodes } from '../../utils/gameSettings';

interface BarChartSetting {
  svgHeight: number;
  svgWidth: number;
  barWidth: number;
  yShrinkRatio: number;
  labelDY: number;
}

export const BarChart: React.FC = () => {
  const loadingStatus = useAppSelector((state) => state.ledgerList.status);
  const ledgerList = useAppSelector((state) => state.ledgerList.dataList);
  const { chosenYear } = useAppSelector((state) => state.ledgerList.choices);
  const [hasCategory, setHasCategory] = useState(false);
  const [labelsDisplay, setLabelsDisplay] = useState(new Array(8).fill(true));
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

  const rawDatas = ledgerList.map((ledger) => {
    return {
      item: ledger.data.item,
      label: ledger.data.labelMain,
      value: ledger.data.amount.number,
      year: ledger.data.timeYear,
      month: ledger.data.timeMonth,
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

  const datasCategory = mainLabels.map((label) => {
    const dataByCategory = months.map((month) => {
      const { xLabel, monthValue } = month;
      const value = rawDatas
        .filter(
          (ledger) =>
            ledger.month === monthValue &&
            ledger.year === chosenYear &&
            ledger.label === label
        )
        .reduce((acc, cur) => acc + cur.value, 0);
      return { value, xLabel, monthValue };
    });
    return { label, isIncluded: true, data: dataByCategory };
  });

  // console.log(datasCategory);

  const drawBar = (
    value: number,
    monthValue: number,
    { svgHeight, svgWidth, barWidth, yShrinkRatio }: BarChartSetting,
    labelColorCodes: string[],
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

  const drawCategoryBar = (
    value: number,
    monthValue: number,
    { svgHeight, svgWidth, barWidth, yShrinkRatio }: BarChartSetting,
    labelColorCodes: string[],
    xMax: number,
    yMax: number,
    index: number,
    labelIndex: number
  ): ReactNode => {
    let prevLabel = 0;
    for (let i = 0; i < labelIndex; i++) {
      if (labelsDisplay[i]) {
        prevLabel +=
          (datasCategory[i].data[index].value / yMax) *
          svgHeight *
          yShrinkRatio;
      }
    }
    const startPointX = (svgWidth / xMax) * (index + 0.5) - barWidth / 2;
    const barHeight = labelsDisplay[labelIndex]
      ? (value / yMax) * svgHeight * yShrinkRatio
      : 0;
    const barTopY = svgHeight - prevLabel - barHeight;

    const dScript = `M ${startPointX} ${svgHeight - prevLabel} V ${barTopY} H ${
      startPointX + barWidth
    } V ${svgHeight - prevLabel} Z`;

    return (
      <BarPath
        key={index}
        onClick={() => {
          dispatch(chooseMonth(monthValue));
          dispatch(chooseLabel(''));
        }}
        d={dScript}
        fill={labelColorCodes[labelIndex]}
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
      <ChartTitle>{`${chosenYear}年各月份花費`}</ChartTitle>
      {/* TODO: NaN 奇怪錯誤，應該與 initial state 無法 render 相關 */}
      {loadingStatus === 'idle' && !hasCategory && (
        <BarSvg>
          {datas.map(({ value, monthValue }, index) =>
            drawBar(
              value,
              monthValue,
              barChartSetting,
              labelColorCodes,
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
      {loadingStatus === 'idle' && hasCategory && (
        <BarSvg>
          {datasCategory.map(
            (dataCategory, labelIndex) =>
              dataCategory.isIncluded &&
              dataCategory.data.map(({ value, monthValue }, index) =>
                drawCategoryBar(
                  value,
                  monthValue,
                  barChartSetting,
                  labelColorCodes,
                  xMax,
                  yMax,
                  index,
                  labelIndex
                )
              )
          )}
          {datas.map(({ xLabel }, index) =>
            setXLabel(xLabel, barChartSetting, xMax, index)
          )}
          <path d={`M 0 300 L 500 300 Z`} stroke="black" />
          <path d={`M 0 300 L 0 0 Z`} stroke="black" />
        </BarSvg>
      )}
      <Buttons>
        <button onClick={() => setDisplayMonths(12)}>全年</button>
        {chosenYear === currentYear && (
          <button onClick={() => setDisplayMonths(3)}>近3個月</button>
        )}
        <span>{`  `}</span>
        <button onClick={() => setHasCategory(!hasCategory)}>
          {hasCategory ? '隱藏類別' : '顯示類別'}
        </button>
        <button onClick={() => setLabelsDisplay(new Array(8).fill(true))}>
          類別全開
        </button>
      </Buttons>

      {hasCategory && (
        <LabelWrap>
          {mainLabels.map((label, index) => (
            <>
              <LabelColor
                $display={labelsDisplay[index]}
                $backgroundColor={labelColorCodes[index]}
                onClick={() => {
                  let newArr = [...labelsDisplay];
                  newArr[index] = !newArr[index];
                  setLabelsDisplay(newArr);
                }}
              />
              <LabelText
                onClick={() => {
                  let newArr = [...labelsDisplay];
                  newArr[index] = !newArr[index];
                  setLabelsDisplay(newArr);
                }}
              >
                {label}
              </LabelText>
            </>
          ))}
        </LabelWrap>
      )}
    </Wrap>
  );
};

type LabelColorProps = {
  $display: boolean;
  $backgroundColor: string;
};

const Wrap = styled.div`
  padding: 10px;
  width: 100%;
  position: relative;
  overflow: scroll;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const ChartTitle = styled.p`
  text-align: center;
  font-size: 28px;
  color: #808080;
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
const Buttons = styled.div`
  display: flex;
  padding-bottom: 20px;
`;
const LabelX = styled.text`
  font-size: 14px;
  text-anchor: middle;
`;

const LabelWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const LabelColor = styled.div<LabelColorProps>`
  width: 16px;
  height: 16px;
  border: grey solid 1px;
  opacity: 0.7;
  background-color: ${({ $backgroundColor, $display }) =>
    $display ? `${$backgroundColor}` : ''};
  cursor: pointer;
`;
const LabelText = styled.p`
  height: 10px;
  cursor: pointer;
`;
