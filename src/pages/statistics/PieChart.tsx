import React, { ReactNode } from 'react';
import styled from 'styled-components/macro';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { chooseTarget } from '../../redux/reducers/ledgerListSlice';

export const PieChart: React.FC = () => {
  const ledgerList = useAppSelector((state) => state.ledgerList.data);
  const items = ledgerList.map((ledger) => ledger.item);
  const ledgerId = ledgerList.map((ledger) => ledger.ledgerId);

  const amounts = ledgerList.map((ledger) => ledger.amount.number);

  const total = amounts.reduce((acc, cur) => (acc += cur), 0);
  const ratios = amounts.map((amount) => amount / total);
  // console.log(ratios);

  const dispatch = useAppDispatch();

  // TODO: 這邊的 code 要好好整理一下
  const colorCodes = [
    '#c23f3f',
    '#cf9741',
    '#d6d176',
    '#a9ce56',
    '#6cd4c2',
    '#7674cf',
  ];

  const accumulate = (array: number[]): number[] =>
    array.reduce(
      (acc: number[], cur: number, index: number) =>
        index === 0 ? [cur] : [...acc, cur + acc[index - 1]],
      [] as number[]
    );

  const startingRatios = [0, ...accumulate(ratios).slice(0, ratios.length - 1)];

  const startAngles = startingRatios.map(
    (ratio) => -Math.PI / 2 + ratio * 2 * Math.PI
  );

  const conbined = ratios.map((ratio, index) => {
    return { ratio, startAngle: startAngles[index], item: items[index] };
  });

  const drawSector = (
    data: { ratio: number; startAngle: number },
    index: number
  ): ReactNode => {
    const radius = 250;
    const origin = { x: 0, y: 10 };
    const startAngle = data.startAngle;
    const endAngle = startAngle + 2 * Math.PI * data.ratio;
    const startPoint = {
      x: radius * Math.cos(startAngle) + origin.x,
      y: radius * Math.sin(startAngle) + origin.y,
    };
    const endPoint = {
      x: radius * Math.cos(endAngle) + origin.x,
      y: radius * Math.sin(endAngle) + origin.y,
    };
    const largeArcFlag = data.ratio > 0.5 ? 1 : 0;

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
      <PieSvg>{conbined.map((data, index) => drawSector(data, index))}</PieSvg>
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
