import React, { ReactNode } from 'react';
import styled from 'styled-components/macro';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { chooseLabel } from '../../redux/reducers/ledgerListSlice';
import { mainLabel } from '../../utils/gameSettings';
import { DoughnutChart } from './DoughnutChart';
import { LedgerDetail } from './LedgerDetail';

export const GeneralAnalysis: React.FC = () => {
  const loadingStatus = useAppSelector((state) => state.ledgerList.status);
  const ledgerList = useAppSelector((state) => state.ledgerList.dataList);
  const { chosenYear, chosenMonth } = useAppSelector(
    (state) => state.ledgerList.choices
  );
  const dispatch = useAppDispatch();

  const rawData = ledgerList.map((ledger) => {
    return {
      labelMain: ledger.data.labelMain,
      ledgerId: ledger.ledgerId,
      value: ledger.data.amount.number,
      year: ledger.data.timeYear,
      month: ledger.data.timeMonth,
    };
  });

  const data = mainLabel.map((label) => {
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
          <DoughnutChart props={props} />
          <LedgerDetail />
        </>
      )}
    </Wrap>
  );
};

const Wrap = styled.div`
  position: relative;
  height: 100%;
  padding: 20px;
  display: flex;
  justify-content: space-around;
  overflow: scroll;
  gap: 20px;
`;
