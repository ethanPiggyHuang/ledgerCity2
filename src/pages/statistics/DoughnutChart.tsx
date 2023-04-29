import React, { ReactNode, useEffect, useState } from 'react';
import styled from 'styled-components/macro';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { chooseLabel } from '../../redux/reducers/ledgerListSlice';
import { mainLabels, labelColorCodes } from '../../utils/gameSettings';

interface Props {
  props: {
    setting: ChartSetting;
    data: { label: string; value: number; colorCode: string }[];
  };
}

interface ChartSetting {
  radius: number;
  holeRatio: number;
  hoverDelta: number;
  labelDelta: number;
}

interface dataByLabel {
  value: number;
  ratio: number;
  label: string;
}

export const DoughnutChart: React.FC<Props> = ({ props }) => {
  // const { chosenYear, chosenMonth } = useAppSelector(
  //   (state) => state.ledgerList.choices
  // );
  // const dispatch = useAppDispatch();
  const { radius, holeRatio, hoverDelta, labelDelta } = props.setting;
  const data = props.data;

  const svgHeight = 2 * (radius + hoverDelta + labelDelta);
  const svgWidth = svgHeight;

  const totalValue = data.reduce((total, data) => (total += data.value), 0);

  const sectorRatios = data.map((data) =>
    data.value / totalValue === 1 ? 0.999999 : data.value / totalValue
  );

  const startRatios = data.map((data, dataIndex) =>
    dataIndex === 0
      ? 0
      : sectorRatios.reduce(
          (total, ratio, index) =>
            index < dataIndex ? (total += ratio) : total,
          0
        )
  );

  console.log('sector', sectorRatios, 'start', startRatios);

  const startAngles = startRatios.map(
    (ratio) => -Math.PI / 2 + ratio * 2 * Math.PI
  );

  const conbinedData = data.map((data, index) => {
    return {
      ...data,
      sectorRatio: sectorRatios[index],
      startAngle: startAngles[index],
    };
  });

  const drawSector = (
    startAngle: number,
    sectorRatio: number,
    label: string,
    radius: number,
    colorCode: string,
    index: number
  ): ReactNode => {
    const origin = { x: 0, y: 0 };
    const endAngle = startAngle + sectorRatio * 2 * Math.PI;
    const startPoint = {
      x: radius * Math.cos(startAngle) + origin.x,
      y: radius * Math.sin(startAngle) + origin.y,
    };
    const endPoint = {
      x: radius * Math.cos(endAngle) + origin.x,
      y: radius * Math.sin(endAngle) + origin.y,
    };
    const largeArcFlag = sectorRatio > 0.5 ? 1 : 0;

    const dScript = `M ${startPoint.x + radius} ${
      startPoint.y + radius
    } A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endPoint.x + radius} ${
      endPoint.y + radius
    } L ${origin.x + radius} ${origin.y + radius} Z`;

    return (
      <>
        <PiePath
          key={`sector ${index}`}
          // onClick={() => {
          //   dispatch(chooseLabel(label));
          // }}

          d={dScript}
          fill={colorCode}
        />
        <LabelX key={`label ${index}`} x={startAngle * 10} y={startAngle * 10}>
          {label}
        </LabelX>
      </>
    );
  };

  return (
    <ChartWrap>
      <PieSvg $svgHeight={svgHeight} $svgWidth={svgWidth}>
        {conbinedData.map(
          ({ startAngle, sectorRatio, label, colorCode }, index) =>
            drawSector(startAngle, sectorRatio, label, radius, colorCode, index)
        )}
      </PieSvg>

      {/* <LabelWrap>
        {mainLabels.map((label, index) => (
          <>
            <LabelColor $backgroundColor={labelColorCodes[index]} />
            <LabelText>{label}</LabelText>
          </>
        ))}
      </LabelWrap> */}
    </ChartWrap>
  );
};

type PieSvgProps = {
  $svgHeight: number;
  $svgWidth: number;
};
type LabelColorProps = {
  $backgroundColor: string;
};

const ChartWrap = styled.div`
  border: 1px solid lightblue;
  display: flex;
  justify-content: center;
  padding: 20px 0;
`;
const PieSvg = styled.svg<PieSvgProps>`
  padding-top: 0px;
  height: ${({ $svgHeight }) => `${$svgHeight}px`};
  width: ${({ $svgWidth }) => `${$svgWidth}px`};
`;

const Sector = styled.div``;

const PiePath = styled.path`
  opacity: 0.7;
  cursor: pointer;
  /* 
  &:hover {
    opacity: 1;
    transform: translate(0, -10px);
  } */
`;

const LabelWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: auto;
  width: 40%;
  gap: 8px;
`;

const LabelColor = styled.div<LabelColorProps>`
  width: 16px;
  height: 16px;
  border: grey solid 1px;
  opacity: 0.7;
  background-color: ${({ $backgroundColor }) => `${$backgroundColor}`};
  cursor: pointer;
`;
const LabelText = styled.p`
  height: 10px;
  cursor: pointer;
`;

const LabelX = styled.text`
  font-size: 14px;
  text-anchor: middle;
`;
