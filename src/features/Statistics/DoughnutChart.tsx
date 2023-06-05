import {
  faAnglesLeft,
  faCaretLeft,
  faCaretRight,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import styled from 'styled-components/macro';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  CHOOSE_LABEL,
  CHOOSE_MONTH,
} from '../../redux/reducers/ledgerListSlice';
import { SWITCH_STATISTICS_MODE } from '../../redux/reducers/pageControlSlice';
import { DoughnutSector } from './DoughnutSector';

interface Props {
  setting: ChartSetting;
  data: { label: string; value: number; colorCode: string }[];
  title: string[];
}

interface ChartSetting {
  radius: number;
  holeRatio: number;
  hoverDelta: number;
  labelDelta: number;
}

export const DoughnutChart: React.FC<Props> = ({ setting, data, title }) => {
  const { chosenLabel, chosenMonth } = useAppSelector(
    (state) => state.ledgerList.choices
  );
  const { statisticsMode: chartShown } = useAppSelector(
    (state) => state.pageControl
  );
  const dispatch = useAppDispatch();
  const { radius, hoverDelta, labelDelta } = setting;

  const bufferSpace = 20;
  const abstractSpace = 50;
  const svgWidth = 2 * (radius + hoverDelta + labelDelta + bufferSpace);
  const svgHeight = svgWidth + abstractSpace;

  const sumValues = (array: { value: number }[]) => {
    return array.reduce((total, data) => (total += data.value), 0);
  };

  const totalValue = sumValues(data);

  const sectorRatios = data.map((data) =>
    totalValue === 0 ? 0 : data.value / totalValue
  );

  const startRatios = data.map((_, dataIndex) =>
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

  return (
    <ChartWrap>
      <PieSvg $svgHeight={svgHeight} $svgWidth={svgWidth}>
        {conbinedData.map((data, index) =>
          data.sectorRatio === 0 ? (
            ''
          ) : (
            <DoughnutSector
              key={data.label}
              data={data}
              index={index}
              setting={{ ...setting, svgWidth, svgHeight }}
            />
          )
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
          onClick={() => dispatch(CHOOSE_LABEL(''))}
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
          onClick={() => dispatch(CHOOSE_LABEL(''))}
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
            dispatch(CHOOSE_MONTH(chosenMonth - 1));
            dispatch(CHOOSE_LABEL(''));
          }}
        />
        <MonthSwitchIcon
          icon={faCaretRight}
          onClick={() => {
            dispatch(CHOOSE_MONTH(chosenMonth + 1));
            dispatch(CHOOSE_LABEL(''));
          }}
        />
      </MonthSwitchWrap>
      <SwitchModeWrap
        onClick={() => dispatch(SWITCH_STATISTICS_MODE('yearAndMonth'))}
        $isHidden={chartShown === 'yearAndMonth'}
      >
        <SwitchModeIcon icon={faAnglesLeft} />
        <SwitchModeText>查看</SwitchModeText>
        <SwitchModeText>每月變化</SwitchModeText>
      </SwitchModeWrap>
    </ChartWrap>
  );
};

type PieSvgProps = {
  $svgHeight: number;
  $svgWidth: number;
};

type ChartAbstractProps = {
  $color: string;
};

type SwitchModeWrapProps = {
  $isHidden: boolean;
};

const ChartWrap = styled.div`
  display: flex;
  justify-content: center;
  transform: scale(1);
  position: relative;
`;
const PieSvg = styled.svg<PieSvgProps>`
  padding-top: 0px;
  height: ${({ $svgHeight }) => `${$svgHeight}px`};
  width: ${({ $svgWidth }) => `${$svgWidth}px`};
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

const SwitchModeWrap = styled.div<SwitchModeWrapProps>`
  position: absolute;
  padding: 20px;
  left: 0px;
  top: 0px;
  height: 100%;
  text-align: center;
  cursor: pointer;
  opacity: 0;
  transition: opacity 1s ease;
  display: ${({ $isHidden }) => ($isHidden ? 'none' : 'block')};
  &:hover {
    opacity: 0.5;
  }
`;

const SwitchModeIcon = styled(FontAwesomeIcon)`
  font-size: 20px;
  color: #808080;
`;

const SwitchModeText = styled.p`
  padding-top: 5px;
  font-size: 16px;
  color: #808080;
`;
