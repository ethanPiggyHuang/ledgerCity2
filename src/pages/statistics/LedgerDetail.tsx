import React from 'react';
import styled from 'styled-components/macro';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { ledgerEdit } from '../../redux/reducers/ledgerSingleSlice';
import {
  SORT_LIST,
  deleteSingleLedger,
} from '../../redux/reducers/ledgerListSlice';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowDown19,
  faArrowUp91,
  faArrowUpLong,
  faArrowDownLong,
  faTrashCan,
  faPen,
} from '@fortawesome/free-solid-svg-icons';
import { mainLabel, labelIndex } from '../../utils/gameSettings';
import { LedgerDataState } from '../../redux/reducers/ledgerSingleSlice';
import { SWITCH_PAGE } from '../../redux/reducers/pageControlSlice';
import { CHANGE_LEDGER_POSITION } from '../../redux/reducers/pageControlSlice';

export const LedgerDetail: React.FC = () => {
  const { userId } = useAppSelector((state) => state.userInfo.data);
  const ledgerList = useAppSelector((state) => state.ledgerList.dataList);
  const { chosenYear, chosenMonth, chosenLabel, sortBy, sortDirection } =
    useAppSelector((state) => state.ledgerList.choices);
  const filtedList = ledgerList.filter(
    (ledger) =>
      ledger.data.timeYear === chosenYear &&
      ledger.data.timeMonth === chosenMonth
  );

  const selectionSort = (
    ledgers: { ledgerId: string; data: LedgerDataState }[],
    sortBy: 'label' | 'value' | 'date',
    orderDirection: 'ascending' | 'descending'
  ) => {
    let result = [...ledgers];

    for (let i = 0; i < ledgers.length; i++) {
      let selected = i;
      for (let j = i + 1; j < ledgers.length; j++) {
        if (sortBy === 'date' && orderDirection === 'ascending') {
          if (result[j].data.timeLedger < result[selected].data.timeLedger) {
            selected = j;
          }
        } else if (sortBy === 'date' && orderDirection === 'descending') {
          if (result[j].data.timeLedger > result[selected].data.timeLedger) {
            selected = j;
          }
        } else if (sortBy === 'value' && orderDirection === 'ascending') {
          if (
            result[j].data.amount.number < result[selected].data.amount.number
          ) {
            selected = j;
          }
        } else if (sortBy === 'value' && orderDirection === 'descending') {
          if (
            result[j].data.amount.number > result[selected].data.amount.number
          ) {
            selected = j;
          }
        } else if (sortBy === 'label' && orderDirection === 'ascending') {
          if (
            labelIndex[result[j].data.labelMain] <
            labelIndex[result[selected].data.labelMain]
          ) {
            selected = j;
          }
        } else if (sortBy === 'label' && orderDirection === 'descending') {
          if (
            labelIndex[result[j].data.labelMain] >
            labelIndex[result[selected].data.labelMain]
          ) {
            selected = j;
          }
        }
      }
      if (selected !== i) {
        [result[i], result[selected]] = [result[selected], result[i]];
      }
    }
    return result;
  };

  const sortedList = selectionSort(filtedList, sortBy, sortDirection);

  const ledgerListDisplay = sortedList.map((ledger) => {
    return {
      ledgerId: ledger.ledgerId,
      item: ledger.data.item,
      amount: ledger.data.amount.number,
      year: ledger.data.timeYear,
      month: ledger.data.timeMonth,
      labelMain: ledger.data.labelMain,
      date: new Date(ledger.data.timeLedger).getDate(),
    };
  });

  const dispatch = useAppDispatch();

  return (
    <Wrap>
      <HeaderRow>
        <HeaderText
          $sortable={true}
          onClick={() => dispatch(SORT_LIST('date'))}
        >
          日期
          {sortBy === 'date' && (
            <SortIconWrap>
              <SortIcon
                icon={
                  sortDirection === 'ascending' ? faArrowDown19 : faArrowUp91
                }
              />
            </SortIconWrap>
          )}
        </HeaderText>
        <HeaderTextSmall
          $sortable={true}
          onClick={() => dispatch(SORT_LIST('label'))}
        >
          類別
          {sortBy === 'label' && (
            <SortIconWrap>
              <SortIcon
                icon={
                  sortDirection === 'ascending'
                    ? faArrowDownLong
                    : faArrowUpLong
                }
              />
            </SortIconWrap>
          )}
        </HeaderTextSmall>
        <HeaderText $sortable={false}>項目</HeaderText>
        <HeaderText
          $sortable={true}
          onClick={() => dispatch(SORT_LIST('value'))}
        >
          花費
          {sortBy === 'value' && (
            <SortIconWrap>
              <SortIcon
                icon={
                  sortDirection === 'ascending' ? faArrowDown19 : faArrowUp91
                }
              />
            </SortIconWrap>
          )}
        </HeaderText>
        <HeaderText $sortable={false}>操作</HeaderText>
      </HeaderRow>
      <LedgerRowsWrap>
        {ledgerListDisplay.length !== 0 &&
          ledgerListDisplay.map((ledger, index) => (
            <LedgerRow
              key={index}
              $isChosen={
                chosenYear === ledger.year &&
                chosenMonth === ledger.month &&
                chosenLabel === ledger.labelMain
              }
              $isHeader={false}
            >
              <LedgerText>{`${ledger.month}月${ledger.date}日`}</LedgerText>
              <LedgerTextSmall>
                <LabelIconWrap
                  $backGround={
                    mainLabel[
                      mainLabel.findIndex(
                        (label) => label.name === ledger.labelMain
                      )
                    ].colorCode
                  }
                >
                  <LabelIcon
                    icon={
                      mainLabel[
                        mainLabel.findIndex(
                          (label) => label.name === ledger.labelMain
                        )
                      ].icon
                    }
                  ></LabelIcon>
                </LabelIconWrap>
              </LedgerTextSmall>
              <LedgerText>{ledger.item}</LedgerText>
              <LedgerText>{ledger.amount}</LedgerText>
              <LedgerText>
                <EditIcon
                  icon={faPen}
                  onClick={() => {
                    const chosenLedger = ledgerList.find(
                      (data) => data.ledgerId === ledger.ledgerId
                    );
                    if (chosenLedger) {
                      dispatch(ledgerEdit(chosenLedger));
                      dispatch(SWITCH_PAGE({ userId, pageActivity: 'ledger' }));
                      dispatch(CHANGE_LEDGER_POSITION('expand'));
                    }
                  }}
                />
                <DeleteIcon
                  icon={faTrashCan}
                  className="material-symbols-outlined"
                  onClick={
                    () => alert('確定刪除嗎？')
                    // dispatch(deleteSingleLedger(ledger.ledgerId))
                  }
                />
              </LedgerText>
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

type HeaderTextProps = {
  $sortable: boolean;
};

const Wrap = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 600px;
  border: 3px solid #ebebeb;
  border-radius: 10px;
  height: 500px;
  padding: 20px;
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
  background-color: ${({ $isChosen }) => ($isChosen ? '#dabd7a58' : '#f2f2f2')};
  color: #808080;
  font-weight: normal;
  justify-content: space-around;
  border-radius: 10px;
`;

const HeaderText = styled.div<HeaderTextProps>`
  position: relative;

  background-color: #ebebeb;
  color: #dabd7a;
  padding: 5px;
  width: 16%;
  text-align: center;
  border-radius: 10px;
  cursor: ${({ $sortable }) => ($sortable ? 'pointer' : 'default')};
  transition: filter 0.2s ease;
  &:hover {
    filter: ${({ $sortable }) => ($sortable ? 'brightness(0.95)' : 'default')};
  }
  &:active {
    filter: ${({ $sortable }) => ($sortable ? 'brightness(1.05)' : 'default')};
  }
`;

const SortIconWrap = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  display: inline;
  top: 0;
  right: 0;
  text-align: right;
  padding: 5px 3px;
  border-radius: 10px;
  opacity: 0.5;
  transition: opacity 0.5s ease;

  &:hover {
    opacity: 1;
  }
`;

const SortIcon = styled(FontAwesomeIcon)`
  font-size: 14px;
  color: #808080;
`;

const HeaderTextSmall = styled(HeaderText)`
  width: 12%;
`;

const LedgerText = styled.div`
  width: 16%;
  text-align: center;
  display: flex;
  justify-content: space-around;
`;

const LedgerTextSmall = styled(LedgerText)`
  width: 12%;
`;

const EditIcon = styled(FontAwesomeIcon)`
  font-size: 16px;
  cursor: pointer;
  opacity: 0.5;
  &:hover {
    opacity: 1;
  }
`;
const DeleteIcon = styled(EditIcon)`
  &:hover {
    color: #ad1818;
    opacity: 1;
  }
`;

type LabelIconWrapProps = {
  $backGround: string;
};

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
