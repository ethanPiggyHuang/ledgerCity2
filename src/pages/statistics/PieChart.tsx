import React, { ReactNode } from 'react';
import styled from 'styled-components/macro';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { chooseLabel } from '../../redux/reducers/ledgerListSlice';
import { mainLabels } from '../../utils/gameSettings';

interface PieChartSetting {
  svgHeight: number;
  svgWidth: number;
  radius: number;
  preservedDy: number;
}

interface dataByLabel {
  value: number;
  ratio: number;
  label: string;
}

export const PieChart: React.FC = () => {
  const loadingStatus = useAppSelector((state) => state.ledgerList.status);
  const ledgerList = useAppSelector((state) => state.ledgerList.data);
  const { chosenYear, chosenMonth } = useAppSelector(
    (state) => state.ledgerList.choices
  );
  const dispatch = useAppDispatch();

  const pieChartSetting = {
    svgHeight: 300,
    svgWidth: 300,
    radius: 140,
    preservedDy: 10,
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
      labelMain: ledger.labelMain,
      ledgerId: ledger.ledgerId,
      value: ledger.amount.number,
      year: ledger.timeYear,
      month: ledger.timeMonth,
    };
  });

  const datas = mainLabels.map((mainLabel) => {
    const label = mainLabel;
    const ledgerMatchMonth = rawDatas.filter(
      (ledger) => ledger.year === chosenYear && ledger.month === chosenMonth
    );
    const totalValue = ledgerMatchMonth.reduce(
      (acc, cur) => (acc += cur.value),
      0
    );
    const ledgerAlsoMatchLabel = ledgerMatchMonth.filter(
      (ledger) => ledger.labelMain === mainLabel
    );
    const value = ledgerAlsoMatchLabel.reduce(
      (acc, cur) => (acc += cur.value),
      0
    );
    const ratio =
      ledgerMatchMonth.length === 1 && ledgerAlsoMatchLabel.length !== 0
        ? value / totalValue - 0.00001
        : value / totalValue;

    return { value, ratio, label };
  });

  const accumulate = (datas: dataByLabel[]): number[] =>
    datas.reduce(
      (acc, cur: dataByLabel, index) =>
        index === 0 ? [cur.ratio] : [...acc, cur.ratio + acc[index - 1]],
      [] as number[]
    );

  const startingRatios = [0, ...accumulate(datas).slice(0, datas.length - 1)];

  const startAngles = startingRatios.map(
    (ratio) => -Math.PI / 2 + ratio * 2 * Math.PI
  );

  const conbined = datas.map((data, index) => {
    return { ...data, startAngle: startAngles[index] };
  });

  const drawSector = (
    startAngle: number,
    ratio: number,
    label: string,
    { radius, preservedDy }: PieChartSetting,
    colorCodes: string[],
    index: number
  ): ReactNode => {
    const origin = { x: 0, y: preservedDy };
    const endAngle = startAngle + 2 * Math.PI * ratio;
    const startPoint = {
      x: radius * Math.cos(startAngle) + origin.x,
      y: radius * Math.sin(startAngle) + origin.y,
    };
    const endPoint = {
      x: radius * Math.cos(endAngle) + origin.x,
      y: radius * Math.sin(endAngle) + origin.y,
    };
    const largeArcFlag = ratio > 0.5 ? 1 : 0;

    const dScript = `M ${startPoint.x + radius} ${
      startPoint.y + radius
    } A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endPoint.x + radius} ${
      endPoint.y + radius
    } L ${origin.x + radius} ${origin.y + radius} Z`;

    return (
      <PiePath
        key={index}
        onClick={() => {
          dispatch(chooseLabel(label));
        }}
        d={dScript}
        fill={colorCodes[index % 6]}
      />
    );
  };

  return (
    <Wrap>
      <ChartTitle>{`PieChart：${chosenMonth}月各類別花費`}</ChartTitle>
      {/* TODO: NaN 奇怪錯誤，應該與 initial state 無法 render 相關 */}
      {loadingStatus === 'idle' && (
        <PieSvg
          $svgHeight={pieChartSetting.svgHeight}
          $svgWidth={pieChartSetting.svgWidth}
        >
          {conbined.map(({ startAngle, ratio, label }, index) =>
            drawSector(
              startAngle,
              ratio,
              label,
              pieChartSetting,
              colorCodes,
              index
            )
          )}
        </PieSvg>
      )}
    </Wrap>
  );
};

type PieSvgProps = {
  $svgHeight: number;
  $svgWidth: number;
};

const Wrap = styled.div`
  padding: 10px;
  position: relative;
  border: 1px solid lightblue;
`;
const ChartTitle = styled.p`
  width: 100%;
`;
const PieSvg = styled.svg<PieSvgProps>`
  padding-top: 0px;
  height: ${({ $svgHeight }) => `${$svgHeight}px`};
  width: ${({ $svgWidth }) => `${$svgWidth}px`};
`;
const PiePath = styled.path`
  opacity: 0.7;
  cursor: pointer;

  &: hover {
    opacity: 1;
    transform: translate(0, -10px);
  }
`;
