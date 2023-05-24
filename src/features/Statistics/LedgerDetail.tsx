import {
  faAnglesRight,
  faArrowDown19,
  faArrowDownLong,
  faArrowUp91,
  faArrowUpLong,
  faPen,
  faTrashCan,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import styled from 'styled-components/macro';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  DELETE_SINGLE_LEDGER,
  SORT_LIST,
} from '../../redux/reducers/ledgerListSlice';
import {
  EDIT_LEDGER,
  LedgerDataState,
} from '../../redux/reducers/ledgerSingleSlice';
import {
  SWITCH_LEDGER_POSITION,
  SWITCH_SECTION_FOCUSED,
  SWITCH_STATISTICS_MODE,
} from '../../redux/reducers/pageControlSlice';
import { labelIndex, mainLabel } from '../../utils/gameSettings';

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
        <HeaderText
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
        </HeaderText>
        <HeaderTextLarge $sortable={false}>項目</HeaderTextLarge>
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
              <LedgerText>
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
              </LedgerText>
              <LedgerTextLarge>{ledger.item}</LedgerTextLarge>
              <LedgerText>{ledger.amount}</LedgerText>
              <LedgerText>
                <EditIcon
                  icon={faPen}
                  onClick={() => {
                    const chosenLedger = ledgerList.find(
                      (data) => data.ledgerId === ledger.ledgerId
                    );
                    if (chosenLedger) {
                      dispatch(EDIT_LEDGER(chosenLedger));
                      dispatch(
                        SWITCH_SECTION_FOCUSED({
                          userId,
                          pageActivity: 'ledger',
                        })
                      );
                      dispatch(SWITCH_LEDGER_POSITION('expand'));
                    }
                  }}
                />
                <DeleteIcon
                  icon={faTrashCan}
                  onClick={() => {
                    alert('確定刪除');
                    dispatch(DELETE_SINGLE_LEDGER(ledger.ledgerId));
                  }}
                />
              </LedgerText>
            </LedgerRow>
          ))}
      </LedgerRowsWrap>
      <MinimizeWrap
        onClick={() => dispatch(SWITCH_STATISTICS_MODE('monthOnly'))}
      >
        <MinimizeIcon icon={faAnglesRight} />
        <MinimizeText>收合</MinimizeText>
      </MinimizeWrap>
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
  min-width: 600px;
  width: 90%;
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
  width: 15%;
  text-align: center;
  border-radius: 10px;
  cursor: ${({ $sortable }) => ($sortable ? 'pointer' : 'default')};
  transition: filter 0.2s ease;
  &:hover {
    filter: ${({ $sortable }) => ($sortable ? 'brightness(0.90)' : 'default')};
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

const HeaderTextLarge = styled(HeaderText)`
  width: 32%;
`;

const LedgerText = styled.div`
  width: 15%;
  text-align: center;
  display: flex;
  justify-content: space-around;
`;

const LedgerTextLarge = styled(LedgerText)`
  width: 32%;
`;

const EditIcon = styled(FontAwesomeIcon)`
  font-size: 16px;
  cursor: pointer;
  opacity: 0.3;
  padding: 0 8px;
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

const MinimizeWrap = styled.div`
  position: absolute;
  padding: 20px;
  right: -70px;
  height: 100%;
  top: 0px;
  text-align: center;

  opacity: 0;
  transition: opacity 1s ease;
  &:hover {
    opacity: 0.5;
  }
`;

const MinimizeIcon = styled(FontAwesomeIcon)`
  font-size: 20px;
  color: #808080;
  cursor: pointer;
`;

const MinimizeText = styled.p`
  padding-top: 5px;
  font-size: 16px;
  color: #808080;
  cursor: pointer;
`;
