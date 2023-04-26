import React, { useEffect } from 'react';
import styled from 'styled-components/macro';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import {
  payPeopleSwitch,
  payMethodSwitch,
} from '../../redux/reducers/ledgerSingleSlice';
import { ReactComponent as Cash } from '../../assets/cash.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCreditCard,
  faMobileScreen,
} from '@fortawesome/free-solid-svg-icons';

export const Payment: React.FC = () => {
  const { payWho, payHow } = useAppSelector((state) => state.ledgerSingle.data);
  const { userNickName } = useAppSelector((state) => state.userInfo.data);
  const dispatch = useAppDispatch();

  const people = [userNickName as string, 'Hazel'];
  const methods: { en: 'cash' | 'creditCard' | 'mobile'; ch: string }[] = [
    { en: 'cash', ch: '現金' },
    { en: 'mobile', ch: '行動支付' },
    { en: 'creditCard', ch: '信用卡' },
  ];
  const payHowIndex = methods.findIndex((method) => method.en === payHow);

  console.log(payHow === 'cash');

  useEffect(() => {
    dispatch(
      payPeopleSwitch({
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
          dispatch(payMethodSwitch(payHow));
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
          dispatch(payPeopleSwitch({ name: payWho, list: people }))
        }
      >
        <PersonOption>
          <Name>{payWho}</Name>
          <PaidText>付款</PaidText>
        </PersonOption>
      </PaidByWho>
    </PaymentInfo>
  );
};

// type PaidMethodProps = {
//   $isChosen: boolean;
// };

const PaymentInfo = styled.div`
  gap: 10%;
  height: 100%;
  width: 40%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: auto;
  margin-right: 15px;
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
const PersonOption = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  gap: 6px;
  cursor: pointer;
`;
const Name = styled(PaidText)`
  font-size: 20px;
  line-height: 24px;
`;
