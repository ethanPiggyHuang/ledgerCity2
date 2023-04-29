import React, { ReactNode } from 'react';
import styled from 'styled-components/macro';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { chooseLabel, chooseMonth } from '../../redux/reducers/ledgerListSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretLeft, faCaretRight } from '@fortawesome/free-solid-svg-icons';

interface Props {
  props: {
    setting: ChartSetting;
    data: { label: string; value: number; colorCode: string }[];
    title: string[];
  };
}

interface ChartSetting {
  radius: number;
  holeRatio: number;
  hoverDelta: number;
  labelDelta: number;
}

export const DoughnutChart: React.FC<Props> = ({ props }) => {
  const { chosenLabel, chosenMonth } = useAppSelector(
    (state) => state.ledgerList.choices
  );
  const dispatch = useAppDispatch();
  const { radius, holeRatio, hoverDelta, labelDelta } = props.setting;
  const { data, title } = props;

  const bufferSpace = 20;
  const abstractSpace = 50;
  const svgWidth = 2 * (radius + hoverDelta + labelDelta + bufferSpace);
  const svgHeight = svgWidth + abstractSpace;

  const totalValue = data.reduce((total, data) => (total += data.value), 0);

  const sectorRatios = data.map((data) =>
    totalValue === 0 ? 0 : data.value / totalValue
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
    data: {
      sectorRatio: number;
      startAngle: number;
      label: string;
      value: number;
      colorCode: string;
    },
    index: number
  ): ReactNode => {
    const { sectorRatio, startAngle, label, colorCode } = data;

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
              onClick={() => {
                label === chosenLabel
                  ? dispatch(chooseLabel(''))
                  : dispatch(chooseLabel(label));
              }}
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
              onClick={() => {
                label === chosenLabel
                  ? dispatch(chooseLabel(''))
                  : dispatch(chooseLabel(label));
              }}
              d={colorDScript}
              fill={colorCode}
            />
            <HolePath d={holeDScript} fill={'#f2f2f2'} />
          </>
        )}

        <LabelName
          x={labelNameAnchor.x}
          y={labelNameAnchor.y}
          onClick={() => {
            label === chosenLabel
              ? dispatch(chooseLabel(''))
              : dispatch(chooseLabel(label));
          }}
        >
          {label}
        </LabelName>
        <LabelRatio x={labelRatioAnchor.x} y={labelRatioAnchor.y}>
          {`${Math.round(sectorRatio * 100)}%`}
        </LabelRatio>
      </SectorGroup>
    );
  };

  return (
    <ChartWrap>
      <PieSvg $svgHeight={svgHeight} $svgWidth={svgWidth}>
        {conbinedData.map((data, index) =>
          data.sectorRatio === 0 ? '' : drawSector(data, index)
        )}
        <ChartSubtitle x={svgWidth / 2 - 70} y={(abstractSpace * 2) / 3}>
          {title[0]}
        </ChartSubtitle>
        <ChartTitle x={svgWidth / 2} y={(abstractSpace * 2) / 3}>
          {title[1]}
        </ChartTitle>
        <ChartSubtitle x={svgWidth / 2 + 80} y={(abstractSpace * 2) / 3}>
          {title[2]}
        </ChartSubtitle>

        <ChartAbstract
          x={svgWidth / 2}
          y={svgHeight / 2 - 17}
          $color={
            data.find((label) => label.label === chosenLabel)?.colorCode ||
            '#5b4105'
          }
          onClick={() => dispatch(chooseLabel(''))}
        >
          {chosenLabel === '' ? `支出總額：` : `${chosenLabel}類支出：`}
        </ChartAbstract>
        <ChartAbstract
          x={svgWidth / 2}
          y={svgHeight / 2 + 17}
          $color={
            data.find((label) => label.label === chosenLabel)?.colorCode ||
            '#5b4105'
          }
          onClick={() => dispatch(chooseLabel(''))}
        >
          {chosenLabel === ''
            ? `${totalValue}元`
            : `${data.find((label) => label.label === chosenLabel)?.value}元`}
        </ChartAbstract>
      </PieSvg>
      <MonthSwitchWrap>
        <MonthSwitchIcon
          icon={faCaretLeft}
          onClick={() => {
            dispatch(chooseMonth(chosenMonth - 1));
            dispatch(chooseLabel(''));
          }}
        />
        <MonthSwitchIcon
          icon={faCaretRight}
          onClick={() => {
            dispatch(chooseMonth(chosenMonth + 1));
            dispatch(chooseLabel(''));
          }}
        />
      </MonthSwitchWrap>
    </ChartWrap>
  );
};

type PieSvgProps = {
  $svgHeight: number;
  $svgWidth: number;
};

type SectorGroupProps = {
  $xShift: number;
  $yShift: number;
  $isChosen: boolean;
};

type ChartAbstractProps = {
  $color: string;
};

const ChartWrap = styled.div`
  display: flex;
  justify-content: center;
  transform: scale(1);
`;
const PieSvg = styled.svg<PieSvgProps>`
  padding-top: 0px;
  height: ${({ $svgHeight }) => `${$svgHeight}px`};
  width: ${({ $svgWidth }) => `${$svgWidth}px`};
`;

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
  stroke: #f2f2f2;
  stroke-width: 0.2px;

  &:hover {
    cursor: pointer;
  }

  /* text-shadow: 1px 1px 1px #f2f2f2; */
`;

const LabelRatio = styled.text`
  font-size: 20px;
  text-anchor: middle;
  fill: #5b4105;
`;

const ChartTitle = styled.text`
  font-size: 28px;
  fill: #808080;
  text-anchor: middle;
`;

const ChartSubtitle = styled(ChartTitle)`
  font-size: 18px;
`;

const ChartAbstract = styled.text<ChartAbstractProps>`
  font-size: 24px;
  font-weight: bold;
  opacity: 0.8;
  fill: ${({ $color }) => $color};

  text-anchor: middle;
  cursor: default;
`;

const MonthSwitchWrap = styled.div`
  width: 360px;
  height: 45px;
  position: absolute;
  top: 0;
  display: flex;
  padding-top: 7px;
  justify-content: space-between;
  opacity: 0;
  transition: opacity 1s ease;

  &:hover {
    opacity: 1;
  }
`;

const MonthSwitchIcon = styled(FontAwesomeIcon)`
  font-size: 20px;
  color: #808080;
  cursor: pointer;
  padding: 10px;
`;
