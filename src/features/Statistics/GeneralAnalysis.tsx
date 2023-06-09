import React, { useEffect } from 'react';
import styled from 'styled-components/macro';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { SET_CURRENT_MONTH } from '../../redux/reducers/ledgerListSlice';
import { mainLabels } from '../../utils/gameSettings';
import { BarChart } from './BarChart';
import { DoughnutChart } from './DoughnutChart';
import { LedgerDetail } from './LedgerDetail';

export const GeneralAnalysis: React.FC = () => {
  const loadingStatus = useAppSelector((state) => state.ledgerList.status);
  const ledgerList = useAppSelector((state) => state.ledgerList.dataList);
  const { chosenYear, chosenMonth } = useAppSelector(
    (state) => state.ledgerList.choices
  );
  const { statisticsMode: chartShown } = useAppSelector(
    (state) => state.pageControl
  );
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (chosenYear === 0 || chosenMonth === 0) {
      const today = new Date();
      const currentMonth = today.getMonth() + 1;
      const currentYear = today.getFullYear();

      dispatch(SET_CURRENT_MONTH({ currentMonth, currentYear }));
    }
  }, [chosenYear, chosenMonth, dispatch]);

  const rawData = ledgerList.map((ledger) => {
    return {
      labelMain: ledger.data.labelMain,
      ledgerId: ledger.ledgerId,
      value: ledger.data.amount.number,
      year: ledger.data.timeYear,
      month: ledger.data.timeMonth,
    };
  });

  const data = mainLabels.map((label) => {
    const ledgersMatched = rawData.filter(
      (ledger) =>
        ledger.year === chosenYear &&
        ledger.month === chosenMonth &&
        ledger.labelMain === label.name
    );
    const labelTotal = ledgersMatched.reduce(
      (acc, cur) => (acc += cur.value),
      0
    );

    return { label: label.name, value: labelTotal, colorCode: label.colorCode };
  });

  const props = {
    setting: { radius: 180, holeRatio: 0.65, hoverDelta: 15, labelDelta: 30 },
    data: data,
    title: [`${chosenYear}年`, `${chosenMonth}月`, '分類支出圖'],
  };

  return (
    <Wrap>
      {loadingStatus === 'idle' && (
        <>
          <LeftSection $isShown={chartShown === 'yearAndMonth'}>
            <BarChart />
          </LeftSection>
          <CenterSection $isShown={chartShown === 'monthOnly'}>
            <DoughnutChart
              setting={props.setting}
              data={data}
              title={props.title}
            />
          </CenterSection>
          <RightSection $isShown={chartShown === 'monthAndDetail'}>
            <LedgerDetail />
          </RightSection>
        </>
      )}
    </Wrap>
  );
};

type SectionProps = {
  $isShown: boolean;
};

const Wrap = styled.div`
  position: relative;
  height: 100%;
  padding: 20px 0;
  display: flex;
  overflow: hidden;
`;

const LeftSection = styled.div<SectionProps>`
  min-width: ${({ $isShown }) => ($isShown ? '50vw' : '0')};
  transform: ${({ $isShown }) =>
    $isShown ? 'translateX(0)' : 'translateX(-50vw)'};
  transition: min-width 2s ease-in-out, transform 2s ease;
`;
const CenterSection = styled.div<SectionProps>`
  min-width: ${({ $isShown }) => ($isShown ? '100vw' : '50vw')};
  transition: min-width 2s ease-in-out;
`;
const RightSection = styled.div<SectionProps>`
  min-width: 50vw;
`;
