import React from 'react';
import styled from 'styled-components/macro';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { ledgerEdit } from '../../redux/reducers/ledgerSingleSlice';
import { mainLabels, mainLabel, labelIndex } from '../../utils/gameSettings';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { CHANGE_LEDGER_POSITION } from '../../redux/reducers/pageControlSlice';

export const DailyLedger: React.FC = () => {
  const { timeLedger } = useAppSelector((state) => state.ledgerSingle.data);
  const { dataList } = useAppSelector((state) => state.ledgerList);
  const dispatch = useAppDispatch();
  const labelSetting = mainLabel;
  const ledgerTime = new Date(timeLedger);

  const dailyLedger = dataList.filter(
    (ledger) =>
      new Date(ledger.data.timeLedger).getDate() === ledgerTime.getDate() &&
      ledger.data.timeMonth === ledgerTime.getMonth() + 1 &&
      ledger.data.timeYear === ledgerTime.getFullYear()
  );

  const dailyAmount = dailyLedger.reduce(
    (acc, cur) => (acc += cur.data.amount.number),
    0
  );

  return (
    <Wrapper>
      <DailyAmount>{`$ ${dailyAmount}`}</DailyAmount>
      <DailyLedgers>
        {dailyLedger.map((ledger) => (
          <LedgerSingle key={ledger.ledgerId}>
            <LedgerOperation
              onClick={() => {
                const chosenLedger = dataList.find(
                  (data) => data.ledgerId === ledger.ledgerId
                );
                if (chosenLedger) {
                  dispatch(ledgerEdit(chosenLedger));
                  dispatch(CHANGE_LEDGER_POSITION('expand'));
                }
              }}
            >
              <EditIcon icon={faPen}></EditIcon>
            </LedgerOperation>
            <LabelIconWrap
              $backGround={
                labelSetting[labelIndex[ledger.data.labelMain]].colorCode
              }
            >
              <LabelIcon
                icon={labelSetting[labelIndex[ledger.data.labelMain]].icon}
              ></LabelIcon>
            </LabelIconWrap>
            <LedgerItem>{ledger.data.item}</LedgerItem>
            <LedgerAmount>{`$ ${ledger.data.amount.number}`}</LedgerAmount>
          </LedgerSingle>
        ))}
      </DailyLedgers>
    </Wrapper>
  );
};

type LabelIconWrapProps = {
  $backGround: string;
};

const Wrapper = styled.div`
  min-height: 132px;
  height: calc(90% - 80px);
`;

const DailyAmount = styled.div`
  position: absolute;
  right: 0px;
  top: 34px;
  height: 34px;
  font-size: 24px;
  font-weight: bold;
  margin-left: auto;
  margin-right: 30px;
  color: #dabd7a;
`;

const DailyLedgers = styled.div`
  height: 100%;
  overflow: scroll;
`;
const LedgerSingle = styled.div`
  height: 40px;
  display: flex;
  align-items: center;
  background-color: #ebebeb;
  gap: 18px;
  /* border: 1px solid black; */
`;
const LedgerOperation = styled.div`
  background-color: #ede9db;
  width: 68px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;
const EditIcon = styled(FontAwesomeIcon)`
  font-size: 22px;
  color: #c8c2ad;
`;
const LabelIconWrap = styled.div<LabelIconWrapProps>`
  width: 32px;
  height: 32px;
  border-radius: 16px;
  background-color: ${({ $backGround }) => $backGround};
  display: flex;
  justify-content: center;
  align-items: center;
`;
const LabelIcon = styled(FontAwesomeIcon)`
  font-size: 20px;
  color: #f2f2f2;
`;
const LedgerItem = styled.div`
  height: 100%;
  font-size: 18px;
  display: flex;
  align-items: center;
  color: #6b6b6b;
`;
const LedgerAmount = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  font-size: 18px;
  margin-left: auto;
  margin-right: 30px;
  color: #6b6b6b;
`;
