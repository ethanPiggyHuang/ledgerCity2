import React from 'react';
import styled from 'styled-components/macro';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { ledgerEdit } from '../../redux/reducers/ledgerSingleSlice';
import { deleteSingleLedger } from '../../redux/reducers/ledgerListSlice';
import { useNavigate } from 'react-router-dom';

export const LedgerDetail: React.FC = () => {
  const ledgerList = useAppSelector((state) => state.ledgerList.dataList);
  const { chosenYear, chosenMonth, chosenLabel } = useAppSelector(
    (state) => state.ledgerList.choices
  );
  const ledgerListDisplay = ledgerList.map((ledger) => {
    return {
      ledgerId: ledger.ledgerId,
      item: ledger.data.item,
      amount: ledger.data.amount.number,
      year: ledger.data.timeYear,
      month: ledger.data.timeMonth,
      labelMain: ledger.data.labelMain,
      date: new Date(ledger.data.timeLedger).toLocaleString(),
    };
  });

  const dispatch = useAppDispatch();

  return (
    <Wrap>
      <LedgerRow $isChosen={false} $isHeader={true}>
        <LedgerText>項目</LedgerText>
        <LedgerText>花費</LedgerText>
        <LedgerText>日期</LedgerText>
        <LedgerText>動作</LedgerText>
      </LedgerRow>
      {ledgerListDisplay.map((ledger, index) => (
        <LedgerRow
          key={index}
          $isChosen={
            chosenYear === ledger.year &&
            chosenMonth === ledger.month &&
            chosenLabel === ledger.labelMain
          }
          $isHeader={false}
        >
          <LedgerText>{ledger.item}</LedgerText>
          <LedgerText>{ledger.amount}</LedgerText>
          <LedgerText>{ledger.date}</LedgerText>
          <LedgerIcon
            className="material-symbols-outlined"
            onClick={() => {
              const chosenLedger = ledgerList.find(
                (data) => data.ledgerId === ledger.ledgerId
              );
              console.log(chosenLedger);
              if (chosenLedger) {
                dispatch(ledgerEdit(chosenLedger));
              }
            }}
          >
            edit
          </LedgerIcon>
          <LedgerIcon
            className="material-symbols-outlined"
            onClick={() => dispatch(deleteSingleLedger(ledger.ledgerId))}
          >
            delete
          </LedgerIcon>
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
  height: 300px;
  overflow: scroll;
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

const LedgerIcon = styled.p`
  width: 15%;
  text-align: center;
  cursor: pointer;
`;
