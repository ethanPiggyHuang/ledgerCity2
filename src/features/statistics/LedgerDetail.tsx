import React, { useEffect } from 'react';
import styled from 'styled-components/macro';
import { useAppSelector, useAppDispatch } from '../../app/hooks';

export const LedgerDetail: React.FC = () => {
  const ledgerList = useAppSelector((state) => state.ledgerList.data);
  // const { item, amount } = ledgerList;
  const ledgerListDisplay = ledgerList.map((ledger) => {
    return {
      item: ledger.item,
      amount: ledger.amount.number,
      date: new Date(ledger.timeLedger).toLocaleString(),
    };
  });
  console.log(ledgerListDisplay);

  const dispatch = useAppDispatch();

  return (
    <Wrap>
      <LedgerRow>
        <LedgerText>項目</LedgerText>
        <LedgerText>花費</LedgerText>
        <LedgerText>日期</LedgerText>
      </LedgerRow>
      {ledgerListDisplay.map((ledger, index) => (
        <LedgerRow key={index}>
          <LedgerText>{ledger.item}</LedgerText>
          <LedgerText>{ledger.amount}</LedgerText>
          <LedgerText>{ledger.date}</LedgerText>
        </LedgerRow>
      ))}
    </Wrap>
  );
};

const Wrap = styled.div`
  margin-top: 25px;
  padding: 20px;
  position: relative;
  display: flex;
  flex-direction: column;
  // flex-wrap: wrap;
  gap: 20px;
  height: 80vh;
  width: 40vw;
  border: 1px solid lightblue;
`;
const LedgerRow = styled.div`
  width: 100%;
  height: 36px;
  display: flex;
`;
const LedgerText = styled.p`
  width: 30%;
  text-align: center;
`;
