import React, { ReactNode } from 'react';
import styled from 'styled-components/macro';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { chooseLabel } from '../../redux/reducers/ledgerListSlice';
import { mainLabels, labelColorCodes } from '../../utils/gameSettings';
import { DoughnutChart } from './DoughnutChart';

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
  const ledgerList = useAppSelector((state) => state.ledgerList.dataList);
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

  const rawDatas = ledgerList.map((ledger) => {
    return {
      labelMain: ledger.data.labelMain,
      ledgerId: ledger.ledgerId,
      value: ledger.data.amount.number,
      year: ledger.data.timeYear,
      month: ledger.data.timeMonth,
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

  const props = {
    setting: { radius: 200, holeRatio: 0.65, hoverDelta: 10, labelDelta: 30 },
    data: [
      { label: '食物', value: 5, colorCode: labelColorCodes[0] },
      { label: '飲品', value: 50, colorCode: labelColorCodes[1] },
      { label: '交通', value: 30, colorCode: labelColorCodes[2] },
    ],
    title: [`${chosenYear}年`, `${chosenMonth}月`, '分類支出圖'],
  };

  return (
    <Wrap>
      {/* <ChartTitle>{`${chosenMonth}月各類別花費`}</ChartTitle>
      {loadingStatus === 'idle' && chosenMonth !== 0 && (
        <ChartWrap>
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
                labelColorCodes,
                index
              )
            )}
          </PieSvg>
        </ChartWrap>
      )}
      <LabelWrap>
        {mainLabels.map((label, index) => (
          <>
            <LabelColor $backgroundColor={labelColorCodes[index]} />
            <LabelText>{label}</LabelText>
          </>
        ))}
      </LabelWrap> */}
      {loadingStatus === 'idle' && <DoughnutChart props={props} />}
    </Wrap>
  );
};

const Wrap = styled.div`
  padding: 10px;
  position: relative;
  border: 1px solid lightblue;
`;
