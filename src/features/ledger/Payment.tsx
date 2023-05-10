import {
  faCreditCard,
  faMobileScreen,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect } from 'react';
import styled from 'styled-components/macro';
import { ReactComponent as Cash } from '../../assets/cash.svg';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  SWITCH_PAY_METHOD,
  SWITCH_PAY_PEOPLE,
} from '../../redux/reducers/ledgerSingleSlice';

export const Payment: React.FC = () => {
  const { payWho, payHow } = useAppSelector((state) => state.ledgerSingle.data);
  const { userNickName } = useAppSelector((state) => state.userInfo.data);
  const { coopInfo, friendsInfo } = useAppSelector(
    (state) => state.userActivity
  );
  const dispatch = useAppDispatch();
  const friendIds = Object.keys(coopInfo);
  const friendNames =
    friendIds.length === 0
      ? []
      : friendIds.map((friendId) => friendsInfo[friendId]?.userNickName || '');

  const people = [userNickName, ...friendNames];
  const methods: { en: 'cash' | 'creditCard' | 'mobile'; ch: string }[] = [
    { en: 'cash', ch: '現金' },
    { en: 'mobile', ch: '行動支付' },
    { en: 'creditCard', ch: '信用卡' },
  ];
  const payHowIndex = methods.findIndex((method) => method.en === payHow);

  useEffect(() => {
    dispatch(
      SWITCH_PAY_PEOPLE({
        name: userNickName as string,
        list: people,
        init: true,
      })
    );
  }, []);

  return (
    <PaymentInfo>
      <PaidMethod
        onClick={() => {
          dispatch(SWITCH_PAY_METHOD(payHow));
        }}
      >
        {payHow === 'cash' ? (
          <PaidCashIcon />
        ) : payHow === 'creditCard' ? (
          <PaidMethodIcon icon={faCreditCard} />
        ) : (
          <PaidMethodIcon icon={faMobileScreen} />
        )}
        <PaidText>{methods[payHowIndex].ch}</PaidText>
      </PaidMethod>
      <PaidByWho
        onClick={() =>
          people.length === 1
            ? ''
            : dispatch(SWITCH_PAY_PEOPLE({ name: payWho, list: people }))
        }
      >
        <PersonOption $isMultiple={people.length > 1}>
          <Name>{payWho}</Name>
          <PaidText>付款</PaidText>
        </PersonOption>
      </PaidByWho>
    </PaymentInfo>
  );
};

type PersonOptionProps = {
  $isMultiple: boolean;
};

const PaymentInfo = styled.div`
  gap: 10%;
  height: 100%;
  width: 40%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: auto;
`;
const PaidMethod = styled.div`
  height: 80%;
  width: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
  background-color: #ebebeb;
  border-radius: 10px;
  cursor: pointer;
  &:hover {
    filter: brightness(0.95);
  }
  &:active {
    filter: brightness(1.1);
  }
`;

const PaidCashIcon = styled(Cash)`
  width: 100%;
  height: 24px;
  color: #808080;
`;
const PaidMethodIcon = styled(FontAwesomeIcon)`
  width: 100%;
  height: 24px;
  color: #808080;
`;
const PaidText = styled.p`
  width: 100%;
  color: #808080;
  display: flex;
  font-size: 16px;
  justify-content: center;
`;

const PaidByWho = styled(PaidMethod)`
  width: 50%;
`;
const PersonOption = styled.div<PersonOptionProps>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  gap: 6px;
  cursor: ${({ $isMultiple }) => ($isMultiple ? 'pointer' : 'default')};
`;
const Name = styled(PaidText)`
  font-size: 20px;
  line-height: 24px;
`;
