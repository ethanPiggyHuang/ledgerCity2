import React from 'react';
import styled from 'styled-components/macro';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { CHOOSE_LABEL } from '../../redux/reducers/ledgerListSlice';
import { SWITCH_STATISTICS_MODE } from '../../redux/reducers/pageControlSlice';

interface Props {
  data: {
    sectorRatio: number;
    startAngle: number;
    label: string;
    value: number;
    colorCode: string;
  };
  index: number;
  setting: ChartSetting;
}

interface ChartSetting {
  radius: number;
  holeRatio: number;
  hoverDelta: number;
  labelDelta: number;
  svgWidth: number;
  svgHeight: number;
}

export const DoughnutSector: React.FC<Props> = ({ data, index, setting }) => {
  const { chosenLabel } = useAppSelector((state) => state.ledgerList.choices);
  const { statisticsMode: chartShown } = useAppSelector(
    (state) => state.pageControl
  );
  const dispatch = useAppDispatch();
  const { sectorRatio, startAngle, label, colorCode } = data;
  const { radius, holeRatio, hoverDelta, labelDelta, svgWidth, svgHeight } =
    setting;

  const origin = {
    x: svgWidth / 2,
    y: svgHeight / 2,
  };
  const midAngle = startAngle + sectorRatio * Math.PI;
  const endAngle = startAngle + sectorRatio * 2 * Math.PI;
  const startPoint = {
    x: radius * Math.cos(startAngle) + origin.x,
    y: radius * Math.sin(startAngle) + origin.y,
  };
  const endPoint = {
    x: radius * Math.cos(endAngle) + origin.x,
    y: radius * Math.sin(endAngle) + origin.y,
  };
  const holeRadius = radius * holeRatio;
  const angleAdjust = 0.01;
  const holeStartPoint = {
    x: holeRadius * Math.cos(startAngle - angleAdjust) + origin.x,
    y: holeRadius * Math.sin(startAngle - angleAdjust) + origin.y,
  };
  const holeEndPoint = {
    x: holeRadius * Math.cos(endAngle + angleAdjust) + origin.x,
    y: holeRadius * Math.sin(endAngle + angleAdjust) + origin.y,
  };
  const largeArcFlag = sectorRatio > 0.5 ? 1 : 0;

  const colorDScript = `M ${startPoint.x} ${startPoint.y} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endPoint.x} ${endPoint.y} L ${origin.x} ${origin.y} Z`;
  const holeDScript = `M ${holeStartPoint.x} ${holeStartPoint.y} A ${holeRadius} ${holeRadius} 0 ${largeArcFlag} 1 ${holeEndPoint.x} ${holeEndPoint.y} L ${origin.x} ${origin.y} Z`;

  const labelNameAnchor =
    sectorRatio > 0.05
      ? {
          x: (radius - labelDelta) * Math.cos(midAngle) + origin.x,
          y: (radius - labelDelta) * Math.sin(midAngle) + origin.y,
        }
      : {
          x: (radius + 0.15 * labelDelta) * Math.cos(midAngle) + origin.x,
          y: (radius + 0.15 * labelDelta) * Math.sin(midAngle) + origin.y,
        };
  const labelRatioAnchor = {
    x: (radius + labelDelta) * Math.cos(midAngle) + origin.x,
    y: (radius + labelDelta) * Math.sin(midAngle) + origin.y,
  };

  const hoverShift = {
    x: hoverDelta * Math.cos(midAngle),
    y: hoverDelta * Math.sin(midAngle),
  };

  const handleClickingLabel = () => {
    label === chosenLabel
      ? dispatch(CHOOSE_LABEL(''))
      : dispatch(CHOOSE_LABEL(label));
    if (chartShown !== 'monthAndDetail')
      dispatch(SWITCH_STATISTICS_MODE('monthAndDetail'));
  };

  return (
    <SectorGroup
      key={index}
      $xShift={hoverShift.x}
      $yShift={hoverShift.y}
      $isChosen={label === chosenLabel}
    >
      {sectorRatio === 1 ? (
        <>
          <CirclePath
            onClick={handleClickingLabel}
            cx={origin.x}
            cy={origin.y}
            r={radius}
            fill={colorCode}
          />
          <CircleHolePath
            cx={origin.x}
            cy={origin.y}
            r={holeRadius}
            fill={'#f2f2f2'}
          />
        </>
      ) : (
        <>
          <SectorPath
            onClick={handleClickingLabel}
            d={colorDScript}
            fill={colorCode}
          />
          <HolePath d={holeDScript} fill={'#f2f2f2'} />
        </>
      )}

      <LabelName
        x={labelNameAnchor.x}
        y={labelNameAnchor.y}
        onClick={handleClickingLabel}
      >
        {label}
      </LabelName>
      <LabelRatio x={labelRatioAnchor.x} y={labelRatioAnchor.y}>
        {`${Math.round(sectorRatio * 100)}%`}
      </LabelRatio>
    </SectorGroup>
  );
};

type SectorGroupProps = {
  $xShift: number;
  $yShift: number;
  $isChosen: boolean;
};

const SectorGroup = styled.g<SectorGroupProps>`
  transition: transform 0.6s ease;
  opacity: 0.7;
  transform: ${({ $xShift, $yShift, $isChosen }) =>
    $isChosen ? `translate(${$xShift}px, ${$yShift}px)` : ''};
  &:hover {
    transform: ${({ $xShift, $yShift }) =>
      `translate(${$xShift}px, ${$yShift}px)`};
  }
`;

const SectorPath = styled.path`
  cursor: pointer;
`;
const HolePath = styled(SectorPath)`
  cursor: default;
`;

const CirclePath = styled.circle`
  cursor: pointer;
`;
const CircleHolePath = styled(CirclePath)`
  cursor: default;
`;

const LabelName = styled.text`
  font-size: 16px;
  font-weight: bold;
  text-anchor: middle;

  fill: #5b4105;

  &:hover {
    cursor: pointer;
  }
`;

const LabelRatio = styled.text`
  font-size: 20px;
  text-anchor: middle;
  fill: #5b4105;
`;
