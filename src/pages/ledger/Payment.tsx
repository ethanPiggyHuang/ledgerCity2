import React, { useEffect } from 'react';
import styled from 'styled-components/macro';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import {
  paySelectPerson,
  paySelectMethod,
} from '../../redux/reducers/ledgerSingleSlice';
import { ReactComponent as Cash } from '../../assets/cash.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCreditCard } from '@fortawesome/free-solid-svg-icons';

export const Payment: React.FC = () => {
  const { payWho, payHow } = useAppSelector((state) => state.ledgerSingle.data);
  const dispatch = useAppDispatch();
  useEffect(() => {
    //TODO: onSnapshot
    // dispatch(getCityInfo());
  }, []);

  const people = ['Ethan', 'Hazel'];
  const methods: { en: 'cash' | 'creditCard' | 'mobile'; ch: string }[] = [
    { en: 'cash', ch: '現金' },
    { en: 'mobile', ch: '行動支付' },
    { en: 'creditCard', ch: '信用卡' },
  ];

  return (
    <PaymentInfo>
      <PaidMethods>
        {methods.map((method) => (
          <PaidMethod
            key={method.en}
            $isChosen={method.en === payHow}
            onClick={() => {
              dispatch(paySelectMethod(method.en));
            }}
          >
            <PaidMethodIcon>
              {method.en === 'cash' ? (
                <Cash />
              ) : (
                <FontAwesomeIcon icon={faCreditCard} />
              )}
            </PaidMethodIcon>
            <PaidMethodText>{method.ch}</PaidMethodText>
          </PaidMethod>
        ))}
      </PaidMethods>
      <PaidByWho>
        {people.map((name, index) => (
          <PersonOption
            key={name}
            // $isChosen={true}
            $isChosen={name === payWho}
            onClick={() => {
              dispatch(paySelectPerson(name));
            }}
          >
            <Name>{name}</Name>
            <Name>付款</Name>
          </PersonOption>
        ))}
      </PaidByWho>
    </PaymentInfo>
  );
};

type PersonOptionProps = {
  $isChosen: boolean;
};
type PaidMethodProps = {
  $isChosen: boolean;
};

const PaymentInfo = styled.div`
  gap: 10%;
  height: 80%;
  width: 25%;
  margin-left: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const PaidMethods = styled.div`
  height: 100%;
  width: 45%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ebebeb;
  border-radius: 10px;
`;
const PaidMethod = styled.div<PaidMethodProps>`
  width: 100%;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  gap: 6px;
  display: ${({ $isChosen }) => ($isChosen ? 'flex' : 'none')};
`;
const PaidMethodIcon = styled(Cash)`
  width: 100%;
  height: 32px;
  color: #808080;
`;
const PaidMethodText = styled.p`
  width: 100%;
  color: #808080;
  display: flex;
  font-size: 18px;
  justify-content: center;
`;

const PaidByWho = styled(PaidMethods)`
  width: 50%;
`;
const PersonOption = styled.div<PersonOptionProps>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  cursor: pointer;
  gap: 6px;
  display: ${({ $isChosen }) => ($isChosen ? 'flex' : 'none')};
`;
const Portrait = styled.img`
  height: 100px;
  width: 100px;
  border: 1px solid lightblue;
  background-color: white;
`;
const Name = styled.p`
  width: 100%;
  color: #808080;
  display: flex;
  font-size: 18px;
  justify-content: center;
`;
const PaidHowText = styled.div`
  height: 100%;
  width: 15%;
  border: 1px solid lightblue;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: auto;
`;
