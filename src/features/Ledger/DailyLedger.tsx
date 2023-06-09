import { faPen, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import styled from 'styled-components/macro';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { TOGGLE_HOUSE_ADDING_MODE } from '../../redux/reducers/citySlice';
import { DELETE_SINGLE_LEDGER } from '../../redux/reducers/ledgerListSlice';
import {
  CLEAR_LEDGER_INPUTS,
  EDIT_LEDGER,
} from '../../redux/reducers/ledgerSingleSlice';
import { SWITCH_LEDGER_POSITION } from '../../redux/reducers/pageControlSlice';
import { labelIndex, mainLabels } from '../../utils/gameSettings';

export const DailyLedger: React.FC = () => {
  const { timeLedger } = useAppSelector((state) => state.ledgerSingle.data);
  const { dataList } = useAppSelector((state) => state.ledgerList);
  const { userId, userPortraitUrl } = useAppSelector(
    (state) => state.userInfo.data
  );
  const { friendsInfo } = useAppSelector((state) => state.userInfo);
  const dispatch = useAppDispatch();
  const labelSetting = mainLabels;
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
        {dailyLedger.length === 0 ? (
          <EmptyLedger
            onClick={() => {
              dispatch(CLEAR_LEDGER_INPUTS());
              dispatch(SWITCH_LEDGER_POSITION('expand'));
              dispatch(TOGGLE_HOUSE_ADDING_MODE(true));
            }}
          >
            <EmptyLedgerText>本日還沒有帳目紀錄</EmptyLedgerText>
            <EmptyLedgerText>立即前往記帳</EmptyLedgerText>
          </EmptyLedger>
        ) : (
          <>
            <LedgerSingleHeader>
              <LedgerOperation>操作</LedgerOperation>
              <LabelIconWrap $backGround="#00000000">類別</LabelIconWrap>
              <LedgerItemHeader>品項</LedgerItemHeader>
              <RecorderHeader>記錄者</RecorderHeader>
              <LedgerAmountHeader>花費</LedgerAmountHeader>
            </LedgerSingleHeader>
            {dailyLedger.map((ledger) => (
              <LedgerSingle key={ledger.ledgerId}>
                <LedgerOperation>
                  <EditIcon
                    icon={faPen}
                    onClick={() => {
                      const chosenLedger = dataList.find(
                        (data) => data.ledgerId === ledger.ledgerId
                      );
                      if (chosenLedger) {
                        dispatch(EDIT_LEDGER(chosenLedger));
                        dispatch(SWITCH_LEDGER_POSITION('expand'));
                      }
                    }}
                  ></EditIcon>
                  <DeleteIcon
                    icon={faTrashCan}
                    onClick={() => {
                      alert('確定刪除');
                      dispatch(DELETE_SINGLE_LEDGER(ledger.ledgerId));
                    }}
                  />
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
                <Recorder>
                  <RecorderPortrait
                    backgroundImg={
                      ledger.data.recordWho === userId
                        ? userPortraitUrl
                        : friendsInfo[ledger.data.recordWho]?.userPortraitUrl
                    }
                  />
                </Recorder>
                <LedgerAmount>{`$ ${ledger.data.amount.number}`}</LedgerAmount>
              </LedgerSingle>
            ))}
          </>
        )}
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
  top: 11px;
  height: 10%;
  font-size: 24px;
  font-weight: bold;
  margin-left: auto;
  margin-right: 30px;
  color: #dabd7a;
  display: flex;
  align-items: center;
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
`;
const LedgerSingleHeader = styled(LedgerSingle)`
  height: 40px;
  display: flex;
  align-items: center;
  background-color: #ebebeb;
  color: #dabd7a;
  gap: 18px;
`;
const LedgerOperation = styled.div`
  background-color: #ede9db;
  width: 68px;
  height: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 0 3px;
`;
const EditIcon = styled(FontAwesomeIcon)`
  font-size: 16px;
  color: #949083;
  cursor: pointer;
  opacity: 0.4;
  &:hover {
    opacity: 1;
  }
`;
const DeleteIcon = styled(EditIcon)`
  &:hover {
    color: #ad1818;
  }
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
  padding-left: 10px;
  width: 40%;
`;
const EmptyLedger = styled.div`
  width: calc(100% - 40px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 20%;
  font-size: 20px;
  color: #dabd7a;
  gap: 20px;
  margin: 20px;
  border-radius: 20px;
  &:hover {
    background-color: #ffffff;
    cursor: pointer;
  }
`;
const EmptyLedgerText = styled.p``;
const LedgerItemHeader = styled(LedgerItem)`
  font-size: 16px;
  justify-content: center;
  padding-left: 0px;
  color: #dabd7a;
`;

type RecorderPortraitState = {
  backgroundImg: string;
};
const Recorder = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  opacity: 0.7;
  margin-left: auto;
  width: 50px;
`;
const RecorderHeader = styled(Recorder)`
  opacity: 1;
  justify-content: center;
`;
const RecorderPortrait = styled.div<RecorderPortraitState>`
  height: 30px;
  width: 30px;
  border-radius: 15px;
  border: 1px rgba(128, 128, 128, 0.6) solid;
  background-image: ${({ backgroundImg }) => `url(${backgroundImg})`};
  background-size: cover;
`;

const LedgerAmount = styled.div`
  height: 100%;
  width: 15%;
  display: flex;
  align-items: center;
  justify-content: end;
  font-size: 18px;
  margin-right: 30px;
  color: #6b6b6b;
`;
const LedgerAmountHeader = styled(LedgerAmount)`
  font-size: 16px;
  color: #dabd7a;
`;
