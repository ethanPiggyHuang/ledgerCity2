import React, { ReactNode, useState } from 'react';
import styled from 'styled-components/macro';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { chooseLabel, chooseMonth } from '../../redux/reducers/ledgerListSlice';
import { mainLabels, labelColorCodes } from '../../utils/gameSettings';
import { CHART_SHOWN_SWITCH } from '../../redux/reducers/pageControlSlice';
import { faAnglesLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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
  const [labelsDisplay, setLabelsDisplay] = useState(new Array(10).fill(true));
  const [displayMonths, setDisplayMonths] = useState(12);
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const dispatch = useAppDispatch();

  const barChartSetting = {
    svgHeight: 300,
    svgWidth: 550,
    barWidth: 35,
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
    { xLabel: '1月', monthValue: 1 },
    { xLabel: '2月', monthValue: 2 },
    { xLabel: '3月', monthValue: 3 },
    { xLabel: '4月', monthValue: 4 },
    { xLabel: '5月', monthValue: 5 },
    { xLabel: '6月', monthValue: 6 },
    { xLabel: '7月', monthValue: 7 },
    { xLabel: '8月', monthValue: 8 },
    { xLabel: '9月', monthValue: 9 },
    { xLabel: '10月', monthValue: 10 },
    { xLabel: '11月', monthValue: 11 },
    { xLabel: '12月', monthValue: 12 },
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

  const yRatios = [0, 0.25, 0.5, 0.75, 1];

  const yScaleMaxDigits = (Math.log(yMax) * Math.LOG10E + 1) | 0;
  const yScaleMax =
    Math.ceil(yMax / Math.pow(10, yScaleMaxDigits - 1)) *
    Math.pow(10, yScaleMaxDigits - 1);

  const yValues = yRatios.map((ratio) => ratio * yScaleMax);
  const yAdjRatios = yValues.map((value) => value / yMax);

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
          {/* TODO: Y axis label */}
          {yAdjRatios.map((yAdjRatio, index) => (
            <g key={yAdjRatio}>
              <path
                d={`M 0 ${
                  barChartSetting.svgHeight -
                  barChartSetting.svgHeight *
                    yAdjRatio *
                    barChartSetting.yShrinkRatio
                } H 10  Z`}
                stroke={'#808080'}
              />
              <LabelY
                x={40}
                y={
                  barChartSetting.svgHeight -
                  barChartSetting.svgHeight *
                    yAdjRatio *
                    barChartSetting.yShrinkRatio
                }
              >
                {Math.round(yValues[index])}
              </LabelY>
            </g>
          ))}
          <path
            d={`M 0 ${barChartSetting.svgHeight} L ${barChartSetting.svgWidth} ${barChartSetting.svgHeight} Z`}
            stroke="#808080"
          />
          <path
            d={`M 0 ${barChartSetting.svgHeight} L 0 0 Z`}
            stroke="#808080"
          />
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
          <path
            d={`M 0 ${barChartSetting.svgHeight} L ${barChartSetting.svgWidth} ${barChartSetting.svgHeight} Z`}
            stroke="#808080"
          />
          <path
            d={`M 0 ${barChartSetting.svgHeight} L 0 0 Z`}
            stroke="#808080"
          />
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
      <MinimizeWrap onClick={() => dispatch(CHART_SHOWN_SWITCH('monthOnly'))}>
        <MinimizeIcon icon={faAnglesLeft} />
        <MinimizeText>收合</MinimizeText>
      </MinimizeWrap>
    </Wrap>
  );
};

type LabelColorProps = {
  $display: boolean;
  $backgroundColor: string;
};

const Wrap = styled.div`
  width: 100%;
  position: relative;
  overflow: scroll;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const ChartTitle = styled.p`
  text-align: center;
  line-height: 50px;
  font-size: 28px;
  color: #808080;
  width: 100%;
  margin-bottom: 50px;
`;
const BarSvg = styled.svg`
  height: 300px;
  width: 500px;
  // border: 1px solid lightblue;
`;
const BarPath = styled.path`
  opacity: 0.7;
  cursor: pointer;

  &:hover {
    opacity: 1;
  }
`;
const Buttons = styled.div`
  display: flex;
  padding-bottom: 20px;
`;
const LabelX = styled.text`
  font-size: 16px;
  font-weight: bold;
  text-anchor: middle;

  fill: #5b4105;
  stroke: #f2f2f2;
  stroke-width: 0.2px;
`;

const LabelY = styled.text`
  font-size: 16px;
  font-weight: bold;
  text-anchor: middle;

  fill: #5b4105;
  stroke: #f2f2f2;
  stroke-width: 0.2px;
`;

const LabelWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  width: 320px;
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
  font-size: 16px;
  cursor: pointer;
`;

const MinimizeWrap = styled.div`
  position: absolute;
  padding: 20px;
  height: 100%;
  left: 0px;
  top: 0px;
  text-align: center;

  opacity: 0;
  transition: opacity 1s ease;
  &:hover {
    opacity: 0.5;
  }
`;

const MinimizeIcon = styled(FontAwesomeIcon)`
  font-size: 20px;
  color: #808080;
  cursor: pointer;
`;

const MinimizeText = styled.p`
  padding-top: 5px;
  font-size: 16px;
  color: #808080;
  cursor: pointer;
`;
