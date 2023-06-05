import {
  faArrowLeft,
  faCheck,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import styled from 'styled-components/macro';
import { ReactComponent as Receipt } from '../../assets/receipt.svg';
import { ClosingButton } from '../../component/ClosingButton';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  SHIFT_CITY_VIA_SCROLL,
  TOGGLE_HOUSE_ADDING_MODE,
} from '../../redux/reducers/citySlice';
import {
  CLEAR_AMOUNT,
  CLEAR_LEDGER_INPUTS,
  SUBMIT_LEDGER,
  UPDATE_LEDGER,
} from '../../redux/reducers/ledgerSingleSlice';
import {
  CONTROL_PANEL_DISPLAYED,
  CurrentActionState,
  SWITCH_LEDGER_POSITION,
  SWITCH_SECTION_FOCUSED,
} from '../../redux/reducers/pageControlSlice';
import { citySetting } from '../../utils/gameSettings';
import { Amount } from './Amount';
import { Calculator } from './Calculator';
import { DailyLedger } from './DailyLedger';
import { Label } from './Label';
import { Payment } from './Payment';
import { TimeBar } from './TimeBar';

export const Ledger: React.FC = () => {
  const { userId } = useAppSelector((state) => state.userInfo.data);
  const { ledgerId } = useAppSelector((state) => state.ledgerSingle);
  const numberAfterOperator = useAppSelector(
    (state) => state.ledgerSingle.calculationHolder.number
  );
  const { labelMain, amount } = useAppSelector(
    (state) => state.ledgerSingle.data
  );
  const { ledgerPosition, pageActivity } = useAppSelector(
    (state) => state.pageControl
  );

  const { nextHousePosition, scale } = useAppSelector((state) => state.city);
  const { gridLength } = citySetting;

  const dispatch = useAppDispatch();

  return (
    <Wrap
      $state={ledgerPosition}
      $isShown={pageActivity === 'ledger'}
      $pageActivity={pageActivity}
    >
      <Background />
      <MainBoard>
        <Header
          onClick={() => {
            if (pageActivity !== 'ledger') {
              dispatch(
                SWITCH_SECTION_FOCUSED({ userId, pageActivity: 'ledger' })
              );
              dispatch(CONTROL_PANEL_DISPLAYED('none'));
            }
          }}
          $pageActivity={pageActivity}
        >
          {ledgerPosition === 'normal' && <ClosingButton size={60} />}
          {ledgerPosition === 'expand' && (
            <IconWrap
              onClick={() => dispatch(SWITCH_LEDGER_POSITION('normal'))}
            >
              <Icon
                icon={faArrowLeft}
                onClick={() => {
                  dispatch(CLEAR_LEDGER_INPUTS());
                  dispatch(CLEAR_AMOUNT());
                }}
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
                  dispatch(CLEAR_LEDGER_INPUTS());
                  dispatch(SWITCH_LEDGER_POSITION('expand'));
                  dispatch(TOGGLE_HOUSE_ADDING_MODE(true));
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
                $isAllowed={
                  amount.number !== 0 &&
                  labelMain !== '' &&
                  numberAfterOperator === 0
                }
                onClick={() => {
                  if (amount.number === 0) {
                    return;
                  } else if (labelMain === '') {
                    return;
                  } else if (numberAfterOperator !== 0) {
                    return;
                  }
                  if (ledgerId === '') {
                    dispatch(
                      SWITCH_SECTION_FOCUSED({ userId, pageActivity: 'city' })
                    );
                    setTimeout(
                      () =>
                        dispatch(
                          SHIFT_CITY_VIA_SCROLL({
                            shiftX:
                              (nextHousePosition.xIndex + 0.5) *
                              gridLength *
                              scale,
                            shiftY:
                              (nextHousePosition.yIndex + 0.5) *
                              gridLength *
                              scale,
                          })
                        ),
                      200
                    );
                    setTimeout(() => dispatch(SUBMIT_LEDGER()), 1000);
                    setTimeout(
                      () =>
                        dispatch(
                          SWITCH_SECTION_FOCUSED({
                            userId,
                            pageActivity: 'ledger',
                          })
                        ),
                      3000
                    );
                  } else {
                    dispatch(UPDATE_LEDGER());
                    dispatch(
                      SWITCH_SECTION_FOCUSED({
                        userId,
                        pageActivity: 'statistics',
                      })
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
  $pageActivity: CurrentActionState;
};

type ConfirmButtonProps = {
  $isAllowed: boolean;
};

const Wrap = styled.div<WrapProps>`
  width: 40%;
  position: absolute;
  margin: ${({ $pageActivity }) =>
    $pageActivity === 'ledger'
      ? '0 30%'
      : $pageActivity === 'profile'
      ? '0 40% 0 30%'
      : '0 35%'};
  z-index: 6;
  height: 80vh;
  overflow: hidden;
  bottom: ${({ $isShown }) => ($isShown ? '0' : 'calc( -80% )')};
  width: ${({ $isShown }) => ($isShown ? '40%' : '30%')};
  transition: 1s ease;
  &:hover {
    transform: ${({ $isShown }) =>
      $isShown ? 'translateY(0px)' : 'translateY(-20px)'};
  }
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

type HeaderProps = {
  $pageActivity: CurrentActionState;
};

const Header = styled.div<HeaderProps>`
  height: 10%;
  width: 100%;
  border-bottom: 3px solid #e6e6e6;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: ${({ $pageActivity }) =>
    $pageActivity === 'ledger' ? '' : 'pointer'};
`;

const SecondRow = styled.div`
  height: 12%;
  margin: 0 15px;
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
  display: flex;
  align-items: center;
`;
const ConfirmButton = styled.div<ConfirmButtonProps>`
  width: 40%;
  height: 80%;
  bottom: 2%;
  margin: 0 auto;
  border-radius: 10px;
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
