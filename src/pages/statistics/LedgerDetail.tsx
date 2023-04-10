import React, { useEffect } from 'react';
import styled from 'styled-components/macro';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';

export const LedgerDetail: React.FC = () => {
  const ledgerList = useAppSelector((state) => state.ledgerList.data);
  const { choosing } = useAppSelector((state) => state.ledgerList);
  // const { item, amount } = ledgerList;
  const ledgerListDisplay = ledgerList.map((ledger) => {
    return {
      ledgerId: ledger.ledgerId,
      item: ledger.item,
      amount: ledger.amount.number,
      date: new Date(ledger.timeLedger).toLocaleString(),
    };
  });
  // console.log(ledgerListDisplay);

  const dispatch = useAppDispatch();

  return (
    <Wrap>
      <LedgerRow $isChosen={false}>
        <LedgerText>項目</LedgerText>
        <LedgerText>花費</LedgerText>
        <LedgerText>日期</LedgerText>
      </LedgerRow>
      {ledgerListDisplay.map((ledger, index) => (
        <LedgerRow key={index} $isChosen={choosing === ledger.ledgerId}>
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
};

const Wrap = styled.div`
  padding: 20px;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  border: 1px solid lightblue;
`;
const LedgerRow = styled.div<LedgerRowProps>`
  width: 100%;
  height: 36px;
  display: flex;
  background-color: ${({ $isChosen }) => ($isChosen ? 'lightblue' : '')};
`;
const LedgerText = styled.p`
  width: 30%;
  text-align: center;
`;
