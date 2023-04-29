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
      <HeaderRow>
        <HeaderText>項目</HeaderText>
        <HeaderText>花費</HeaderText>
        <HeaderText>日期</HeaderText>
        <HeaderText>動作</HeaderText>
      </HeaderRow>
      <LedgerRowsWrap>
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
      </LedgerRowsWrap>
    </Wrap>
  );
};

type LedgerRowProps = {
  $isChosen: boolean;
  $isHeader: boolean;
};

const Wrap = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 500px;
  border: 1px solid lightblue;
  height: 300px;
`;

const HeaderRow = styled.div`
  width: 100%;
  min-height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  font-weight: bold;
`;
const LedgerRowsWrap = styled.div`
  overflow: scroll;
`;

const LedgerRow = styled(HeaderRow)<LedgerRowProps>`
  background-color: ${({ $isChosen }) => ($isChosen ? 'lightblue' : '#f2f2f2')};
  color: #808080;
  font-weight: normal;
`;

const HeaderText = styled.p`
  background-color: #ebebeb;
  padding: 5px;
  width: 15%;
  text-align: center;
  border-radius: 10px;
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
