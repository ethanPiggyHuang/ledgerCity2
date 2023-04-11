import React, { useEffect } from 'react';
import styled from 'styled-components/macro';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';

export const LedgerDetail: React.FC = () => {
  const ledgerList = useAppSelector((state) => state.ledgerList.data);
  const { choices } = useAppSelector((state) => state.ledgerList);
  const ledgerListDisplay = ledgerList.map((ledger) => {
    return {
      ledgerId: ledger.ledgerId,
      item: ledger.item,
      amount: ledger.amount.number,
      month: ledger.timeMonth,
      labelMain: ledger.labelMain,
      date: new Date(ledger.timeLedger).toLocaleString(),
    };
  });

  const dispatch = useAppDispatch();

  return (
    <Wrap>
      <LedgerRow $isChosen={false} $isHeader={true}>
        <LedgerText>項目</LedgerText>
        <LedgerText>花費</LedgerText>
        <LedgerText>日期</LedgerText>
      </LedgerRow>
      {ledgerListDisplay.map((ledger, index) => (
        <LedgerRow
          key={index}
          $isChosen={
            choices.chosenMonth === ledger.month &&
            choices.chosenLabel === ledger.labelMain
          }
          $isHeader={false}
        >
          <LedgerText>{ledger.item}</LedgerText>
          <LedgerText>{ledger.amount}</LedgerText>
          <LedgerText>{ledger.date}</LedgerText>
        </LedgerRow>
      ))}
    </Wrap>
  );
};

type LedgerRowProps = {
  $isChosen: boolean;
  $isHeader: boolean;
};

const Wrap = styled.div`
  padding: 20px;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  border: 1px solid lightblue;
`;
const LedgerRow = styled.div<LedgerRowProps>`
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  background-color: ${({ $isChosen }) => ($isChosen ? 'lightblue' : '')};
  border: ${({ $isHeader }) => ($isHeader ? '2px solid darkblue' : '')};
  font-weight: ${({ $isHeader }) => ($isHeader ? 'bold' : '')};
`;
const LedgerText = styled.p`
  width: 30%;
  text-align: center;
`;
