import React, { ReactNode } from 'react';
import styled from 'styled-components/macro';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { chooseTarget } from '../../redux/reducers/ledgerListSlice';
import { mainLabels } from '../../utils/gameSettings';

interface PieChartSetting {
  svgHeight: number;
  svgWidth: number;
  radius: number;
}

interface dataByLabel {
  value: number;
  ratio: number;
  label: string;
  ledgerMatchedIds: string[];
}

export const PieChart: React.FC = () => {
  const ledgerList = useAppSelector((state) => state.ledgerList.data);
  const dispatch = useAppDispatch();

  const pieChartSetting = {
    svgHeight: 550,
    svgWidth: 550,
    radius: 250,
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
    const totalValue = rawDatas.reduce((acc, cur) => (acc += cur.value), 0);
    const ledgerMatched = rawDatas.filter(
      (ledger) => ledger.labelMain === mainLabel
    ) || { ledgerId: [] };
    const ledgerMatchedIds = ledgerMatched.map((ledger) => ledger.ledgerId);
    const value = ledgerMatched.reduce((acc, cur) => acc + cur.value, 0);
    const ratio = value / totalValue;

    return { value, ratio, label, ledgerMatchedIds };
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
    value: number,
    ratio: number,
    label: string,
    ledgerMatchedIds: string[],
    { svgHeight, svgWidth, radius }: PieChartSetting,
    index: number
  ): ReactNode => {
    const origin = { x: 0, y: 10 };
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

    return (
      <PiePath
        key={index}
        onClick={() => {
          dispatch(
            chooseTarget({
              targetType: 'ledgerId',
              targetValue: ledgerMatchedIds[0],
            })
          );
          console.log('select: ', label);
          // alert(items[index]);
        }} // TODO: fix global variable
        d={`M ${startPoint.x + radius} ${
          startPoint.y + radius
        } A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endPoint.x + radius} ${
          endPoint.y + radius
        } L ${origin.x + radius} ${origin.y + radius} Z`}
        fill={colorCodes[index % 6]} // TODO: fix global variable
      />
    );
  };

  return (
    <Wrap>
      <ChartTitle>PieChart [四月各項花費]</ChartTitle>
      <PieSvg>
        {conbined.map(
          ({ startAngle, value, ratio, label, ledgerMatchedIds }, index) =>
            drawSector(
              startAngle,
              value,
              ratio,
              label,
              ledgerMatchedIds,
              pieChartSetting,
              index
            )
        )}
      </PieSvg>
    </Wrap>
  );
};

// type PiePathProps = {
//   $backgroundColor: string;
// };

const Wrap = styled.div`
  padding: 10px;
  position: relative;
  border: 1px solid lightblue;
`;
const ChartTitle = styled.p`
  width: 100%;
`;
const PieSvg = styled.svg`
  height: 510px;
  width: 500px;
  // border: 1px solid lightblue;
`;
const PiePath = styled.path`
  opacity: 0.7;
  cursor: pointer;

  &: hover {
    opacity: 1;
    transform: translate(0, -10px);
  }
`;
