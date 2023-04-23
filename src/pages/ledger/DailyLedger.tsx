import React, { useEffect } from 'react';
import styled from 'styled-components/macro';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import {
  itemKeyIn,
  labelChooseMain,
  labelRetrieve,
} from '../../redux/reducers/ledgerSingleSlice';
import {
  mainLabels,
  labelColorCodes,
  subLabels,
} from '../../utils/gameSettings';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUtensils,
  faMugHot,
  faTrainSubway,
  faShirt,
  faGamepad,
  faHouse,
  faMobileScreenButton,
  faBriefcaseMedical,
  faGift,
  faTags,
  faClipboard,
  faPen,
} from '@fortawesome/free-solid-svg-icons';

export const DailyLedger: React.FC = () => {
  const { labelMain, labelSubs, timeLedger } = useAppSelector(
    (state) => state.ledgerSingle.data
  );
  const { dataList } = useAppSelector((state) => state.ledgerList);
  const dispatch = useAppDispatch();

  const dailyLedger = dataList.filter(
    (ledger) =>
      new Date(ledger.data.recordTime).getDate() ===
      new Date(timeLedger).getDate()
  );

  console.log(dailyLedger);

  const dailyAmount = dailyLedger.reduce(
    (acc, cur) => (acc += cur.data.amount.number),
    0
  );

  const labelIcons = [
    faUtensils,
    faMugHot,
    faTrainSubway,
    faShirt,
    faGamepad,
    faHouse,
    faMobileScreenButton,
    faBriefcaseMedical,
    faGift,
    faTags,
  ];

  useEffect(() => {
    //TODO: onSnapshot
    // dispatch(getCityInfo());
  }, []);
  // const time: DateConstructor = new Date();

  return (
    <Wrapper>
      <DailyAmount>{`$ ${dailyAmount}`}</DailyAmount>
      {dailyLedger.map((ledger) => {
        const index = mainLabels.findIndex(
          (label) => label === ledger.data.labelMain
        );
        return (
          <LedgerSingle>
            <LedgerOperation>
              <EditIcon icon={faPen}></EditIcon>
            </LedgerOperation>
            <LabelIconWrap $backGround={labelColorCodes[index]}>
              <LabelIcon icon={labelIcons[index]}></LabelIcon>
            </LabelIconWrap>
            <LedgerItem>{ledger.data.item}</LedgerItem>
            <LedgerAmount>{`$ ${ledger.data.amount.number}`}</LedgerAmount>
          </LedgerSingle>
        );
      })}
    </Wrapper>
  );
};

type LabelIconWrapProps = {
  $backGround: string;
};

type LabelOptionProps = {
  $isChosen: boolean;
  $color: string;
};
const Wrapper = styled.div`
  min-height: 132px;
`;

const DailyAmount = styled.div`
  position: absolute;
  right: 0px;
  top: 34px;
  height: 34px;
  font-size: 28px;
  font-weight: bold;
  margin-left: auto;
  margin-right: 30px;
  color: #dabd7a;
`;
const LedgerSingle = styled.div`
  height: 40px;
  display: flex;
  align-items: center;
  background-color: #ebebeb;
  gap: 18px;
`;
const LedgerOperation = styled.div`
  background-color: #ede9db;
  width: 68px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const EditIcon = styled(FontAwesomeIcon)`
  height: 21px;
  color: #c8c2ad;
`;
const LabelIconWrap = styled.div<LabelIconWrapProps>`
  width: 34px;
  height: 34px;
  border-radius: 17px;
  background-color: ${({ $backGround }) => $backGround};
  display: flex;
  justify-content: center;
  align-items: center;
`;
const LabelIcon = styled(FontAwesomeIcon)`
  height: 21px;
  color: #f2f2f2;
`;
const LedgerItem = styled.div`
  height: 34px;
  font-size: 24px;
  display: flex;
  align-items: center;
  color: #6b6b6b;
`;
const LedgerAmount = styled.div`
  height: 34px;
  font-size: 24px;
  margin-left: auto;
  margin-right: 30px;
  color: #6b6b6b;
`;

const ItemIcon = styled(FontAwesomeIcon)`
  height: 40px;
`;
const ItemInput = styled.input`
  height: 80%;
  width: 75%;
  padding-left: 15px;
  font-size: 24px;
  margin-right: auto;
  margin-left: 30px;
  text-align: left;
  border: none;
  color: #808080;
  background-color: #f2f2f2;
`;
const SubLabelOptions = styled.div`
  height: 75px;
  display: flex;
  align-items: center;
`;
const SubLabelOption = styled.div`
  height: 38px;
  margin-left: 15px;
  padding: 0 38px;
  font-size: 20px;
  border-radius: 19px;
  color: #808080;
  background-color: #e6e6e6;
  display: flex;
  align-items: center;
  cursor: pointer;
`;
