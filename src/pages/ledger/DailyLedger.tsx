import React from 'react';
import styled from 'styled-components/macro';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { ledgerEdit } from '../../redux/reducers/ledgerSingleSlice';
import { mainLabels, mainLabel, labelIndex } from '../../utils/gameSettings';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faPen, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { CHANGE_LEDGER_POSITION } from '../../redux/reducers/pageControlSlice';
import { deleteSingleLedger } from '../../redux/reducers/ledgerListSlice';

export const DailyLedger: React.FC = () => {
  const { timeLedger } = useAppSelector((state) => state.ledgerSingle.data);
  const { dataList } = useAppSelector((state) => state.ledgerList);
  const { userId } = useAppSelector((state) => state.userInfo.data);
  const { friendsInfo } = useAppSelector((state) => state.userActivity);
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
            <LedgerOperation>
              <EditIcon
                icon={faPen}
                onClick={() => {
                  const chosenLedger = dataList.find(
                    (data) => data.ledgerId === ledger.ledgerId
                  );
                  if (chosenLedger) {
                    dispatch(ledgerEdit(chosenLedger));
                    dispatch(CHANGE_LEDGER_POSITION('expand'));
                  }
                }}
              ></EditIcon>
              <DeleteIcon
                icon={faTrashCan}
                onClick={() => {
                  alert('確定刪除');
                  dispatch(deleteSingleLedger(ledger.ledgerId));
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
            <Recorder $isInvisible={ledger.data.recordWho === userId}>
              <RecorderPortrait
                backgroundImg={
                  friendsInfo[ledger.data.recordWho]?.userPortraitUrl
                }
              />
              <RecorderText>記錄</RecorderText>
            </Recorder>

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
  /* border: 1px solid black; */
`;
const LedgerOperation = styled.div`
  background-color: #ede9db;
  width: 68px;
  height: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  /* gap: 5px; */
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
  width: 40%;
`;

type RecorderState = {
  $isInvisible: boolean;
};
type RecorderPortraitState = {
  backgroundImg: string;
};
const Recorder = styled.div<RecorderState>`
  display: flex;
  align-items: center;
  gap: 5px;
  opacity: ${({ $isInvisible }) => ($isInvisible ? '0' : '0.5')};
  margin-left: auto;
`;
const RecorderPortrait = styled.div<RecorderPortraitState>`
  height: 30px;
  width: 30px;
  border-radius: 15px;
  border: 1px rgba(128, 128, 128, 0.6) solid;
  background-image: ${({ backgroundImg }) => `url(${backgroundImg})`};
  background-size: cover;
`;
const RecorderText = styled(LedgerItem)`
  font-size: 14px;
`;
const LedgerAmount = styled.div`
  height: 100%;
  width: 15%;
  display: flex;
  align-items: center;
  justify-content: end;
  font-size: 18px;
  /* margin-left: auto; */
  margin-right: 30px;
  color: #6b6b6b;
`;
