import React from 'react';
import styled from 'styled-components/macro';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import {
  CLEAR_LEDGER_ID,
  ledgerSubmit,
  ledgerUpdate,
} from '../../redux/reducers/ledgerSingleSlice';
import { TimeBar } from './TimeBar';
import { Label } from './Label';
import { Payment } from './Payment';
import { Calculator } from './Calculator';
import { ReactComponent as Receipt } from '../../assets/receipt.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faCheck,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import {
  CHANGE_LEDGER_POSITION,
  SWITCH_PAGE,
} from '../../redux/reducers/pageControlSlice';
import { DailyLedger } from './DailyLedger';
import { ClosingButton } from '../../component/ClosingButton';
import { Amount } from './Amount';

export const Ledger: React.FC = () => {
  const { userId } = useAppSelector((state) => state.userInfo.data);
  const { number } = useAppSelector((state) => state.ledgerSingle.data.amount);
  const { ledgerId } = useAppSelector((state) => state.ledgerSingle);
  const { item, labelMain, amount } = useAppSelector(
    (state) => state.ledgerSingle.data
  );
  const { ledgerPosition, pageActivity } = useAppSelector(
    (state) => state.pageControl
  );

  const dispatch = useAppDispatch();

  return (
    <Wrap $state={ledgerPosition} $isShown={pageActivity === 'ledger'}>
      <Background />
      <MainBoard>
        <Header>
          {ledgerPosition === 'normal' && <ClosingButton size={60} />}
          {ledgerPosition === 'expand' && (
            <IconWrap
              onClick={() => dispatch(CHANGE_LEDGER_POSITION('normal'))}
            >
              <Icon
                icon={faArrowLeft}
                onClick={() => dispatch(CLEAR_LEDGER_ID())}
              />
            </IconWrap>
          )}
          <TimeBar />
        </Header>
        {ledgerPosition === 'normal' && (
          <>
            <DailyLedger />
            <AddNewWrap>
              <AddNewButton
                onClick={() => {
                  dispatch(CLEAR_LEDGER_ID());
                  dispatch(CHANGE_LEDGER_POSITION('expand'));
                }}
              >
                <AddNewIcon icon={faPlus} />
                新紀錄
              </AddNewButton>
            </AddNewWrap>
          </>
        )}

        {ledgerPosition === 'expand' && (
          <>
            <Label />
            <SecondRow>
              <Payment />
              <Amount />
            </SecondRow>
            <ConfirmRow>
              <ConfirmButton
                $isAllowed={amount.number !== 0 && labelMain !== ''}
                onClick={() => {
                  if (amount.number === 0) {
                    alert('請輸入花費金額');
                    return;
                  } else if (labelMain === '') {
                    alert('請選擇類別');
                    return;
                  }
                  if (ledgerId === '') {
                    dispatch(ledgerSubmit());
                  } else {
                    dispatch(ledgerUpdate());
                    dispatch(
                      SWITCH_PAGE({ userId, pageActivity: 'statistics' })
                    );
                  }
                }}
              >
                <CheckIcon icon={faCheck} />
              </ConfirmButton>
            </ConfirmRow>

            <Calculator />
          </>
        )}
      </MainBoard>
    </Wrap>
  );
};

type WrapProps = {
  $state: 'minimize' | 'normal' | 'expand';
  $isShown: boolean;
};

type ConfirmButtonProps = {
  $isAllowed: boolean;
};

const Wrap = styled.div<WrapProps>`
  width: 40%;
  position: absolute;
  margin: 0 30%;
  z-index: 6;
  height: 80vh;
  overflow: hidden;
  bottom: ${({ $isShown }) => ($isShown ? '0' : '-80%')};
  transition: bottom 1s ease;
`;

const Background = styled(Receipt)`
  overflow: clip;
  display: flex;
  justify-content: center;
`;
const MainBoard = styled.div`
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  padding-top: 15px;
`;

const Header = styled.div`
  height: 10%;
  width: 100%;
  border-bottom: 3px solid #e6e6e6;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SecondRow = styled.div`
  height: 12%;
  margin: 0 15px;
  /* width: 100%; */
  border-bottom: 3px solid #e6e6e6;
  display: flex;
  align-items: center;
`;

const IconWrap = styled.div`
  position: absolute;
  left: 21px;
  height: 60px;
  display: flex;
  align-items: center;
  cursor: pointer;
`;
const Icon = styled(FontAwesomeIcon)`
  height: 27px;
  color: #808080;
`;

const ConfirmRow = styled.div`
  height: 10%;
  /* opacity: 0.5; */
  &:hover {
    filter: brightness(1.1);
  }
`;
const ConfirmButton = styled.div<ConfirmButtonProps>`
  width: 20%;
  height: 100%;
  /* position: absolute; */
  bottom: 2%;
  margin-left: auto;
  margin-right: 15px;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;

  background-color: #f2f2f2;
  cursor: ${({ $isAllowed }) => ($isAllowed ? 'pointer' : 'not-allowed')};
  &:hover {
    background-color: #ffffff;
  }
`;

const CheckIcon = styled(FontAwesomeIcon)`
  color: #dabd7a;
  font-size: 28px;
`;

const AddNewWrap = styled.div`
  position: absolute;
  z-index: 5;
  bottom: 0;
  height: 80px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f7f7f7;
`;

const AddNewButton = styled.div`
  height: 44px;
  width: 250px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  border-radius: 22px;
  background-color: #ebebeb;
  color: #808080;
  cursor: pointer;
  &:hover {
    filter: brightness(0.95);
  }
  &:active {
    filter: brightness(1.1);
  }
`;

const AddNewIcon = styled(FontAwesomeIcon)`
  font-size: 20px;
  color: #808080;
  padding-right: 5px;
`;
